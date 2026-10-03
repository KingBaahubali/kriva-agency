import { defineConfig, type Connect, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Kriva — Vite configuration
 *
 * `base: './'` emits relative asset URLs so the build works from any GoDaddy
 * directory (public_html root, sub-folder, or addon domain) without rebuilding.
 */
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), contactMock()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    assetsInlineLimit: 0,
    sourcemap: false,
  },
});

/* -------------------------------------------------------------------------- */
/*  Local stand-in for public/api/contact.php                                 */
/*  Vite (dev + preview) cannot execute PHP. This middleware mirrors the PHP  */
/*  handler's validation contract so the form's states can be exercised       */
/*  locally. It is never shipped — production requests hit the real PHP file. */
/* -------------------------------------------------------------------------- */

const ENGAGEMENTS = ['architecture-call', 'product-pod', 'fixed-scope-sprint'];
const BUDGETS = ['under-25k', '25k-75k', '75k-150k', '150k-plus'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(input: Record<string, unknown>) {
  const str = (k: string) => (typeof input[k] === 'string' ? (input[k] as string).trim() : '');
  const errors: Record<string, string> = {};
  const name = str('name');
  const email = str('email');
  const scope = str('scope');
  if (name.length < 2 || name.length > 100) errors.name = 'Enter your full name.';
  if (!EMAIL_RE.test(email) || email.length > 254) errors.email = 'Enter a valid work email.';
  if (str('company').length > 120) errors.company = 'Company name is too long.';
  if (!ENGAGEMENTS.includes(str('engagement'))) errors.engagement = 'Select an engagement type.';
  if (!BUDGETS.includes(str('budget'))) errors.budget = 'Select a budget band.';
  if (scope.length < 20 || scope.length > 3000) errors.scope = 'Describe the project in at least 20 characters.';
  return errors;
}

function contactMock(): Plugin {
  const handler: Connect.NextHandleFunction = (req, res, next) => {
    if (!req.url || !req.url.split('?')[0].endsWith('/api/contact.php')) return next();

    const send = (status: number, body: unknown) => {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.end(JSON.stringify(body));
    };

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return send(405, { success: false, message: 'Method not allowed.' });
    }

    let raw = '';
    req.on('data', (chunk: Buffer) => {
      raw += chunk.toString('utf8');
    });
    req.on('end', () => {
      let data: Record<string, unknown>;
      try {
        data = JSON.parse(raw || '{}');
      } catch {
        return send(400, { success: false, message: 'Malformed JSON payload.' });
      }
      if (typeof data.website === 'string' && data.website.length > 0) {
        return send(200, { success: true }); // honeypot — silently accept
      }
      const errors = validate(data);
      if (Object.keys(errors).length) {
        return send(422, { success: false, message: 'Please correct the highlighted fields.', errors });
      }
      // Simulate network + mail latency so loading states are visible.
      setTimeout(() => send(200, { success: true }), 650);
    });
  };

  return {
    name: 'kriva-contact-mock',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}
