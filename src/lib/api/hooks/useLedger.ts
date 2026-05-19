"use client";

import { useEffect, useState } from "react";
import { ApiAuthError, getLedger } from "@/lib/api/client";
import { normalizeLedgerResponse } from "@/lib/api/transformers/ledger";
import type { LedgerResponse } from "@/lib/api/types";

export type LedgerStatus = "loading" | "ready" | "error";

export interface LedgerState {
  status: LedgerStatus;
  data: LedgerResponse | null;
  error: Error | null;
}

const INITIAL_STATE: LedgerState = {
  status: "loading",
  data: null,
  error: null,
};

export function useLedgerFetch(): LedgerState {
  const [state, setState] = useState<LedgerState>(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const raw = await getLedger();
        if (cancelled) return;
        const data = normalizeLedgerResponse(raw);
        setState({ status: "ready", data, error: null });
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiAuthError) {
          console.warn("[useLedger] auth error — UserProvider handles redirect");
          setState({ status: "error", data: null, error: err });
          return;
        }
        console.warn("[useLedger] fetch failed", err);
        const error = err instanceof Error ? err : new Error(String(err));
        setState({ status: "error", data: null, error });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
