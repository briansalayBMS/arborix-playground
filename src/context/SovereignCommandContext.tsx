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
import { computeDiscVerdict } from "@/lib/personalityDisc";
import type { PersonalityAnswers } from "@/lib/personalityDisc";
import {
  DEPOSITION_STEPS,
  getAckAndFollowUp,
  makeAnswerSnippet,
} from "@/lib/depositionFlow";
import { getMe } from "@/lib/api/client";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "arborix:sovereign-command";

export type DepositionCompletedTurn = {
  question: string;
  answer: string;
  pendingEvidence: boolean;
  sourceLabel: string | null;
};

export type DepositionSession = {
  currentRound: number;
  currentAck: string;
  currentQuestion: string;
  completedTurns: DepositionCompletedTurn[];
};

export type SovereignCommandState = {
  auditCalibrationPercent: number;
  activeInquirySummary: string;
  mostPressingQuestion: string;
  loggedTestimony: string[];
  personalityPhase1Complete: boolean;
  /** Twelve-question core complete (future flow). */
  personalityPhase2Complete: boolean;
  archetypeVerdict: string | null;
  /** Active multi-round deposition, or null if none. */
  depositionSession: DepositionSession | null;
  /** Short snippet of the last committed answer (summary card). */
  latestDepositionPreview: string;
  /** Onboarding response from API */
  onboardingData: unknown | null;
  /** One-pager data from API */
  onePagerData: unknown | null;
  /** User data from GET /users/me */
  userData: { name?: string; mode?: string; completeness_pct?: number } | null;
};

const DEFAULTS: SovereignCommandState = {
  auditCalibrationPercent: 40,
  activeInquirySummary: "Pending: Peer Review Friction",
  mostPressingQuestion:
    "If you were forced to demote one flagship initiative to 'maintenance' for two quarters, which would you choose, and what irreversible signal would you need from the org to justify it?",
  loggedTestimony: [],
  personalityPhase1Complete: false,
  personalityPhase2Complete: false,
  archetypeVerdict: null,
  depositionSession: null,
  latestDepositionPreview: "",
  onboardingData: null,
  onePagerData: null,
  userData: null,
};

function loadState(): SovereignCommandState {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<SovereignCommandState>;
    const auditRaw =
      typeof parsed.auditCalibrationPercent === "number"
        ? Math.min(100, Math.max(0, parsed.auditCalibrationPercent))
        : DEFAULTS.auditCalibrationPercent;
    const migratedPhase1 =
      typeof parsed.personalityPhase1Complete === "boolean"
        ? parsed.personalityPhase1Complete
        : auditRaw >= 55;
    const phase2 =
      typeof parsed.personalityPhase2Complete === "boolean"
        ? parsed.personalityPhase2Complete
        : false;
    const rawDep = (parsed as { depositionSession?: unknown }).depositionSession;
    const depositionSession =
      rawDep &&
      typeof rawDep === "object" &&
      rawDep !== null &&
      "currentQuestion" in rawDep &&
      "completedTurns" in rawDep
        ? (rawDep as DepositionSession)
        : DEFAULTS.depositionSession;

    return {
      ...DEFAULTS,
      ...parsed,
      auditCalibrationPercent: auditRaw,
      personalityPhase1Complete: migratedPhase1,
      personalityPhase2Complete: phase2,
      archetypeVerdict:
        typeof parsed.archetypeVerdict === "string" ? parsed.archetypeVerdict : null,
      loggedTestimony: Array.isArray(parsed.loggedTestimony)
        ? parsed.loggedTestimony.filter((t): t is string => typeof t === "string")
        : DEFAULTS.loggedTestimony,
      depositionSession,
      latestDepositionPreview:
        typeof (parsed as { latestDepositionPreview?: unknown }).latestDepositionPreview ===
        "string"
          ? String((parsed as { latestDepositionPreview: string }).latestDepositionPreview)
          : DEFAULTS.latestDepositionPreview,
      onboardingData: (parsed as { onboardingData?: unknown }).onboardingData ?? DEFAULTS.onboardingData,
      onePagerData: (parsed as { onePagerData?: unknown }).onePagerData ?? DEFAULTS.onePagerData,
      userData: (parsed as { userData?: unknown }).userData ?? DEFAULTS.userData,
    };
  } catch {
    return DEFAULTS;
  }
}

