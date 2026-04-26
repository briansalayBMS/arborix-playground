"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ArtifactSource } from "@/lib/sovereignLedgerDomain";

export type AssetInspectorPayload = {
  recordId: string;
  assetTitle: string;
  sourcePath: string;
  fileType: string;
  timestamp: string;
  /** Full auditor analysis including chain-of-custody exhibit IDs. */
  forensicVerdict: string;
  /** Discrete exhibits for SOURCES OF TRUTH and focus interaction. */
  sources: ArtifactSource[];
  /** For row highlight sync across ledgers */
  selectionKey: string;
};

type RightRailDrawerContextValue = {
  isOpen: boolean;
  payload: AssetInspectorPayload | null;
  selectedKey: string | null;
  open: (p: AssetInspectorPayload) => void;
  close: () => void;
};

const RightRailDrawerContext = createContext<RightRailDrawerContextValue | null>(null);

export function RightRailDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState<AssetInspectorPayload | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const open = useCallback((p: AssetInspectorPayload) => {
    setPayload(p);
    setSelectedKey(p.selectionKey);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setPayload(null);
    setSelectedKey(null);
  }, []);

  const value = useMemo(
    () => ({ isOpen, payload, selectedKey, open, close }),
    [isOpen, payload, selectedKey, open, close],
  );

  return (
    <RightRailDrawerContext.Provider value={value}>{children}</RightRailDrawerContext.Provider>
  );
}

export function useRightRailDrawer(): RightRailDrawerContextValue {
  const ctx = useContext(RightRailDrawerContext);
  if (!ctx) {
    throw new Error("useRightRailDrawer must be used within RightRailDrawerProvider");
  }
  return ctx;
}
