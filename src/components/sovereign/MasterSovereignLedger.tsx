"use client";

import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { useRightRailDrawer } from "@/context/RightRailDrawerContext";
import { buildMasterInspectorAnalysis, MASTER_LEDGER_MOCK } from "@/lib/masterSovereignLedger";

function noEmDash(s: string): string {
  return s.replace(/\u2014/g, "-");
}

export type MasterSovereignLedgerProps = {
  className?: string;
};

/**
 * Global vault: consolidated registry with DOMAIN column. Read-only mock aggregate for /home.
 */
export function MasterSovereignLedger({ className }: MasterSovereignLedgerProps) {
  const [expanded, setExpanded] = useState(false);
  const rows = useMemo(() => MASTER_LEDGER_MOCK, []);
  const { open, selectedKey } = useRightRailDrawer();

  const masterSelectionKey = useCallback((recordId: string) => `master:${recordId}`, []);

  const openMasterInspector = useCallback(
    (row: (typeof MASTER_LEDGER_MOCK)[number]) => {
      open({
        recordId: row.recordId,
        assetTitle: noEmDash(row.asset),
        sourcePath: row.sourcePath,
        fileType: row.fileType,
        timestamp: row.timestamp,
        sources: [...row.sources],
        forensicVerdict: buildMasterInspectorAnalysis(
          row.recordId,
          row.sources,
          row.forensicVerdict,
        ),
        selectionKey: masterSelectionKey(row.recordId),
      });
    },
    [masterSelectionKey, open],
  );

  return (
    <section
      className={cn(
        "w-full border-t-[0.5px] border-[#E2E8F0] bg-[#F8FAFC] text-left",
        className,
      )}
    >
      <div className="w-full px-4 py-8 sm:px-5">
        <div className="overflow-hidden border-[0.5px] border-[#E2E8F0] bg-[#F8FAFC] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]">
          <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b-[0.5px] border-[#E2E8F0] bg-[#F1F5F9]/40 px-4 py-3 sm:px-5">
            <p className="m-0 min-w-0 font-code text-[12px] font-semibold uppercase tracking-[0.12em] text-[#131517]">
              00 MASTER SOVEREIGN LEDGER
            </p>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="ml-auto shrink-0 rounded-none border-0 bg-transparent px-0 py-1 font-code text-[12px] font-semibold uppercase tracking-[0.12em] text-[#131517] outline-none transition-opacity hover:opacity-80 focus-visible:ring-1 focus-visible:ring-[#06B6D4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] motion-reduce:transition-none"
            >
              {expanded ? "[ COLLAPSE MASTER LEDGER ]" : "[ EXPAND MASTER LEDGER ]"}
            </button>
          </div>

          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-300 ease-linear motion-reduce:duration-0",
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div
              className="min-h-0 overflow-hidden"
              aria-hidden={!expanded}
              {...(!expanded ? { inert: true as const } : {})}
            >
              <div className="border-b-[0.5px] border-[#E2E8F0] px-4 py-3 sm:px-5">
                <p className="mono-label m-0 text-[#131517]">Master registry</p>
              </div>

              <div className="w-full overflow-x-auto px-0 pb-6 pt-0">
                <div
                  className="min-w-[min(100%,880px)] border-collapse text-left"
                  role="table"
                  aria-label="Master sovereign ledger"
                >
                  <div
                    role="row"
                    className="grid grid-cols-[minmax(6.5rem,1fr)_minmax(5rem,0.75fr)_minmax(11rem,1.5fr)_minmax(7rem,1fr)_minmax(7.5rem,1fr)] items-end gap-4 border-b-[0.5px] border-[#E2E8F0] px-4 py-3 sm:px-5"
                  >
                    <span role="columnheader" className="font-code text-[12px] font-bold uppercase tracking-[0.12em] text-slate-600">
                      Record
                    </span>
                    <span role="columnheader" className="font-code text-[12px] font-bold uppercase tracking-[0.12em] text-slate-600">
                      Domain
                    </span>
                    <span role="columnheader" className="font-code text-[12px] font-bold uppercase tracking-[0.12em] text-slate-600">
                      Asset
                    </span>
                    <span role="columnheader" className="font-code text-[12px] font-bold uppercase tracking-[0.12em] text-slate-600">
                      Adjust
                    </span>
                    <span role="columnheader" className="font-code text-[12px] font-bold uppercase tracking-[0.12em] text-slate-600">
                      Verification
                    </span>
                  </div>

                  {rows.map((row) => {
                    const rowSelected = selectedKey === masterSelectionKey(row.recordId);
                    return (
                    <div
                      key={row.recordId}
                      role="row"
                      className={cn(
                        "grid grid-cols-[minmax(6.5rem,1fr)_minmax(5rem,0.75fr)_minmax(11rem,1.5fr)_minmax(7rem,1fr)_minmax(7.5rem,1fr)] items-start gap-4 border-b-[0.5px] border-[#E2E8F0] px-4 py-3 sm:px-5 last:border-b-0",
                        rowSelected && "bg-[#E0F5FF]/35",
                      )}
                    >
                      <span className="font-code text-[14px] font-normal tabular-nums leading-snug text-[#131517]">
                        {row.recordId}
                      </span>
                      <span className="font-code text-[14px] font-semibold uppercase leading-snug tracking-[0.08em] text-[#131517]">
                        {row.domain}
                      </span>
                      <button
                        type="button"
                        onClick={() => openMasterInspector(row)}
                        className="min-w-0 cursor-pointer break-words bg-transparent px-0 py-0 text-left font-code text-[14px] font-normal leading-snug text-[#131517] underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:ring-1 focus-visible:ring-[#06B6D4]"
                      >
                        {noEmDash(row.asset)}
                      </button>
                      <span className="font-code text-[14px] font-normal tabular-nums leading-snug text-slate-800">
                        {row.adjust}
                      </span>
                      <span className="min-w-0 font-code text-[14px] font-semibold uppercase tracking-[0.06em] text-slate-700">
                        {row.verification}
                      </span>
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
