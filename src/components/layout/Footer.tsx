import { MapPin } from 'lucide-react';
import { FOOTER, NAV_LINKS, SITE } from '../../data/content';
import { useClock } from '../../hooks/useClock';
import { currentPhase, formatClock, PHASE_LABEL, zoneAbbr } from '../../lib/time';
import { Logo } from '../brand/Logo';

function Clock({ label, zone, now }: { label: string; zone: string; now: Date }) {
  return (
    <div className="surface rounded-lg px-4 py-3.5">
      <p className="eyebrow mb-1.5">{label}</p>
      <p className="flex items-baseline gap-2">
        <time dateTime={now.toISOString()} className="tabular font-mono text-[1.375rem] font-medium text-ink-100">
          {formatClock(now, zone)}
        </time>
        <span className="font-mono text-caption text-ink-300">{zoneAbbr(now, zone)}</span>
      </p>
    </div>
  );
}

export function Footer() {
  const now = useClock(1000);
  const phase = currentPhase(now);

  return (
    <footer className="relative border-t border-line bg-basalt-deep pb-10 pt-20">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo className="h-9 text-ink-100" />
            <p className="mt-6 max-w-sm text-ink-300">{SITE.tagline} Senior-led sprint pods for US product teams.</p>
            <a href={`mailto:${SITE.email}`} className="mt-6 inline-block font-display text-title font-semibold text-ink-100 underline decoration-line-strong underline-offset-8 hover:decoration-signal">
              {SITE.email}
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7">
            {FOOTER.offices.map((o) => (
              <div key={o.name}>
                <h3 className="flex items-center gap-2 font-display text-[1.0625rem] font-semibold text-ink-100">
                  <MapPin className="h-4 w-4 text-signal" aria-hidden="true" />
                  {o.name}
                </h3>
                <p className="mt-3 text-small text-ink-300">
                  {o.lines[0]}
                  <br />
                  {o.lines[1]}
                </p>
                <div className="mt-5">
                  <Clock label={`${o.label} · local time`} zone={o.zone} now={now} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-12">
          <nav aria-label="Footer" className="md:col-span-5">
            <p className="eyebrow mb-4">Explore</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-small">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="text-ink-300 transition-colors hover:text-ink-100">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className="text-ink-300 transition-colors hover:text-ink-100">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="eyebrow mb-4">System status</p>
            <p className="flex items-center gap-2.5 text-small text-ink-100">
              <span aria-hidden="true" className="pulse-dot h-2 w-2 rounded-full bg-status-ok" />
              All delivery systems operational
            </p>
            <p className="mt-2 font-mono text-caption text-ink-400">{PHASE_LABEL[phase]} · CI, on-call & incident response 24/7</p>
          </div>

          <nav aria-label="Legal" className="md:col-span-3">
            <p className="eyebrow mb-4">Legal</p>
            <ul className="space-y-2.5 text-small">
              {FOOTER.legal.map((l) => (
                <li key={l.label}>
                  <a
                    href={`mailto:${SITE.email}?subject=${encodeURIComponent(`${l.label} documentation request`)}`}
                    className="text-ink-300 transition-colors hover:text-ink-100"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-line pt-6 text-caption text-ink-400 sm:flex-row">
          <p>© {now.getFullYear()} Kriva. All rights reserved.</p>
          <p className="font-mono">SOC2-aligned delivery · US-law contracts · Client-owned IP</p>
        </div>
      </div>
    </footer>
  );
}
