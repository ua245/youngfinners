"use client";
import { useState } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { DEMO_MILESTONES } from "@/lib/demo";
import { releasableFunds } from "@/lib/rep";

export default function Fund() {
  const { s } = useSettings();
  const [raised, setRaised] = useState(500);
  const capped = Math.min(raised, s.fundingCap);
  return (
    <>
      <h1 className="text-2xl font-bold">Micro-Crowdfunding & Escrow</h1>
      <div className="panel space-y-3">
        <label className="block text-sm text-slate">Pledged amount ($)
          <input type="number" min={0} className="field mt-1" value={raised} onChange={(e) => setRaised(Math.max(0, +e.target.value))} />
        </label>
        {raised > s.fundingCap && <p className="alert">Funding cap of ${s.fundingCap} per project exceeded; excess is not accepted.</p>}
        <div className="font-mono">In escrow: ${capped}</div>
        <div className="font-mono">Releasable now (AI-verified milestones, 4 tranches): ${releasableFunds(capped, DEMO_MILESTONES, 0)}</div>
      </div>
    </>
  );
}
