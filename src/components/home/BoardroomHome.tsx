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
    <div className="flex min-h-[calc(100vh-10rem)] w-full flex-col gap-4 bg-[var(--color-card)] text-left">
      <header className="border-b-[0.5px] border-[var(--color-border)] pb-4">
        <p className="label-card m-0">boardroom</p>
        <h1
          className="statement-hero m-0 mt-2"
          style={{ fontSize: "28px" }}
        >
          Sovereign Command Center
        </h1>
        <p className="text-description m-0 mt-2">
          Status across pillars. Select a domain to deepen calibration.
        </p>
      </header>

      <DraftSovereignNarrative />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          href="/you"
          className={cn(
            "group flex min-h-[168px] flex-col gap-3 border-[0.5px] border-[var(--color-border)] bg-[var(--color-card)] p-4 outline-none transition-colors",
            "hover:bg-[var(--color-bg)] focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]",
          )}
        >
          <p className="label-card m-0 text-[var(--color-primary)]">YOU</p>
          <div className="flex flex-col gap-2 border-t-[0.5px] border-[var(--color-border)] pt-3">
            <p
              className="m-0 text-[14px] font-medium leading-snug text-[var(--color-primary)]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              YOU: {auditCalibrationPercent}% resolution.
            </p>
            <p className="text-description m-0">
              {unverifiedClaims} unverified claims on record.
            </p>
          </div>
          <span className="inter-sm-active mt-auto opacity-0 transition-opacity group-hover:opacity-100">
            Open domain
          </span>
        </Link>

        <Link
          href="/company"
          className={cn(
            "group flex min-h-[168px] flex-col gap-3 border-[0.5px] border-[var(--color-border)] bg-[var(--color-card)] p-4 outline-none transition-colors",
            "hover:bg-[var(--color-bg)] focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]",
          )}
        >
          <p className="label-card m-0 text-[var(--color-primary)]">COMPANY</p>
          <div className="flex flex-col gap-2 border-t-[0.5px] border-[var(--color-border)] pt-3">
            <p
              className="m-0 text-[14px] font-medium leading-snug text-[var(--color-primary)]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              COMPANY: Mission narrative staged.
            </p>
            <p className="text-description m-0">
              Context and team signals need consolidation.
            </p>
          </div>
          <span className="inter-sm-active mt-auto opacity-0 transition-opacity group-hover:opacity-100">
            Open domain
          </span>
        </Link>

        <Link
          href="/work"
          className={cn(
            "group flex min-h-[168px] flex-col gap-3 border-[0.5px] border-[var(--color-border)] bg-[var(--color-card)] p-4 outline-none transition-colors",
            "hover:bg-[var(--color-bg)] focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]",
          )}
        >
          <p className="label-card m-0 text-[var(--color-primary)]">WORK</p>
          <div className="flex flex-col gap-2 border-t-[0.5px] border-[var(--color-border)] pt-3">
            <p
              className="m-0 text-[14px] font-medium leading-snug text-[var(--color-primary)]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              WORK: OKR cycle live.
            </p>
            <p className="text-description m-0">
              Weekly performance versus commitment pending sync.
            </p>
          </div>
          <span className="inter-sm-active mt-auto opacity-0 transition-opacity group-hover:opacity-100">
            Open domain
          </span>
        </Link>
      </div>

      <MasterSovereignLedger className="mt-auto" />
    </div>
  );
}
