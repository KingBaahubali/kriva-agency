/**
 * Kriva — site copy
 * -----------------------------------------------------------------------------
 * All marketing claims, metrics and case studies live here.
 * TODO(verify before launch): every value marked `// VERIFY` is a realistic
 * placeholder. Replace with substantiated figures before publishing — US buyers
 * (and the FTC) treat performance claims as factual representations.
 */

export const SITE = {
  name: 'Kriva',
  domain: 'kriva.io',
  email: 'hello@kriva.io',
  tagline: 'Silicon Valley product engineering with high-throughput global delivery.',
} as const;

export const NAV_LINKS = [
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'engagement', label: 'Engagement Models' },
  { id: 'cases', label: 'Case Studies' },
  { id: 'simulator', label: 'Cost Simulator' },
  { id: 'faq', label: 'FAQ' },
] as const;

export const HERO = {
  kicker: 'Product engineering studio · San Francisco / India',
  headline: ['Elite Engineering Pods', 'for High-Growth', 'US Teams'],
  lead:
    'Silicon Valley product engineering with high-throughput global delivery. Dedicated US-aligned sprint pods building cloud-native, AI-ready platforms — led by Staff and Senior engineers, shipped on deterministic sprint cycles.',
  primaryCta: 'Schedule Architecture Call',
  secondaryCta: 'Model your pod',
  metrics: [
    { value: 180, prefix: '$', suffix: 'M+', label: 'Client funding supported', decimals: 0 }, // VERIFY
    { value: 99.4, suffix: '%', label: 'On-time sprint delivery', decimals: 1 }, // VERIFY
    { value: 5, prefix: '4–', suffix: 'h', label: 'Daily PST/EST overlap', decimals: 0, static: '4–6h' },
    { value: 100, suffix: '%', label: 'Pods led by Staff/Senior engineers', decimals: 0 },
  ],
} as const;

export const CAPABILITIES = {
  eyebrow: '01 — Capabilities',
  title: 'One studio across the full delivery surface.',
  lead:
    'From the first architecture review to the 10-millionth event, our pods own product code, infrastructure and applied AI as a single system — not three vendors with three backlogs.',
  items: [
    {
      id: 'product',
      title: 'Full-Stack Product Development',
      body:
        'Type-safe product surfaces and service layers built for change. Monorepos, contract-tested APIs, feature-flagged releases and preview environments on every pull request.',
      stack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Python', 'Go', 'PostgreSQL', 'GraphQL'],
      stat: { value: '2.1 days', label: 'Median PR-to-production' }, // VERIFY
    },
    {
      id: 'cloud',
      title: 'Cloud & DevOps Infrastructure',
      body:
        'Infrastructure as code from day one. Golden-path Kubernetes platforms, policy-as-code guardrails and cost-aware autoscaling across AWS and GCP.',
      stack: ['AWS', 'GCP', 'Kubernetes', 'Terraform', 'ArgoCD', 'GitHub Actions'],
      stat: { value: '38%', label: 'Avg. cloud spend reduction' }, // VERIFY
    },
    {
      id: 'ai',
      title: 'Applied AI & LLM Systems',
      body:
        'Production RAG pipelines, evaluation harnesses and fine-tuned models with guardrails, observability and cost controls — shipped behind your existing auth and data boundaries.',
      stack: ['RAG', 'Fine-tuning', 'pgvector', 'Pinecone', 'LangGraph', 'Evals'],
      pipeline: ['Ingest', 'Embed', 'Vector DB', 'Rerank', 'LLM'],
    },
    {
      id: 'modernization',
      title: 'Architecture Modernization & Performance Audits',
      body:
        'Two-week audits that end in a ranked remediation plan, not a slide deck. Strangler-fig migrations, data-layer tuning and load testing against real traffic shapes.',
      stack: ['Profiling', 'Load testing', 'Event sourcing', 'CQRS', 'OpenTelemetry'],
      before: { label: 'p95 before', value: 1840 }, // VERIFY
      after: { label: 'p95 after', value: 212 }, // VERIFY
    },
  ],
} as const;

export const COLLABORATION = {
  eyebrow: '02 — Operating model',
  title: 'A 24-hour delivery loop, synchronised to your morning.',
  lead:
    'Your team sets direction during the overlap window. Our build crew executes while you sleep. Automated gates keep quality deterministic. You start every day with review-ready work.',
  steps: [
    {
      time: '09:00 PT / ET',
      title: 'Standup & spec lock',
      body:
        'Pod lead joins your standup inside the 4–6 hour overlap window. Scope, acceptance criteria and open decisions are locked in writing before handoff.',
      tag: 'Overlap window',
    },
    {
      time: '21:00 → 06:00 PT',
      title: 'Async overnight execution',
      body:
        'The build crew in India picks up locked tickets and executes against the spec — with a Staff engineer on shift to unblock architecture questions.',
      tag: 'Build crew',
    },
    {
      time: 'Continuous',
      title: 'Automated gates',
      body:
        'CI enforces 90%+ coverage, type checks, SAST and dependency scans. AI-assisted review flags risk; a senior engineer approves every merge.',
      tag: 'CI / CD',
    },
    {
      time: '08:30 PT / ET',
      title: 'Review-ready morning',
      body:
        'Preview deploys, PR summaries and a written async update land before your first coffee: shipped, in review, blocked, decisions needed.',
      tag: 'Handoff',
    },
  ],
  guarantees: [
    { title: 'Deterministic sprint cycles', body: 'Fixed cadence, fixed ceremonies, committed scope. Slippage is surfaced on day 3, not day 10.' },
    { title: 'SOC2-aligned controls', body: 'SSO + hardware MFA, least-privilege access, audit logging and client-owned infrastructure.' },
    { title: '90%+ test coverage, enforced', body: 'Coverage is a merge gate in CI, not a metric on a dashboard.' },
  ],
} as const;

