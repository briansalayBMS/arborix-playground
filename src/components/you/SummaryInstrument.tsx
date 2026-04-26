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
    body:
      "You repeatedly absorb strategy work while owning execution depth. The ledger shows outsized craft signal with compressed horizon for upstream framing.",
  },
  {
    title: "Narrative compression under load",
    body:
      "When timelines compress, your external narrative tightens to outcomes (healthy), but internal reviewers lose traceability to the decision graph.",
  },
] as const;

const SURGICAL_INQUIRY =
  "If you were forced to demote one flagship initiative to 'maintenance' for two quarters, which would you choose, and what irreversible signal would you need from the org to justify it?";

function DemoInitialIngestionNote() {
  return (
    <div className="space-y-4 text-left">
      <p className="m-0 text-sm font-normal leading-relaxed text-slate-800">
        The raw resume upload shows title inflation next to verifiable delivery scope. Dates align, but
        initiative claims lack anchor artifacts in the sovereign intake folder. Peer graph references
        are absent below the director line.
      </p>
      <p className="m-0 text-sm font-normal leading-relaxed text-slate-800">
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
      <div className="border-b-[0.5px] border-[var(--color-arborix-line)] bg-white/30 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="m-0 font-code text-[12px] font-medium uppercase tracking-[0.12em] text-[#5C6166]">
            {simulationActive ? "INITIAL INGESTION NOTE" : "SUMMARY INSTRUMENT"}
          </p>
          {simulationActive ? (
            <span className="font-code text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
              Day 0 preview
            </span>
          ) : (
            <PerspectiveToggle value={perspective} onChange={setPerspective} />
          )}
        </div>
      </div>

      <div className="relative min-h-[320px] bg-[var(--color-arborix-bg)] px-4 py-6 sm:px-6 sm:py-8">
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
      className="inline-flex max-w-full flex-nowrap items-stretch overflow-x-auto rounded-none border-[0.5px] border-[var(--color-arborix-line)] bg-white/50 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Perspective"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === "recruiter"}
        onClick={() => onChange("recruiter")}
        className={cn(
          "flex shrink-0 items-center justify-center whitespace-nowrap px-4 py-2.5 text-center font-ui text-[12px] font-semibold uppercase tracking-[0.06em] outline-none transition-colors sm:text-[14px] sm:tracking-[0.08em]",
          "min-h-[44px] focus-visible:ring-1 focus-visible:ring-[var(--color-arborix-accent)]/40",
          value === "recruiter"
            ? "bg-[#E0F5FF] text-[#131517]"
            : "bg-transparent text-slate-600 hover:bg-white/60",
        )}
      >
        [ RECRUITER SUMMARY ]
      </button>
      <span className="w-px shrink-0 self-stretch bg-[var(--color-arborix-line)]" aria-hidden />
      <button
        type="button"
        role="tab"
        aria-selected={value === "internal"}
        onClick={() => onChange("internal")}
        className={cn(
          "flex shrink-0 items-center justify-center whitespace-nowrap px-4 py-2.5 text-center font-ui text-[12px] font-semibold uppercase tracking-[0.06em] outline-none transition-colors sm:text-[14px] sm:tracking-[0.08em]",
          "min-h-[44px] focus-visible:ring-1 focus-visible:ring-[var(--color-arborix-accent)]/40",
          value === "internal"
            ? "bg-[#E0F5FF] text-[#131517]"
            : "bg-transparent text-slate-600 hover:bg-white/60",
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
      <div className="flex flex-col gap-3 border-b-[0.5px] border-[var(--color-arborix-line)] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <p className="mono-label text-[#131517]">Executive narrative</p>
        <LevelBadge />
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <p className="text-sm font-normal leading-relaxed tracking-tight text-slate-800">
            You translate ambiguous market pressure into shippable revenue narratives, then stand
            behind the instrumentation that makes those claims defensible where capital is allocated.
            Judgment under uncertainty is the through-line: you compress complexity without erasing
            tradeoffs, and you leave organizations with artifacts they can operate, not decks they can
            only applaud.
          </p>
        </div>

        <div>
          <p className="mono-label mb-4 text-slate-500">Key impact assets</p>
          <ul className="space-y-3">
            {IMPACT_BULLETS.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border-[0.5px] border-[var(--color-arborix-line)] bg-white/50">
                  <Check
                    className="h-2.5 w-2.5 text-[var(--color-arborix-accent)]"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </span>
                <span className="text-sm font-normal leading-relaxed text-slate-800">
                  {line}
                </span>
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
    <p className="m-0 text-sm font-normal text-slate-800">
      Level <span className="font-bold">L8</span>
      <span className="text-slate-500"> · </span>
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
  const inquiryText =
    mostPressingQuestion.trim() || SURGICAL_INQUIRY;
  const inDeposition = depositionSession != null;
  const showResumeDot = inDeposition && !depositionOpen;

  return (
    <div className="w-full max-w-3xl space-y-8 text-left">
      <div className="border-b-[0.5px] border-[var(--color-arborix-line)] pb-5">
        <p className="mono-label text-slate-500">Auditor observation</p>
        <p className="mt-4 text-sm font-normal leading-[1.65] text-slate-800">
          Subject demonstrates a repeatable pattern: high-fidelity execution paired with narrative
          closure under executive scrutiny. Signal density is strongest where outcomes are tied to
          instrumentation and weakest where upstream intent is inferred from artifacts rather than
          explicit decision records. No integrity flags on the sovereign ledger; variance is
          concentrated in horizon management and coalition depth.
        </p>
      </div>

      <div>
        <p className="mono-label mb-4 text-slate-500">Forensic gaps</p>
        <ul className="space-y-4">
          {FORENSIC_GAPS.map((gap) => (
            <li
              key={gap.title}
              className="rounded-none border-[0.5px] border-slate-200 bg-white/60 px-4 py-3"
            >
              <p className="font-code text-[12px] font-bold uppercase leading-snug tracking-[0.12em] text-slate-800">
                {gap.title}
              </p>
              <p className="mt-2 text-sm font-normal leading-relaxed text-slate-800">
                {gap.body}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-none border-[0.5px] border-[var(--color-arborix-line)] bg-white/40 px-4 py-4 text-left shadow-[0_0_0_0.5px_rgba(226,232,240,0.85)]">
        <p className="mono-label text-slate-500">Surgical inquiry</p>
        {inDeposition ? (
          <div className="mt-3 w-full text-left">
            <p className="m-0 text-left font-code text-[12px] font-bold uppercase leading-snug tracking-[0.12em] text-[#131517]">
              [ STATUS: DEPOSITION IN PROGRESS ]
            </p>
            <p className="m-0 mt-2 text-left font-code text-[14px] leading-relaxed text-slate-800">
              Latest: {latestDepositionPreview.trim() || "Awaiting your next line in the transcript."}
            </p>
            <button
              type="button"
              onClick={() => openDeposition()}
              className="relative mt-3 w-full border-[0.5px] border-slate-300 bg-[#E0F5FF] px-3 py-2.5 pr-8 text-left font-code text-[12px] font-semibold uppercase tracking-[0.1em] text-[#131517] outline-none transition-colors hover:bg-[#C0E8FF] focus-visible:ring-1 focus-visible:ring-[#06B6D4]/45"
            >
              {showResumeDot ? (
                <span
                  className="absolute right-3 top-1/2 h-[8px] w-[8px] -translate-y-1/2 rounded-full bg-[#06B6D4]"
                  aria-hidden
                />
              ) : null}
              <span className="block pr-1">[ CONTINUE DEPOSITION ]</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            aria-label="Open deposition for this question"
            onClick={() => openDeposition(inquiryText)}
            className="mt-3 w-full text-left text-sm font-normal leading-snug tracking-tight text-slate-800 underline decoration-transparent transition-colors [text-decoration-thickness:2px] [text-underline-offset:0.2em] hover:cursor-pointer hover:underline hover:decoration-[#E0F5FF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#06B6D4]/45"
          >
            {inquiryText}
          </button>
        )}
      </div>
    </div>
  );
}
