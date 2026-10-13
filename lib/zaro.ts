import type { Settings } from "./settings.ts";
import type { BudgetLine, Milestone } from "./rep.ts";
import { repScore } from "./rep.ts";

export interface Validation {
  market: number;
  feasibility: number;
  team: number;
  overall: number;
  comment: string;
}

/** Heuristic Idea Validator; scores are 0-100. */
export function validateIdea(
  pitch: string,
  team: { builders: number; strategists: number },
  s: Pick<Settings, "persona">,
): Validation {
  const words = pitch.trim().split(/\s+/).filter(Boolean).length;
  const has = (re: RegExp) => (re.test(pitch) ? 1 : 0);
  const market = Math.min(
    100,
    30 + Math.min(words, 60) / 2 + 15 * has(/\b(students?|users?|customers?|market|saas|b2b|campus)\b/i) + 15 * has(/\$\d|revenue|pricing|subscription/i),
  );
  const feasibility = Math.min(
    100,
    40 + 20 * has(/\b(app|api|web|mobile|platform|ai|bot|dashboard)\b/i) + 20 * has(/\bmvp|prototype|weeks?\b/i) - 20 * has(/\b(blockchain|quantum|hardware|satellite)\b/i) + Math.min(words, 40) / 4,
  );
  const teamScore =
    (team.builders > 0 ? 50 : 0) + (team.strategists > 0 ? 50 : 0);
  const overall = Math.round(0.4 * market + 0.3 * feasibility + 0.3 * teamScore);
  const tone = {
    "strict-vc": overall < 60 ? "Weak ROI case. Define revenue before asking for capital." : "Investable on paper. Prove unit economics.",
    "supportive-mentor": overall < 60 ? "Good start! Sharpen your customer and add a co-founder." : "Nice work! Keep validating with real users.",
    "technical-lead": overall < 60 ? "Scope the architecture and cut the MVP to one core flow." : "Solid scope. Plan sprints around the core flow.",
  }[s.persona];
  return {
    market: Math.round(market),
    feasibility: Math.round(Math.max(0, feasibility)),
    team: teamScore,
    overall,
    comment: tone,
  };
}

/** 12-week sprint roadmap. Strictness 1-10 controls how many weeks are hard milestones. */
export function generateRoadmap(idea: string, strictness: number): Milestone[] {
  const name = idea.trim().split(/\s+/).slice(0, 4).join(" ") || "the product";
  const plan: [string, Milestone["track"]][] = [
    [`Interview 10 target users for ${name}`, "business"],
    ["Define scope and architecture", "technical"],
    ["Set up repo, CI and design system", "technical"],
    ["Expense plan and budget approved", "business"],
    ["Core feature prototype", "technical"],
    ["Internal demo and feedback", "business"],
    ["MVP feature-complete", "technical"],
    ["Pricing and go-to-market draft", "business"],
    ["Closed beta with 20 users", "business"],
    ["Fix top beta issues", "technical"],
    ["Public launch", "business"],
    ["Retrospective and funding report", "business"],
  ];
  void strictness;
  return plan.map(([title, track], i) => ({ week: i + 1, title, track, done: false, late: false }));
}

/** Number of milestone weeks enforced as rigid deadlines (1 = agile, 10 = waterfall). */
export function rigidWeeks(strictness: number): number {
  return Math.round((Math.min(10, Math.max(1, strictness)) / 10) * 12);
}

export interface AuditFlag {
  category: string;
  over: number;
  /** Negative Rep-Score change caused by this overspend */
  repImpact: number;
  severity: "red" | "warn";
}

/**
 * Flags overspend. Aggressiveness 1 flags only >50% deviation; 10 flags any >$1 deviation.
 */
export function auditBudget(
  budget: BudgetLine[],
  milestones: Milestone[],
  s: Pick<Settings, "auditAggressiveness" | "repWeightFinancial">,
): AuditFlag[] {
  const a = Math.min(10, Math.max(1, s.auditAggressiveness));
  const base = repScore({ budget, milestones, weightFinancial: s.repWeightFinancial });
  const flags: AuditFlag[] = [];
  for (const line of budget) {
    const over = line.actual - line.planned;
    if (over <= 0) continue;
    const threshold = a >= 10 ? 1 : (line.planned * 0.5 * (10 - a)) / 9;
    if (over <= threshold) continue;
    const corrected = budget.map((b) => (b === line ? { ...b, actual: b.planned } : b));
    const withoutOverspend = repScore({ budget: corrected, milestones, weightFinancial: s.repWeightFinancial });
    flags.push({
      category: line.category,
      over,
      repImpact: base - withoutOverspend,
      severity: over / Math.max(line.planned, 1) > 0.2 ? "red" : "warn",
    });
  }
  return flags;
}

export interface Profile {
  name: string;
  role: "builder" | "strategist";
  skills: string[];
  github?: string;
  gpa?: number;
  hackathonWins?: number;
}

export function eligible(p: Profile, s: Pick<Settings, "requireGithub" | "requireGpa" | "requireHackathonWins">): boolean {
  if (s.requireGithub && !p.github) return false;
  if (s.requireGpa && p.gpa === undefined) return false;
  if (s.requireHackathonWins && !p.hackathonWins) return false;
  return true;
}

/** Suggest complementary co-founders for `me`, ranked by skill-gap coverage. */
export function matchmake(
  me: Profile,
  needs: string[],
  pool: Profile[],
  s: Pick<Settings, "requireGithub" | "requireGpa" | "requireHackathonWins">,
): { profile: Profile; score: number }[] {
  const need = needs.map((n) => n.toLowerCase());
  return pool
    .filter((p) => p.role !== me.role && eligible(p, s))
    .map((p) => {
      const skills = p.skills.map((k) => k.toLowerCase());
      const covered = need.filter((n) => skills.includes(n)).length;
      const score = need.length ? Math.round((covered / need.length) * 100) : 50;
      return { profile: p, score };
    })
    .sort((a, b) => b.score - a.score);
}
