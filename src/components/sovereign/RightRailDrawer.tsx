"use client";

import { useEffect, useMemo, useState } from "react";
import { auditorAnalysisForFocusedSource } from "@/lib/sovereignLedgerDomain";
import { cn } from "@/lib/cn";
import { useRightRailDrawer } from "@/context/RightRailDrawerContext";

function noEmDash(s: string): string {
  return s.replace(/\u2014/g, "-");
}

export function RightRailDrawer() {
  const { isOpen, payload, close } = useRightRailDrawer();
  const [slideIn, setSlideIn] = useState(false);
  const [focusedSourceId, setFocusedSourceId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !payload) return;
    setSlideIn(false);
    setFocusedSourceId(null);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setSlideIn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen, payload]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const displayAnalysis = useMemo(() => {
    if (!payload) return "";
    return noEmDash(
      auditorAnalysisForFocusedSource(
        payload.forensicVerdict,
        payload.sources,
        focusedSourceId,
      ),
    );
  }, [payload, focusedSourceId]);

  if (!isOpen || !payload) return null;

  return (
    <div className="fixed inset-0 z-[60]" aria-modal role="dialog" aria-labelledby="asset-inspector-title">
      <button
        type="button"
        aria-label="Close asset inspector shade"
        className="absolute inset-0 bg-slate-900/15"
        onClick={close}
      />

      <div
        role="document"
        className={cn(
          "fixed top-0 right-0 z-[70] flex h-screen w-[400px] flex-col border-l border-[#E2E8F0] bg-white",
          "transition-transform duration-300 ease-out motion-reduce:transition-none",
          slideIn ? "translate-x-0" : "translate-x-full",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-1 p-6 text-left">
          <p
            id="asset-inspector-title"
            className="m-0 min-w-0 flex-1 pr-2 font-code text-[12px] font-semibold uppercase leading-snug tracking-[0.1em] text-[#131517]"
          >
            ASSET INSPECTOR [ID: {payload.recordId}]
          </p>
          <button
            type="button"
            onClick={close}
            className="ml-auto shrink-0 rounded-none border-0 bg-transparent p-0 font-code text-[12px] font-semibold uppercase tracking-[0.08em] text-[#131517] outline-none hover:opacity-80 focus-visible:ring-1 focus-visible:ring-[#06B6D4]"
          >
            [ CLOSE ]
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto">
          <div className="bg-gray-50 p-6 text-left">
            <dl className="m-0 flex flex-col gap-1">
              <div>
                <dt className="m-0 font-code text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">
                  Source
                </dt>
                <dd className="m-0 mt-1 break-all font-code text-[13px] font-normal leading-snug text-[#131517]">
                  {payload.sourcePath}
                </dd>
              </div>
              <div>
                <dt className="m-0 font-code text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">
                  Type
                </dt>
                <dd className="m-0 mt-1 font-code text-[13px] font-normal leading-snug text-[#131517]">
                  {payload.fileType}
                </dd>
              </div>
              <div>
                <dt className="m-0 font-code text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">
                  Timestamp
                </dt>
                <dd className="m-0 mt-1 font-code text-[13px] font-normal tabular-nums leading-snug text-[#131517]">
                  {payload.timestamp}
                </dd>
              </div>
            </dl>
          </div>

          <div className="p-6 text-left">
            <p className="m-0 font-code text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
              AUDITOR&apos;S ANALYSIS
            </p>
            <p className="m-0 mt-1 font-code text-[13px] font-normal leading-[1.5] text-[#131517]">
              {displayAnalysis}
            </p>
          </div>

          <div className="border-t border-[#E2E8F0] p-6 text-left">
            <p className="m-0 font-code text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
              SOURCES OF TRUTH
            </p>
            <ul className="m-0 mt-1 list-none space-y-1 p-0">
              {payload.sources.map((s) => {
                const page = s.pageHint ? ` (${s.pageHint})` : "";
                const line = `- [${s.tag}] ${s.label}${page}`;
                const active = focusedSourceId === s.id;
                return (
                  <li key={s.id} className="m-0 p-0">
                    <button
                      type="button"
                      onClick={() =>
                        setFocusedSourceId((prev) => (prev === s.id ? null : s.id))
                      }
                      className={cn(
                        "w-full cursor-pointer border-0 bg-transparent p-0 text-left font-code text-[13px] font-normal leading-snug text-[#131517]",
                        "underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#06B6D4]",
                        active && "bg-[#E0F5FF]/60 text-[#131517] ring-1 ring-inset ring-[#06B6D4]/40",
                      )}
                    >
                      {noEmDash(line)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <footer className="shrink-0 border-t border-[#E2E8F0] bg-white p-6">
          <div className="flex flex-col gap-1">
            <a
              href="#"
              className={cn(
                "flex min-h-[44px] w-full items-center justify-center rounded-none border border-[#131517] bg-white",
                "font-ui text-[14px] font-semibold leading-tight text-[#131517]",
                "outline-none transition-colors hover:bg-[#F8FAFC] focus-visible:ring-1 focus-visible:ring-[#06B6D4]",
              )}
              onClick={(e) => e.preventDefault()}
            >
              [ DOWNLOAD ORIGINAL ]
            </a>
            <a
              href="#"
              className={cn(
                "flex min-h-[44px] w-full items-center justify-center rounded-none border border-[#06B6D4]/25 bg-[#E0F5FF]",
                "font-ui text-[14px] font-semibold leading-tight text-[#131517]",
                "outline-none transition-colors hover:bg-[#C0E8FF] focus-visible:ring-1 focus-visible:ring-[#06B6D4]",
              )}
              onClick={(e) => e.preventDefault()}
            >
              [ VIEW FULL TRANSCRIPT ]
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
