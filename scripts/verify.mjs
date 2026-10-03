/**
 * Kriva — headless browser QA
 * Usage: BASE_URL=http://localhost:5173/ npm run verify
 * Uses the locally-installed Google Chrome via playwright-core.
 * Output: .qa/*.png + console summary. Exits non-zero on any failure.
 */
import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:5173/';
const OUT = process.env.QA_DIR || '.qa';
mkdirSync(OUT, { recursive: true });

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? '  ✓' : '  ✗'} ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch({ channel: 'chrome', headless: true });

for (const vp of [
  { label: 'mobile-375', width: 375, height: 812, mobile: true },
  { label: 'desktop-1440', width: 1440, height: 900, mobile: false },
]) {
  console.log(`\n=== ${vp.label} ===`);
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  });
  const page = await ctx.newPage();
  const consoleIssues = [];
  const failedRequests = [];
  page.on('console', (m) => {
    if (['error', 'warning'].includes(m.type())) consoleIssues.push(`[${m.type()}] ${m.text()}`);
  });
  page.on('pageerror', (e) => consoleIssues.push(`[pageerror] ${e.message}`));
  page.on('requestfailed', (r) => failedRequests.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on('response', (r) => {
    if (r.status() >= 400) failedRequests.push(`${r.status()} ${r.url()}`);
  });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Reveal everything for screenshots + layout checks by scrolling through the page
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += vp.height * 0.6) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  // 1. Horizontal overflow
  const overflow = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    iw: window.innerWidth,
  }));
  check('no horizontal overflow', overflow.sw <= overflow.iw, `scrollWidth ${overflow.sw} / viewport ${overflow.iw}`);

  // 2. Landmarks + headings
  const h1s = await page.locator('h1').count();
  check('exactly one <h1>', h1s === 1, `${h1s}`);
  for (const id of ['capabilities', 'model', 'engagement', 'cases', 'simulator', 'faq', 'contact']) {
    check(`section #${id} present`, (await page.locator(`#${id}`).count()) === 1);
  }

  // 3. Fonts really loaded (not system fallback)
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    return ['Plus Jakarta Sans Variable', 'Geist Variable', 'Geist Mono Variable'].map((f) => [f, document.fonts.check(`16px "${f}"`)]);
  });
  fonts.forEach(([f, ok]) => check(`font loaded: ${f}`, ok));

  // 4. Nav anchors resolve
  const hrefs = await page.$$eval('header nav a[href^="#"]', (as) => as.map((a) => a.getAttribute('href')));
  if (!vp.mobile) {
    check('desktop nav has 5 anchors', hrefs.length === 5, hrefs.join(', '));
    for (const h of hrefs) check(`anchor ${h} target exists`, (await page.locator(h).count()) === 1);
  }

  // 5. Mobile menu
  if (vp.mobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.waitForTimeout(300);
    check('mobile menu dialog opens', await page.locator('dialog#mobile-menu[open]').count() === 1);
    await page.screenshot({ path: `${OUT}/${vp.label}-menu.png` });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    check('mobile menu closes on Escape', (await page.locator('dialog#mobile-menu[open]').count()) === 0);
  }

  // 6. Anchor navigation moves viewport
  await page.evaluate(() => document.getElementById('faq')?.scrollIntoView());
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  if (!vp.mobile) {
    await page.locator('header nav a[href="#simulator"]').click();
    await page.waitForTimeout(2000);
    const top = await page.evaluate(() => document.getElementById('simulator').getBoundingClientRect().top);
    check('nav click scrolls to #simulator', top < 260 && top > -300, `top=${Math.round(top)}`);
  }

  // 7. Simulator interaction
  await page.locator('#simulator').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const readVelocity = () =>
    page.evaluate(() => {
      const dts = [...document.querySelectorAll('#simulator dl dt')];
      const dt = dts.find((d) => d.textContent.startsWith('Velocity'));
      return dt?.parentElement?.querySelector('dd .sr-only')?.textContent ?? '';
    });
  const v0 = await readVelocity();
  await page.getByRole('button', { name: 'Add one Senior Full-Stack Engineer' }).click();
  await page.waitForTimeout(300);
  const v1 = await readVelocity();
  check('simulator velocity changes on +Full-Stack', v0 !== '' && v0 !== v1, `${v0} → ${v1}`);
  await page.getByLabel('1-week sprints').check({ force: true });
  await page.waitForTimeout(300);
  const v2 = await readVelocity();
  check('simulator velocity changes on cadence toggle', v2 !== v1, `${v1} → ${v2}`);
  await page.getByRole('button', { name: 'AI Platform Pod' }).click();
  await page.waitForTimeout(200);
  check('preset applies', (await page.getByRole('button', { name: 'AI Platform Pod' }).getAttribute('aria-pressed')) === 'true');

  // 8. FAQ keyboard
  await page.locator('#faq').scrollIntoViewIfNeeded();
  const triggers = page.locator('#faq button[aria-expanded]');
  const n = await triggers.count();
  check('FAQ has 8 questions', n === 8, `${n}`);
  await triggers.nth(1).focus();
  await page.keyboard.press('Enter');
  check('FAQ Enter expands', (await triggers.nth(1).getAttribute('aria-expanded')) === 'true');
  await page.keyboard.press('Space');
  check('FAQ Space collapses', (await triggers.nth(1).getAttribute('aria-expanded')) === 'false');
  await page.keyboard.press('ArrowDown');
  check('FAQ ArrowDown moves focus', await triggers.nth(2).evaluate((el) => el === document.activeElement));
  await page.keyboard.press('End');
  check('FAQ End moves focus to last', await triggers.nth(n - 1).evaluate((el) => el === document.activeElement));
  await page.keyboard.press('Home');
  check('FAQ Home moves focus to first', await triggers.nth(0).evaluate((el) => el === document.activeElement));

  // 9. Contact form: empty submit → inline errors, focus first invalid
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: /Request architecture call/ }).click();
  await page.waitForTimeout(300);
  const invalidCount = await page.locator('#contact [aria-invalid="true"]').count();
  check('empty submit shows inline errors', invalidCount >= 3, `${invalidCount} invalid fields`);
  check('focus moves to first invalid field', await page.locator('#contact-name').evaluate((el) => el === document.activeElement));

  // 10. Contact form: valid submit → success
  await page.locator('#contact-name').fill('Jordan Rivera');
  await page.locator('#contact-email').fill('jordan@acme-payments.com');
  await page.locator('#contact-company').fill('Acme Payments');
  await page.getByLabel('Dedicated product pod').check({ force: true });
  await page.getByLabel('$75k – $150k').check({ force: true });
  await page.locator('#contact-scope').fill('Rebuilding our payment ledger as an event-sourced service; need two senior engineers inside our Pacific standup.');
  await page.getByRole('button', { name: /Request architecture call/ }).click();
  await page.getByText('Request received.').waitFor({ timeout: 10000 }).catch(() => {});
  check('valid submit shows success state', (await page.getByText('Request received.').count()) === 1);

  // 11. Console + network
  check('zero console errors/warnings', consoleIssues.length === 0, consoleIssues.slice(0, 5).join(' | '));
  check('zero failed/4xx/5xx requests', failedRequests.filter((r) => !r.includes('/api/contact.php')).length === 0, failedRequests.slice(0, 5).join(' | '));

  // 12. axe — WCAG 2.1 A/AA
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const serious = axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
  check('axe: zero serious/critical violations', serious.length === 0, serious.map((v) => `${v.id}(${v.nodes.length})`).join(', '));
  axe.violations
    .filter((v) => !['serious', 'critical'].includes(v.impact))
    .forEach((v) => console.log(`    · axe ${v.impact}: ${v.id} (${v.nodes.length})`));
  serious.forEach((v) => v.nodes.slice(0, 3).forEach((n) => console.log(`    ! ${v.id}: ${n.target.join(' ')} — ${n.failureSummary?.split('\n')[1] ?? ''}`)));

  // 13. Screenshots
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `${OUT}/${vp.label}-hero.png` });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += vp.height * 0.5) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${vp.label}-full.png`, fullPage: true });
  for (const id of ['capabilities', 'simulator', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.locator(`#${id}`).screenshot({ path: `${OUT}/${vp.label}-${id}.png` });
  }

  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log('Failures:');
  failed.forEach((f) => console.log(`  ✗ ${f.name} — ${f.detail}`));
  process.exit(1);
}
