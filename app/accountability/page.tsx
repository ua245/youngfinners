"use client";
import { useState } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { DEMO_BUDGET, DEMO_MILESTONES } from "@/lib/demo";
import { repScore } from "@/lib/rep";
import { auditBudget } from "@/lib/zaro";

export default function Accountability() {
  const { s } = useSettings();
  const [budget, setBudget] = useState(DEMO_BUDGET);
  const flags = auditBudget(budget, DEMO_MILESTONES, s);
  const score = repScore({ budget, milestones: DEMO_MILESTONES, weightFinancial: s.repWeightFinancial });
  return (
    <>
      <h1 className="text-2xl font-bold">Financial Accountability</h1>
      <div className="panel font-mono">Rep-Score: {score}/1000</div>
      <table className="panel w-full font-mono text-sm">
        <thead className="text-left text-slate"><tr><th>Category</th><th>Planned</th><th>Actual</th></tr></thead>
        <tbody>
          {budget.map((b, i) => (
            <tr key={b.category} className={flags.some((f) => f.category === b.category) ? "alert" : ""}>
              <td>{b.category}</td>
              <td>${b.planned}</td>
              <td><input type="number" min={0} className="field w-24" value={b.actual} onChange={(e) => setBudget(budget.map((x, j) => (j === i ? { ...x, actual: Math.max(0, +e.target.value) } : x)))} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {flags.map((f) => (
        <div key={f.category} className="panel alert">
          Zaro flag: {f.category} is ${f.over} over plan. Rep-Score impact: {f.repImpact}.
        </div>
      ))}
    </>
  );
}
