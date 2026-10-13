"use client";
import { useState } from "react";
import { useSettings } from "@/components/SettingsProvider";
import type { Milestone } from "@/lib/rep";

export default function Roadmap() {
  const { s } = useSettings();
  const [idea, setIdea] = useState("");
  const [items, setItems] = useState<Milestone[]>([]);
  const [rigid, setRigid] = useState(0);

  async function run() {
    const r = await fetch("/api/zaro", { method: "POST", body: JSON.stringify({ action: "roadmap", idea, settings: s }) });
    const j = await r.json();
    setItems(j.result);
    setRigid(j.rigidWeeks);
  }
  return (
    <>
      <h1 className="text-2xl font-bold">Zaro Roadmap Generator</h1>
      <div className="panel flex gap-2">
        <input className="field" placeholder="Describe your idea" value={idea} onChange={(e) => setIdea(e.target.value)} />
        <button className="btn" onClick={run}>Generate</button>
      </div>
      {items.length > 0 && (
        <>
          <p className="text-slate">Strictness {s.roadmapStrictness}/10: weeks 1–{rigid} are rigid deadlines.</p>
          <ol className="space-y-2">
            {items.map((m) => (
              <li key={m.week} className={`panel flex justify-between ${m.week <= rigid ? "border-l-4 border-l-crimson" : ""}`}>
                <span><span className="font-mono text-slate">W{m.week}</span> {m.title}</span>
                <span className="text-xs uppercase text-slate">{m.track}</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </>
  );
}