export const ENGAGEMENT = {
  eyebrow: '03 — Engagement models',
  title: 'Two ways to work with Kriva.',
  lead: 'Start with a fixed-scope sprint to de-risk the architecture, or embed a dedicated pod that scales with your roadmap.',
  models: [
    {
      id: 'pod',
      name: 'Dedicated Product Pod',
      billing: 'Monthly retainer',
      summary:
        'A senior-led, cross-functional pod embedded in your rituals, repos and Slack — accountable for roadmap throughput, not hours.',
      rows: [
        ['Team', '3–8 engineers · Staff/Senior lead · optional DevOps, ML, QA'],
        ['Cadence', '1- or 2-week sprints inside your ceremonies'],
        ['Overlap', '4–6 hours daily with PT or ET'],
        ['Contract', 'Monthly, 30-day scale-up / scale-down notice'],
        ['Best for', 'Series A–C teams with a continuous product roadmap'],
      ],
      cta: 'Configure a pod',
      href: '#simulator',
      featured: true,
    },
    {
      id: 'sprint',
      name: 'Fixed-Scope Architecture Sprint',
      billing: 'Fixed fee · 2–6 weeks',
      summary:
        'A tightly scoped engagement with a defined deliverable: an audit, a migration plan, an MVP slice or a proof-of-concept that de-risks a decision.',
      rows: [
        ['Team', 'Lead Architect + 1–3 senior engineers'],
        ['Cadence', 'Weekly demos, written decision log'],
        ['Overlap', '4 hours daily with your lead'],
        ['Contract', 'Fixed price, fixed scope, milestone billing'],
        ['Best for', 'Seed–A founders, platform rewrites, due-diligence audits'],
      ],
      cta: 'Scope a sprint',
      href: '#contact',
      featured: false,
    },
  ],
} as const;

export const CASES = {
  eyebrow: '04 — Case studies',
  title: 'Systems that carry real load.',
  lead: 'Selected engagements. Client names withheld under NDA; references available on request.',
  items: [
    {
      id: 'fintech',
      sector: 'FinTech Scale-Up',
      location: 'New York, NY',
      stage: 'Series C',
      title: 'Real-time payment ledger rebuilt for 99.999% uptime.',
      challenge:
        'A batch-reconciled ledger was failing at month-end peaks, forcing manual reconciliation and blocking a banking-partner launch.',
      solution:
        'Event-sourced, double-entry ledger with idempotent write paths, outbox-pattern publishing and multi-AZ PostgreSQL with automated failover.',
      metrics: [
        { value: '99.999%', label: 'Ledger uptime, trailing 12 mo' }, // VERIFY
        { value: '42ms', label: 'p99 write latency' }, // VERIFY
        { value: '0', label: 'Reconciliation breaks post-launch' }, // VERIFY
      ],
      stack: ['Go', 'PostgreSQL', 'Kafka', 'AWS', 'Terraform'],
      duration: '7 months · 6-engineer pod',
    },
    {
      id: 'healthtech',
      sector: 'HealthTech Platform',
      location: 'San Francisco, CA',
      stage: 'Series B',
      title: 'HIPAA-compliant patient intelligence pipeline.',
      challenge:
        'Clinical data from 40+ EHR integrations sat in silos, and care teams waited up to 48 hours for risk scores.',
      solution:
        'De-identification at ingestion, a FHIR-normalised lakehouse and a governed LLM summarisation layer with audit trails and BAA-covered infrastructure.',
      metrics: [
        { value: '48h → 6m', label: 'Time to patient risk score' }, // VERIFY
        { value: '40+', label: 'EHR sources unified' }, // VERIFY
        { value: 'HIPAA', label: 'Audit passed, zero findings' }, // VERIFY
      ],
      stack: ['Python', 'FHIR', 'GCP', 'BigQuery', 'Vertex AI'],
      duration: '9 months · 5-engineer pod',
    },
    {
      id: 'saas',
      sector: 'Enterprise B2B SaaS',
      location: 'Austin, TX',
      stage: 'Series C',
      title: 'Multi-tenant architecture migration handling 10M+ daily events.',
      challenge:
        'A single-tenant deployment model made each enterprise onboarding a two-week infrastructure project and blocked SOC2 Type II.',
      solution:
        'Strangler-fig migration to a pooled multi-tenant architecture with row-level security, per-tenant rate limiting and Kubernetes-based cell isolation.',
      metrics: [
        { value: '10M+', label: 'Events processed daily' }, // VERIFY
        { value: '14d → 1h', label: 'Enterprise tenant onboarding' }, // VERIFY
        { value: '-46%', label: 'Infrastructure cost per tenant' }, // VERIFY
      ],
      stack: ['Node.js', 'TypeScript', 'Kubernetes', 'PostgreSQL', 'Redis'],
      duration: '11 months · 8-engineer pod',
    },
  ],
} as const;

