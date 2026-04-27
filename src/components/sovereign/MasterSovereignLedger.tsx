"use client";

import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { useRightRailDrawer } from "@/context/RightRailDrawerContext";
import { buildMasterInspectorAnalysis, MASTER_LEDGER_MOCK } from "@/lib/masterSovereignLedger";

function noEmDash(s: string): string {
  return s.replace(/—/g, "-");
}

export type MasterSovereignLedgerProps = {
  className?: string;
};

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
        "w-full border-t-[0.5px] border-[var(--color-border)] bg-[var(--color-bg)] text-left",
        className,
      )}
    >
      <div className="w-full px-4 py-8 sm:px-5">
        <div className="overflow-hidden border-[0.5px] border-[var(--color-border)] bg-[var(--color-bg)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]">
          <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b-[0.5px] border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 sm:px-5">
            <p className="label-card m-0 text-[var(--color-primary)]">
              00 MASTER SOVEREIGN LEDGER
            </p>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="label-card ml-auto shrink-0 rounded-none border-0 bg-transparent px-0 py-1 text-[var(--color-primary)] outline-none transition-opacity hover:opacity-80 focus-visible:ring-1 focus-visible:ring-[var(--color-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] motion-reduce:transition-none"
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
              <div className="border-b-[0.5px] border-[var(--color-border)] px-4 py-3 sm:px-5">
                <p className="label-card m-0 text-[var(--color-primary)]">Master registry</p>
              </div>

              <div className="w-full overflow-x-auto px-0 pb-6 pt-0">
                <div
                  className="min-w-[min(100%,880px)] border-collapse text-left"
                  role="table"
                  aria-label="Master sovereign ledger"
                >
                  <div
                    role="row"
                    className="grid grid-cols-[minmax(6.5rem,1fr)_minmax(5rem,0.75fr)_minmax(11rem,1.5fr)_minmax(7rem,1fr)_minmax(7.5rem,1fr)] items-end gap-4 border-b-[0.5px] border-[var(--color-border)] px-4 py-3 sm:px-5"
                  >
                    {["Record", "Domain", "Asset", "Adjust", "Verification"].map((h) => (
                      <span
                        key={h}
                        role="columnheader"
                        className="inter-sm text-[var(--color-secondary)]"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {rows.map((row) => {
                    const rowSelected = selectedKey === masterSelectionKey(row.recordId);
                    return (
                      <div
                        key={row.recordId}
                        role="row"
                        className={cn(
                          "grid grid-cols-[minmax(6.5rem,1fr)_minmax(5rem,0.75fr)_minmax(11rem,1.5fr)_minmax(7rem,1fr)_minmax(7.5rem,1fr)] items-start gap-4 border-b-[0.5px] border-[var(--color-border)] px-4 py-3 sm:px-5 last:border-b-0",
                          rowSelected && "bg-[rgba(0,113,227,0.06)]/35",
                        )}
                      >
                        <span className="font-code text-[14px] font-normal tabular-nums leading-snug text-[var(--color-primary)]">
                          {row.recordId}
                        </span>
                        <span className="font-code text-[14px] font-semibold uppercase leading-snug tracking-[0.08em] text-[var(--color-primary)]">
                          {row.domain}
                        </span>
                        <button
                          type="button"
                          onClick={() => openMasterInspector(row)}
                          className="min-w-0 cursor-pointer break-words bg-transparent px-0 py-0 text-left font-code text-[14px] font-normal leading-snug text-[var(--color-primary)] underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]"
                        >
                          {noEmDash(row.asset)}
                        </button>
                        <span className="font-code text-[14px] font-normal tabular-nums leading-snug text-[var(--color-primary)]">
                          {row.adjust}
                        </span>
                        <span className="min-w-0 font-code text-[14px] font-semibold uppercase tracking-[0.06em] text-[var(--color-secondary)]">
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
