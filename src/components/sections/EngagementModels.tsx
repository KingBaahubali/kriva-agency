import { ArrowRight } from 'lucide-react';
import { ENGAGEMENT } from '../../data/content';
import { cn } from '../../lib/cn';
import { ButtonLink } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';

export function EngagementModels() {
  return (
    <section id="engagement" aria-labelledby="engagement-title" className="relative py-[var(--spacing-section)]">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line" />
      <div className="shell">
        <SectionHeader id="engagement" eyebrow={ENGAGEMENT.eyebrow} title={ENGAGEMENT.title} lead={ENGAGEMENT.lead} />

        <div className="mt-16 grid gap-4 lg:grid-cols-12">
          {ENGAGEMENT.models.map((m, i) => (
            <Reveal
              as="article"
              key={m.id}
              delay={i * 0.08}
              className={cn(
                'flex flex-col rounded-lg p-6 sm:p-9',
                m.featured ? 'surface-raised lg:col-span-7' : 'surface lg:col-span-5',
              )}
            >
              <p className="eyebrow">{m.billing}</p>
              <h3 className="mt-3 text-display-md font-semibold text-ink-100">{m.name}</h3>
              <p className="mt-4 max-w-lg text-ink-300">{m.summary}</p>

              <dl className="mt-8 divide-y divide-line border-y border-line">
                {m.rows.map(([k, v]) => (
                  <div key={k} className="grid gap-1 py-3.5 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
                    <dt className="font-mono text-caption uppercase tracking-[0.1em] text-ink-400">{k}</dt>
                    <dd className="text-small text-ink-100">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex-1" />
              <ButtonLink href={m.href} variant={m.featured ? 'primary' : 'secondary'} className="self-start">
                {m.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
