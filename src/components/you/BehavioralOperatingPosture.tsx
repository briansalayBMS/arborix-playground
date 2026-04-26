"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";

function parseOperatingPosture(archetypeVerdict: string | null): {
  title: string;
  summary: string;
  primaryForce: string;
  posture: string;
  bias: string;
  highlight: "I" | "D" | "S" | "C";
} {
  if (!archetypeVerdict?.trim()) {
    return {
      title: "INITIATOR",
      summary:
        "High-pace delivery with a primary focus on rallying teams around new initiatives.",
      primaryForce: "Influence and pace expansion",
      posture: "High-frequency coalition shaping",
      bias: "Over-extension under ambiguous sponsorship",
      highlight: "I",
    };
  }
  const normalized = archetypeVerdict.toLowerCase();
  const parts = archetypeVerdict
    .split(".")
    .map((s) => s.trim())
    .filter(Boolean);
  const opener = parts[0] ?? "";
  const nameMatch = opener.match(/You are (?:an|a) ([^(]+?)\s*(?:\(|$)/);
  const raw = nameMatch?.[1]?.trim() ?? "Initiator";
  const title = raw.toUpperCase();
  const summary = parts.slice(1).join(". ").trim() || archetypeVerdict;
  if (normalized.includes("driver")) {
    return {
      title,
      summary,
      primaryForce: "Dominance and deadline compression",
      posture: "Decisive execution under volatility",
      bias: "Task pressure over consensus pacing",
      highlight: "D",
    };
  }
  if (normalized.includes("analyst")) {
    return {
      title,
      summary,
      primaryForce: "Conscientiousness and precision control",
      posture: "Evidence-first diagnostic sequencing",
      bias: "Latency from over-validation",
      highlight: "C",
    };
  }
  if (normalized.includes("steady")) {
    return {
      title,
      summary,
      primaryForce: "Steadiness and alignment continuity",
      posture: "Rhythmic coordination with low variance",
      bias: "Under-signaling conflict until late",
      highlight: "S",
    };
  }
  return {
    title,
    summary,
    primaryForce: "Influence and pace expansion",
    posture: "High-frequency coalition shaping",
    bias: "Over-extension under ambiguous sponsorship",
    highlight: "I",
  };
}

function DiscQuadrant({ active }: { active: "I" | "D" | "S" | "C" }) {
  const cells: Array<{ key: "D" | "I" | "S" | "C"; label: string }> = [
    { key: "D", label: "D" },
    { key: "I", label: "I" },
    { key: "S", label: "S" },
    { key: "C", label: "C" },
  ];
  return (
    <div className="grid w-full max-w-[172px] grid-cols-2 border-[0.5px] border-[#E2E8F0] bg-white">
      {cells.map((c) => (
        <div
          key={c.key}
          className={cn(
            "flex aspect-square items-center justify-center border-[0.5px] border-[#E2E8F0] font-code text-[20px] font-semibold tracking-[0.08em]",
            c.key === active ? "bg-[#E0F5FF] text-[#06B6D4]" : "bg-white text-[#131517]",
          )}
        >
          {c.label}
        </div>
      ))}
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b-[0.5px] border-[#E2E8F0] py-3 last:border-b-0">
      <p className="m-0 font-code text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
        {label}
      </p>
      <p className="m-0 mt-1 font-code text-[13px] font-normal leading-snug text-[#131517]">
        {value}
      </p>
    </div>
  );
}

export type BehavioralOperatingPostureProps = {
  auditPercent: number;
  archetypeVerdict: string | null;
  mounted: boolean;
  /** Inside unified operating posture box: no outer border or pillar sub-header. */
  embedded?: boolean;
};

export function BehavioralOperatingPosture({
  auditPercent,
  archetypeVerdict,
  mounted,
  embedded = false,
}: BehavioralOperatingPostureProps) {
  const postureLocked = !mounted || auditPercent < 55;
  const profile = useMemo(
    () => parseOperatingPosture(archetypeVerdict),
    [archetypeVerdict],
  );

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col bg-white",
        !embedded && "border-[0.5px] border-[#E2E8F0]",
      )}
    >
      {!embedded ? (
        <div className="border-b-[0.5px] border-[#E2E8F0] bg-white/30 px-4 py-4">
          <p className="mono-label m-0 text-[#131517]">behavioral posture</p>
        </div>
      ) : null}

      <div
        className={cn(
          "relative flex min-h-0 flex-1 flex-col gap-0 will-change-[filter,backdrop-filter]",
          "transition-[filter,backdrop-filter,-webkit-backdrop-filter] duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          postureLocked && "pointer-events-none blur-md grayscale backdrop-blur-md select-none",
        )}
      >
        <div className="flex flex-col gap-1 p-4 text-left">
          <p className="m-0 font-code text-[24px] font-bold uppercase leading-tight tracking-[0.06em] text-[#131517]">
            {profile.title}
          </p>
          <p className="m-0 font-code text-[13px] font-normal leading-relaxed text-[#5C6166]">
            {profile.summary}
          </p>
          <div className="mt-1 flex justify-start">
            <DiscQuadrant active={profile.highlight} />
          </div>
        </div>

        <div className="border-t-[0.5px] border-[#E2E8F0] p-4 text-left">
          <p className="m-0 font-code text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
            Force analysis
          </p>
          <div className="mt-3">
            <SpecRow label="Primary force" value={profile.primaryForce} />
            <SpecRow label="Posture" value={profile.posture} />
            <SpecRow label="Bias" value={profile.bias} />
          </div>
        </div>
      </div>

      {postureLocked ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-start p-4">
          <div className="max-w-[min(100%,18rem)] border border-solid border-[#BEE3F8] bg-[#E0F5FF]/90 px-3 py-2">
            <p className="m-0 text-left font-code text-[12px] font-medium uppercase leading-snug tracking-[0.12em] text-[#334155]">
              [ CALIBRATION REQUIRED TO UNLOCK DATA ]
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
