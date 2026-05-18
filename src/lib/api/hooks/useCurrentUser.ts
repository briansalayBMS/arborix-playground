"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiAuthError, getMe } from "@/lib/api/client";
import type { UserResponse } from "@/lib/api/types";

export type UserStatus = "loading" | "ready" | "error";

export interface UserState {
  status: UserStatus;
  user: UserResponse | null;
  error: Error | null;
}

const INITIAL_STATE: UserState = {
  status: "loading",
  user: null,
  error: null,
};

export function useCurrentUser(): UserState {
  const router = useRouter();
  const [state, setState] = useState<UserState>(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = (await getMe()) as UserResponse;
        if (cancelled) return;
        setState({ status: "ready", user: result, error: null });
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiAuthError) {
          router.push("/login");
          setState({ status: "error", user: null, error: err });
          return;
        }
        console.warn("[useCurrentUser] fetch failed", err);
        const error = err instanceof Error ? err : new Error(String(err));
        setState({ status: "error", user: null, error });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return state;
}
