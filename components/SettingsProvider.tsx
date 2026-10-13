"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/settings";

const Ctx = createContext<{ s: Settings; set: (p: Partial<Settings>) => void }>({
  s: DEFAULT_SETTINGS,
  set: () => {},
});
export const useSettings = () => useContext(Ctx);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Settings>(DEFAULT_SETTINGS);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("yf-settings");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setS({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("yf-settings", JSON.stringify(s));
    const d = document.documentElement.dataset;
    d.theme = s.theme;
    d.density = s.density;
    d.anim = s.animation;
  }, [s]);
  return <Ctx.Provider value={{ s, set: (p) => setS((o) => ({ ...o, ...p })) }}>{children}</Ctx.Provider>;
}
