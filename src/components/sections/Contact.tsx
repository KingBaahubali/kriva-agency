import { AlertTriangle, ArrowUpRight, CheckCircle2, LoaderCircle, X } from 'lucide-react';
import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { CONTACT, SITE } from '../../data/content';
import { cn } from '../../lib/cn';
import { setPodSummary, usePodSummary } from '../../lib/podStore';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';

type Field = 'name' | 'email' | 'company' | 'engagement' | 'budget' | 'scope';
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMPTY: Values = { name: '', email: '', company: '', engagement: 'architecture-call', budget: '', scope: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_FILL_MS = 3000;

function validateField(field: Field, v: Values): string | undefined {
  const val = v[field].trim();
  switch (field) {
    case 'name':
      return val.length < 2 ? 'Enter your full name.' : val.length > 100 ? 'Name is too long.' : undefined;
    case 'email':
      return !EMAIL_RE.test(val) ? 'Enter a valid work email, e.g. jordan@company.com.' : undefined;
    case 'company':
      return val.length > 120 ? 'Company name is too long.' : undefined;
    case 'engagement':
      return !val ? 'Select an engagement type.' : undefined;
    case 'budget':
      return !val ? 'Select a budget band.' : undefined;
    case 'scope':
      return val.length < 20
        ? `Describe the project in at least 20 characters (${val.length}/20).`
        : val.length > 3000
          ? 'Keep the description under 3,000 characters.'
          : undefined;
  }
}

const ORDER: Field[] = ['name', 'email', 'company', 'engagement', 'budget', 'scope'];

function Label({ htmlFor, children, optional }: { htmlFor?: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-small font-medium text-ink-100">
      <span>{children}</span>
      {optional && <span className="font-mono text-[0.6875rem] font-normal uppercase tracking-[0.1em] text-ink-400">Optional</span>}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} className={cn('mt-2 flex items-start gap-1.5 text-caption text-status-error', !message && 'hidden')}>
      {message && (
        <>
          <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{message}</span>
        </>
      )}
    </p>
  );
}

