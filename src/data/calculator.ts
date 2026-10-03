/**
 * Sprint Pod & Velocity Simulator — model
 * -----------------------------------------------------------------------------
 * Story-point and PR baselines are per engineer per 2-week sprint, calibrated
 * for senior engineers on a mature CI/CD pipeline.
 * TODO(verify before launch): `rate` values are placeholder monthly USD ranges.
 */

export type RoleId = 'architect' | 'fullstack' | 'backend' | 'devops' | 'ml' | 'qa';

export interface Role {
  id: RoleId;
  label: string;
  short: string;
  /** Story points per 2-week sprint. */
  pts: number;
  /** Merged PRs per week. */
  prs: number;
  /** Monthly USD range per engineer (placeholder). */
  rate: readonly [number, number];
  max: number;
  note: string;
}

export const ROLES: readonly Role[] = [
  { id: 'architect', label: 'Lead Architect', short: 'Architect', pts: 8, prs: 4, rate: [15000, 19000], max: 2, note: 'Raises pod efficiency' },
  { id: 'fullstack', label: 'Senior Full-Stack Engineer', short: 'Full-Stack', pts: 21, prs: 9, rate: [9500, 12500], max: 6, note: 'Product surfaces + APIs' },
  { id: 'backend', label: 'Staff Backend Engineer', short: 'Backend', pts: 24, prs: 8, rate: [11000, 14500], max: 4, note: 'Distributed systems' },
  { id: 'devops', label: 'DevOps / SRE', short: 'DevOps', pts: 13, prs: 6, rate: [10000, 13000], max: 3, note: 'Drives deploy frequency' },
  { id: 'ml', label: 'Applied ML Engineer', short: 'ML', pts: 18, prs: 6, rate: [12000, 16000], max: 3, note: 'RAG, evals, fine-tuning' },
  { id: 'qa', label: 'QA Automation Engineer', short: 'QA', pts: 10, prs: 7, rate: [7000, 9000], max: 3, note: 'Coverage + regression' },
] as const;

export type PodConfig = Record<RoleId, number>;
export type Cadence = 1 | 2;

export const PRESETS: { id: string; label: string; config: PodConfig }[] = [
  { id: 'mvp', label: 'MVP Pod', config: { architect: 1, fullstack: 2, backend: 0, devops: 1, ml: 0, qa: 0 } },
  { id: 'scale', label: 'Scale Pod', config: { architect: 1, fullstack: 3, backend: 2, devops: 1, ml: 0, qa: 1 } },
  { id: 'ai', label: 'AI Platform Pod', config: { architect: 1, fullstack: 1, backend: 1, devops: 1, ml: 2, qa: 1 } },
];

export const DEFAULT_CONFIG: PodConfig = PRESETS[0].config;
export const MAX_POD_SIZE = 12;

export interface PodEstimate {
  headcount: number;
  efficiency: number;
  velocity: number;
  sprintsPerQuarter: number;
  pointsPerQuarter: number;
  prsPerWeek: number;
  deploysPerWeek: number;
  overlapHoursPerWeek: number;
  coverageTarget: number;
  monthly: readonly [number, number];
  contributions: { id: RoleId; label: string; points: number }[];
}

const round = (n: number, step = 1) => Math.round(n / step) * step;

export function estimatePod(config: PodConfig, cadence: Cadence): PodEstimate {
  const headcount = ROLES.reduce((sum, r) => sum + config[r.id], 0);

  // Coordination overhead (Brooks): −3.5% per additional engineer, floor 70%.
  const coordination = Math.max(0.7, 1 - 0.035 * Math.max(0, headcount - 1));
  // Each Lead Architect lifts pod efficiency (+8%, capped at +12%).
  const architectLift = Math.min(0.12, config.architect * 0.08);
  const efficiency = headcount === 0 ? 0 : Math.min(1.05, coordination + architectLift);

  // 1-week sprints carry proportionally more ceremony overhead (×0.94).
  const cadenceFactor = cadence === 1 ? 0.5 * 0.94 : 1;

  const contributions = ROLES.map((r) => ({
    id: r.id,
    label: r.short,
    points: config[r.id] * r.pts * cadenceFactor * efficiency,
  }));
  const velocity = contributions.reduce((s, c) => s + c.points, 0);

  const sprintsPerQuarter = cadence === 1 ? 13 : 6.5;
  const prsPerWeek = ROLES.reduce((s, r) => s + config[r.id] * r.prs, 0) * efficiency;

  // Deploys: baseline daily trunk deploys, multiplied by DevOps maturity.
  const deploysPerWeek = headcount === 0 ? 0 : 5 * (1 + config.devops * 0.6) + (cadence === 1 ? 2 : 0);
  const overlapHoursPerWeek = headcount === 0 ? 0 : 25;
  const coverageTarget = config.qa > 0 ? 92 : 90;

  const monthly = ROLES.reduce<[number, number]>(
    (acc, r) => [acc[0] + config[r.id] * r.rate[0], acc[1] + config[r.id] * r.rate[1]],
    [0, 0],
  );

  return {
    headcount,
    efficiency,
    velocity: round(velocity),
    sprintsPerQuarter,
    pointsPerQuarter: round(velocity * sprintsPerQuarter, 5),
    prsPerWeek: round(prsPerWeek),
    deploysPerWeek: round(deploysPerWeek),
    overlapHoursPerWeek,
    coverageTarget,
    monthly: [round(monthly[0], 500), round(monthly[1], 500)] as const,
    contributions: contributions.filter((c) => c.points > 0).map((c) => ({ ...c, points: round(c.points) })),
  };
}

export function describePod(config: PodConfig, cadence: Cadence, estimate: PodEstimate) {
  const roles = ROLES.filter((r) => config[r.id] > 0)
    .map((r) => `${config[r.id]} × ${r.label}`)
    .join(', ');
  return `Pod: ${roles} · ${cadence}-week sprints · est. ${estimate.velocity} pts/sprint, ${estimate.prsPerWeek} PRs/week`;
}

export const usd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
