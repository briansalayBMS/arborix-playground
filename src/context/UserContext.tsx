"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useCurrentUser, type UserState } from "@/lib/api/hooks/useCurrentUser";

const UserContext = createContext<UserState | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const state = useCurrentUser();
  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
}

export function useUser(): UserState {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
}
