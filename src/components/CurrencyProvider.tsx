import { useEffect, useState } from "react";
import { initCurrency } from "@/lib/currency-store";

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    initCurrency().finally(() => {
      if (active) setReady(true);
    });
    return () => { active = false; };
  }, []);

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center text-sm uppercase tracking-[0.12em] text-muted-foreground">Initializing Pricing...</div>;
  }

  return <>{children}</>;
};
