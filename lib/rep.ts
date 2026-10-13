export interface BudgetLine {
  category: string;
  planned: number;
  actual: number;
}

export interface Milestone {
  week: number;
  title: string;
  track: "technical" | "business";
  done: boolean;
  late: boolean;
}

export interface RepInput {
  budget: BudgetLine[];
  milestones: Milestone[];
  /** 0-100: share of the score driven by financial accuracy; rest is roadmap completion */
  weightFinancial: number;
}

/** Fraction (0-1) of spend that stays within plan; overspend is penalised proportionally. */
export function financialAccuracy(budget: BudgetLine[]): number {
  const planned = budget.reduce((s, b) => s + b.planned, 0);
  if (planned <= 0) return 0;
  const over = budget.reduce((s, b) => s + Math.max(0, b.actual - b.planned), 0);
  return Math.max(0, 1 - over / planned);
}

/** Fraction (0-1) of milestones done, with late milestones counting half. */
export function roadmapCompletion(milestones: Milestone[]): number {
  if (milestones.length === 0) return 0;
  const pts = milestones.reduce(
    (s, m) => s + (m.done ? (m.late ? 0.5 : 1) : 0),
    0,
  );
  return pts / milestones.length;
}

/** Reputation score 0-1000. */
export function repScore({ budget, milestones, weightFinancial }: RepInput): number {
  const w = Math.min(100, Math.max(0, weightFinancial)) / 100;
  const v = w * financialAccuracy(budget) + (1 - w) * roadmapCompletion(milestones);
  return Math.round(v * 1000);
}

/** Maximum funding a project may raise, scaled by Rep-Score and capped by platform rule. */
export function fundingEligibility(score: number, cap: number): number {
  const factor = 0.25 + 0.75 * (Math.min(1000, Math.max(0, score)) / 1000);
  return Math.round(cap * factor);
}

/**
 * Release escrow tranches: one per completed milestone group of 3 (4 tranches over 12 weeks).
 * Returns amount releasable from `raised`, minus what was already released.
 */
export function releasableFunds(
  raised: number,
  milestones: Milestone[],
  alreadyReleased: number,
): number {
  const total = milestones.length;
  if (total === 0) return 0;
  const done = milestones.filter((m) => m.done).length;
  const tranches = Math.floor((done / total) * 4);
  return Math.max(0, Math.round((raised * tranches) / 4) - alreadyReleased);
}
