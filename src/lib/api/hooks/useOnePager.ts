"use client";

import { useEffect, useState } from "react";
import { ApiAuthError, getOnePager } from "@/lib/api/client";
import type { OnePagerResponse } from "@/lib/api/types";

export type OnePagerStatus = "loading" | "ready" | "error";

export interface OnePagerState {
  status: OnePagerStatus;
  data: OnePagerResponse | null;
  error: Error | null;
}

const INITIAL_STATE: OnePagerState = {
  status: "loading",
  data: null,
  error: null,
};

export function useOnePager(): OnePagerState {
  const [state, setState] = useState<OnePagerState>(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = (await getOnePager()) as OnePagerResponse;
        if (cancelled) return;
        setState({ status: "ready", data: result, error: null });
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiAuthError) {
          console.warn("[useOnePager] auth error — UserProvider handles redirect");
          setState({ status: "error", data: null, error: err });
          return;
        }
        console.warn("[useOnePager] fetch failed", err);
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
