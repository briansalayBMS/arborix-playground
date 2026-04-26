"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDemoFirstTime } from "@/context/DemoFirstTimeContext";
import { useSovereignCommand } from "@/context/SovereignCommandContext";
import { cn } from "@/lib/cn";
import { BehavioralOperatingPosture } from "@/components/you/BehavioralOperatingPosture";
import { IdentityRadar } from "@/components/you/IdentityRadar";
import { SummaryInstrument } from "@/components/you/SummaryInstrument";
import { SovereignLedger } from "@/components/sovereign/SovereignLedger";

const ENHANCEMENT_CARDS = [
  {
    key: "skills",
    title: "SHARPEN SKILLS",
    body: "Position against [Job Family] benchmarks.",
    href: "/skills",
  },
  {
    key: "360",
    title: "INITIATE 360",
    body: "Map stakeholder friction.",
    href: "/ingest",
  },
] as const;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 font-code text-[12px] font-medium uppercase tracking-[0.12em] text-[#5C6166]">
      {children}
    </p>
  );
}

export function YouHubPage() {
  const {
    archetypeVerdict,
    openPersonalityHook,
    personalityPhase1Complete,
    depositionSession,
    depositionOpen,
    openDeposition,
  } = useSovereignCommand();
  const { effectiveAuditCalibrationPercent } = useDemoFirstTime();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    if (p.get("resumeDeposition") !== "1") return;
    openDeposition();
    window.history.replaceState(null, "", "/you");
  }, [openDeposition]);

  const emphasizeCalibratePersonality =
    mounted && !personalityPhase1Complete;

  const showDepositionResume =
    Boolean(depositionSession) && !depositionOpen;

  return (
    <div className="flex min-h-[calc(100vh-10rem)] w-full flex-col gap-12 bg-white text-left">
      <section>
        <SummaryInstrument />
      </section>

      <section className="flex flex-col gap-1">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <SectionTitle>FORENSIC OPERATING POSTURE</SectionTitle>
          <p
            className="m-0 font-code text-[12px] font-semibold tabular-nums tracking-[0.08em] text-[#131517]"
            aria-live="polite"
          >
            AUDIT STATUS{" "}
            <span
              className={
                effectiveAuditCalibrationPercent >= 55 ? "text-[#06B6D4]" : "text-[#64748B]"
              }
            >
              {effectiveAuditCalibrationPercent}%
            </span>
          </p>
        </div>

        <div className="border-[0.5px] border-[#E2E8F0] bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex min-h-0 flex-col gap-1 p-4 lg:min-h-[480px]">
              <IdentityRadar auditPercent={effectiveAuditCalibrationPercent} />
            </div>
            <div
              className={cn(
                "flex min-h-0 flex-col border-t-[0.5px] border-[#E2E8F0] lg:min-h-[480px] lg:border-t-0 lg:border-l-[0.5px]",
              )}
            >
              <BehavioralOperatingPosture
                embedded
                auditPercent={effectiveAuditCalibrationPercent}
                archetypeVerdict={archetypeVerdict}
                mounted={mounted}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-1">
        <SectionTitle>ENHANCEMENT HUB</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {depositionSession ? (
            <motion.button
              type="button"
              onClick={() => openDeposition()}
              className={cn(
                "relative border-[0.5px] border-slate-300 bg-[#E0F5FF] p-4 text-left transition-colors hover:bg-[#C0E8FF]",
                "font-ui text-[14px] font-semibold leading-snug text-[#131517] outline-none",
                "focus-visible:ring-1 focus-visible:ring-[#06B6D4]",
              )}
            >
              {showDepositionResume ? (
                <span
                  className="absolute right-4 top-4 h-[8px] w-[8px] rounded-full bg-[#06B6D4]"
                  aria-hidden
                />
              ) : null}
              <span className="block pr-6">CONTINUE DEPOSITION</span>
              <span className="mt-2 block font-normal leading-relaxed">
                Return to the transcript at the same step. Use [ FINISH FOR NOW ] to keep the session
                and work elsewhere.
              </span>
            </motion.button>
          ) : null}
          <motion.button
            type="button"
            onClick={() => openPersonalityHook()}
            animate={
              emphasizeCalibratePersonality
                ? {
                    boxShadow: [
                      "0 0 0 0 rgba(6, 182, 212, 0.55)",
                      "0 0 0 12px rgba(6, 182, 212, 0)",
                    ],
                  }
                : { boxShadow: "0 0 0 0 rgba(0,0,0,0)" }
            }
            transition={{
              repeat: emphasizeCalibratePersonality ? Infinity : 0,
              duration: 2,
              ease: "easeInOut",
            }}
            className={cn(
              "border-[0.5px] border-slate-300 bg-[#E0F5FF] p-4 text-left transition-colors hover:bg-[#C0E8FF]",
              "font-ui text-[14px] font-semibold leading-snug text-[#131517] outline-none",
              "focus-visible:ring-1 focus-visible:ring-[#06B6D4]",
              emphasizeCalibratePersonality &&
                "ring-2 ring-[#06B6D4] ring-offset-4 ring-offset-white",
            )}
          >
            <span className="block">CALIBRATE PERSONALITY</span>
            <span className="mt-2 block font-normal leading-relaxed">
              Jump to 55% resolution via 2-question hook.
            </span>
          </motion.button>
          {ENHANCEMENT_CARDS.map((card) => (
            <Link
              key={card.key}
              href={card.href}
              className={cn(
                "border-[0.5px] border-slate-300 bg-[#E0F5FF] p-4 text-left transition-colors hover:bg-[#C0E8FF]",
                "font-ui text-[14px] font-semibold leading-snug text-[#131517] outline-none",
                "focus-visible:ring-1 focus-visible:ring-[#06B6D4]",
              )}
            >
              <span className="block">{card.title}</span>
              <span className="mt-2 block font-normal leading-relaxed">{card.body}</span>
            </Link>
          ))}
          <Link
            href="/work"
            className={cn(
              "border-[0.5px] border-slate-300 bg-[#E0F5FF] p-4 text-left transition-colors hover:bg-[#C0E8FF]",
              "font-ui text-[14px] font-semibold leading-snug text-[#131517] outline-none",
              "focus-visible:ring-1 focus-visible:ring-[#06B6D4]",
            )}
          >
            <span className="block">WORK SNAPSHOT</span>
            <span className="mt-2 block font-normal leading-relaxed">
              OKRs, week load, and proof surfaces on the Work pillar.
            </span>
          </Link>
        </div>
      </section>

      <section className="mt-auto pt-12">
        <SovereignLedger domain="YOU" />
      </section>
    </div>
  );
}
