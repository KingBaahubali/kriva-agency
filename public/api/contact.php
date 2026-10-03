<?php
/**
 * Kriva — Architecture consultation form handler
 * -----------------------------------------------------------------------------
 * Endpoint : POST api/contact.php   (Content-Type: application/json)
 * Response : application/json  →  { "success": true }
 *                                  { "success": false, "message": "...", "errors": { field: msg } }
 * Runtime  : PHP 7.4+ (GoDaddy cPanel default or newer). No dependencies.
 *
 * Deliverability on GoDaddy: KRIVA_FROM_ADDRESS must be a mailbox (or alias)
 * on the hosted domain, otherwise GoDaddy's relay may silently drop the mail.
 */

declare(strict_types=1);

/* ---------------------------------------------------------------- Config -- */
const KRIVA_RECIPIENT        = 'hello@kriva.io';      // TODO: inbox that receives leads
const KRIVA_FROM_ADDRESS     = 'no-reply@kriva.io';   // TODO: must exist on the hosted domain
const KRIVA_FROM_NAME        = 'Kriva Website';
const KRIVA_SUBJECT_PREFIX   = '[kriva.io] Architecture consultation';
const KRIVA_ALLOWED_HOSTS    = [];                    // e.g. ['kriva.io', 'www.kriva.io']; empty = request host
const KRIVA_MAX_BODY_BYTES   = 16384;
const KRIVA_RATE_LIMIT       = 5;                     // submissions …
const KRIVA_RATE_WINDOW      = 900;                   // … per 15 minutes per IP
const KRIVA_MIN_FILL_SECONDS = 3;

const KRIVA_ENGAGEMENTS = [
    'architecture-call'  => 'Architecture call',
    'product-pod'        => 'Dedicated product pod',
    'fixed-scope-sprint' => 'Fixed-scope architecture sprint',
];

const KRIVA_BUDGETS = [
    'under-25k' => 'Under $25k / quarter',
    '25k-75k'   => '$25k – $75k / quarter',
    '75k-150k'  => '$75k – $150k / quarter',
    '150k-plus' => '$150k+ / quarter',
];

/* --------------------------------------------------------------- Helpers -- */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function text_length(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }
    return (int) preg_match_all('/./us', $value);
}

/** Trim, strip control characters, normalise newlines. Returns '' for non-strings / invalid UTF-8. */
function clean_text($value, bool $multiline = false): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = str_replace(["\r\n", "\r"], "\n", trim($value));
    $pattern = $multiline ? '/[^\P{C}\n\t]/u' : '/\p{C}/u';
    $value = preg_replace($pattern, '', $value);
    if ($value === null) {
        return ''; // invalid UTF-8
    }
    if ($multiline) {
        $value = preg_replace("/\n{3,}/", "\n\n", $value) ?? '';
    }
    return trim($value);
}

/** Header-safe value: no CR/LF or encoded equivalents (blocks header injection). */
function header_safe(string $value): string
{
    return trim(str_ireplace(["\r", "\n", '%0a', '%0d', "\0"], '', $value));
}

function client_ip(): string
{
    // REMOTE_ADDR only — forwarded headers are client-controlled on shared hosting.
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
}

/** Sliding-window limiter backed by a hashed temp file. Returns false when the limit is exceeded. */
function rate_limit_allows(string $ip, bool $record): bool
{
    $file = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR
        . 'kriva_rl_' . hash('sha256', $ip . '|' . __FILE__);
    $now = time();
    $handle = @fopen($file, 'c+');
    if ($handle === false) {
        return true; // fail open — never block a real lead because /tmp is unavailable
    }
    flock($handle, LOCK_EX);
    $raw = stream_get_contents($handle);
    $hits = json_decode($raw !== false && $raw !== '' ? $raw : '[]', true);
    $hits = array_values(array_filter(is_array($hits) ? $hits : [], static function ($t) use ($now) {
        return is_int($t) && ($now - $t) < KRIVA_RATE_WINDOW;
    }));
    $allowed = count($hits) < KRIVA_RATE_LIMIT;
    if ($allowed && $record) {
        $hits[] = $now;
    }
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($hits));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    return $allowed;
}

/* --------------------------------------------------------- Request gate -- */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['success' => false, 'message' => 'Method not allowed.']);
}

$contentType = strtolower($_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '');
if (strpos($contentType, 'application/json') === false) {
    respond(415, ['success' => false, 'message' => 'Expected application/json.']);
}

// Same-origin check (defence in depth; browsers always send Origin on fetch POST).
$requestHost = strtolower((string) preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''));
$source = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$sourceHost = strtolower((string) parse_url($source, PHP_URL_HOST));
$allowedHosts = KRIVA_ALLOWED_HOSTS ?: [$requestHost];
if ($sourceHost === '' || !in_array($sourceHost, $allowedHosts, true)) {
    respond(403, ['success' => false, 'message' => 'Request origin not permitted.']);
}

