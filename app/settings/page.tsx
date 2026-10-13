"use client";
import type { ReactNode } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { clamp, type Settings } from "@/lib/settings";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return <label className="flex items-center justify-between gap-4 py-2 text-sm">{label}{children}</label>;
}

export default function SettingsPage() {
  const { s, set } = useSettings();
  const sel = <K extends keyof Settings>(k: K, opts: string[]) => (
    <select className="field w-48" value={String(s[k])} onChange={(e) => set({ [k]: e.target.value } as Partial<Settings>)}>
      {opts.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
  const slider = (k: "roadmapStrictness" | "auditAggressiveness") => (
    <span className="flex items-center gap-2 font-mono">
      <input type="range" min={1} max={10} value={s[k]} onChange={(e) => set({ [k]: +e.target.value })} />{s[k]}
    </span>
  );
  const check = (k: "requireGithub" | "requireGpa" | "requireHackathonWins") => (
    <input type="checkbox" checked={s[k]} onChange={(e) => set({ [k]: e.target.checked })} />
  );
  return (
    <>
      <h1 className="text-2xl font-bold">Settings & Controls</h1>
      <section className="panel">
        <h2 className="font-bold text-crimson">UI & Experience</h2>
        <Row label="Theme intensity">{sel("theme", ["pitch-black", "matte-grey"])}</Row>
        <Row label="Data density">{sel("density", ["compact", "comfortable"])}</Row>
        <Row label="Animation level">{sel("animation", ["none", "subtle", "high"])}</Row>
      </section>
      <section className="panel">
        <h2 className="font-bold text-crimson">Zaro AI</h2>
        <Row label="Persona">{sel("persona", ["strict-vc", "supportive-mentor", "technical-lead"])}</Row>
        <Row label="Roadmap strictness (1 agile – 10 waterfall)">{slider("roadmapStrictness")}</Row>
        <Row label="Financial auditing aggressiveness (1–10)">{slider("auditAggressiveness")}</Row>
      </section>
      <section className="panel">
        <h2 className="font-bold text-crimson">Platform Rules</h2>
        <Row label="Funding cap per project ($)">
          <input type="number" min={0} className="field w-32" value={s.fundingCap} onChange={(e) => set({ fundingCap: Math.max(0, +e.target.value) })} />
        </Row>
        <Row label={`Rep-Score weighting: ${s.repWeightFinancial}% financial / ${100 - s.repWeightFinancial}% roadmap`}>
          <input type="range" min={0} max={100} value={s.repWeightFinancial} onChange={(e) => set({ repWeightFinancial: clamp(+e.target.value, 0, 100) })} />
        </Row>
        <Row label="Require GitHub link">{check("requireGithub")}</Row>
        <Row label="Require GPA">{check("requireGpa")}</Row>
        <Row label="Require prior hackathon wins">{check("requireHackathonWins")}</Row>
      </section>
    </>
  );
}
