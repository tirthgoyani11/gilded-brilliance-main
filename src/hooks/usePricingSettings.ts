import { useState, useEffect } from "react";

export type PricingSettings = {
  multipliers: Record<string, number>;
  safetyBuffer: number;
};

const DEFAULT_SETTINGS: PricingSettings = {
  multipliers: { "10K": 4.2, "14K": 6.2, "18K": 8.5, "22K": 10.5 },
  safetyBuffer: 1.05
};

export const getPricingSettings = (): PricingSettings => {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem("vmora_pricing_settings");
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed, multipliers: { ...DEFAULT_SETTINGS.multipliers, ...(parsed.multipliers || {}) } };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const setPricingSettings = (settings: PricingSettings) => {
  window.localStorage.setItem("vmora_pricing_settings", JSON.stringify(settings));
  window.dispatchEvent(new Event("pricing-settings-updated"));
};

export const usePricingSettings = () => {
  const [settings, setSettingsState] = useState(getPricingSettings());

  useEffect(() => {
    const handleUpdate = () => setSettingsState(getPricingSettings());
    window.addEventListener("pricing-settings-updated", handleUpdate);
    return () => window.removeEventListener("pricing-settings-updated", handleUpdate);
  }, []);

  return { settings, savePricingSettings: setPricingSettings };
};
