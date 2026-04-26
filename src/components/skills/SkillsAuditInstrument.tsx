"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDiagnosticFocus } from "@/context/DiagnosticFocusContext";
import { cn } from "@/lib/cn";
import { SKILL_DIAGNOSTIC_AXIS } from "@/lib/diagnosticSkillAxis";

const BENCHMARKS = [
  { id: "pde-l8", line: "Product Design Executive · L8" },
  { id: "pde-l7", line: "Product Design Executive · L7" },
] as const;

/** L8 Arborix standard position on the 1–10 precision scale (benchmark hairline). */
const SKILLS = [
  { id: "strategic", label: "Strategic Framing", benchmark: 8.2 },
  { id: "system", label: "System Design", benchmark: 8.0 },
  { id: "coalition", label: "Stakeholder Coalition", benchmark: 7.8 },
  { id: "commercial", label: "Commercial Impact", benchmark: 7.6 },
  { id: "exec_comms", label: "Executive Communication", benchmark: 8.1 },
  { id: "governance", label: "Delivery Governance", benchmark: 7.9 },
  { id: "talent", label: "Talent & Org Design", benchmark: 7.7 },
] as const;

function ratingBelowBenchmark(
  rating: number | null | undefined,
  benchmark: number,
): boolean {
  if (rating === null || rating === undefined) return false;
  return rating < benchmark;
}

function clampRating(n: number): number {
  const v = Math.round(n * 10) / 10;
  return Math.min(10, Math.max(1, v));
}

function pctForValue(v: number): string {
  return `${((v - 1) / 9) * 100}%`;
}