$raw = file_get_contents('php://input', false, null, 0, KRIVA_MAX_BODY_BYTES + 1);
if ($raw === false || strlen($raw) > KRIVA_MAX_BODY_BYTES) {
    respond(413, ['success' => false, 'message' => 'Payload too large.']);
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    respond(400, ['success' => false, 'message' => 'Malformed JSON payload.']);
}

// Honeypot — bots fill hidden fields. Pretend success, send nothing.
if (isset($data['website']) && is_string($data['website']) && trim($data['website']) !== '') {
    respond(200, ['success' => true]);
}

// Minimum fill time (client sends the epoch-ms timestamp when the form was first touched).
$startedAt = isset($data['startedAt']) && is_numeric($data['startedAt']) ? (int) $data['startedAt'] : 0;
if ($startedAt > 0 && ((int) floor(microtime(true) * 1000) - $startedAt) < KRIVA_MIN_FILL_SECONDS * 1000) {
    respond(429, ['success' => false, 'message' => 'That was fast — please wait a moment and submit again.']);
}

$ip = client_ip();
if (!rate_limit_allows($ip, false)) {
    header('Retry-After: ' . KRIVA_RATE_WINDOW);
    respond(429, ['success' => false, 'message' => 'Too many submissions. Please try again in 15 minutes or email ' . KRIVA_RECIPIENT . '.']);
}

/* ------------------------------------------------------------ Validation -- */
$name       = clean_text($data['name'] ?? '');
$email      = clean_text($data['email'] ?? '');
$company    = clean_text($data['company'] ?? '');
$engagement = clean_text($data['engagement'] ?? '');
$budget     = clean_text($data['budget'] ?? '');
$scope      = clean_text($data['scope'] ?? '', true);
$pod        = clean_text($data['pod'] ?? '', true);

$errors = [];
$nameLength = text_length($name);
if ($nameLength < 2 || $nameLength > 100) {
    $errors['name'] = 'Enter your full name.';
}
if (strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL) || $email !== header_safe($email)) {
    $errors['email'] = 'Enter a valid work email.';
}
if (text_length($company) > 120) {
    $errors['company'] = 'Company name is too long.';
}
if (!array_key_exists($engagement, KRIVA_ENGAGEMENTS)) {
    $errors['engagement'] = 'Select an engagement type.';
}
if (!array_key_exists($budget, KRIVA_BUDGETS)) {
    $errors['budget'] = 'Select a budget band.';
}
$scopeLength = text_length($scope);
if ($scopeLength < 20 || $scopeLength > 3000) {
    $errors['scope'] = 'Describe the project in at least 20 characters.';
}
if (text_length($pod) > 800) {
    $pod = '';
}

if ($errors) {
    respond(422, ['success' => false, 'message' => 'Please correct the highlighted fields.', 'errors' => $errors]);
}

/* ------------------------------------------------------------------ Mail -- */
$submittedAt = gmdate('M j, Y · H:i') . ' UTC';
$lines = [
    'New architecture consultation request — kriva.io',
    str_repeat('-', 56),
    'Name        : ' . $name,
    'Email       : ' . $email,
    'Company     : ' . ($company !== '' ? $company : '—'),
    'Engagement  : ' . KRIVA_ENGAGEMENTS[$engagement],
    'Budget      : ' . KRIVA_BUDGETS[$budget],
    'Submitted   : ' . $submittedAt,
    '',
    'Project scope',
    str_repeat('-', 56),
    wordwrap($scope, 900, "\n", true),
];
if ($pod !== '') {
    array_push($lines, '', 'Pod configuration (from velocity simulator)', str_repeat('-', 56), $pod);
}
array_push($lines, '', str_repeat('-', 56), 'Sender IP: ' . $ip);

$body    = implode("\r\n", $lines);
$subject = KRIVA_SUBJECT_PREFIX . ' — ' . header_safe($company !== '' ? $company : $name);
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$headers = [
    'From: ' . KRIVA_FROM_NAME . ' <' . KRIVA_FROM_ADDRESS . '>',
    'Reply-To: ' . header_safe($email),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: Kriva-Web/1.0',
];

$sent = @mail(KRIVA_RECIPIENT, $encodedSubject, $body, implode("\r\n", $headers), '-f' . KRIVA_FROM_ADDRESS);

if (!$sent) {
    error_log('[kriva-contact] mail() returned false for submission from ' . $ip);
    respond(500, ['success' => false, 'message' => 'We could not send your message. Please email ' . KRIVA_RECIPIENT . ' directly.']);
}

rate_limit_allows($ip, true);
respond(200, ['success' => true]);
