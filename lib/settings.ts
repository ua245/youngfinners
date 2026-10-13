export type Persona = "strict-vc" | "supportive-mentor" | "technical-lead";

export interface Settings {
  theme: "pitch-black" | "matte-grey";
  density: "compact" | "comfortable";
  animation: "none" | "subtle" | "high";
  persona: Persona;
  roadmapStrictness: number;
  auditAggressiveness: number;
  fundingCap: number;
  repWeightFinancial: number;
  requireGithub: boolean;
  requireGpa: boolean;
  requireHackathonWins: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: "pitch-black",
  density: "comfortable",
  animation: "subtle",
  persona: "strict-vc",
  roadmapStrictness: 5,
  auditAggressiveness: 5,
  fundingCap: 2000,
  repWeightFinancial: 50,
  requireGithub: true,
  requireGpa: false,
  requireHackathonWins: false,
};

export const PERSONA_PROMPTS: Record<Persona, string> = {
  "strict-vc":
    "You are Zaro, a Strict VC. Focus heavily on ROI and give harsh financial critiques.",
  "supportive-mentor":
    "You are Zaro, a Supportive Mentor. Focus on learning and give gentle corrections.",
  "technical-lead":
    "You are Zaro, a Technical Lead. Focus on architecture and sprint velocity.",
};

export const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));
