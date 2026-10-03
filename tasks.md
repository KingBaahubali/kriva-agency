# Kriva — Execution Plan

Defaults applied: Signal Orange `#FF4B1F` accent · Plus Jakarta Sans + Geist + Geist Mono (self-hosted) ·
indicative pricing shown in simulator · placeholder mail addresses · CTA scrolls to consultation form.

## 1. Scaffold
- [x] package.json, vite.config.ts (base `./`, contact mock), tsconfig*, eslint, index.html
- [x] Tailwind v4 + `@config` bridge to `brand/tokens.json`
- [x] Install dependencies

## 2. Brand system
- [x] `brand/tokens.json`
- [x] `brand/BRAND.md`
- [x] `public/brand/` — kriva-logo.svg, kriva-mark.svg, favicon.svg, app-icon.svg, noise.svg

## 3. GoDaddy infrastructure
- [x] `public/.htaccess` (HTTPS, SPA fallback, deep-link asset repair, deflate/brotli, expires, security headers)
- [x] `public/api/contact.php` + `public/api/.htaccess`
- [x] robots.txt, sitemap.xml, site.webmanifest

## 4. Runtime & primitives
- [x] hooks: useScrollSpy, useClock · lib: cn (token-aware tailwind-merge), time, motion, scroll (Lenis), podStore
- [x] ui: Button, SectionHeader, Reveal, AnimatedNumber · brand: Logo, NoiseOverlay

## 5. Sections
- [x] Header + MobileMenu
- [x] Hero + TelemetryWidget
- [x] Capabilities (bento)
- [x] Collaboration Model
- [x] Engagement Models
- [x] Case Studies
- [x] Velocity / Cost Simulator
- [x] FAQ (ARIA accordion)
- [x] Contact form
- [x] Footer

## 6. Verification
- [x] `npm run lint` + `npm run build` clean
- [x] `npm run verify` — 63/63 (console, overflow, axe a11y, interactions @ 375 / 1440)
- [x] `npm run package:godaddy` + zip audit (32 files, `.htaccess` + `api/` present)
- [ ] Final production smoke test on GoDaddy after upload

## 7. Before go-live (owner)
- [ ] `public/api/contact.php`: set `KRIVA_RECIPIENT`, `KRIVA_FROM_ADDRESS` (must exist on the domain), `KRIVA_ALLOWED_HOSTS`
- [ ] Replace placeholder `kriva.io` canonical / sitemap URLs if the domain differs
- [ ] Re-run `npm run package:godaddy`, upload zip to `public_html/`, extract, enable AutoSSL
