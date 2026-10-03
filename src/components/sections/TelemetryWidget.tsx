import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useClock } from '../../hooks/useClock';
import { cn } from '../../lib/cn';
import { CREWS, crewRow, currentPhase, overlapHours, PHASE_LABEL, usRow, ZONES, type HeatCell } from '../../lib/time';

const PODS = [
  { name: 'Atlas', work: 'Ledger v3', day: 6, base: 64, ctx: 'FinTech · NYC' },
  { name: 'Meridian', work: 'Patient graph', day: 4, base: 41, ctx: 'HealthTech · SF' },
  { name: 'Vector', work: 'Tenant mesh', day: 8, base: 82, ctx: 'B2B SaaS · AUS' },
] as const;

const PR_SERIES = [31, 34, 33, 38, 41, 39, 44, 47, 46, 51, 49, 54, 56, 58];

const CELL_STYLE: Record<HeatCell, string> = {
  0: 'bg-white/[0.04]',
  1: 'bg-ink-400/45',
  2: 'bg-signal',
};

function Sparkline({ values }: { values: number[] }) {
  const w = 220;
  const h = 56;
  const min = Math.min(...values) - 4;
  const max = Math.max(...values) + 4;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - ((v - min) / (max - min)) * h] as const);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h + 6}`} className="h-14 w-full overflow-visible" aria-hidden="true" preserveAspectRatio="none">
      <path d={`${line} L${w} ${h} L0 ${h} Z`} fill="rgb(255 75 31 / 0.08)" />
      <path d={line} fill="none" stroke="#FF4B1F" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx={lx} cy={ly} r="3" fill="#FF4B1F" />
    </svg>
  );
}

/** Live engineering telemetry. Values are illustrative and labelled as sample data. */
export function TelemetryWidget({ className }: { className?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const inView = useInView(rootRef, { margin: '100px' });
  const reduce = useReducedMotion();
  const live = inView && !reduce;
  const now = useClock(30_000, inView);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 2500);
    return () => window.clearInterval(id);
  }, [live]);

  const phase = currentPhase(now);
  const estH = overlapHours(now, CREWS[1]);
  const pstH = overlapHours(now, CREWS[2]);

  const rows: { label: string; cells: HeatCell[] }[] = [
    { label: 'US Pacific team · 9–5 PT', cells: usRow(now, ZONES.sf.id) },
    { label: 'US Eastern team · 9–5 ET', cells: usRow(now, ZONES.nyc.id) },
    { label: 'Kriva EST crew', cells: crewRow(now, CREWS[1]) },
    { label: 'Kriva PST crew', cells: crewRow(now, CREWS[2]) },
    { label: 'Kriva build crew', cells: crewRow(now, CREWS[0]) },
  ];
  const utcPos = ((now.getUTCHours() + now.getUTCMinutes() / 60) / 24) * 100;
  const utcLabel = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;

  const wave = (i: number, amp: number) => Math.sin(tick * 0.9 + i * 1.7) * amp;
  const median = (3.1 + wave(2, 0.25)).toFixed(1);
  const series = PR_SERIES.map((v, i) => (i === PR_SERIES.length - 1 ? v + wave(1, 2) : v));

  return (
    <section
      ref={rootRef}
      aria-label="Live engineering telemetry (sample data)"
      className={cn('surface relative overflow-hidden rounded-xl', className)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-signal/10 blur-3xl"
      />

      <header className="relative flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full bg-status-ok', live && 'pulse-dot')} />
          <h3 className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.14em] text-ink-100">
            Engineering telemetry
          </h3>
        </div>
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-400">Sample data</span>
      </header>

      <div className="relative space-y-6 p-5">
        {/* Active sprints */}
        <div>
          <p className="eyebrow mb-3">Active sprints</p>
          <ul className="space-y-3.5" aria-hidden="true">
            {PODS.map((p, i) => {
              const pct = Math.round(Math.min(97, Math.max(5, p.base + wave(i, 3))));
              return (
                <li key={p.name}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-small text-ink-100">
                      {p.name} <span className="text-ink-400">· {p.work}</span>
                    </span>
                    <span className="tabular font-mono text-caption text-ink-300">
                      Day {p.day}/10 · {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-pill bg-white/[0.06]">
                    <div
                      className="h-full rounded-pill bg-ink-200 transition-[width] duration-slow ease-kinetic"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 font-mono text-[0.6875rem] text-ink-400">{p.ctx}</p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* PR velocity */}
        <div className="border-t border-line pt-5">
          <div className="mb-2 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-1.5">PR velocity · 14 days</p>
              <p className="font-display text-display-md font-semibold leading-none text-ink-100" aria-hidden="true">
                <span className="tabular">{Math.round(series[series.length - 1])}</span>
                <span className="ml-1.5 font-body text-small font-normal text-ink-300">merged PRs / week</span>
              </p>
            </div>
            <dl className="text-right" aria-hidden="true">
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-400">Median review</dt>
              <dd className="tabular font-mono text-small text-ink-100">{median} h</dd>
            </dl>
          </div>
          <Sparkline values={series} />
        </div>

        {/* Overlap heatmap */}
        <div className="border-t border-line pt-5">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <p className="eyebrow">Overlap heatmap · UTC</p>
            <p className="font-mono text-[0.6875rem] text-ink-300">{PHASE_LABEL[phase]}</p>
          </div>
          <div
            role="img"
            aria-label={`Timezone overlap heatmap. Current overlap with US business hours: ${estH} hours for the Eastern crew and ${pstH} hours for the Pacific crew.`}
          >
            <div className="relative space-y-2" aria-hidden="true">
              {rows.map((row) => (
                <div key={row.label}>
                  <p className="mb-1 font-mono text-[0.6875rem] text-ink-400">{row.label}</p>
                  <div className="grid gap-[2px]" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
                    {row.cells.map((c, h) => (
                      <span key={h} className={cn('h-3.5 rounded-[2px]', CELL_STYLE[c])} />
                    ))}
                  </div>
                </div>
              ))}
              <div
                className="pointer-events-none absolute -bottom-1 -top-1 w-px bg-ink-100"
                style={{ left: `${utcPos}%` }}
              >
                <span className="absolute -top-0.5 left-1 -translate-y-full whitespace-nowrap rounded-xs bg-ink-100 px-1 font-mono text-[0.625rem] leading-4 text-basalt">
                  {utcLabel}
                </span>
              </div>
              <div className="flex justify-between pt-1 font-mono text-[0.625rem] text-ink-400">
                <span>00</span>
                <span>06</span>
                <span>12</span>
                <span>18</span>
                <span>24</span>
              </div>
            </div>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-caption text-ink-300">
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2 w-2 rounded-[2px] bg-signal" /> US overlap · {estH}h EST / {pstH}h PST
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2 w-2 rounded-[2px] bg-ink-400/45" /> Working
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
