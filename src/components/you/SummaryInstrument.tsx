"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useDemoFirstTime } from "@/context/DemoFirstTimeContext";
import { useSovereignCommand } from "@/context/SovereignCommandContext";

type Perspective = "recruiter" | "internal";

const IMPACT_BULLETS = [
  "Closed a $4.2M ARR expansion with zero discounting; procurement cited your narrative as decisive.",
  "Shipped revenue-grade instrumentation adopted by Finance; cut month-close variance by 31%.",
  "Led cross-functional launch (Eng, Design, GTM) with executive air-cover and measurable NPS lift.",
] as const;

const FORENSIC_GAPS = [
  {
    title: "Strategic vs. tactical friction",
    body: "You repeatedly absorb strategy work while owning execution depth. The ledger shows outsized craft signal with compressed horizon for upstream framing.",
  },
  {
    title: "Narrative compression under load",
    body: "When timelines compress, your external narrative tightens to outcomes (healthy), but internal reviewers lose traceability to the decision graph.",
  },
] as const;

const SURGICAL_INQUIRY =
  "If you were forced to demote one flagship initiative to 'maintenance' for two quarters, which would you choose, and what irreversible signal would you need from the org to justify it?";

function DemoInitialIngestionNote() {
  return (
    <div className="space-y-4 text-left">
      <p className="narrative-body m-0">
        The raw resume upload shows title inflation next to verifiable delivery scope. Dates align, but
        initiative claims lack anchor artifacts in the sovereign intake folder. Peer graph references
        are absent below the director line.
      </p>
      <p className="narrative-body m-0">
        Treat this intake as unverified until deposition lines attach exhibits and ledger seals bind the
        record.
      </p>
    </div>
  );
}

