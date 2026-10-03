import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { Shield, TestTube2, Timer } from 'lucide-react';
import { useRef } from 'react';
import { COLLABORATION } from '../../data/content';
import { cn } from '../../lib/cn';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';

/** 24-hour strip in US Pacific time — matches the crew model in lib/time.ts (DST: PDT). */
const SEGMENTS = [
  { from: 0, to: 6, label: 'Async build', tone: 'bg-ink-400/50' },
  { from: 6, to: 9, label: 'Review-ready', tone: 'bg-ink-200/70' },
  { from: 9, to: 14, label: 'US overlap', tone: 'bg-signal' },
  { from: 14, to: 21, label: 'CI + on-call', tone: 'bg-white/[0.08]' },
  { from: 21, to: 24, label: 'Async build', tone: 'bg-ink-400/50' },
] as const;

const GUARANTEE_ICONS = [Timer, Shield, TestTube2];

export function CollaborationModel() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  return (
    <section id="model" aria-labelledby="model-title" className="relative py-[var(--spacing-section)]">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line" />
      <div className="shell">
        <SectionHeader id="model" eyebrow={COLLABORATION.eyebrow} title={COLLABORATION.title} lead={COLLABORATION.lead} />

        {/* 24h strip */}
        <Reveal className="surface mt-14 rounded-lg p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <p className="eyebrow">One delivery day · US Pacific time</p>
            <p className="font-mono text-caption text-ink-400">Eastern clients: add 3 hours</p>
          </div>
          <div role="img" aria-label="24-hour delivery day in Pacific time: async build 9 PM to 6 AM, review-ready handoff 6 to 9 AM, US overlap window 9 AM to 2 PM, CI and on-call coverage 2 PM to 9 PM.">
            <div aria-hidden="true" className="flex h-9 gap-[2px] overflow-hidden rounded-sm">
              {SEGMENTS.map((s, i) => (
                <div key={i} className={cn('relative flex items-center overflow-hidden px-2', s.tone)} style={{ flex: s.to - s.from }}>
                  <span className={cn('truncate font-mono text-[0.6875rem] uppercase tracking-[0.08em]', s.tone === 'bg-signal' || s.tone === 'bg-ink-200/70' ? 'text-basalt' : 'text-ink-100')}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <div aria-hidden="true" className="mt-2 flex justify-between font-mono text-[0.6875rem] text-ink-400">
              {['12a', '3a', '6a', '9a', '12p', '3p', '6p', '9p', '12a'].map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Steps */}
        <div className="relative mt-14">
          <div aria-hidden="true" className="absolute left-[15px] top-2 hidden h-[calc(100%-1rem)] w-px bg-line lg:left-0 lg:top-[15px] lg:block lg:h-px lg:w-full" />
          <ol ref={ref} className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
            {!reduce && (
              <>
                <motion.span
                  aria-hidden="true"
                  style={{ scaleY: progress }}
                  className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-signal lg:hidden"
                />
                <motion.span
                  aria-hidden="true"
                  style={{ scaleX: progress }}
                  className="absolute left-0 top-[15px] hidden h-px w-full origin-left bg-signal lg:block"
                />
              </>
            )}
            {COLLABORATION.steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 0.08} className="relative pl-12 lg:pl-0 lg:pt-12">
                <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-line-strong bg-basalt font-mono text-caption text-ink-100">
                  {i + 1}
                </span>
                <p className="font-mono text-caption text-signal">{step.time}</p>
                <h3 className="mt-2 text-title font-semibold text-ink-100">{step.title}</h3>
                <p className="mt-3 text-small text-ink-300">{step.body}</p>
                <p className="mt-4 eyebrow !text-ink-400">{step.tag}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Guarantees */}
        <ul className="mt-20 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
          {COLLABORATION.guarantees.map((g, i) => {
            const Icon = GUARANTEE_ICONS[i];
            return (
              <li key={g.title} className="bg-graphite p-6 sm:p-7">
                <Icon className="mb-4 h-5 w-5 text-ink-100" aria-hidden="true" />
                <h3 className="font-display text-[1.0625rem] font-semibold text-ink-100">{g.title}</h3>
                <p className="mt-2 text-small text-ink-300">{g.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
