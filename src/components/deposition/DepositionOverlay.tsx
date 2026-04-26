"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { DEPOSITION_STEPS } from "@/lib/depositionFlow";
import { useSovereignCommand } from "@/context/SovereignCommandContext";

export function DepositionOverlay() {
  const {
    depositionOpen,
    depositionSession,
    closeDeposition,
    continueDeposition,
  } = useSovereignCommand();

  const [portalReady, setPortalReady] = useState(false);
  const [response, setResponse] = useState("");
  const [sourceName, setSourceName] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const inputId = useId();

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const round = depositionSession?.currentRound;
  const activeQ = depositionSession?.currentQuestion;

  useEffect(() => {
    if (!depositionOpen || !depositionSession) return;
    setResponse("");
    setSourceName(null);
    if (fileRef.current) fileRef.current.value = "";
    const id = window.requestAnimationFrame(() => {
      taRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [depositionOpen, round, activeQ, depositionSession]);

  useEffect(() => {
    if (depositionOpen && !depositionSession) {
      closeDeposition();
    }
  }, [depositionOpen, depositionSession, closeDeposition]);

  useEffect(() => {
    if (!depositionOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [depositionOpen]);

  useEffect(() => {
    if (!depositionOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDeposition();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [depositionOpen, closeDeposition]);

  const onPickFile = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setSourceName(f ? f.name : null);
  }, []);

  const onFinishForNow = useCallback(() => {
    closeDeposition();
  }, [closeDeposition]);

  const onContinue = useCallback(() => {
    if (!depositionSession) return;
    const a = response.trim();
    if (!a) return;
    const hasFile = Boolean(sourceName);
    const pendingEvidence = !hasFile;
    continueDeposition({
      answer: a,
      pendingEvidence,
      sourceLabel: hasFile && sourceName ? sourceName : null,
    });
  }, [response, sourceName, depositionSession, continueDeposition]);

  if (!portalReady || !depositionSession) return null;

  const { currentRound, currentAck, currentQuestion, completedTurns } = depositionSession;
  const hasLocked = completedTurns.length > 0;
  const stepLabel = `Step ${currentRound} of ${DEPOSITION_STEPS}`;

  return createPortal(
    <AnimatePresence>
      {depositionOpen && depositionSession ? (
        <motion.div
          key="deposition-root"
          className="fixed inset-0 z-[110]"
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
            onClick={closeDeposition}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute bottom-0 left-0 right-0 flex max-h-[min(90vh,860px)] flex-col overflow-hidden border-t-[0.5px] border-slate-300 bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.12)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-end border-b-[0.5px] border-[var(--color-arborix-line)]/60 px-4 py-3 sm:px-8 sm:pl-[var(--main-with-nav-ml)]">
              <button
                type="button"
                onClick={onFinishForNow}
                className="font-code text-[12px] font-medium uppercase tracking-[0.12em] text-[#131517] outline-none hover:text-[#5C6166] focus-visible:ring-1 focus-visible:ring-[#06B6D4]"
              >
                [ DISMISS ]
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-8 pt-4 text-left sm:px-8 sm:pl-[var(--main-with-nav-ml)]">
              <h2
                id={titleId}
                className="m-0 text-left font-ui text-[16px] font-semibold leading-snug text-[#131517]"
              >
                Transcript
              </h2>
              <p className="m-0 mt-1 text-left font-code text-[12px] uppercase tracking-[0.1em] text-slate-500">
                {stepLabel}
              </p>

              {hasLocked ? (
                <div className="mt-4 space-y-3 border-b-[0.5px] border-slate-200 pb-4">
                  {completedTurns.map((t, i) => (
                    <div
                      key={`${t.question.slice(0, 24)}-${i}`}
                      className="rounded-none border-[0.5px] border-slate-200 bg-slate-100/90 px-3 py-2.5 text-slate-500"
                    >
                      <p className="m-0 text-left font-code text-[12px] font-medium uppercase tracking-[0.1em]">
                        Locked
                      </p>
                      <p className="m-0 mt-1 text-left font-code text-[14px] leading-relaxed text-slate-500">
                        {t.question}
                      </p>
                      <p className="m-0 mt-2 text-left font-code text-[14px] leading-relaxed text-slate-500">
                        {t.answer}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              {hasLocked && currentAck ? (
                <div className="mt-4 text-left">
                  <h3 className="m-0 text-left font-ui text-[16px] font-semibold text-[#131517]">
                    Acknowledgement
                  </h3>
                  <p className="m-0 mt-1 text-left font-code text-[14px] leading-relaxed text-slate-800">
                    {currentAck}
                  </p>
                </div>
              ) : null}

              <div className="mt-5 text-left">
                <h3 className="m-0 text-left font-ui text-[16px] font-semibold text-[#131517]">
                  {hasLocked ? "Follow-up" : "Current inquiry"}
                </h3>
                <p className="m-0 mt-1 text-left font-code text-[14px] leading-relaxed text-slate-800">
                  {currentQuestion}
                </p>
              </div>

              <div className="mt-4 border-t-[0.5px] border-slate-200 pt-3">
                <p className="m-0 text-left font-ui text-[16px] font-semibold text-[#131517]">
                  Your turn
                </p>
                <div className="mt-2 flex flex-col items-stretch gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    className="sr-only"
                    aria-hidden
                    tabIndex={-1}
                    onChange={onFile}
                  />
                  <button
                    type="button"
                    onClick={onPickFile}
                    className="w-full max-w-md border-[0.5px] border-dashed border-slate-300 bg-white/60 px-3 py-2 text-left font-code text-[12px] font-medium uppercase tracking-[0.1em] text-slate-600 outline-none transition-colors hover:bg-white/90 focus-visible:ring-1 focus-visible:ring-[#06B6D4]"
                  >
                    [ MOUNT SOURCE (OPTIONAL) ]
                    {sourceName ? (
                      <span className="ml-2 font-normal text-slate-500">{sourceName}</span>
                    ) : null}
                  </button>
                </div>
                <label
                  htmlFor={inputId}
                  className="m-0 mt-3 block text-left font-ui text-[16px] font-semibold text-[#131517]"
                >
                  Your response
                </label>
                <textarea
                  ref={taRef}
                  id={inputId}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={5}
                  className="mt-1 w-full min-h-[120px] resize-y rounded-none border-[0.5px] border-slate-300 bg-white px-3 py-2.5 text-left font-code text-[14px] leading-relaxed text-[#131517] outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]/35"
                  placeholder="Type your next response. The Auditor reads this in line with your prior turns."
                  spellCheck
                />
              </div>

              <div className="mt-5 flex w-full max-w-2xl flex-col items-stretch gap-2">
                <button
                  type="button"
                  onClick={onContinue}
                  disabled={!response.trim()}
                  className="min-h-[48px] w-full border-[0.5px] border-slate-300 bg-[#E0F5FF] px-4 py-3 text-left font-code text-[12px] font-semibold uppercase tracking-[0.12em] text-[#131517] outline-none transition-colors hover:bg-[#C0E8FF] focus-visible:ring-1 focus-visible:ring-[#06B6D4] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  [ CONTINUE DEPOSITION ]
                </button>
                <button
                  type="button"
                  onClick={onFinishForNow}
                  className="min-h-[44px] w-full border-[0.5px] border-transparent bg-transparent px-4 py-2 text-left font-code text-[12px] font-medium uppercase tracking-[0.12em] text-slate-600 outline-none hover:text-[#131517] focus-visible:ring-1 focus-visible:ring-[#06B6D4]"
                >
                  [ FINISH FOR NOW ]
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
