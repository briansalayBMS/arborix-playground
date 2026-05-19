"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useLedgerFetch, type LedgerState } from "@/lib/api/hooks/useLedger";

const LedgerContext = createContext<LedgerState | null>(null);

export function LedgerProvider({ children }: { children: ReactNode }) {
  const state = useLedgerFetch();
  return <LedgerContext.Provider value={state}>{children}</LedgerContext.Provider>;
}

export function useLedger(): LedgerState {
  const ctx = useContext(LedgerContext);
  if (!ctx) {
    throw new Error("useLedger must be used within a LedgerProvider");
  }
  return ctx;
}
