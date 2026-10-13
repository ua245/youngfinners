"use client";
import { useState } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { DEMO_POOL } from "@/lib/demo";
import { matchmake } from "@/lib/zaro";

export default function Match() {
  const { s } = useSettings();
  const [role, setRole] = useState<"builder" | "strategist">("builder");
  const [needs, setNeeds] = useState("finance, marketing");
  const me = { name: "You", role, skills: [] };
  const list = matchmake(me, needs.split(",").map((n) => n.trim()).filter(Boolean), DEMO_POOL, s);
  return (
    <>
      <h1 className="text-2xl font-bold">Zaro Matchmaker</h1>
      <div className="panel flex gap-2">
        <select className="field w-40" value={role} onChange={(e) => setRole(e.target.value as "builder" | "strategist")}>
          <option value="builder">I build</option>
          <option value="strategist">I strategize</option>
        </select>
        <input className="field" value={needs} onChange={(e) => setNeeds(e.target.value)} placeholder="Skills you need, comma separated" />
      </div>
      <p className="text-xs text-slate">Required fields: {[s.requireGithub && "GitHub", s.requireGpa && "GPA", s.requireHackathonWins && "hackathon wins"].filter(Boolean).join(", ") || "none"}</p>
      {list.length === 0 && <p className="text-slate">No eligible co-founders.</p>}
      {list.map(({ profile: p, score }) => (
        <div key={p.name} className="panel flex justify-between">
          <div><div className="font-bold">{p.name}</div><div className="text-sm text-slate">{p.role} · {p.skills.join(", ")}</div></div>
          <div className="font-mono text-crimson">{score}% fit</div>
        </div>
      ))}
    </>
  );
}
