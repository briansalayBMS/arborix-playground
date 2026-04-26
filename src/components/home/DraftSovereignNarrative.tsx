"use client";

import Link from "next/link";
import { useSovereignCommand } from "@/context/SovereignCommandContext";
import {
  buildDraftSovereignNarrative,
  hasDepositionTestimony,
} from "@/lib/draftSovereignNarrative";

const RESUME_HREF = "/you?resumeDeposition=1";

export function DraftSovereignNarrative() {
  const { loggedTestimony, activeInquirySummary, latestDepositionPreview } =
    useSovereignCommand();

  if (!hasDepositionTestimony(loggedTestimony)) return null;

  const narrative = buildDraftSovereignNarrative({
    loggedTestimony,
    activeInquirySummary,
    latestDepositionPreview,
  });

  return (
    <section
      className="w-full text-left"
      aria-labelledby="draft-sovereign-heading"
    >
      <p id="draft-sovereign-heading" className="mono-label m-0 text-[#131517]">
        [ DRAFT SOVEREIGN NARRATIVE - IN PROGRESS ]
      </p>
      <div className="mt-4 rounded-none border border-dashed border-[#BEE3F8] bg-[#F8FAFC] p-4">
        <p className="m-0 text-left font-code text-[14px] font-normal leading-relaxed text-[#131517]">
          {narrative}
        </p>
        <Link
          href={RESUME_HREF}
          className="mt-4 inline-block bg-[#E0F5FF] px-4 py-2 font-code text-[12px] font-semibold uppercase tracking-[0.1em] text-[#131517] outline-none ring-inset transition-colors hover:bg-[#C0E8FF] focus-visible:ring-1 focus-visible:ring-[#06B6D4]"
        >
          [ CONTINUE DEPOSITION TO SEAL RECORD ]
        </Link>
      </div>
    </section>
  );
}
