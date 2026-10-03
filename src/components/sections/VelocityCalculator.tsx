import { ArrowRight, Check, Minus, Plus } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import {
  DEFAULT_CONFIG,
  describePod,
  estimatePod,
  MAX_POD_SIZE,
  PRESETS,
  ROLES,
  usd,
  type Cadence,
  type PodConfig,
  type RoleId,
} from '../../data/calculator';
import { cn } from '../../lib/cn';
import { setPodSummary } from '../../lib/podStore';
import { scrollToSection } from '../../lib/scroll';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';

const SEGMENT_TONES = ['bg-signal', 'bg-ink-100', 'bg-ink-200/80', 'bg-ink-300/70', 'bg-ink-400/70', 'bg-white/25'];

function Stat({
  label,
  value,
  unit,
  decimals = 0,
  prefix,
}: {
  label: string;
  value: number;
  unit?: string;
  decimals?: number;
  prefix?: string;
}) {
  return (
    <div className="flex flex-col-reverse justify-end">
      <dt className="mt-1.5 text-caption text-ink-300">{label}</dt>
      <dd className="font-display text-display-md font-semibold leading-none text-ink-100">
        <AnimatedNumber value={value} decimals={decimals} prefix={prefix} duration={0.6} />
        {unit && <span className="ml-1 font-body text-small font-normal text-ink-300">{unit}</span>}
      </dd>
    </div>
  );
}

