import { NextResponse } from "next/server";
import { DEFAULT_SETTINGS, PERSONA_PROMPTS, type Settings } from "@/lib/settings";
import { auditBudget, generateRoadmap, rigidWeeks, validateIdea } from "@/lib/zaro";
import type { BudgetLine } from "@/lib/rep";

// The Zaro key is read server-side only from the environment and never sent to the client.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.action !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const s: Settings = { ...DEFAULT_SETTINGS, ...(body.settings ?? {}) };
  const live = Boolean(process.env.ZARO_API_KEY);
  const systemPrompt = `${PERSONA_PROMPTS[s.persona]} Roadmap strictness ${s.roadmapStrictness}/10. Audit aggressiveness ${s.auditAggressiveness}/10.`;

  switch (body.action) {
    case "validate": {
      const pitch = String(body.pitch ?? "").slice(0, 5000);
      const team = { builders: Number(body.builders) || 0, strategists: Number(body.strategists) || 0 };
      return NextResponse.json({ live, systemPrompt, result: validateIdea(pitch, team, s) });
    }
    case "roadmap": {
      const idea = String(body.idea ?? "").slice(0, 5000);
      return NextResponse.json({
        live,
        systemPrompt,
        rigidWeeks: rigidWeeks(s.roadmapStrictness),
        result: generateRoadmap(idea, s.roadmapStrictness),
      });
    }
    case "audit": {
      const budget: BudgetLine[] = Array.isArray(body.budget) ? body.budget : [];
      return NextResponse.json({ live, systemPrompt, result: auditBudget(budget, [], s) });
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
