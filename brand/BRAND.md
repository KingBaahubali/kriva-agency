# Kriva — Brand Identity Guidelines

> Version 1.0 · Owner: Kriva Brand & Engineering · Source of truth for values: [`tokens.json`](./tokens.json)

---

## 1. Positioning

**Kriva is a cross-border product engineering and cloud infrastructure studio.**
We embed senior-led sprint pods inside US product organisations and ship cloud-native, AI-ready platforms on a deterministic cadence.

| | |
|---|---|
| **Promise** | Silicon Valley product engineering with high-throughput global delivery. |
| **Proof** | 4–6 hours of daily PST/EST overlap · Staff/Senior engineers lead every pod · SOC2-aligned delivery, automated CI/CD, 90%+ test coverage. |
| **Category** | Product engineering studio — not an agency, not a staffing vendor, not "offshore development". |
| **Domain** | kriva.io |

### Audience

| Persona | What they are measured on | What they need to hear from us |
|---|---|---|
| **CTO (Series A–C)** | Platform reliability, roadmap throughput, hiring velocity | Architecture judgement, ownership of outcomes, security posture |
| **VP of Engineering** | Predictable delivery, team health, cycle time | Sprint determinism, overlap hours, code review discipline, metrics |
| **Venture-backed founder (Seed–A)** | Time to market, burn efficiency, investor milestones | Senior people on day one, clear scope, IP ownership, no surprises |

---

## 2. Voice

Kriva speaks the way a principal engineer writes a design doc: **architectural, authoritative, calm, specific.**

| Principle | In practice |
|---|---|
| **Precise over persuasive** | Quote the number, the protocol, the SLA. Let the specificity carry authority. |
| **Calm over hyped** | No exclamation marks. No superlatives we cannot measure. |
| **Engineering-first** | Name the systems: event sourcing, idempotent ledgers, RAG pipelines, Terraform modules. |
| **Accountable** | "We own the sprint outcome" — never "we'll do our best". |
| **US-native** | US English, US date format (Oct 3, 2026), times always carry a zone (9:00 AM PT). |

### Say / Never say

| ✅ Say | ⛔ Never say |
|---|---|
| Deterministic sprint cycles | Supercharge your business |
| 4-hour US timezone overlap | Cost-effective offshore development |
| SOC2-aligned delivery | We are passionate developers |
| Senior-led sprint pods | Rockstar / ninja / 10x developers |
| Distributed systems, event-driven architecture | Cutting-edge, next-gen, revolutionary |
| Review-ready PRs every US morning | 24/7 resources at your disposal |
| Code and IP assigned to you on commit | Cheap, affordable, low-cost |
| Dedicated product pod | Outsourcing, body shop, bench |

### Lexicon (approved terms)

`sprint pod` · `overlap window` · `deterministic cadence` · `review-ready PR` · `preview deploy` · `architecture call` · `fixed-scope sprint` · `SOC2-aligned controls` · `p95 latency` · `cycle time` · `error budget` · `multi-tenant` · `idempotent` · `RAG pipeline` · `vector store` · `IaC` · `golden path`

---

## 3. Logo

### Construction
- **Monogram "K"** drawn on a 32-unit grid. A solid 6-unit stem; the upper arm and lower leg are sharp parallelograms separated from the stem by a **2-unit expansion joint** — the architectural detail that signals modular, decoupled systems.
- A **Signal Orange node** (4×4 units) sits at the junction of the arms: the "pod active" indicator. It is the only accent in the mark.
- **Wordmark "kriva"** is constructed from monoline geometric strokes matched to the monogram's stem weight, set with tight optical tracking. It is supplied as outlined vector paths — never retype it in a font.

### Files (`/public/brand`)
| File | Use |
|---|---|
| `kriva-logo.svg` | Primary horizontal lockup (mark + wordmark) on dark backgrounds |
| `kriva-mark.svg` | Monogram only — avatars, social, tight spaces |
| `favicon.svg` | Browser tab icon (mark on rounded Basalt tile) |
| `app-icon.svg` | 512×512 app / PWA icon with maskable-safe padding |
| `noise.svg` | `feTurbulence` grain texture for surface depth |

### Rules
- **Clear space:** equal to the height of the Signal node × 3 on all sides.
- **Minimum size:** mark 16 px; full lockup 96 px wide.
- **Do not** recolour the node, rotate, outline, add effects, place on busy imagery, or separate the node from the mark.
- On light backgrounds use the mark in Basalt `#0A0C10` with the node unchanged.

---

## 4. Colour

Kriva follows a strict **60 · 30 · 10** distribution.

| Role | Token | Hex | Share |
|---|---|---|---|
| Canvas | `basalt` | `#0A0C10` | 60% |
| Elevated surfaces & cards | `graphite` | `#12151C` | 30% |
| Raised surface / hover | `graphite.raised` / `graphite.hover` | `#171B24` / `#1C212B` | — |
| High-energy accent | `signal` | `#FF4B1F` | 10% |
| Primary text | `ink.100` | `#F4F5F7` | — |
| Secondary text | `ink.200` | `#C9CDD6` | — |
| Tertiary text | `ink.300` | `#9BA1AE` | — |
| Captions / meta | `ink.400` | `#7E8595` | — |
| Hairline | `line` | `rgba(255,255,255,0.08)` | — |
| System OK | `status.ok` | `#3DDC97` | — |

### Measured contrast (WCAG 2.2)
| Pair | Ratio | Grade |
|---|---|---|
| ink.100 on basalt | 17.94:1 | AAA |
| ink.200 on basalt | 12.29:1 | AAA |
| ink.300 on basalt | 7.55:1 | AAA |
| ink.400 on basalt | 5.29:1 | AA |
| ink.400 on graphite | 4.94:1 | AA |
| signal on basalt | 5.85:1 | AA |
| basalt label on signal button | 5.85:1 | AA |

