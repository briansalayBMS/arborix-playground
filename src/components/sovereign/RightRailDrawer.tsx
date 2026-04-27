"use client";

import { useEffect, useMemo, useState } from "react";
import { auditorAnalysisForFocusedSource } from "@/lib/sovereignLedgerDomain";
import { cn } from "@/lib/cn";
import { useRightRailDrawer } from "@/context/RightRailDrawerContext";

function noEmDash(s: string): string {
  return s.replace(/—/g, "-");
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
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const displayAnalysis = useMemo(() => {
    if (!payload) return "";
    return noEmDash(
      auditorAnalysisForFocusedSource(payload.forensicVerdict, payload.sources, focusedSourceId),
    );
  }, [payload, focusedSourceId]);

  if (!isOpen || !payload) return null;

  return (
    <div className="fixed inset-0 z-[60]" aria-modal role="dialog" aria-labelledby="asset-inspector-title">
      <button
        type="button"
        aria-label="Close asset inspector shade"
        className="absolute inset-0 bg-[rgba(0,0,0,0.15)]"
        onClick={close}
      />

      <div
        role="document"
        className={cn(
          "fixed top-0 right-0 z-[70] flex h-screen w-[400px] flex-col border-l border-[var(--color-border)] bg-[var(--color-card)]",
          "transition-transform duration-300 ease-out motion-reduce:transition-none",
          slideIn ? "translate-x-0" : "translate-x-full",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-1 p-6 text-left">
          <p
            id="asset-inspector-title"
            className="label-card m-0 min-w-0 flex-1 pr-2 text-[var(--color-primary)]"
          >
            ASSET INSPECTOR [ID: {payload.recordId}]
          </p>
          <button
            type="button"
            onClick={close}
            className="label-card ml-auto shrink-0 rounded-none border-0 bg-transparent p-0 text-[var(--color-primary)] outline-none hover:opacity-80 focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]"
          >
            [ CLOSE ]
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto">
          <div className="bg-[var(--color-bg)] p-6 text-left">
            <dl className="m-0 flex flex-col gap-1">
              {[
                { key: "Source", value: payload.sourcePath },
                { key: "Type", value: payload.fileType },
                { key: "Timestamp", value: payload.timestamp },
              ].map(({ key, value }) => (
                <div key={key}>
                  <dt className="inter-sm m-0">{key}</dt>
                  <dd className="m-0 mt-1 break-all font-code text-[13px] font-normal leading-snug text-[var(--color-primary)]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="p-6 text-left">
            <p className="inter-sm m-0">AUDITOR&apos;S ANALYSIS</p>
            <p className="text-description m-0 mt-2">{displayAnalysis}</p>
          </div>

          <div className="border-t border-[var(--color-border)] p-6 text-left">
            <p className="inter-sm m-0">SOURCES OF TRUTH</p>
            <ul className="m-0 mt-2 list-none space-y-1 p-0">
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
                        "w-full cursor-pointer border-0 bg-transparent p-0 text-left font-code text-[13px] font-normal leading-snug text-[var(--color-primary)]",
                        "underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]",
                        active && "bg-[rgba(0,113,227,0.06)]/60 text-[var(--color-primary)] ring-1 ring-inset ring-[var(--color-blue)]/40",
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

        <footer className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <div className="flex flex-col gap-1">
            <a
              href="#"
              className={cn(
                "flex min-h-[44px] w-full items-center justify-center rounded-none border border-[var(--color-primary)] bg-[var(--color-card)]",
                "text-[14px] font-semibold leading-tight text-[var(--color-primary)]",
                "outline-none transition-colors hover:bg-[var(--color-bg)] focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]",
              )}
              style={{ fontFamily: "var(--font-sans)" }}
              onClick={(e) => e.preventDefault()}
            >
              [ DOWNLOAD ORIGINAL ]
            </a>
            <a
              href="#"
              className={cn(
                "flex min-h-[44px] w-full items-center justify-center rounded-none border border-[var(--color-blue)]/25 bg-[rgba(0,113,227,0.06)]",
                "text-[14px] font-semibold leading-tight text-[var(--color-primary)]",
                "outline-none transition-colors hover:bg-[rgba(0,113,227,0.04)] focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]",
              )}
              style={{ fontFamily: "var(--font-sans)" }}
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
