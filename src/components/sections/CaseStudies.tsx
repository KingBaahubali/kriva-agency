import { CASES } from '../../data/content';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';

export function CaseStudies() {
  return (
    <section id="cases" aria-labelledby="cases-title" className="relative py-[var(--spacing-section)]">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line" />
      <div className="shell">
        <SectionHeader id="cases" eyebrow={CASES.eyebrow} title={CASES.title} lead={CASES.lead} />

        <ol className="mt-16 border-t border-line">
          {CASES.items.map((c, i) => (
            <Reveal as="li" key={c.id} className="border-b border-line py-10 sm:py-12">
              <article className="grid gap-8 lg:grid-cols-12 lg:gap-10" aria-labelledby={`case-${c.id}`}>
                <header className="lg:col-span-3">
                  <p className="font-mono text-caption text-ink-400">0{i + 1}</p>
                  <p className="mt-3 font-display text-[1.0625rem] font-semibold text-ink-100">{c.sector}</p>
                  <p className="mt-1 text-small text-ink-300">
                    {c.location} · {c.stage}
                  </p>
                  <p className="mt-4 font-mono text-caption text-ink-400">{c.duration}</p>
                </header>

                <div className="lg:col-span-5">
                  <h3 id={`case-${c.id}`} className="text-display-md font-semibold text-ink-100">
                    {c.title}
                  </h3>
                  <dl className="mt-6 space-y-5 text-small">
                    <div>
                      <dt className="eyebrow mb-1.5">Challenge</dt>
                      <dd className="text-ink-300">{c.challenge}</dd>
                    </div>
                    <div>
                      <dt className="eyebrow mb-1.5">Architecture</dt>
                      <dd className="text-ink-200">{c.solution}</dd>
                    </div>
                  </dl>
                  <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technology stack">
                    {c.stack.map((s) => (
                      <li key={s} className="rounded-pill border border-line px-2.5 py-1 font-mono text-[0.75rem] text-ink-200">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <dl className="surface grid self-start rounded-lg lg:col-span-4">
                  {c.metrics.map((m, j) => (
                    <div
                      key={m.label}
                      className={`flex items-baseline justify-between gap-4 px-5 py-4 sm:px-6 ${j ? 'border-t border-line' : ''}`}
                    >
                      <dt className="text-caption text-ink-300">{m.label}</dt>
                      <dd className="tabular font-display text-[1.5rem] font-semibold leading-none text-ink-100">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
