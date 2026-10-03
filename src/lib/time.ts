/**
 * Timezone utilities built on Intl — DST transitions (PDT↔PST, EDT↔EST) are
 * resolved by the browser, so overlap maths stays correct all year.
 */

export const ZONES = {
  sf: { id: 'America/Los_Angeles', city: 'San Francisco', short: 'SF' },
  nyc: { id: 'America/New_York', city: 'New York', short: 'NYC' },
  india: { id: 'Asia/Kolkata', city: 'Pune', short: 'IST' },
} as const;

const formatters = new Map<string, Intl.DateTimeFormat>();
function formatter(zone: string, opts: Intl.DateTimeFormatOptions) {
  const key = zone + JSON.stringify(opts);
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', { timeZone: zone, ...opts });
    formatters.set(key, f);
  }
  return f;
}

/** "09:42:07 AM" in the requested zone. */
export function formatClock(date: Date, zone: string, withSeconds = true) {
  return formatter(zone, {
    hour: '2-digit',
    minute: '2-digit',
    ...(withSeconds ? { second: '2-digit' } : {}),
    hour12: true,
  }).format(date);
}

/** Zone abbreviation — "PDT", "PST", "EDT", "EST", "IST". */
export function zoneAbbr(date: Date, zone: string) {
  if (zone === ZONES.india.id) return 'IST';
  return (
    formatter(zone, { timeZoneName: 'short' })
      .formatToParts(date)
      .find((p) => p.type === 'timeZoneName')?.value ?? ''
  );
}

/** Offset of a zone from UTC in hours (e.g. -7, -4, 5.5). */
export function utcOffsetHours(date: Date, zone: string) {
  const parts = formatter(zone, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const asUTC = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'));
  const actual = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
  );
  return Math.round(((asUTC - actual) / 3_600_000) * 2) / 2;
}

/* -------------------------------------------------------------------------- */
/*  Delivery model                                                            */
/*  Each pod runs staggered crews anchored in IST:                            */
/*   · Build crew   — IST day shift = US overnight (async execution)          */
/*   · EST crew     — shifted late; 4–6 h overlap with 09:00–17:00 ET         */
/*   · PST crew     — shifted later; 4–6 h overlap with 09:00–17:00 PT        */
/* -------------------------------------------------------------------------- */

export interface Crew {
  id: 'build' | 'est' | 'pst';
  label: string;
  /** Shift start in IST, decimal hours. */
  istStart: number;
  /** Shift length in hours. */
  length: number;
  /** US zone this crew overlaps with (overlap crews only). */
  usZone?: string;
}

export const CREWS: Crew[] = [
  { id: 'build', label: 'Build crew', istStart: 9.5, length: 9 },
  { id: 'est', label: 'EST crew', istStart: 14.5, length: 9, usZone: ZONES.nyc.id },
  { id: 'pst', label: 'PST crew', istStart: 17.5, length: 9, usZone: ZONES.sf.id },
];

const IST_OFFSET = 5.5;
const mod24 = (n: number) => ((n % 24) + 24) % 24;
const inRange = (h: number, start: number, len: number) => mod24(h - start) < len;

export function crewUtc(crew: Crew) {
  return { start: mod24(crew.istStart - IST_OFFSET), length: crew.length };
}

export function usBusinessUtc(date: Date, zone: string) {
  return { start: mod24(9 - utcOffsetHours(date, zone)), length: 8 };
}

/** Hours of overlap between an overlap crew and its US zone's 09:00–17:00. */
export function overlapHours(date: Date, crew: Crew) {
  if (!crew.usZone) return 0;
  const c = crewUtc(crew);
  const us = usBusinessUtc(date, crew.usZone);
  let total = 0;
  for (let step = 0; step < 96; step++) {
    const h = step / 4 + 0.125;
    if (inRange(h, c.start, c.length) && inRange(h, us.start, us.length)) total += 0.25;
  }
  return total;
}

export type HeatCell = 0 | 1 | 2; // 0 idle · 1 working · 2 overlapping with US day

/** Is the 1-hour UTC slot `h` mostly inside a window? (samples slot midpoint) */
const slotIn = (h: number, start: number, len: number) => inRange(h + 0.5, start, len);

export function usRow(date: Date, zone: string): HeatCell[] {
  const us = usBusinessUtc(date, zone);
  return Array.from({ length: 24 }, (_, h) => (slotIn(h, us.start, us.length) ? 1 : 0));
}

export function crewRow(date: Date, crew: Crew): HeatCell[] {
  const c = crewUtc(crew);
  const us = crew.usZone ? usBusinessUtc(date, crew.usZone) : null;
  return Array.from({ length: 24 }, (_, h) => {
    if (!slotIn(h, c.start, c.length)) return 0;
    return us && slotIn(h, us.start, us.length) ? 2 : 1;
  });
}

export type DeliveryPhase = 'overlap' | 'build' | 'ci';

/** What the delivery system is doing right now. */
export function currentPhase(date: Date): DeliveryPhase {
  const h = date.getUTCHours() + date.getUTCMinutes() / 60;
  for (const crew of CREWS) {
    if (!crew.usZone) continue;
    const c = crewUtc(crew);
    const us = usBusinessUtc(date, crew.usZone);
    if (inRange(h, c.start, c.length) && inRange(h, us.start, us.length)) return 'overlap';
  }
  const build = crewUtc(CREWS[0]);
  if (inRange(h, build.start, build.length)) return 'build';
  return 'ci';
}

export const PHASE_LABEL: Record<DeliveryPhase, string> = {
  overlap: 'US overlap window',
  build: 'Async build window',
  ci: 'CI + on-call coverage',
};