function persistState(state: SovereignCommandState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
}

type SovereignCommandContextValue = SovereignCommandState & {
  personalityHookOpen: boolean;
  openPersonalityHook: () => void;
  closePersonalityHook: () => void;
  completePersonalityPhase1: (answers: PersonalityAnswers) => void;
  completePersonalityPhase2: () => void;
  setAuditCalibrationPercent: (n: number) => void;
  setActiveInquirySummary: (s: string) => void;
  setMostPressingQuestion: (s: string) => void;
  logTestimony: (entry: string) => void;
  /** Deposition bottom sheet (not open state persisted; session is). */
  depositionOpen: boolean;
  openDeposition: (initialQuestion?: string) => void;
  closeDeposition: () => void;
  continueDeposition: (payload: {
    answer: string;
    pendingEvidence: boolean;
    sourceLabel: string | null;
  }) => void;
  setOnboardingData: (data: unknown) => void;
  setOnePagerData: (data: unknown) => void;
  setUserData: (data: { name?: string; mode?: string; completeness_pct?: number } | null) => void;
};

type DepositionContinueResult = {
  state: SovereignCommandState;
  logLine: string;
  logComplete: string | null;
  closeOverlay: boolean;
};

function reduceDepositionContinue(
  s: SovereignCommandState,
  payload: { answer: string; pendingEvidence: boolean; sourceLabel: string | null },
): DepositionContinueResult | null {
  const answer = payload.answer.trim();
  if (!answer || !s.depositionSession) return null;
  const dep = s.depositionSession;
  const turn: DepositionCompletedTurn = {
    question: dep.currentQuestion,
    answer,
    pendingEvidence: payload.pendingEvidence,
    sourceLabel: payload.sourceLabel,
  };
  const newTurns = [...dep.completedTurns, turn];
  const n = newTurns.length;

  const logLine = [
    `Deposition round ${dep.currentRound} of ${DEPOSITION_STEPS}`,
    `Q: ${turn.question}`,
    `A: ${turn.answer}`,
    turn.pendingEvidence ? "Ledger note: Pending evidence" : null,
    turn.sourceLabel ? `Source: ${turn.sourceLabel}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  if (n >= DEPOSITION_STEPS) {
    return {
      state: {
        ...s,
        depositionSession: null,
        latestDepositionPreview: makeAnswerSnippet(turn.answer, 140),
      },
      logLine,
      logComplete: "Deposition session complete. Four rounds on record.",
      closeOverlay: true,
    };
  }

  const next = getAckAndFollowUp(n, turn.answer);
  if (!next) return null;
  return {
    state: {
      ...s,
      latestDepositionPreview: makeAnswerSnippet(turn.answer, 140),
      depositionSession: {
        currentRound: dep.currentRound + 1,
        currentAck: next.ack,
        currentQuestion: next.question,
        completedTurns: newTurns,
      },
    },
    logLine,
    logComplete: null,
    closeOverlay: false,
  };
}

const SovereignCommandContext = createContext<SovereignCommandContextValue | null>(
  null,
);

export function SovereignCommandProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<SovereignCommandState>(DEFAULTS);
  const [personalityHookOpen, setPersonalityHookOpen] = useState(false);
  const [depositionOpen, setDepositionOpen] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const result = await getMe();
        if (result && typeof result === "object") {
          const data = result as Record<string, unknown>;
          setState((s) => ({
            ...s,
            userData: {
              name: typeof data.name === "string" ? data.name : undefined,
              mode: typeof data.mode === "string" ? data.mode : undefined,
              completeness_pct: typeof data.completeness_pct === "number" ? data.completeness_pct : undefined,
            },
          }));
        }
      } catch (err) {
        console.warn("Failed to fetch user data:", err);
      }
    };
    fetchUserData();
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    persistState(state);
  }, [hydrated, state]);

  const setAuditCalibrationPercent = useCallback((n: number) => {
    const v = Math.min(100, Math.max(0, Math.round(n)));
    setState((s) => ({ ...s, auditCalibrationPercent: v }));
  }, []);

  const setActiveInquirySummary = useCallback((activeInquirySummary: string) => {
    setState((s) => ({ ...s, activeInquirySummary }));
  }, []);

  const setMostPressingQuestion = useCallback((mostPressingQuestion: string) => {
    setState((s) => ({ ...s, mostPressingQuestion }));
  }, []);

  const logTestimony = useCallback((entry: string) => {
    const trimmed = entry.trim();
    if (!trimmed) return;
    setState((s) => ({
      ...s,
      loggedTestimony: [...s.loggedTestimony, trimmed],
    }));
  }, []);

  const openDeposition = useCallback((initialQuestion?: string) => {
    setPersonalityHookOpen(false);
    setState((s) => {
      if (s.depositionSession) {
        queueMicrotask(() => setDepositionOpen(true));
        return s;
      }
      const q = initialQuestion?.trim();
      if (!q) return s;
      queueMicrotask(() => setDepositionOpen(true));
      return {
        ...s,
        depositionSession: {
          currentRound: 1,
          currentAck: "",
          currentQuestion: q,
          completedTurns: [],
        },
      };
    });
  }, []);

  const closeDeposition = useCallback(() => {
    setDepositionOpen(false);
  }, []);

  const continueDeposition = useCallback(
    (payload: {
      answer: string;
      pendingEvidence: boolean;
      sourceLabel: string | null;
    }) => {
      setState((s) => {
        const r = reduceDepositionContinue(s, payload);
        if (!r) return s;
        queueMicrotask(() => {
          logTestimony(r.logLine);
          if (r.logComplete) logTestimony(r.logComplete);
          if (r.closeOverlay) setDepositionOpen(false);
        });
        return r.state;
      });
    },
    [logTestimony],
  );

  const openPersonalityHook = useCallback(() => {
    setDepositionOpen(false);
    setPersonalityHookOpen(true);
  }, []);
  const closePersonalityHook = useCallback(() => setPersonalityHookOpen(false), []);

  const completePersonalityPhase1 = useCallback((answers: PersonalityAnswers) => {
    const { verdictLine } = computeDiscVerdict(answers);
    setState((s) => ({
      ...s,
      auditCalibrationPercent: 55,
      personalityPhase1Complete: true,
      archetypeVerdict: verdictLine,
    }));
  }, []);

  const completePersonalityPhase2 = useCallback(() => {
    setState((s) => ({ ...s, personalityPhase2Complete: true }));
  }, []);

  const setOnboardingData = useCallback((data: unknown) => {
    setState((s) => ({ ...s, onboardingData: data }));
  }, []);

  const setOnePagerData = useCallback((data: unknown) => {
    setState((s) => ({ ...s, onePagerData: data }));
  }, []);

  const setUserData = useCallback((data: { name?: string; mode?: string; completeness_pct?: number } | null) => {
    setState((s) => ({ ...s, userData: data }));
  }, []);

  const value = useMemo<SovereignCommandContextValue>(
    () => ({
      ...state,
      personalityHookOpen,
      openPersonalityHook,
      closePersonalityHook,
      completePersonalityPhase1,
      completePersonalityPhase2,
      setAuditCalibrationPercent,
      setActiveInquirySummary,
      setMostPressingQuestion,
      logTestimony,
      depositionOpen,
      openDeposition,
      closeDeposition,
      continueDeposition,
      setOnboardingData,
      setOnePagerData,
      setUserData,
    }),
    [
      state,
      personalityHookOpen,
      openPersonalityHook,
      closePersonalityHook,
      completePersonalityPhase1,
      completePersonalityPhase2,
      setAuditCalibrationPercent,
      setActiveInquirySummary,
      setMostPressingQuestion,
      logTestimony,
      depositionOpen,
      openDeposition,
      closeDeposition,
      continueDeposition,
      setOnboardingData,
      setOnePagerData,
      setUserData,
    ],
  );

  return (
    <SovereignCommandContext.Provider value={value}>
      {children}
    </SovereignCommandContext.Provider>
  );
}

export function useSovereignCommand() {
  const ctx = useContext(SovereignCommandContext);
  if (!ctx) {
    throw new Error("useSovereignCommand must be used within SovereignCommandProvider");
  }
  return ctx;
}
