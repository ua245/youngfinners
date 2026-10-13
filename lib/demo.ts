import type { BudgetLine, Milestone } from "./rep.ts";
import type { Profile } from "./zaro.ts";

export const DEMO_BUDGET: BudgetLine[] = [
  { category: "Cloud hosting", planned: 120, actual: 180 },
  { category: "Design tools", planned: 60, actual: 55 },
  { category: "Marketing", planned: 200, actual: 210 },
  { category: "Legal", planned: 80, actual: 0 },
];

export const DEMO_MILESTONES: Milestone[] = Array.from({ length: 12 }, (_, i) => ({
  week: i + 1,
  title: `Week ${i + 1} milestone`,
  track: i % 2 ? "business" : "technical",
  done: i < 6,
  late: i === 3,
}));

export const DEMO_POOL: Profile[] = [
  { name: "Aisha K.", role: "strategist", skills: ["finance", "marketing", "pricing"], github: "aisha-k", gpa: 3.8, hackathonWins: 2 },
  { name: "Marcus L.", role: "strategist", skills: ["finance", "sales"], gpa: 3.4 },
  { name: "Priya S.", role: "builder", skills: ["react", "python", "ml"], github: "priya-s", hackathonWins: 1 },
  { name: "Tom W.", role: "builder", skills: ["node", "react", "postgres"], github: "tomw", gpa: 3.5 },
];
