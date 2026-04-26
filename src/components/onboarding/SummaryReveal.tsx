"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type SummaryMode = "recruiter" | "internal";

const RECRUITER_SUMMARY = [
  "You are an execution-focused operator with a pattern of shipping outcomes that align team velocity with business goals.",
  "Your documented wins show strong cross-functional influence, practical prioritization, and a consistent ability to convert ambiguity into shipped work.",
  "You present as a high-trust collaborator who can lead initiatives from discovery through delivery while maintaining measurable impact.",
];

const INTERNAL_SUMMARY = [
  "The current record describes results, but it does not fully expose your decision logic under pressure. That creates calibration drag in high-stakes hiring loops.",
  "Several skills are directionally stated but remain blurry in commercial context. The file needs sharper evidence on stakeholder negotiation, escalation control, and risk trade-off framing.",
  "There is a measurable gap between delivery proof and narrative precision. Closing that gap is the fastest path to stronger compensation and role-level positioning.",
];

const ENHANCEMENTS = [
  {
    title: "CALIBRATE PERSONALITY",
    body: "Your Pace/Priority scores are currently 40% resolution. Take the 2-question hook.",
  },
  {
    title: "MAP SKILLS",
    body: "Position your skills against typical job class benchmarks.",
  },
  {
    title: "INITIATE 360 FEEDBACK",
    body: "Compare your internal narrative against stakeholder reality.",
  },
] as const;

export function SummaryReveal() {
  const [mode, setMode] = useState<SummaryMode>("recruiter");
  const content = mode === "recruiter" ? RECRUITER_SUMMARY : INTERNAL_SUMMARY;

  return (
    <section className="w-full max-w-4xl">
      <header className="border-b-[0.5px] border-slate-300 pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("recruiter")}
            className={cn(
              "border-[0.5px] border-slate-300 px-6 py-2 font-code text-[14px] font-semibold text-[#131517]",
              mode === "recruiter"
                ? "bg-[#E0F5FF]"
                : "bg-white hover:bg-[#E0F5FF]/45",
            )}
          >
            RECRUITER SUMMARY
          </button>
          <button
            type="button"
            onClick={() => setMode("internal")}
            className={cn(
              "border-[0.5px] border-slate-300 px-6 py-2 font-code text-[14px] font-semibold text-[#131517]",
              mode === "internal"
                ? "bg-[#E0F5FF]"
                : "bg-white hover:bg-[#E0F5FF]/45",
            )}
          >
            INTERNAL SUMMARY
          </button>
        </div>
      </header>

      <div className="mt-6 border-[0.5px] border-slate-300 bg-white p-6">
        <h2 className="font-ui m-0 text-[24px] font-semibold leading-tight text-[#131517]">
          {mode === "recruiter" ? "Executive Summary" : "Forensic Audit"}
        </h2>
        <div className="mt-4 space-y-3">
          {content.map((line) => (
            <p
              key={line}
              className="font-ui m-0 text-[16px] font-normal leading-relaxed text-[#131517]"
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-ui m-0 text-[16px] font-semibold text-[#131517]">
          Enhancement Pathways
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
          {ENHANCEMENTS.map((item) => (
            <button
              key={item.title}
              type="button"
              className="cursor-pointer border-[0.5px] border-[#BEE3F8] bg-[#E0F5FF] p-4 text-left transition-colors hover:bg-[#C0E8FF]"
            >
              <p className="font-code m-0 text-[14px] font-semibold text-[#131517]">
                {item.title}
              </p>
              <p className="font-ui m-0 mt-2 text-[14px] leading-relaxed text-[#131517]">
                {item.body}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

