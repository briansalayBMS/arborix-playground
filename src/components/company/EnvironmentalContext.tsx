"use client";

import { useCallback, useState } from "react";
import { SealedArtifactsPanel } from "@/components/ingest/SealedArtifactsPanel";
import { cn } from "@/lib/cn";

const LEDGER_ROWS = [
  {
    domain: "Mission",
    value: "Ship trusted product decisions at executive velocity.",
    audit: "Verified",
    unverified: false,
  },
  {
    domain: "Values",
    value: "Transparency in tradeoffs; no silent scope expansion.",
    audit: "Unverified",
    unverified: true,
  },
  {
    domain: "Operating norm",
    value: "Consensus before commit on cross-functional launches.",
    audit: "Unverified",
    unverified: true,
  },
  {
    domain: "Risk posture",
    value: "Finance-grade instrumentation on revenue claims.",
    audit: "Verified",
    unverified: false,
  },
] as const;

export function EnvironmentalContext() {
  const [mounted, setMounted] = useState(false);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setMounted(true);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-16">
      <header className="space-y-3">
        <h1 className="font-ui m-0 text-[32px] font-bold leading-tight tracking-tight text-[var(--color-arborix-text)]">
          Environmental Context
        </h1>
        <p className="font-ui m-0 max-w-3xl text-base font-normal leading-relaxed text-[var(--color-arborix-meta)]">
          The operating environment. Mounting the organizational mission, values, and cultural
          friction points.
        </p>
      </header>

      <SealedArtifactsPanel domain="COMPANY" />

      <section className="space-y-4">
        <h2 className="font-ui m-0 text-sm font-bold tracking-tight text-[var(--color-arborix-text)]">
          Environmental ledger
        </h2>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b-[0.5px] border-slate-400">
                <th
                  scope="col"
                  className="font-code py-4 pr-4 text-[12px] font-bold uppercase tracking-widest text-[var(--color-arborix-meta)]"
                >
                  Domain
                </th>
                <th
                  scope="col"
                  className="font-code py-4 pr-4 text-[12px] font-bold uppercase tracking-widest text-[var(--color-arborix-meta)]"
                >
                  Value / principle
                </th>
                <th
                  scope="col"
                  className="font-code py-4 text-[12px] font-bold uppercase tracking-widest text-[var(--color-arborix-meta)]"
                >
                  Audit status
                </th>
              </tr>
            </thead>
            <tbody>
              {LEDGER_ROWS.map((row) => (
                <tr
                  key={row.domain}
                  className="border-b-[0.5px] border-slate-400"
                >
                  <td className="py-4 pr-4 align-top text-sm font-bold text-[var(--color-arborix-text)]">
                    {row.domain}
                  </td>
                  <td className="py-4 pr-4 align-top text-sm font-normal text-[var(--color-arborix-text)]">
                    {row.value}
                  </td>
                  <td className="py-4 align-top">
                    <div className="flex items-center gap-2">
                      {row.unverified ? (
                        <span
                          className="h-2 w-2 shrink-0 rounded-full bg-[#06B6D4]"
                          title="Unverified"
                          aria-label="Unverified"
                        />
                      ) : (
                        <span className="h-2 w-2 shrink-0" aria-hidden />
                      )}
                      <span className="font-code text-[12px] font-normal text-[var(--color-arborix-meta)]">
                        {row.audit}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <p className="m-0 font-code text-[12px] font-normal uppercase tracking-[0.2em] text-[var(--color-arborix-meta)]">
          [ mount company values ]
        </p>
        <label
          htmlFor="company-values-mount"
          onDrop={onDrop}
          onDragOver={onDragOver}
          className={cn(
            "flex min-h-[120px] cursor-pointer flex-col justify-center border-[0.5px] border-dashed border-slate-400 bg-white px-4 py-6",
            "transition-colors hover:border-[var(--color-arborix-accent)]/50",
          )}
        >
          <input
            id="company-values-mount"
            type="file"
            accept=".pdf,.txt,application/pdf,text/plain"
            className="sr-only"
            onChange={() => setMounted(true)}
          />
          <span className="text-center text-sm font-normal text-[var(--color-arborix-meta)]">
            Drop PDF or text — or click to select
          </span>
        </label>
        <p className="m-0 font-code text-[12px] font-normal uppercase tracking-[0.14em] text-[var(--color-arborix-meta)]">
          {mounted ? (
            <>[ STATUS: FILE STAGED — ANALYSIS QUEUED ]</>
          ) : (
            <>
              [ STATUS: ANALYSIS PENDING. MOUNT VALUES TO COMPARE AGAINST PERSONALITY RADAR. ]
            </>
          )}
        </p>
      </section>
    </div>
  );
}
