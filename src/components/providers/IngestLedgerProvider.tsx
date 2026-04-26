"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  computeAutoDomain,
  computeVerificationRequired,
  loadIngestLedger,
  saveIngestLedger,
  type ArtifactKind,
  type IngestLogRow,
  type LedgerDomain,
} from "@/lib/ingestLedger";

/** Canonical SSR / first-paint snapshot — must match server HTML for hydration. */
const INITIAL_LOG: IngestLogRow[] = [
  {
    id: "AX-812",
    source: "https://internal.wiki/principles",
    type: "URL",
    ingestedAt: "2026-04-12",
    intent: undefined,
    autoDetectedDomain: "COMPANY",
    domain: "COMPANY",
    sealed: true,
    verificationRequired: false,
  },
  {
    id: "AX-240",
    source: "leadership-charter.docx",
    type: "FILE",
    ingestedAt: "2026-04-14",
    intent: undefined,
    autoDetectedDomain: "COMPANY",
    domain: "COMPANY",
    sealed: false,
    verificationRequired: false,
  },
  {
    id: "AX-905",
    source: "Q3_Review.pdf — personal identity fields referenced",
    type: "FILE",
    ingestedAt: "2026-04-15",
    intent: undefined,
    autoDetectedDomain: "WORK",
    domain: "WORK",
    sealed: false,
    verificationRequired: true,
  },
];

function cloneInitialLog(): IngestLogRow[] {
  return INITIAL_LOG.map((r) => ({ ...r }));
}

function nextArtifactId(): string {
  const n = Math.floor(100 + Math.random() * 900);
  return `AX-${n}`;
}

export type IngestLedgerContextValue = {
  log: IngestLogRow[];
  appendRow: (input: {
    source: string;
    type: ArtifactKind;
    ingestedAt: string;
    intent?: string;
  }) => void;
  setDomain: (id: string, domain: LedgerDomain) => void;
  sealRecord: (id: string) => void;
  sealedFor: (domain: LedgerDomain) => IngestLogRow[];
};

const IngestLedgerContext = createContext<IngestLedgerContextValue | null>(null);

export function IngestLedgerProvider({ children }: { children: ReactNode }) {
  const [log, setLogState] = useState<IngestLogRow[]>(() => cloneInitialLog());
  const [hasRehydrated, setHasRehydrated] = useState(false);

  useEffect(() => {
    const stored = loadIngestLedger();
    if (stored && stored.length > 0) {
      setLogState(stored);
    }
    setHasRehydrated(true);
  }, []);

  useEffect(() => {
    if (!hasRehydrated) return;
    saveIngestLedger(log);
  }, [log, hasRehydrated]);

  const appendRow = useCallback(
    (input: { source: string; type: ArtifactKind; ingestedAt: string; intent?: string }) => {
      const intent = input.intent?.trim() || undefined;
      const auto = computeAutoDomain(input.type, input.source, intent);
      const verificationRequired = computeVerificationRequired(
        input.type,
        input.source,
        intent,
        auto,
      );
      const row: IngestLogRow = {
        id: nextArtifactId(),
        source: input.source,
        type: input.type,
        ingestedAt: input.ingestedAt,
        intent,
        autoDetectedDomain: auto,
        domain: auto,
        sealed: false,
        verificationRequired,
      };
      setHasRehydrated(true);
      setLogState((prev) => [row, ...prev]);
    },
    [],
  );

  const setDomain = useCallback((id: string, domain: LedgerDomain) => {
    setHasRehydrated(true);
    setLogState((prev) =>
      prev.map((r) => {
        if (r.id !== id || r.sealed) return r;
        const verificationRequired = computeVerificationRequired(
          r.type,
          r.source,
          r.intent,
          domain,
        );
        return { ...r, domain, verificationRequired };
      }),
    );
  }, []);

  const sealRecord = useCallback((id: string) => {
    setHasRehydrated(true);
    setLogState((prev) =>
      prev.map((r) => {
        if (r.id !== id || r.sealed) return r;
        return { ...r, sealed: true, verificationRequired: false };
      }),
    );
  }, []);

  const visibleLog = hasRehydrated ? log : INITIAL_LOG;

  const sealedFor = useCallback(
    (domain: LedgerDomain) =>
      visibleLog.filter((r) => r.sealed && r.domain === domain),
    [visibleLog],
  );

  const value = useMemo(
    () => ({
      log: visibleLog,
      appendRow,
      setDomain,
      sealRecord,
      sealedFor,
    }),
    [visibleLog, appendRow, setDomain, sealRecord, sealedFor],
  );

  return <IngestLedgerContext.Provider value={value}>{children}</IngestLedgerContext.Provider>;
}

export function useIngestLedger(): IngestLedgerContextValue {
  const ctx = useContext(IngestLedgerContext);
  if (!ctx) {
    throw new Error("useIngestLedger must be used within IngestLedgerProvider");
  }
  return ctx;
}
