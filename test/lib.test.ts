import test from "node:test";
import assert from "node:assert/strict";
import { repScore, fundingEligibility, releasableFunds, financialAccuracy } from "../lib/rep.ts";
import { auditBudget, matchmake, generateRoadmap, validateIdea } from "../lib/zaro.ts";

const budget = [
  { category: "Cloud", planned: 100, actual: 150 },
  { category: "Ads", planned: 100, actual: 90 },
];
const ms = generateRoadmap("A student app", 5);

test("financial accuracy penalises overspend", () => {
  assert.equal(financialAccuracy(budget), 0.75);
});

test("rep score weighting", () => {
  const done = ms.map((m) => ({ ...m, done: true }));
  assert.equal(repScore({ budget, milestones: done, weightFinancial: 0 }), 1000);
  assert.equal(repScore({ budget, milestones: done, weightFinancial: 100 }), 750);
});

test("funding eligibility respects cap", () => {
  assert.equal(fundingEligibility(1000, 2000), 2000);
  assert.equal(fundingEligibility(0, 2000), 500);
});

test("tranche release", () => {
  const half = ms.map((m, i) => ({ ...m, done: i < 6 }));
  assert.equal(releasableFunds(1000, half, 0), 500);
  assert.equal(releasableFunds(1000, half, 500), 0);
});

test("audit aggressiveness", () => {
  const s = { repWeightFinancial: 100 };
  assert.equal(auditBudget(budget, ms, { ...s, auditAggressiveness: 1 }).length, 0);
  const flags = auditBudget(budget, ms, { ...s, auditAggressiveness: 10 });
  assert.equal(flags.length, 1);
  assert.equal(flags[0].repImpact, -250);
  assert.equal(flags[0].severity, "red");
});

test("matchmaking filters", () => {
  const me = { name: "me", role: "builder" as const, skills: [] };
  const pool = [
    { name: "a", role: "strategist" as const, skills: ["finance"], github: "x" },
    { name: "b", role: "strategist" as const, skills: ["finance"] },
  ];
  const f = { requireGpa: false, requireHackathonWins: false };
  assert.equal(matchmake(me, ["finance"], pool, { ...f, requireGithub: true }).length, 1);
  assert.equal(matchmake(me, ["finance"], pool, { ...f, requireGithub: false }).length, 2);
});

test("validator needs both sides of team", () => {
  const v = validateIdea("A web app for campus students with subscription pricing MVP in 8 weeks", { builders: 1, strategists: 0 }, { persona: "strict-vc" });
  assert.equal(v.team, 50);
});
