"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { computeDiscVerdict } from "@/lib/personalityDisc";
import type { PaceAnswer, PriorityAnswer } from "@/lib/personalityDisc";
import { useSovereignCommand } from "@/context/SovereignCommandContext";

type Phase = "q1" | "q2" | "payoff";

const BTN =
  "min-h-[52px] w-full max-w-xl border-[0.5px] border-slate-300 bg-[#E0F5FF] px-6 py-4 text-left font-ui text-[15px] font-semibold leading-snug text-[#131517] outline-none transition-colors hover:bg-[#C0E8FF] focus-visible:ring-2 focus-visible:ring-[#06B6D4] sm:max-w-none";

export function PersonalityHookOverlay() {
  const {
    personalityHookOpen,
    closePersonalityHook,
    completePersonalityPhase1,
  } = useSovereignCommand();

  const [portalReady, setPortalReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("q1");
  const [pace, setPace] = useState<PaceAnswer | null>(null);
  const [priority, setPriority] = useState<PriorityAnswer | null>(null);
  const titleId = useId();

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!personalityHookOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [personalityHookOpen]);

  const onMinimizeDeposition = useCallback(() => {
    closePersonalityHook();
  }, [closePersonalityHook]);

  useEffect(() => {
    if (!personalityHookOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMinimizeDeposition();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [personalityHookOpen, onMinimizeDeposition]);

  const onSelectPace = useCallback((p: PaceAnswer) => {
    setPace(p);
    setPhase("q2");
  }, []);

  const onSelectPriority = useCallback(
    (pr: PriorityAnswer) => {
      if (!pace) return;
      setPriority(pr);
      completePersonalityPhase1({ pace, priority: pr });
      setPhase("payoff");
    },
    [pace, completePersonalityPhase1],
  );

  const verdict =
    pace && priority ? computeDiscVerdict({ pace, priority }) : null;

  useEffect(() => {
    if (!personalityHookOpen || phase !== "payoff" || !verdict) return;
    const id = window.setTimeout(() => {
      closePersonalityHook();
      setPhase("q1");
      setPace(null);
      setPriority(null);
    }, 2000);
    return () => window.clearTimeout(id);
  }, [personalityHookOpen, phase, verdict, closePersonalityHook]);

  if (!portalReady) return null;

  return createPortal(
    <AnimatePresence>
      {personalityHookOpen ? (
        <motion.div
          key="personality-hook-root"
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMinimizeDeposition}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute bottom-0 left-0 right-0 flex max-h-[min(92vh,880px)] flex-col overflow-hidden border-t-[0.5px] border-slate-300 bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.12)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 justify-end px-4 py-3 sm:px-8">
              <button
                type="button"
                onClick={onMinimizeDeposition}
                className="font-code text-[12px] font-medium uppercase tracking-[0.12em] text-[#131517] outline-none hover:text-[#5C6166] focus-visible:ring-1 focus-visible:ring-[#06B6D4]"
              >
                [ MINIMIZE DEPOSITION ]
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-10 sm:px-8">
              {phase === "q1" ? (
                <div className="w-full max-w-3xl text-left">
                  <p className="font-code m-0 text-[12px] font-medium uppercase tracking-[0.12em] text-[#5C6166]">
                    Phase 1 · Pace
                  </p>
                  <h2
                    id={titleId}
                    className="font-ui m-0 mt-4 text-[24px] font-semibold leading-snug text-[#131517]"
                  >
                    When a new challenge arises, do you prefer to act immediately to get results, or take
                    time to analyze the best approach?
                  </h2>
                  <div className="mt-8 flex max-w-xl flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectPace("immediate")}
                      className={BTN}
                    >
                      Act immediately for results
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectPace("analyze")}
                      className={BTN}
                    >
                      Take time to analyze the best approach
                    </button>
                  </div>
                </div>
              ) : null}

              {phase === "q2" ? (
                <div className="w-full max-w-3xl text-left">
                  <p className="font-code m-0 text-[12px] font-medium uppercase tracking-[0.12em] text-[#5C6166]">
                    Phase 1 · Priority
                  </p>
                  <h2 className="font-ui m-0 mt-4 text-[24px] font-semibold leading-snug text-[#131517]">
                    In a high-pressure meeting, is your primary focus on the logic of the solution or the
                    morale of the team?
                  </h2>
                  <div className="mt-8 flex max-w-xl flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectPriority("logic")}
                      className={BTN}
                    >
                      Logic of the solution
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectPriority("morale")}
                      className={BTN}
                    >
                      Morale of the team
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPhase("q1");
                      setPace(null);
                    }}
                    className="mt-8 font-code text-[12px] font-medium uppercase tracking-[0.12em] text-[#5C6166] underline-offset-2 hover:text-[#131517] hover:underline"
                  >
                    Back
                  </button>
                </div>
              ) : null}

              {phase === "payoff" && verdict ? (
                <div className="w-full max-w-3xl text-left">
                  <p className="font-code m-0 text-[12px] font-medium uppercase tracking-[0.12em] text-[#5C6166]">
                    Archetype verdict
                  </p>
                  <p className="font-ui m-0 mt-4 text-[20px] font-semibold leading-relaxed text-[#131517]">
                    {verdict.verdictLine}
                  </p>
                  <p className="font-code m-0 mt-6 text-[12px] font-medium uppercase tracking-[0.12em] text-[#5C6166]">
                    Closing in 2 seconds
                  </p>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
