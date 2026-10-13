"use client";
import { useSettings } from "@/components/SettingsProvider";
import { DEMO_BUDGET, DEMO_MILESTONES } from "@/lib/demo";
import { financialAccuracy, fundingEligibility, repScore, roadmapCompletion } from "@/lib/rep";

export default function Dashboard() {
  const { s } = useSettings();
  const score = repScore({ budget: DEMO_BUDGET, milestones: DEMO_MILESTONES, weightFinancial: s.repWeightFinancial });
  return (
    <>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-slate">Pitch ideas, match with co-founders, raise micro-funds, and let Zaro keep you accountable.</p>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Rep-Score" value={`${score}/1000`} />
        <Stat label="Financial accuracy" value={`${Math.round(financialAccuracy(DEMO_BUDGET) * 100)}%`} />
        <Stat label="Roadmap completion" value={`${Math.round(roadmapCompletion(DEMO_MILESTONES) * 100)}%`} />
        <Stat label="Funding eligibility" value={`$${fundingEligibility(score, s.fundingCap)}`} />
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel">
      <div className="text-xs uppercase text-slate">{label}</div>
      <div className="font-mono text-2xl">{value}</div>
    </div>
  );
}
