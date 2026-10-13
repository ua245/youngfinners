"use client";
import { useState } from "react";
import { useSettings } from "@/components/SettingsProvider";
import type { Validation } from "@/lib/zaro";

export default function Validate() {
  const { s } = useSettings();
  const [pitch, setPitch] = useState("");
  const [builders, setBuilders] = useState(1);
  const [strategists, setStrategists] = useState(0);
  const [res, setRes] = useState<Validation | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    const r = await fetch("/api/zaro", {
      method: "POST",
      body: JSON.stringify({ action: "validate", pitch, builders, strategists, settings: s }),
    });
    setRes((await r.json()).result);
    setBusy(false);
  }
  return (
    <>
      <h1 className="text-2xl font-bold">Zaro Idea Validator</h1>
      <div className="panel space-y-3">
        <textarea className="field h-32" placeholder="Paste your raw startup idea…" value={pitch} onChange={(e) => setPitch(e.target.value)} />
        <div className="flex gap-4 text-sm">
          <label>Builders <input type="number" min={0} className="field w-20" value={builders} onChange={(e) => setBuilders(+e.target.value)} /></label>
          <label>Strategists <input type="number" min={0} className="field w-20" value={strategists} onChange={(e) => setStrategists(+e.target.value)} /></label>
        </div>
        <button className={`btn ${busy ? "pulse" : ""}`} disabled={busy || !pitch.trim()} onClick={run}>Validate</button>
      </div>
      {res && (
        <div className="panel font-mono">
          <div>Market viability: {res.market}</div>
          <div>Technical feasibility: {res.feasibility}</div>
          <div>Team composition: {res.team}</div>
          <div className={res.overall < 60 ? "alert" : ""}>Overall: {res.overall}</div>
          <p className="mt-2 font-sans text-slate">{res.comment}</p>
        </div>
      )}
    </>
  );
}