export function Contact() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [banner, setBanner] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef<number>(0);
  const pod = usePodSummary();

  const touch = () => {
    if (!startedAt.current) startedAt.current = Date.now();
  };

  const set = (field: Field, value: string) => {
    touch();
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined })); // clear on input
  };

  const blur = (field: Field) => {
    const msg = validateField(field, values);
    if (values[field] !== '' || errors[field]) setErrors((e) => ({ ...e, [field]: msg }));
  };

  const focusField = (field: Field) => {
    const form = formRef.current;
    if (!form) return;
    const el =
      form.querySelector<HTMLElement>(`#contact-${field}`) ??
      form.querySelector<HTMLElement>(`input[name="${field}"]`);
    el?.focus();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    const found: Errors = {};
    for (const f of ORDER) {
      const msg = validateField(f, values);
      if (msg) found[f] = msg;
    }
    setErrors(found);
    const first = ORDER.find((f) => found[f]);
    if (first) {
      setBanner('');
      setStatus('idle');
      focusField(first);
      return;
    }

    setStatus('submitting');
    setBanner('');
    try {
      // Server enforces a minimum fill time as spam protection; pad quietly for fast autofill.
      const wait = Math.max(0, MIN_FILL_MS - (Date.now() - (startedAt.current || Date.now())));
      if (wait) await new Promise((r) => setTimeout(r, wait));

      const data = new FormData(formRef.current!);
      const res = await fetch(new URL('api/contact.php', document.baseURI), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...values,
          website: String(data.get('website') ?? ''),
          startedAt: startedAt.current,
          pod: pod ?? '',
        }),
      });

      let payload: { success?: boolean; message?: string; errors?: Errors } = {};
      try {
        payload = await res.json();
      } catch {
        /* non-JSON response (e.g. PHP not available) */
      }

      if (res.ok && payload.success) {
        setStatus('success');
        setValues(EMPTY);
        setPodSummary(null);
        startedAt.current = 0;
        return;
      }
      if (payload.errors) {
        setErrors(payload.errors);
        const f = ORDER.find((k) => payload.errors?.[k]);
        if (f) focusField(f);
      }
      setBanner(payload.message || `We could not send your message (HTTP ${res.status}). Email ${SITE.email} directly.`);
      setStatus('error');
    } catch {
      setBanner(`Network error — your message was not sent. Check your connection or email ${SITE.email} directly.`);
      setStatus('error');
    }
  };

  const describedBy = (f: Field) => (errors[f] ? `contact-${f}-error` : undefined);
  const invalid = (f: Field) => (errors[f] ? true : undefined);

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative py-[var(--spacing-section)]">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line" />
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeader id="contact" eyebrow={CONTACT.eyebrow} title={CONTACT.title} lead={CONTACT.lead} className="!block [&>*+*]:mt-6" />
          <ul className="mt-10 space-y-3">
            {CONTACT.promises.map((p) => (
              <li key={p} className="flex items-center gap-3 text-small text-ink-200">
                <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-signal" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-small text-ink-300">
            Prefer email? <a href={`mailto:${SITE.email}`} className="text-ink-100 underline decoration-line-strong underline-offset-4 hover:decoration-signal">{SITE.email}</a>
          </p>
        </div>

        <Reveal className="lg:col-span-7">
          <div className="surface rounded-xl p-5 sm:p-9">
            {status === 'success' ? (
              <div role="status" className="py-8 text-center sm:py-14 sm:text-left">
                <CheckCircle2 className="mb-6 h-9 w-9 text-status-ok" aria-hidden="true" />
                <h3 className="text-display-md font-semibold text-ink-100">Request received.</h3>
                <p className="mt-4 max-w-md text-ink-300">
                  A Kriva principal engineer will reply within one US business day with times for your architecture call. Check your inbox for the confirmation thread.
                </p>
                <Button variant="secondary" className="mt-8" onClick={() => setStatus('idle')}>
                  Send another request
                </Button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby={banner ? 'contact-banner' : undefined} className="space-y-6">
                {status === 'error' && banner && (
                  <div id="contact-banner" role="alert" className="flex items-start gap-3 rounded-md border border-status-error/40 bg-status-error/10 p-4 text-small text-ink-100">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-status-error" aria-hidden="true" />
                    <p>{banner}</p>
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="contact-name">Full name</Label>
                    <input id="contact-name" name="name" type="text" autoComplete="name" required maxLength={100} enterKeyHint="next"
                      className="field-control" value={values.name} onChange={(e) => set('name', e.target.value)} onBlur={() => blur('name')}
                      aria-invalid={invalid('name')} aria-describedby={describedBy('name')} />
                    <FieldError id="contact-name-error" message={errors.name} />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Work email</Label>
                    <input id="contact-email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={254} enterKeyHint="next"
                      className="field-control" value={values.email} onChange={(e) => set('email', e.target.value)} onBlur={() => blur('email')}
                      aria-invalid={invalid('email')} aria-describedby={describedBy('email')} />
                    <FieldError id="contact-email-error" message={errors.email} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contact-company" optional>Company</Label>
                  <input id="contact-company" name="company" type="text" autoComplete="organization" maxLength={120} enterKeyHint="next"
                    className="field-control" value={values.company} onChange={(e) => set('company', e.target.value)} onBlur={() => blur('company')}
                    aria-invalid={invalid('company')} aria-describedby={describedBy('company')} />
                  <FieldError id="contact-company-error" message={errors.company} />
                </div>

                <fieldset aria-invalid={invalid('engagement')} aria-describedby={describedBy('engagement')}>
                  <legend className="mb-2 text-small font-medium text-ink-100">What would you like to discuss?</legend>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {CONTACT.engagements.map((o, i) => (
                      <label key={o.value} className="relative block cursor-pointer">
                        <input id={i === 0 ? 'contact-engagement' : undefined} type="radio" name="engagement" value={o.value} className="peer sr-only"
                          checked={values.engagement === o.value} onChange={() => set('engagement', o.value)} />
                        <span className="flex h-full min-h-[64px] flex-col justify-center rounded-md border border-line-strong bg-basalt px-3.5 py-2.5 transition-colors peer-checked:border-signal peer-checked:bg-signal/10 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal hover:border-ink-300">
                          <span className="text-small font-medium text-ink-100">{o.label}</span>
                          <span className="text-caption text-ink-400 peer-checked:text-ink-300">{o.hint}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <FieldError id="contact-engagement-error" message={errors.engagement} />
                </fieldset>

                <fieldset aria-invalid={invalid('budget')} aria-describedby={describedBy('budget')}>
                  <legend className="mb-2 text-small font-medium text-ink-100">Budget per quarter</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {CONTACT.budgets.map((o, i) => (
                      <label key={o.value} className="relative block cursor-pointer">
                        <input id={i === 0 ? 'contact-budget' : undefined} type="radio" name="budget" value={o.value} className="peer sr-only"
                          checked={values.budget === o.value} onChange={() => set('budget', o.value)} />
                        <span className="flex h-12 items-center justify-center rounded-md border border-line-strong bg-basalt px-2 text-small text-ink-100 transition-colors peer-checked:border-signal peer-checked:bg-signal/10 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal hover:border-ink-300">
                          {o.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  <FieldError id="contact-budget-error" message={errors.budget} />
                </fieldset>

                <div>
                  <Label htmlFor="contact-scope">Project scope</Label>
                  <textarea id="contact-scope" name="scope" rows={5} required maxLength={3000}
                    placeholder="Current architecture, the constraint you need to break, and the milestone you are working toward."
                    className="field-control resize-y" value={values.scope} onChange={(e) => set('scope', e.target.value)} onBlur={() => blur('scope')}
                    aria-invalid={invalid('scope')} aria-describedby={describedBy('scope')} />
                  <FieldError id="contact-scope-error" message={errors.scope} />
                </div>

                {pod && (
                  <div className="flex items-start justify-between gap-4 rounded-md border border-line-strong bg-basalt p-4">
                    <div className="min-w-0">
                      <p className="eyebrow mb-1.5">Pod configuration attached</p>
                      <p className="text-small text-ink-200">{pod}</p>
                    </div>
                    <button type="button" onClick={() => setPodSummary(null)} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line text-ink-200 hover:border-line-strong hover:text-ink-100">
                      <X className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Remove attached pod configuration</span>
                    </button>
                  </div>
                )}

                {/* Honeypot — invisible to people and assistive tech, tempting to bots */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Website
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                  <Button type="submit" size="lg" disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
                    {status === 'submitting' ? (
                      <>
                        <LoaderCircle className="h-[18px] w-[18px] animate-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Request architecture call
                        <ArrowUpRight className="h-[18px] w-[18px]" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                  <p className="max-w-[18rem] text-caption text-ink-400">
                    We use your details only to respond to this request. Mutual NDA available on request.
                  </p>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