### Accent rules
- Signal Orange is reserved for: primary CTAs, active/live indicators, the logo node, and single key data points. Never more than one Signal element competing in a viewport region.
- **Button labels on Signal are always Basalt.** White on Signal is 3.3:1 and fails AA.
- No gradients across the brand palette. A soft radial Signal glow (≤ 12% opacity) is permitted behind hero telemetry only.
- Never place `ink.400` on `graphite.hover` (4.36:1).

---

## 5. Typography

| Role | Family | Weights | Notes |
|---|---|---|---|
| Display | **Plus Jakarta Sans** (variable) | 600–700 | Headlines, numerals in metrics. Tight tracking (−0.03em). |
| Body | **Geist** (variable) | 400–500 | All running text, UI labels. |
| Technical | **Geist Mono** (variable) | 400–500 | Telemetry, timestamps, code, eyebrow labels. |

All fonts are self-hosted from npm (`@fontsource-variable/*`) — no third-party font requests.
Inter, Roboto and Arial are not permitted anywhere in the brand.

### Fluid scale
| Token | Size (clamp) | Line height | Tracking | Use |
|---|---|---|---|---|
| `display-xl` | 2.6rem → 5.25rem | 0.98 | −0.035em | Hero headline |
| `display-lg` | 2.15rem → 3.75rem | 1.03 | −0.03em | Section headlines |
| `display-md` | 1.7rem → 2.6rem | 1.08 | −0.025em | Sub-section / metrics |
| `title` | 1.2rem → 1.45rem | 1.25 | −0.015em | Card titles |
| `body-lg` | 1.0625rem → 1.2rem | 1.6 | 0 | Lead paragraphs |
| `body` | 1rem | 1.65 | 0 | Body copy |
| `small` | 0.875rem | 1.55 | 0 | Secondary UI |
| `caption` | 0.8125rem | 1.5 | 0.01em | Meta, footnotes |
| `eyebrow` | 0.75rem (mono, uppercase) | 1.4 | 0.14em | Section labels |

Numerals in data contexts use `font-variant-numeric: tabular-nums`.

---

## 6. Surfaces, Borders & Radius

- **Cards** are Graphite `#12151C` with a 1 px hairline `rgba(255,255,255,0.08)` and a specular top edge `inset 0 1px 0 rgba(255,255,255,0.08)`.
- **No** glassmorphism on content cards, **no** coloured left borders, **no** centred icon-in-circle feature cards.
- Backdrop blur is permitted only on the floating navigation bar, over a ≥70% opaque Basalt fill.
- Radius scale: `xs 4` · `sm 8` · `md 12` · `lg 18` · `xl 24` · `pill 999`. Cards use `lg`; inputs and buttons use `md`; chips use `pill`.
- Grain: `noise.svg` at ~4% opacity, `mix-blend-mode: overlay`, fixed, non-interactive.

---

## 7. Motion

| Token | Value |
|---|---|
| Easing (`kinetic`) | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Durations | fast 160 ms · base 320 ms · slow 640 ms · reveal 900 ms |
| Spring (buttons) | stiffness 420 · damping 30 · mass 0.8 |

- Motion explains state; it never decorates. Reveals rise 16 px and fade — once per element.
- Smooth scrolling (Lenis) and all non-essential animation are **disabled** under `prefers-reduced-motion: reduce`.
- Live data updates are paused when off-screen.

---

## 8. Iconography

- **Lucide** icons only, `strokeWidth={1.25}` for hairline fidelity, 16–20 px in UI.
- Icons sit inline with their label (top-left of a card, or leading a line) — never centred in a coloured circle.
- Decorative icons are `aria-hidden`.

---

## 9. Imagery

- No stock photography of handshakes, laptops or "diverse teams pointing at screens".
- Visual language is **system diagrams, telemetry, timelines and grids** rendered in-brand as SVG/HTML.
- Texture comes from the grain overlay and hairline grids, not from photographs.

---

## 10. US Client Communication Standards

| Standard | Commitment |
|---|---|
| **Overlap window** | 4–6 hours daily with the client's primary zone (PT or ET). Standups are scheduled inside the window, never before 8:30 AM local. |
| **Response SLA** | < 1 business hour inside the overlap window · < 4 hours outside it · P0 incidents 15 minutes, 24/7. |
| **Daily cadence** | Async written update in Slack by 9:00 AM client time: shipped, in review, blocked, decisions needed. |
| **Sprint rituals** | Planning, mid-sprint demo, review + retro — all inside the overlap window, recorded, with written notes in Linear/Jira. |
| **Escalation** | Pod lead → Engagement director → Kriva partner, each named at kickoff with direct phone numbers. |
| **Language** | US English spelling; plain, declarative sentences; no jargon the client didn't introduce. |
| **Dates & times** | `Oct 3, 2026 · 9:00 AM PT`. Always include the zone. Never write "tonight" or "tomorrow" without a date. |
| **Contracts** | US-law MSA (Delaware) + SOW; mutual NDA before discovery; IP assignment on payment; DPA/BAA where data requires it. |
| **Security** | Client-owned repositories and cloud accounts from day one; SSO + hardware MFA; least-privilege access reviewed monthly. |

---

## 11. Copy checklist (before anything ships)

1. Does every claim have a number, a mechanism, or a source?
2. Is a timezone attached to every time?
3. Did we avoid every phrase in the "Never say" column?
4. Is the reading level calm and declarative — no exclamation marks?
5. Is Signal Orange used for at most one focal element in this view?
