import { motion, useReducedMotion } from 'framer-motion';
import { BrainCircuit, Cloud, Gauge, GitMerge, Layers, Check, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { CAPABILITIES } from '../../data/content';
import { cn } from '../../lib/cn';
import { EASE_KINETIC } from '../../lib/motion';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';

function CardHead({ icon: Icon, index, title }: { icon: LucideIcon; index: string; title: string }) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line-strong bg-basalt text-ink-100">
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <span className="font-mono text-caption text-ink-400" aria-hidden="true">
          {index}
        </span>
      </div>
      <h3 className="text-title font-semibold text-ink-100">{title}</h3>
    </div>
  );
}

function Chips({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
      {items.map((s) => (
        <li key={s} className="rounded-pill border border-line bg-basalt/60 px-2.5 py-1 font-mono text-[0.75rem] text-ink-200">
          {s}
        </li>
      ))}
    </ul>
  );
}

function Card({ className, children, delay = 0 }: { className?: string; children: ReactNode; delay?: number }) {
  return (
    <Reveal className={cn('surface flex flex-col rounded-lg p-6 transition-colors duration-base ease-kinetic hover:bg-graphite-raised sm:p-8', className)} delay={delay}>
      {children}
    </Reveal>
  );
}

export function Capabilities() {
  const [product, cloud, ai, modern] = CAPABILITIES.items;
  const reduce = useReducedMotion();
  const barProps = (pct: number) =>
    reduce
      ? { style: { width: `${pct}%` } }
      : {
          initial: { width: 0 },
          whileInView: { width: `${pct}%` },
          viewport: { once: true },
          transition: { duration: 1.2, ease: EASE_KINETIC, delay: 0.2 },
        };

  return (
    <section id="capabilities" aria-labelledby="capabilities-title" className="py-[var(--spacing-section)]">
      <div className="shell">
        <SectionHeader id="capabilities" eyebrow={CAPABILITIES.eyebrow} title={CAPABILITIES.title} lead={CAPABILITIES.lead} />

        <div className="mt-16 grid gap-4 lg:grid-cols-12">
          {/* Full-stack — 7 cols, 2 rows */}
          <Card className="lg:col-span-7 lg:row-span-2">
            <CardHead icon={Layers} index="A" title={product.title} />
            <p className="mt-4 max-w-xl text-ink-300">{product.body}</p>
            <Chips items={product.stack} />
            <div className="mt-8 flex-1" />
            <div aria-hidden="true" className="rounded-md border border-line bg-basalt p-4 font-mono text-[0.75rem] leading-6 text-ink-300">
              <div className="flex items-center gap-2 text-ink-100">
                <GitMerge className="h-3.5 w-3.5 text-signal" /> feat(ledger): idempotent write path
              </div>
              <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-3">
                <span className="text-status-ok">✓</span>
                <span>types · lint · unit · contract</span>
                <span className="text-status-ok">✓</span>
                <span>coverage 94.2% (gate ≥ 90%)</span>
                <span className="text-status-ok">✓</span>
                <span>SAST · dependency scan · preview deploy</span>
                <span className="text-signal">●</span>
                <span className="text-ink-100">Review requested — Staff engineer</span>
              </div>
            </div>
            <dl className="mt-6 flex items-baseline gap-3 border-t border-line pt-5">
              <dt className="order-last text-caption text-ink-300">{product.stat.label}</dt>
              <dd className="font-display text-display-md font-semibold leading-none text-ink-100">{product.stat.value}</dd>
            </dl>
          </Card>

          {/* Cloud — 5 cols */}
          <Card className="lg:col-span-5" delay={0.06}>
            <CardHead icon={Cloud} index="B" title={cloud.title} />
            <p className="mt-4 text-ink-300">{cloud.body}</p>
            <Chips items={cloud.stack} />
            <div aria-hidden="true" className="mt-6 rounded-md border border-line bg-basalt px-4 py-3 font-mono text-[0.75rem] leading-6 text-ink-300">
              <span className="text-ink-400">$</span> terraform plan
              <br />
              <span className="text-status-ok">Plan:</span> 14 to add, 2 to change, 0 to destroy
            </div>
            <dl className="mt-6 flex items-baseline gap-3 border-t border-line pt-5">
              <dt className="order-last text-caption text-ink-300">{cloud.stat.label}</dt>
              <dd className="font-display text-display-md font-semibold leading-none text-ink-100">{cloud.stat.value}</dd>
            </dl>
          </Card>

          {/* AI — 5 cols */}
          <Card className="lg:col-span-5" delay={0.1}>
            <CardHead icon={BrainCircuit} index="C" title={ai.title} />
            <p className="mt-4 text-ink-300">{ai.body}</p>
            <Chips items={ai.stack} />
            <ol aria-label="RAG pipeline stages" className="mt-6 flex flex-wrap items-center gap-x-1.5 gap-y-2 font-mono text-[0.75rem]">
              {ai.pipeline.map((step, i) => (
                <li key={step} className="flex items-center gap-1.5">
                  <span className={cn('rounded-xs border px-2 py-1', i === ai.pipeline.length - 1 ? 'border-signal text-ink-100' : 'border-line-strong text-ink-200')}>
                    {step}
                  </span>
                  {i < ai.pipeline.length - 1 && (
                    <span aria-hidden="true" className="text-ink-400">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Card>

          {/* Modernization — full width */}
          <Card className="lg:col-span-12" delay={0.06}>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-5">
                <CardHead icon={Gauge} index="D" title={modern.title} />
                <p className="mt-4 text-ink-300">{modern.body}</p>
                <Chips items={modern.stack} />
              </div>
              <div className="lg:col-span-7">
                <p className="eyebrow mb-5">Checkout API · p95 latency (ms)</p>
                <div className="space-y-5">
                  {[
                    { l: modern.before.label, v: modern.before.value, pct: 100, tone: 'bg-ink-400/60' },
                    { l: modern.after.label, v: modern.after.value, pct: (modern.after.value / modern.before.value) * 100, tone: 'bg-signal' },
                  ].map((row) => (
                    <div key={row.l}>
                      <div className="mb-2 flex items-baseline justify-between font-mono text-caption">
                        <span className="text-ink-300">{row.l}</span>
                        <span className="tabular text-ink-100">{row.v.toLocaleString('en-US')} ms</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-xs bg-white/[0.05]">
                        <motion.div className={cn('h-full rounded-xs', row.tone)} {...barProps(row.pct)} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 flex items-center gap-2 text-small text-ink-200">
                  <Check className="h-4 w-4 text-status-ok" aria-hidden="true" />
                  8.7× faster after data-layer tuning and query-plan remediation (sample engagement)
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