export function SkillsAuditInstrument() {
  const [benchmarkIdx, setBenchmarkIdx] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const s of SKILLS) {
      initial[s.id] = clampRating(s.benchmark - 0.4 + (s.id.length % 3) * 0.15);
    }
    return initial;
  });
  const [forensicUrl, setForensicUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { effectiveDiagnosticAxis } = useDiagnosticFocus();

  const benchmark = BENCHMARKS[benchmarkIdx];

  const gapCount = useMemo(() => {
    return SKILLS.filter((s) => ratingBelowBenchmark(ratings[s.id], s.benchmark)).length;
  }, [ratings]);

  const hasBelowBenchmarkRow = useMemo(
    () => SKILLS.some((s) => ratingBelowBenchmark(ratings[s.id], s.benchmark)),
    [ratings],
  );

  const copyKey = useCallback(async () => {
    if (!forensicUrl) return;
    try {
      await navigator.clipboard.writeText(forensicUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [forensicUrl]);

  return (
    <div className="max-w-3xl space-y-14">
      <header className="space-y-3">
        <h1 className="font-ui m-0 text-[32px] font-bold leading-tight tracking-tight text-[var(--color-arborix-text)]">
          Skills Audit
        </h1>
        <p className="m-0 max-w-2xl text-base font-normal leading-relaxed text-slate-600">
          A technical mapping of capabilities against the Arborix Standard. Benchmarked for L8
          Design Leadership.
        </p>
      </header>

      <section className="space-y-3 border-b border-[var(--color-arborix-line)] pb-10">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-base font-normal text-slate-600">Current benchmark:</span>
          <span className="text-base font-bold text-[var(--color-arborix-text)]">{benchmark.line}</span>
          <button
            type="button"
            onClick={() => setPickerOpen((o) => !o)}
            className="text-sm font-normal text-[#06B6D4] underline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#06B6D4]/40"
          >
            Change
          </button>
        </div>
        <AnimatePresence initial={false}>
          {pickerOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <ul className="m-0 mt-4 list-none space-y-2 p-0">
                {BENCHMARKS.map((b, i) => (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setBenchmarkIdx(i);
                        setPickerOpen(false);
                      }}
                      className={cn(
                        "w-full cursor-pointer border-0 bg-transparent p-0 text-left text-sm font-normal transition-colors",
                        i === benchmarkIdx ? "text-slate-800" : "text-slate-500 hover:text-slate-700",
                      )}
                    >
                      {b.line}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <section className="space-y-12">
          {SKILLS.map((skill) => {
            const rating = ratings[skill.id];
            const diagnostic = effectiveDiagnosticAxis;
            let rowDimmed = false;
            if (diagnostic) {
              rowDimmed = SKILL_DIAGNOSTIC_AXIS[skill.id] !== diagnostic;
            } else if (hasBelowBenchmarkRow) {
              rowDimmed = !ratingBelowBenchmark(rating, skill.benchmark);
            }
            const cyanLead =
              (diagnostic && SKILL_DIAGNOSTIC_AXIS[skill.id] === diagnostic && !rowDimmed) ||
              (!diagnostic && ratingBelowBenchmark(rating, skill.benchmark) && !rowDimmed);

            return (
              <PrecisionRow
                key={skill.id}
                skill={skill}
                rating={rating}
                rowDimmed={rowDimmed}
                cyanDiagnosticLead={cyanLead}
                onRating={(v) => setRatings((prev) => ({ ...prev, [skill.id]: v }))}
              />
            );
          })}
      </section>

      <section className="space-y-5 border-t border-[var(--color-arborix-line)] pt-12">
        <p className="m-0 font-code text-[12px] font-normal uppercase tracking-[0.2em] text-slate-500">
          [ ISSUANCE : VERIFICATION KEY ]
        </p>
        <p className="m-0 max-w-2xl text-sm font-normal leading-relaxed text-slate-800">
          Arborix records are self-reported until verified by 3 peers. Generate a secure, anonymous
          link to seal this record.
        </p>
        {gapCount > 0 ? (
          <p className="m-0 text-sm font-normal text-slate-500">
            <span className="font-bold text-slate-800">
              {gapCount} benchmark gap{gapCount === 1 ? "" : "s"}
            </span>{" "}
            — peer verification recommended before seal.
          </p>
        ) : null}

        {forensicUrl ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <pre className="m-0 min-h-[3rem] min-w-0 flex-1 overflow-x-auto border-[0.5px] border-[var(--color-arborix-line)] bg-slate-50/80 px-3 py-3 font-code text-sm leading-relaxed text-slate-800">
                <code>{forensicUrl}</code>
              </pre>
              <button
                type="button"
                onClick={copyKey}
                className="h-auto shrink-0 border-[0.5px] border-[var(--color-arborix-line)] bg-white px-4 py-3 text-sm font-normal text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#06B6D4]/40 sm:self-auto"
              >
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
            <p className="m-0 font-code text-[12px] font-normal uppercase tracking-[0.14em] text-slate-500">
              [ status: awaiting 3 testimonies ]
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              const id = crypto.randomUUID?.() ?? `arx-${Date.now()}`;
              setForensicUrl(`https://arborix.app/verify/${id.slice(0, 8)}`);
            }}
            className="inline-flex w-full max-w-md items-center justify-center border-[0.5px] border-slate-600 bg-slate-800 px-5 py-3 font-code text-[12px] font-normal uppercase tracking-[0.18em] text-white transition-colors hover:bg-slate-800/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#06B6D4]/45 sm:w-auto"
          >
            Generate forensic link
          </button>
        )}
      </section>
    </div>
  );
}

function PrecisionRow({
  skill,
  rating,
  rowDimmed,
  cyanDiagnosticLead,
  onRating,
}: {
  skill: (typeof SKILLS)[number];
  rating: number;
  rowDimmed: boolean;
  cyanDiagnosticLead: boolean;
  onRating: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const t = Math.min(1, Math.max(0, x / rect.width));
      onRating(clampRating(1 + t * 9));
    },
    [onRating],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    trackRef.current?.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (trackRef.current?.hasPointerCapture(e.pointerId)) {
      trackRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const dataPoint = `${skill.label}: ${rating.toFixed(1)}`;

  return (
    <div
      className={cn(
        "space-y-3 transition-opacity duration-300",
        rowDimmed && "opacity-[0.45]",
        cyanDiagnosticLead && !rowDimmed && "opacity-100",
      )}
    >
      <p className="m-0 text-sm font-normal text-slate-800">
        <span
          className={cn(
            "font-bold",
            cyanDiagnosticLead && !rowDimmed ? "text-[#06B6D4]" : "text-slate-800",
          )}
        >
          {dataPoint}
        </span>
      </p>

      <div className="relative">
        <div
          ref={trackRef}
          role="slider"
          aria-valuemin={1}
          aria-valuemax={10}
          aria-valuenow={rating}
          aria-label={`${skill.label} precision scale`}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              onRating(clampRating(rating - 0.1));
            }
            if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              onRating(clampRating(rating + 0.1));
            }
          }}
          className="relative h-10 w-full cursor-pointer touch-none outline-none focus-visible:ring-1 focus-visible:ring-[#06B6D4]/40"
        >
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-slate-200" />

          <div
            className="pointer-events-none absolute top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 bg-slate-400"
            style={{
              left: pctForValue(skill.benchmark),
              width: "0.5px",
              height: "1.5rem",
            }}
            aria-hidden
          />

          <span
            className="pointer-events-none absolute top-1/2 z-[2] block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#06B6D4] shadow-[0_0_0_1px_rgba(6,182,212,0.25)]"
            style={{ left: pctForValue(rating) }}
            aria-hidden
          />

          <div
            className="pointer-events-none absolute left-0 right-0 top-full flex justify-between pt-1 font-code text-[10px] font-normal tabular-nums text-slate-500"
            aria-hidden
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
