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
            className="absolute bottom-0 left-0 right-0 flex max-h-[min(90vh,860px)] flex-col overflow-hidden border-t-[0.5px] border-[var(--color-border)] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.12)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-end border-b-[0.5px] border-[var(--color-border)]/60 px-4 py-3 sm:px-8 sm:pl-[var(--main-with-nav-ml)]">
              <button
                type="button"
                onClick={onFinishForNow}
                className="font-code text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--color-primary)] outline-none hover:text-[var(--color-secondary)] focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]"
              >
                [ DISMISS ]
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-8 pt-4 text-left sm:px-8 sm:pl-[var(--main-with-nav-ml)]">
              <h2
                id={titleId}
                className="m-0 text-left font-ui text-[16px] font-semibold leading-snug text-[var(--color-primary)]"
              >
                Transcript
              </h2>
              <p className="m-0 mt-1 text-left font-code text-[12px] uppercase tracking-[0.1em] text-[var(--color-secondary)]">
                {stepLabel}
              </p>

              {hasLocked ? (
                <div className="mt-4 space-y-3 border-b-[0.5px] border-[var(--color-border)] pb-4">
                  {completedTurns.map((t, i) => (
                    <div
                      key={`${t.question.slice(0, 24)}-${i}`}
                      className="rounded-none border-[0.5px] border-[var(--color-border)] bg-[var(--color-bg)]/90 px-3 py-2.5 text-[var(--color-secondary)]"
                    >
                      <p className="m-0 text-left font-code text-[12px] font-medium uppercase tracking-[0.1em]">
                        Locked
                      </p>
                      <p className="m-0 mt-1 text-left font-code text-[14px] leading-relaxed text-[var(--color-secondary)]">
                        {t.question}
                      </p>
                      <p className="m-0 mt-2 text-left font-code text-[14px] leading-relaxed text-[var(--color-secondary)]">
                        {t.answer}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              {hasLocked && currentAck ? (
                <div className="mt-4 text-left">
                  <h3 className="m-0 text-left font-ui text-[16px] font-semibold text-[var(--color-primary)]">
                    Acknowledgement
                  </h3>
                  <p className="m-0 mt-1 text-left font-code text-[14px] leading-relaxed text-[var(--color-primary)]">
                    {currentAck}
                  </p>
                </div>
              ) : null}

              <div className="mt-5 text-left">
                <h3 className="m-0 text-left font-ui text-[16px] font-semibold text-[var(--color-primary)]">
                  {hasLocked ? "Follow-up" : "Current inquiry"}
                </h3>
                <p className="m-0 mt-1 text-left font-code text-[14px] leading-relaxed text-[var(--color-primary)]">
                  {currentQuestion}
                </p>
              </div>

              <div className="mt-4 border-t-[0.5px] border-[var(--color-border)] pt-3">
                <p className="m-0 text-left font-ui text-[16px] font-semibold text-[var(--color-primary)]">
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
                    className="w-full max-w-md border-[0.5px] border-dashed border-[var(--color-border)] bg-white/60 px-3 py-2 text-left font-code text-[12px] font-medium uppercase tracking-[0.1em] text-[var(--color-primary)] outline-none transition-colors hover:bg-white/90 focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]"
                  >
                    [ MOUNT SOURCE (OPTIONAL) ]
                    {sourceName ? (
                      <span className="ml-2 font-normal text-[var(--color-secondary)]">{sourceName}</span>
                    ) : null}
                  </button>
                </div>
                <label
                  htmlFor={inputId}
                  className="m-0 mt-3 block text-left font-ui text-[16px] font-semibold text-[var(--color-primary)]"
                >
                  Your response
                </label>
                <textarea
                  ref={taRef}
                  id={inputId}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={5}
                  className="mt-1 w-full min-h-[120px] resize-y rounded-none border-[0.5px] border-[var(--color-border)] bg-white px-3 py-2.5 text-left font-code text-[14px] leading-relaxed text-[var(--color-primary)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--color-secondary)] focus:border-[var(--color-blue)] focus:ring-1 focus:ring-[var(--color-blue)]/35"
                  placeholder="Type your next response. The Auditor reads this in line with your prior turns."
                  spellCheck
                />
              </div>

              <div className="mt-5 flex w-full max-w-2xl flex-col items-stretch gap-2">
                <button
                  type="button"
                  onClick={onContinue}
                  disabled={!response.trim()}
                  className="min-h-[48px] w-full border-[0.5px] border-[var(--color-border)] bg-[rgba(0,113,227,0.06)] px-4 py-3 text-left font-code text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)] outline-none transition-colors hover:bg-[rgba(0,113,227,0.04)] focus-visible:ring-1 focus-visible:ring-[var(--color-blue)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  [ CONTINUE DEPOSITION ]
                </button>
                <button
                  type="button"
                  onClick={onFinishForNow}
                  className="min-h-[44px] w-full border-[0.5px] border-transparent bg-transparent px-4 py-2 text-left font-code text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--color-primary)] outline-none hover:text-[var(--color-primary)] focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]"
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
