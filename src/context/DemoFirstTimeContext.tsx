"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSovereignCommand } from "@/context/SovereignCommandContext";

type DemoFirstTimeContextValue = {
  /** Ephemeral Day-0 simulation (not persisted). */
  simulationActive: boolean;
  /** Audit percent shown in UI: 40+ during simulation, else persisted command value. */
  effectiveAuditCalibrationPercent: number;
  /** Changes when demo seals update (for memo deps). */
  demoSealedSignature: string;
  toggleSimulation: () => void;
  /** True when this row is sealed in the demo overlay (YOU ledger only). */
  isDemoSealed: (recordId: string) => boolean;
  /** Seal a row in simulation only; bumps demo audit and does not write localStorage. */
  sealDemoRecord: (recordId: string) => void;
};

const DemoFirstTimeContext = createContext<DemoFirstTimeContextValue | null>(null);

const DEMO_START = 40;
const DEMO_CAP = 55;
const AUDIT_PER_SEAL = 5;
const AUDIT_PER_DEPOSITION_TURN = 3;

export function DemoFirstTimeProvider({ children }: { children: ReactNode }) {
  const { auditCalibrationPercent, depositionSession } = useSovereignCommand();
  const [simulationActive, setSimulationActive] = useState(false);
  const [demoAuditPercent, setDemoAuditPercent] = useState(DEMO_START);
  const [demoSealedIds, setDemoSealedIds] = useState<Set<string>>(() => new Set());
  const depoSnapshotRef = useRef(0);

  const effectiveAuditCalibrationPercent = simulationActive
    ? demoAuditPercent
    : auditCalibrationPercent;

  const toggleSimulation = useCallback(() => {
    setSimulationActive((prev) => {
      if (prev) {
        return false;
      }
      setDemoAuditPercent(DEMO_START);
      setDemoSealedIds(new Set());
      depoSnapshotRef.current = depositionSession?.completedTurns.length ?? 0;
      return true;
    });
  }, [depositionSession?.completedTurns.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        toggleSimulation();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSimulation]);

  useEffect(() => {
    if (!simulationActive) return;
    const n = depositionSession?.completedTurns.length ?? 0;
    if (n > depoSnapshotRef.current) {
      setDemoAuditPercent((a) => Math.min(DEMO_CAP, a + AUDIT_PER_DEPOSITION_TURN));
      depoSnapshotRef.current = n;
    }
  }, [simulationActive, depositionSession?.completedTurns.length]);

  const isDemoSealed = useCallback(
    (recordId: string) => demoSealedIds.has(recordId),
    [demoSealedIds],
  );

  const sealDemoRecord = useCallback((recordId: string) => {
    setDemoSealedIds((prev) => {
      if (prev.has(recordId)) return prev;
      const next = new Set(prev);
      next.add(recordId);
      return next;
    });
    setDemoAuditPercent((a) => Math.min(DEMO_CAP, a + AUDIT_PER_SEAL));
  }, []);

  const demoSealedSignature = useMemo(
    () => [...demoSealedIds].sort().join("|"),
    [demoSealedIds],
  );

  const value = useMemo(
    () => ({
      simulationActive,
      effectiveAuditCalibrationPercent,
      demoSealedSignature,
      toggleSimulation,
      isDemoSealed,
      sealDemoRecord,
    }),
    [
      simulationActive,
      effectiveAuditCalibrationPercent,
      demoSealedSignature,
      toggleSimulation,
      isDemoSealed,
      sealDemoRecord,
    ],
  );

  return (
    <DemoFirstTimeContext.Provider value={value}>{children}</DemoFirstTimeContext.Provider>
  );
}

export function useDemoFirstTime(): DemoFirstTimeContextValue {
  const ctx = useContext(DemoFirstTimeContext);
  if (!ctx) {
    throw new Error("useDemoFirstTime must be used within DemoFirstTimeProvider");
  }
  return ctx;
}
