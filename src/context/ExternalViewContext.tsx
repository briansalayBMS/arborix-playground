"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ExternalViewContextValue = {
  isExternalView: boolean;
  setIsExternalView: (v: boolean) => void;
};

const ExternalViewContext = createContext<ExternalViewContextValue | null>(null);

export function ExternalViewProvider({ children }: { children: ReactNode }) {
  const [isExternalView, setIsExternalViewState] = useState(false);
  const setIsExternalView = useCallback((v: boolean) => setIsExternalViewState(v), []);
  const value = useMemo(
    () => ({ isExternalView, setIsExternalView }),
    [isExternalView, setIsExternalView],
  );
  return (
    <ExternalViewContext.Provider value={value}>{children}</ExternalViewContext.Provider>
  );
}

export function useExternalView(): ExternalViewContextValue {
  const ctx = useContext(ExternalViewContext);
  if (!ctx) throw new Error("useExternalView must be used within ExternalViewProvider");
  return ctx;
}
