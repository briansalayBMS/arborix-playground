"use client";

import Link from "next/link";
import { useSovereignCommand } from "@/context/SovereignCommandContext";
import { DraftSovereignNarrative } from "@/components/home/DraftSovereignNarrative";
import { MasterSovereignLedger } from "@/components/sovereign/SovereignLedger";
import { cn } from "@/lib/cn";

export function BoardroomHome() {
  const { auditCalibrationPercent, loggedTestimony } = useSovereignCommand();
  const unverifiedClaims = loggedTestimony.length > 0 ? loggedTestimony.length : 2;

  return (
    <div className="flex min-h-[calc(100vh-10rem)] w-full flex-col gap-4 bg-white text-left">
      <header className="border-b-[0.5px] border-slate-300 pb-4">
        <p className="m-0 font-code text-[12px] font-medium uppercase tracking-[0.12em] text-[#5C6166]">
          boardroom
        </p>
        <h1 className="font-ui m-0 mt-2 text-[28px] font-semibold leading-tight text-[#131517]">
          Sovereign Command Center
        </h1>
        <p className="font-ui m-0 mt-2 text-[14px] font-normal leading-relaxed text-[#5C6166]">
          Status across pillars. Select a domain to deepen calibration.
        </p>
      </header>

      <DraftSovereignNarrative />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          href="/you"
          className={cn(
            "group flex min-h-[168px] flex-col gap-3 border-[0.5px] border-slate-300 bg-white p-4 outline-none transition-colors",
            "hover:bg-[#F8FAFC] focus-visible:ring-1 focus-visible:ring-[#06B6D4]",
          )}
        >
          <p className="m-0 font-code text-[12px] font-semibold uppercase tracking-[0.14em] text-[#131517]">
            YOU
          </p>
          <div className="flex flex-col gap-2 border-t-[0.5px] border-slate-300 pt-3">
            <p className="font-ui m-0 text-[14px] font-medium leading-snug text-[#131517]">
              YOU: {auditCalibrationPercent}% resolution.
            </p>
            <p className="font-ui m-0 text-[14px] font-normal leading-snug text-[#5C6166]">
              {unverifiedClaims} unverified claims on record.
            </p>
          </div>
          <span className="font-code mt-auto text-[11px] uppercase tracking-[0.12em] text-[#06B6D4] opacity-0 transition-opacity group-hover:opacity-100">
            Open domain
          </span>
        </Link>

        <Link
          href="/company"
          className={cn(
            "group flex min-h-[168px] flex-col gap-3 border-[0.5px] border-slate-300 bg-white p-4 outline-none transition-colors",
            "hover:bg-[#F8FAFC] focus-visible:ring-1 focus-visible:ring-[#06B6D4]",
          )}
        >
          <p className="m-0 font-code text-[12px] font-semibold uppercase tracking-[0.14em] text-[#131517]">
            COMPANY
          </p>
          <div className="flex flex-col gap-2 border-t-[0.5px] border-slate-300 pt-3">
            <p className="font-ui m-0 text-[14px] font-medium leading-snug text-[#131517]">
              COMPANY: Mission narrative staged.
            </p>
            <p className="font-ui m-0 text-[14px] font-normal leading-snug text-[#5C6166]">
              Context and team signals need consolidation.
            </p>
          </div>
          <span className="font-code mt-auto text-[11px] uppercase tracking-[0.12em] text-[#06B6D4] opacity-0 transition-opacity group-hover:opacity-100">
            Open domain
          </span>
        </Link>

        <Link
          href="/work"
          className={cn(
            "group flex min-h-[168px] flex-col gap-3 border-[0.5px] border-slate-300 bg-white p-4 outline-none transition-colors",
            "hover:bg-[#F8FAFC] focus-visible:ring-1 focus-visible:ring-[#06B6D4]",
          )}
        >
          <p className="m-0 font-code text-[12px] font-semibold uppercase tracking-[0.14em] text-[#131517]">
            WORK
          </p>
          <div className="flex flex-col gap-2 border-t-[0.5px] border-slate-300 pt-3">
            <p className="font-ui m-0 text-[14px] font-medium leading-snug text-[#131517]">
              WORK: OKR cycle live.
            </p>
            <p className="font-ui m-0 text-[14px] font-normal leading-snug text-[#5C6166]">
              Weekly performance versus commitment pending sync.
            </p>
          </div>
          <span className="font-code mt-auto text-[11px] uppercase tracking-[0.12em] text-[#06B6D4] opacity-0 transition-opacity group-hover:opacity-100">
            Open domain
          </span>
        </Link>
      </div>

      <MasterSovereignLedger className="mt-auto" />
    </div>
  );
}