export const FAQ = {
  eyebrow: '06 — FAQ',
  title: 'Answers for your legal, security and engineering leads.',
  items: [
    {
      q: 'Who owns the code and intellectual property?',
      a: 'You do. Our MSA assigns all work product, code and IP to you upon payment of each invoice, and every engineer signs an individual IP-assignment and confidentiality agreement before touching your systems. Work happens in your repositories from day one, so ownership is never a transfer exercise.',
    },
    {
      q: 'Do you contract under US law?',
      a: 'Yes. We sign a US-law Master Services Agreement (Delaware by default, or your preferred state) with a Statement of Work per engagement. We are comfortable with your paper, and we routinely sign mutual NDAs before discovery calls.',
    },
    {
      q: 'How do you protect our data and infrastructure?',
      a: 'We operate SOC2-aligned controls: SSO with hardware-key MFA, least-privilege access reviewed monthly, encrypted managed devices, audit logging and immediate off-boarding. We work inside your cloud accounts and never copy production data to our environments. DPAs and HIPAA BAAs are available where your data requires them.',
    },
    {
      q: 'What does the US time-zone overlap actually look like?',
      a: 'Every pod runs staggered crews. Overlap crews work shifted hours to give you 4–6 hours of live collaboration with Pacific or Eastern time — typically 9:00 AM to 2:00 PM local. A build crew works the India day shift, which is your overnight, so work progresses while you sleep.',
    },
    {
      q: 'How do communication and reporting work?',
      a: 'We work in your Slack, Linear or Jira, GitHub and Notion. Expect a written async update by 9:00 AM your time every day, a mid-sprint demo, and a sprint review with metrics: velocity, cycle time, escaped defects and coverage. Response SLA is under one business hour inside the overlap window.',
    },
    {
      q: 'Who will actually work on our product?',
      a: 'Every pod is led by a Staff or Senior engineer with 8+ years of experience who has shipped production systems at scale. You interview and approve every engineer before they join. There are no junior-only handoffs and no silent substitutions.',
    },
    {
      q: 'How quickly can a pod start, and can we scale it?',
      a: 'Fixed-scope sprints typically start within 5 business days of signature. Dedicated pods start within 10–15 business days. You can scale a pod up or down with 30 days\u2019 notice, and we maintain continuity by keeping the pod lead constant.',
    },
    {
      q: 'What happens if an engineer is not the right fit?',
      a: 'Tell your pod lead or engagement director. We replace the engineer within 10 business days with a two-week overlap for knowledge transfer, at no cost to you.',
    },
  ],
} as const;

export const CONTACT = {
  eyebrow: '07 — Architecture consultation',
  title: 'Book a 45-minute architecture call.',
  lead:
    'Talk to a Kriva principal engineer — not a salesperson. Bring your architecture, your roadmap and your hardest constraint. You leave with a written point of view within 48 hours, whether or not we work together.',
  promises: [
    'Response within one US business day',
    'Mutual NDA available before the call',
    'Written architecture notes within 48 hours',
  ],
  engagements: [
    { value: 'architecture-call', label: 'Architecture call', hint: '45-min consultation' },
    { value: 'product-pod', label: 'Dedicated product pod', hint: 'Monthly retainer' },
    { value: 'fixed-scope-sprint', label: 'Fixed-scope sprint', hint: '2–6 weeks' },
  ],
  budgets: [
    { value: 'under-25k', label: 'Under $25k' },
    { value: '25k-75k', label: '$25k – $75k' },
    { value: '75k-150k', label: '$75k – $150k' },
    { value: '150k-plus', label: '$150k+' },
  ],
} as const;

export const FOOTER = {
  offices: [
    {
      name: 'San Francisco Partner Hub',
      lines: ['Partnerships, architecture & client leadership', 'San Francisco, CA, USA'],
      zone: 'America/Los_Angeles',
      label: 'San Francisco',
    },
    {
      name: 'India Engineering Delivery Centers',
      lines: ['Build crews, platform & applied AI', 'Pune · Bengaluru, India'],
      zone: 'Asia/Kolkata',
      label: 'India',
    },
  ],
  legal: [
    { label: 'Privacy', href: '#privacy' },
    { label: 'Terms', href: '#terms' },
    { label: 'Security', href: '#security' },
    { label: 'DPA', href: '#dpa' },
  ],
} as const;