export function SummaryInstrument() {
  const [perspective, setPerspective] = useState<Perspective>("internal");
  const reduceMotion = useReducedMotion();
  const { simulationActive } = useDemoFirstTime();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="frame-museum overflow-hidden"
    >
      <div className="border-b-[0.5px] border-[var(--color-border)] bg-[var(--color-card)] px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="label-card m-0">
            {simulationActive ? "INITIAL INGESTION NOTE" : "SUMMARY INSTRUMENT"}
          </p>
          {simulationActive ? (
            <span className="inter-sm">Day 0 preview</span>
          ) : (
            <PerspectiveToggle value={perspective} onChange={setPerspective} />
          )}
        </div>
      </div>

      <div className="relative min-h-[320px] bg-[var(--color-bg)] px-4 py-6 sm:px-6 sm:py-8">
        {simulationActive ? (
          <DemoInitialIngestionNote />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            {perspective === "recruiter" ? (
              <motion.div
                key="recruiter"
                initial={
                  reduceMotion
                    ? { opacity: 1, filter: "blur(0px)", scale: 1 }
                    : { opacity: 0, filter: "blur(8px)", scale: 0.996 }
                }
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={
                  reduceMotion
                    ? { opacity: 0, scale: 1 }
                    : { opacity: 0, filter: "blur(6px)", scale: 0.998 }
                }
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="will-change-[opacity,filter,transform]"
              >
                <RecruiterView />
              </motion.div>
            ) : (
              <motion.div
                key="internal"
                initial={
                  reduceMotion
                    ? { opacity: 1, filter: "blur(0px)", scale: 1 }
                    : { opacity: 0, filter: "blur(8px)", scale: 0.996 }
                }
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={
                  reduceMotion
                    ? { opacity: 0, scale: 1 }
                    : { opacity: 0, filter: "blur(6px)", scale: 0.998 }
                }
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="will-change-[opacity,filter,transform]"
              >
                <InternalView />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

function PerspectiveToggle({
  value,
  onChange,
}: {
  value: Perspective;
  onChange: (v: Perspective) => void;
}) {
  return (
    <div
      className="tab-container inline-flex max-w-full flex-nowrap items-stretch overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Perspective"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === "recruiter"}
        onClick={() => onChange("recruiter")}
        className={cn(
          "tab min-h-[44px] shrink-0 whitespace-nowrap outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]/40",
          value === "recruiter" ? "tab-active" : "",
        )}
      >
        [ RECRUITER SUMMARY ]
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === "internal"}
        onClick={() => onChange("internal")}
        className={cn(
          "tab min-h-[44px] shrink-0 whitespace-nowrap outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]/40",
          value === "internal" ? "tab-active" : "",
        )}
      >
        [ INTERNAL SUMMARY ]
      </button>
    </div>
  );
}

function RecruiterView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b-[0.5px] border-[var(--color-border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <p className="label-card m-0">Executive narrative</p>
        <LevelBadge />
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <p className="narrative-body m-0">
            You translate ambiguous market pressure into shippable revenue narratives, then stand
            behind the instrumentation that makes those claims defensible where capital is allocated.
            Judgment under uncertainty is the through-line: you compress complexity without erasing
            tradeoffs, and you leave organizations with artifacts they can operate, not decks they can
            only applaud.
          </p>
        </div>

        <div>
          <p className="label-card mb-4">Key impact assets</p>
          <ul className="space-y-3">
            {IMPACT_BULLETS.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border-[0.5px] border-[var(--color-border)] bg-[var(--color-card)]">
                  <Check
                    className="h-2.5 w-2.5 text-[var(--color-blue)]"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </span>
                <span className="text-description">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function LevelBadge() {
  return (
    <p className="text-metadata m-0">
      Level <span style={{ fontWeight: 600 }}>L8</span>
      <span style={{ color: "var(--color-tertiary)" }}> · </span>
      Head of Design
    </p>
  );
}

function InternalView() {
  const {
    mostPressingQuestion,
    openDeposition,
    depositionOpen,
    depositionSession,
    latestDepositionPreview,
  } = useSovereignCommand();
  const inquiryText = mostPressingQuestion.trim() || SURGICAL_INQUIRY;
  const inDeposition = depositionSession != null;
  const showResumeDot = inDeposition && !depositionOpen;

  return (
    <div className="w-full max-w-3xl space-y-8 text-left">
      <div className="border-b-[0.5px] border-[var(--color-border)] pb-5">
        <p className="label-card">Arbor's read</p>
        <p className="narrative-body mt-4">
          Subject demonstrates a repeatable pattern: high-fidelity execution paired with narrative
          closure under executive scrutiny. Signal density is strongest where outcomes are tied to
          instrumentation and weakest where upstream intent is inferred from artifacts rather than
          explicit decision records. No integrity flags on the sovereign ledger; variance is
          concentrated in horizon management and coalition depth.
        </p>
      </div>

      <div>
        <p className="label-card mb-4">What's missing</p>
        <ul className="space-y-4">
          {FORENSIC_GAPS.map((gap) => (
            <li
              key={gap.title}
              className="surface-card px-4 py-3"
            >
              <p className="label-card m-0" style={{ fontWeight: 700 }}>
                {gap.title}
              </p>
              <p className="text-description mt-2">{gap.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="surface-card px-4 py-4 text-left">
        <p className="label-card">Surgical inquiry</p>
        {inDeposition ? (
          <div className="mt-3 w-full text-left">
            <p className="label-card m-0" style={{ color: "var(--color-primary)", fontWeight: 700 }}>
              [ STATUS: DEPOSITION IN PROGRESS ]
            </p>
            <p className="text-description mt-2">
              Latest: {latestDepositionPreview.trim() || "Awaiting your next line in the transcript."}
            </p>
            <button
              type="button"
              onClick={() => openDeposition()}
              className="relative mt-3 w-full border-[0.5px] border-[var(--color-border)] bg-[rgba(0,113,227,0.06)] px-3 py-2.5 pr-8 text-left font-code text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--color-primary)] outline-none transition-colors hover:bg-[rgba(0,113,227,0.04)] focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]/45"
            >
              {showResumeDot ? (
                <span
                  className="absolute right-3 top-1/2 h-[8px] w-[8px] -translate-y-1/2 rounded-full bg-[var(--color-blue)]"
                  aria-hidden
                />
              ) : null}
              <span className="block pr-1">[ CONTINUE ]</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            aria-label="Open deposition for this question"
            onClick={() => openDeposition(inquiryText)}
            className="text-description mt-3 w-full text-left underline decoration-transparent transition-colors [text-decoration-thickness:2px] [text-underline-offset:0.2em] hover:cursor-pointer hover:underline hover:decoration-[rgba(0,113,227,0.06)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]/45"
          >
            {inquiryText}
          </button>
        )}
      </div>
    </div>
  );
}
