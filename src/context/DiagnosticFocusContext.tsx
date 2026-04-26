"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type DiagnosticFocusContextValue = {
  /** Primary calibration lead (e.g. largest radar gap), persisted across navigation. */
  leadAxis: string | null;
  setLeadAxis: (axis: string | null) => void;
  /** Transient hover on radar diagnostic targets or axis labels. */
  hoverAxis: string | null;
  setHoverAxis: (axis: string | null) => void;
  /** Debounced clear for hover when pointer exits radar or hit targets. */
  clearHoverDebounced: () => void;
  /** Resolved lead for cross-panel sync: hover wins, else persisted lead. */
  effectiveDiagnosticAxis: string | null;
  /** Increments when ledger seals a record so IdentityRadar can pulse cyan traces. */
  radarLedgerPulseTick: number;
  triggerRadarLedgerPulse: () => void;
  /**
   * 0..1 share of YOU ledger lines active ON. Retracts adaptive radar trace when &lt; 1.
   * Non-YOU pages should leave this at 1.
   */
  youLedgerActiveRatio: number;
  setYouLedgerActiveRatio: (ratio: number) => void;
};

const DiagnosticFocusContext = createContext<DiagnosticFocusContextValue | null>(null);

export function DiagnosticFocusProvider({ children }: { children: ReactNode }) {
  const [leadAxis, setLeadAxis] = useState<string | null>(null);
  const [hoverAxis, setHoverAxisState] = useState<string | null>(null);
  const [radarLedgerPulseTick, setRadarLedgerPulseTick] = useState(0);
  const [youLedgerActiveRatio, setYouLedgerActiveRatio] = useState(1);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerRadarLedgerPulse = useCallback(() => {
    setRadarLedgerPulseTick((n) => n + 1);
  }, []);

  const setHoverAxis = useCallback((axis: string | null) => {
    if (clearTimer.current) {
      clearTimeout(clearTimer.current);
      clearTimer.current = null;
    }
    setHoverAxisState(axis);
  }, []);

  const clearHoverDebounced = useCallback(() => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => {
      setHoverAxisState(null);
      clearTimer.current = null;
    }, 90);
  }, []);

  const effectiveDiagnosticAxis = hoverAxis ?? leadAxis;

  const value = useMemo(
    () => ({
      leadAxis,
      setLeadAxis,
      hoverAxis,
      setHoverAxis,
      clearHoverDebounced,
      effectiveDiagnosticAxis,
      radarLedgerPulseTick,
      triggerRadarLedgerPulse,
      youLedgerActiveRatio,
      setYouLedgerActiveRatio,
    }),
    [
      leadAxis,
      hoverAxis,
      setHoverAxis,
      clearHoverDebounced,
      effectiveDiagnosticAxis,
      radarLedgerPulseTick,
      triggerRadarLedgerPulse,
      youLedgerActiveRatio,
    ],
  );

  return (
    <DiagnosticFocusContext.Provider value={value}>{children}</DiagnosticFocusContext.Provider>
  );
}

export function useDiagnosticFocus(): DiagnosticFocusContextValue {
  const ctx = useContext(DiagnosticFocusContext);
  if (!ctx) {
    return {
      leadAxis: null,
      setLeadAxis: () => {},
      hoverAxis: null,
      setHoverAxis: () => {},
      clearHoverDebounced: () => {},
      effectiveDiagnosticAxis: null,
      radarLedgerPulseTick: 0,
      triggerRadarLedgerPulse: () => {},
      youLedgerActiveRatio: 1,
      setYouLedgerActiveRatio: () => {},
    };
  }
  return ctx;
}