export function VelocityCalculator() {
  const [config, setConfig] = useState<PodConfig>(DEFAULT_CONFIG);
  const [cadence, setCadence] = useState<Cadence>(2);
  const [attached, setAttached] = useState(false);
  const groupId = useId();

  const estimate = useMemo(() => estimatePod(config, cadence), [config, cadence]);
  const total = estimate.headcount;
  const activePreset = PRESETS.find((p) => ROLES.every((r) => p.config[r.id] === config[r.id]))?.id;

  const change = (id: RoleId, delta: number) => {
    setAttached(false);
    setConfig((c) => {
      const role = ROLES.find((r) => r.id === id)!;
      const next = Math.min(role.max, Math.max(0, c[id] + delta));
      const size = total - c[id] + next;
      if (size > MAX_POD_SIZE) return c;
      return { ...c, [id]: next };
    });
  };

  const attach = () => {
    setPodSummary(describePod(config, cadence, estimate));
    setAttached(true);
    scrollToSection('contact');
  };

  const summary =
    total === 0
      ? 'Add at least one engineer to model a pod.'
      : `${total} engineers. Estimated ${estimate.velocity} story points per ${cadence}-week sprint, ${estimate.prsPerWeek} merged pull requests per week, ${estimate.deploysPerWeek} deploys per week.`;

  return (
    <section id="simulator" aria-labelledby="simulator-title" className="relative py-[var(--spacing-section)]">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line" />
      <div className="shell">
        <SectionHeader
          id="simulator"
          eyebrow="05 — Sprint pod & velocity simulator"
          title="Model your pod before the first call."
          lead="Compose a team, pick a cadence and see estimated sprint throughput and an indicative monthly investment — calculated live from role baselines on a mature CI/CD pipeline."
        />

        <Reveal className="surface mt-14 overflow-hidden rounded-xl">
          <div className="grid lg:grid-cols-12">
            {/* Inputs */}
            <div className="p-5 sm:p-8 lg:col-span-7 lg:border-r lg:border-line">
              <div role="group" aria-label="Presets" className="flex flex-wrap items-center gap-2">
                <span className="eyebrow mr-1">Presets</span>
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={activePreset === p.id}
                    onClick={() => {
                      setConfig(p.config);
                      setAttached(false);
                    }}
                    className={cn(
                      'rounded-pill border px-3.5 py-1.5 text-small transition-colors duration-fast',
                      activePreset === p.id
                        ? 'border-signal bg-signal/10 text-ink-100'
                        : 'border-line-strong text-ink-200 hover:border-ink-300 hover:text-ink-100',
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <fieldset className="mt-8">
                <legend className="eyebrow mb-3">Team composition</legend>
                <ul className="divide-y divide-line border-y border-line">
                  {ROLES.map((r) => {
                    const count = config[r.id];
                    const labelId = `${groupId}-${r.id}`;
                    return (
                      <li key={r.id} className="flex items-center justify-between gap-4 py-3.5">
                        <div className="min-w-0">
                          <p id={labelId} className="text-[0.9375rem] font-medium text-ink-100">
                            {r.label}
                          </p>
                          <p className="text-caption text-ink-400">{r.note}</p>
                        </div>
                        <div role="group" aria-labelledby={labelId} className="flex shrink-0 items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => change(r.id, -1)}
                            disabled={count === 0}
                            aria-label={`Remove one ${r.label}`}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong text-ink-100 transition-colors hover:bg-graphite-hover disabled:cursor-not-allowed disabled:opacity-35"
                          >
                            <Minus className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <output aria-live="off" className="tabular w-8 text-center font-mono text-[1.0625rem] text-ink-100">
                            {count}
                          </output>
                          <button
                            type="button"
                            onClick={() => change(r.id, 1)}
                            disabled={count >= r.max || total >= MAX_POD_SIZE}
                            aria-label={`Add one ${r.label}`}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong text-ink-100 transition-colors hover:bg-graphite-hover disabled:cursor-not-allowed disabled:opacity-35"
                          >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-caption text-ink-400">Up to {MAX_POD_SIZE} engineers per pod. Staff/Senior engineers only.</p>
              </fieldset>

              <fieldset className="mt-8">
                <legend className="eyebrow mb-3">Sprint cadence</legend>
                <div role="radiogroup" aria-label="Sprint cadence" className="inline-grid grid-cols-2 gap-1 rounded-md border border-line bg-basalt p-1">
                  {([1, 2] as const).map((c) => (
                    <label key={c} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name={`${groupId}-cadence`}
                        value={c}
                        checked={cadence === c}
                        onChange={() => {
                          setCadence(c);
                          setAttached(false);
                        }}
                        className="peer sr-only"
                      />
                      <span className="flex h-10 min-w-28 items-center justify-center rounded-sm px-4 text-small text-ink-200 transition-colors peer-checked:bg-graphite-hover peer-checked:text-ink-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal">
                        {c}-week sprints
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Outputs */}
            <div className="relative flex flex-col bg-basalt/40 p-5 sm:p-8 lg:col-span-5">
              <p className="eyebrow mb-6">Estimated output</p>
              <p role="status" className="sr-only">
                {summary}
              </p>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-8" aria-hidden="true">
                <Stat label={`Velocity / ${cadence}-wk sprint`} value={estimate.velocity} unit="pts" />
                <Stat label="Sprints / quarter" value={estimate.sprintsPerQuarter} decimals={estimate.sprintsPerQuarter % 1 ? 1 : 0} />
                <Stat label="Merged PRs / week" value={estimate.prsPerWeek} />
                <Stat label="Deploys / week" value={estimate.deploysPerWeek} />
                <Stat label="US overlap hours / week" value={estimate.overlapHoursPerWeek} unit="h" />
                <Stat label="Enforced coverage gate" value={estimate.coverageTarget} unit="%" />
              </dl>

              <div className="mt-8 border-t border-line pt-6">
                <div className="mb-3 flex items-baseline justify-between">
                  <p className="eyebrow">Throughput by role</p>
                  <p className="tabular font-mono text-caption text-ink-400" aria-hidden="true">
                    {Math.round(estimate.efficiency * 100)}% pod efficiency
                  </p>
                </div>
                <div aria-hidden="true" className="flex h-3 gap-[2px] overflow-hidden rounded-xs bg-white/[0.04]">
                  {estimate.contributions.map((c, i) => (
                    <div
                      key={c.id}
                      className={cn('h-full transition-[flex-grow] duration-slow ease-kinetic', SEGMENT_TONES[i % SEGMENT_TONES.length])}
                      style={{ flexGrow: c.points, flexBasis: 0 }}
                    />
                  ))}
                </div>
                <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-caption text-ink-300">
                  {estimate.contributions.map((c, i) => (
                    <li key={c.id} className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <span aria-hidden="true" className={cn('h-2 w-2 rounded-[2px]', SEGMENT_TONES[i % SEGMENT_TONES.length])} />
                        {c.label}
                      </span>
                      <span className="tabular font-mono text-ink-100">{c.points}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 rounded-lg border border-line bg-graphite p-5 shadow-specular">
                <p className="eyebrow mb-2">Indicative monthly investment</p>
                <p className="font-display text-display-md font-semibold leading-none text-ink-100">
                  {total === 0 ? '—' : `${usd(estimate.monthly[0])} – ${usd(estimate.monthly[1])}`}
                </p>
                <p className="mt-3 text-caption text-ink-400">
                  Planning range only, based on blended role rates. Final pricing is fixed in the SOW after an architecture call.
                </p>
              </div>

              <div className="mt-auto pt-6">
                <Button size="lg" onClick={attach} disabled={total === 0} className="w-full">
                  {attached ? <Check className="h-[18px] w-[18px]" aria-hidden="true" /> : null}
                  Use this pod in my inquiry
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
