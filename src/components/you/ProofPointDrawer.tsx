"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { buildRecalibratedVerdict } from "@/lib/verdictRecalibration";
import { mergeRedactionRanges, type RedactionRange } from "@/lib/proofRedaction";
import { cn } from "@/lib/cn";
import { RedactableSourceText } from "@/components/you/RedactableSourceText";
import type { LedgerAssetDetail } from "./sovereignLedgerData";

type Props = {
  open: boolean;
  onClose: () => void;
  asset: LedgerAssetDetail | null;
};

type ProofSourceType = "link" | "file" | "testimony" | "text";

type ProofSource = {
  id: string;
  type: ProofSourceType;
  value: string;
  redactions?: RedactionRange[];
};

type ProofPointState = {
  sources: ProofSource[];
  draftTestimony: string;
};

function ForensicBody({ text }: { text: string }) {
  const parts = text.split(/(\*\*.+?\*\*)/g);
  return (
    <p className="m-0 text-sm font-normal leading-relaxed text-[var(--color-primary)]">
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          const inner = part.slice(2, -2);
          return (
            <strong key={i} className="font-bold text-[var(--color-primary)]">
              {inner}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

function nextSourceId(): string {
  return `src-${Math.random().toString(36).slice(2, 9)}`;
}

function sourceTypeLabel(type: ProofSourceType): string {
  if (type === "link") return "[ LINK ]";
  if (type === "file") return "[ FILE ]";
  if (type === "testimony") return "[ TESTIMONY ]";
  return "[ TEXT ]";
}

function sourceSupportsRedaction(source: ProofSource): boolean {
  return source.type === "testimony" || source.type === "text";
}

function buildInitialSources(asset: LedgerAssetDetail): ProofSource[] {
  if (asset.mount.kind === "url") {
    return [{ id: `mount-${asset.artifactId}`, type: "link", value: asset.mount.href }];
  }
  return [{ id: `mount-${asset.artifactId}`, type: "text", value: asset.mount.excerpt, redactions: [] }];
}

export function ProofPointDrawer({ open, onClose, asset }: Props) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const verdictId = useId();
  const testimonyDraftId = useId();
  const evidenceUrlId = useId();
  const fileInputId = useId();
  const reduce = !!reduceMotion;

  const [proofPoint, setProofPoint] = useState<ProofPointState>({
    sources: [],
    draftTestimony: "",
  });
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [verdictPhase, setVerdictPhase] = useState<"idle" | "reanalyzing">("idle");
  const reanalyzeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lowResolution = proofPoint.sources.length <= 1;

  const hasSharpenedStack = proofPoint.sources.length > 1;

  const hasSovereignRedaction = proofPoint.sources.some(
    (s) => Array.isArray(s.redactions) && s.redactions.length > 0,
  );

  const displayVerdict = useMemo(() => {
    if (!asset) return "";
    return buildRecalibratedVerdict(asset, hasSharpenedStack, hasSovereignRedaction);
  }, [asset, hasSharpenedStack, hasSovereignRedaction]);

  const triggerReanalyze = useCallback(() => {
    if (reanalyzeTimer.current) clearTimeout(reanalyzeTimer.current);
    setVerdictPhase("reanalyzing");
    reanalyzeTimer.current = setTimeout(() => {
      setVerdictPhase("idle");
      reanalyzeTimer.current = null;
    }, reduce ? 0 : 1400);
  }, [reduce]);

  useEffect(() => {
    if (!asset) {
      setProofPoint({ sources: [], draftTestimony: "" });
      setEvidenceUrl("");
      return;
    }
    const initialSources = buildInitialSources(asset);
    try {
      const raw = sessionStorage.getItem(`arborix:proof-${asset.artifactId}`);
      if (raw) {
        const p = JSON.parse(raw) as {
          sources?: ProofSource[];
          proofPoint?: ProofPointState;
          testimony?: string;
          evidence?: Array<{ id: string; kind: "url"; href: string } | { id: string; kind: "file"; name: string }>;
          testimonyBlocks?: Array<{ id: string; text: string; redactions: RedactionRange[] }>;
          mountRedactions?: RedactionRange[];
          draftTestimony?: string;
        };
        if (p.proofPoint && Array.isArray(p.proofPoint.sources)) {
          setProofPoint({
            sources: p.proofPoint.sources,
            draftTestimony: typeof p.proofPoint.draftTestimony === "string" ? p.proofPoint.draftTestimony : "",
          });
        } else if (Array.isArray(p.sources)) {
          setProofPoint({
            sources: p.sources,
            draftTestimony: typeof p.draftTestimony === "string" ? p.draftTestimony : "",
          });
        } else {
          const mountRedactions = Array.isArray(p.mountRedactions) ? p.mountRedactions : [];
          const mountSource = initialSources[0];
          const migratedMount: ProofSource =
            mountSource.type === "text"
              ? { ...mountSource, redactions: mountRedactions }
              : mountSource;
          const migratedEvidence: ProofSource[] = Array.isArray(p.evidence)
            ? p.evidence.map((e) =>
                e.kind === "url"
                  ? { id: e.id || nextSourceId(), type: "link" as const, value: e.href }
                  : { id: e.id || nextSourceId(), type: "file" as const, value: e.name },
              )
            : [];
          const migratedBlocks: ProofSource[] = Array.isArray(p.testimonyBlocks)
            ? p.testimonyBlocks
                .filter((b) => typeof b.text === "string")
                .map((b) => ({
                  id: b.id || nextSourceId(),
                  type: "testimony" as const,
                  value: b.text,
                  redactions: Array.isArray(b.redactions) ? b.redactions : [],
                }))
            : typeof p.testimony === "string" && p.testimony.trim()
              ? [{ id: nextSourceId(), type: "testimony", value: p.testimony, redactions: [] }]
              : [];
          setProofPoint({
            sources: [migratedMount, ...migratedEvidence, ...migratedBlocks],
            draftTestimony: typeof p.draftTestimony === "string" ? p.draftTestimony : "",
          });
        }
      } else {
        setProofPoint({ sources: initialSources, draftTestimony: "" });
      }
    } catch {
      setProofPoint({ sources: initialSources, draftTestimony: "" });
    }
    setEvidenceUrl("");
  }, [asset]);

  useEffect(() => {
    if (!asset) return;
    try {
      sessionStorage.setItem(
        `arborix:proof-${asset.artifactId}`,
        JSON.stringify({
          proofPoint,
          sources: proofPoint.sources,
          draftTestimony: proofPoint.draftTestimony,
        }),
      );
    } catch {
      /* ignore */
    }
  }, [asset, proofPoint]);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onKey]);

  const addEvidenceUrl = useCallback(() => {
    const v = evidenceUrl.trim();
    if (!v) return;
    let href = v;
    if (!/^https?:\/\//i.test(href)) href = `https://${href}`;
    setProofPoint((prev) => ({
      ...prev,
      sources: [...prev.sources, { id: nextSourceId(), type: "link", value: href }],
    }));
    setEvidenceUrl("");
    triggerReanalyze();
  }, [evidenceUrl, triggerReanalyze]);

  const onEvidenceFile = useCallback(
    (files: FileList | null) => {
      const f = files?.[0];
      if (!f) return;
      setProofPoint((prev) => ({
        ...prev,
        sources: [...prev.sources, { id: nextSourceId(), type: "file", value: f.name }],
      }));
      triggerReanalyze();
    },
    [triggerReanalyze],
  );

  const addTestimonyToStack = useCallback(() => {
    const t = proofPoint.draftTestimony.trim();
    if (!t) return;
    setProofPoint((prev) => ({
      ...prev,
      sources: [
        ...prev.sources,
        { id: nextSourceId(), type: "testimony", value: t, redactions: [] },
      ],
      draftTestimony: "",
    }));
    triggerReanalyze();
  }, [proofPoint.draftTestimony, triggerReanalyze]);

  const updateSourceRedactions = useCallback(
    (sourceId: string, range: RedactionRange) => {
      setProofPoint((prev) => ({
        ...prev,
        sources: prev.sources.map((source) =>
          source.id === sourceId
            ? {
                ...source,
                redactions: mergeRedactionRanges(source.redactions ?? [], range),
              }
            : source,
        ),
      }));
      triggerReanalyze();
    },
    [triggerReanalyze],
  );

  return (
    <AnimatePresence mode="wait">
      {open && asset ? (
        <>
          <motion.button
            type="button"
            key="backdrop"
            aria-hidden
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            className="fixed inset-0 z-[60] bg-[var(--color-primary)]/6"
            onClick={onClose}
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ x: reduce ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: reduce ? 0 : "100%" }}
            transition={{ type: "tween", duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed inset-y-0 right-0 z-[70] flex w-full max-w-[min(28rem,100vw)] flex-col",
              "border-l-[0.5px] border-[var(--color-secondary)] bg-white shadow-none",
            )}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 p-8 pb-4">
              <h2
                id={titleId}
                className="font-ui m-0 max-w-[calc(100%-2.5rem)] text-[32px] font-bold leading-tight tracking-tight text-[var(--color-primary)]"
              >
                {asset.title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 border-0 bg-transparent p-1 text-[var(--color-secondary)] outline-none transition-colors hover:text-[var(--color-primary)] focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]"
                aria-label="Close proof point"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-8">
              <div
                className={cn(
                  "border-b-[0.5px] border-[var(--color-secondary)] pb-8",
                  verdictPhase === "reanalyzing" && "verdict-shimmer-overlay",
                )}
              >
                <h3
                  id={verdictId}
                  className="font-ui m-0 text-base font-bold leading-snug text-[var(--color-primary)]"
                >
                  Forensic Analysis
                </h3>
                <div className="relative z-10 mt-4 min-h-[4.5rem]">
                  {verdictPhase === "reanalyzing" ? (
                    <p className="m-0 font-code text-sm font-normal text-[var(--color-secondary)]">
                      Re-analyzing…
                    </p>
                  ) : (
                    <ForensicBody text={displayVerdict} />
                  )}
                </div>
              </div>

              <dl className="m-0 mt-8 grid grid-cols-1 gap-2 border-b-[0.5px] border-[var(--color-secondary)] pb-8 font-code text-[12px] font-normal uppercase tracking-[0.12em] text-[var(--color-secondary)]">
                <div className="m-0 flex flex-wrap gap-x-4 gap-y-1">
                  <dt className="m-0 inline font-normal">ARTIFACT ID</dt>
                  <dd className="m-0 inline normal-case tracking-normal text-[var(--color-primary)]">
                    {asset.artifactId}
                  </dd>
                </div>
                <div className="m-0 flex flex-wrap gap-x-4 gap-y-1">
                  <dt className="m-0 inline font-normal">SEAL DATE</dt>
                  <dd className="m-0 inline normal-case tracking-normal text-[var(--color-primary)]">
                    {asset.sealDate}
                  </dd>
                </div>
                <div className="m-0 flex flex-wrap gap-x-4 gap-y-1">
                  <dt className="m-0 inline font-normal">DOMAIN</dt>
                  <dd className="m-0 inline normal-case tracking-normal text-[var(--color-primary)]">
                    {asset.domain}
                  </dd>
                </div>
              </dl>

              {lowResolution ? (
                <p className="m-0 mt-8 font-code text-[12px] font-normal uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                  [ STATUS : LOW RESOLUTION RECORD ]
                </p>
              ) : null}

              <div className="mt-8 border-b-[0.5px] border-[var(--color-secondary)] pb-8">
                <p className="m-0 font-code text-[12px] font-normal uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                  [ EVIDENTIARY STACK ]
                </p>
                <ul className="m-0 mt-4 list-none p-0">
                  {proofPoint.sources.map((source) => (
                    <li key={source.id} className="mb-2">
                      <p className="m-0 font-code text-[12px] font-normal uppercase tracking-[0.12em] text-[var(--color-secondary)]">
                        {sourceTypeLabel(source.type)}
                      </p>
                      <p className="mt-1 m-0 font-code text-[12px] font-normal uppercase tracking-[0.12em] text-[var(--color-secondary)]">
                        SOURCE
                      </p>
                      <div className="mt-1 border-[0.5px] border-[var(--color-secondary)] bg-[var(--color-bg)] p-4">
                        {source.type === "link" ? (
                          <a
                            href={source.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-all font-code text-sm font-normal text-[var(--color-primary)] outline-none underline-offset-2 hover:underline focus-visible:ring-1 focus-visible:ring-[var(--color-blue)]"
                          >
                            {source.value}
                          </a>
                        ) : sourceSupportsRedaction(source) ? (
                          <RedactableSourceText
                            value={source.value}
                            redactions={source.redactions ?? []}
                            onRedact={(range) => updateSourceRedactions(source.id, range)}
                          />
                        ) : (
                          <span className="break-all font-code text-sm font-normal text-[var(--color-primary)]">
                            {source.value}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 border-b-[0.5px] border-[var(--color-secondary)] pb-8">
                <p className="m-0 font-code text-[12px] font-normal uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                  Append
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-block h-2 w-2 shrink-0 bg-[var(--color-blue)]",
                      lowResolution && "motion-safe:animate-pulse",
                    )}
                    aria-hidden
                  />
                  <span className="font-code text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--color-primary)]">
                    Append Testimony
                  </span>
                </div>
                <label className="sr-only" htmlFor={testimonyDraftId}>
                  Append testimony draft
                </label>
                <textarea
                  id={testimonyDraftId}
                  rows={4}
                  value={proofPoint.draftTestimony}
                  onChange={(e) =>
                    setProofPoint((prev) => ({ ...prev, draftTestimony: e.target.value }))
                  }
                  placeholder="Describe the friction you resolved. What was the commercial consequence of your intervention?"
                  className="mt-4 w-full resize-y border-[0.5px] border-[var(--color-secondary)] bg-white p-4 font-code text-sm font-normal leading-relaxed text-[var(--color-primary)] outline-none placeholder:text-[var(--color-secondary)] focus:border-[var(--color-blue)]/50"
                />
                <button
                  type="button"
                  onClick={addTestimonyToStack}
                  className="cta-active mt-4"
                >
                  APPEND TESTIMONY
                </button>

                <div className="mt-8 flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-block h-2 w-2 shrink-0 bg-[var(--color-blue)]",
                      lowResolution && "motion-safe:animate-pulse",
                    )}
                    aria-hidden
                  />
                  <span className="font-code text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--color-primary)]">
                    [ MOUNT SUPPORTING EVIDENCE ]
                  </span>
                </div>
                <div className="mt-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                    <label htmlFor={evidenceUrlId} className="sr-only">
                      Evidence URL
                    </label>
                    <input
                      id={evidenceUrlId}
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      value={evidenceUrl}
                      onChange={(e) => setEvidenceUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addEvidenceUrl();
                        }
                      }}
                      placeholder="https://"
                      className="min-w-0 flex-1 border-[0.5px] border-[var(--color-secondary)] bg-white p-4 font-code text-sm text-[var(--color-primary)] outline-none placeholder:text-[var(--color-secondary)] focus:border-[var(--color-blue)]/50"
                    />
                    <button
                      type="button"
                      onClick={addEvidenceUrl}
                      className="cta-active shrink-0"
                    >
                      APPEND ARTIFACT
                    </button>
                  </div>
                  <div>
                    <label htmlFor={fileInputId} className="sr-only">
                      Upload file evidence
                    </label>
                    <input
                      id={fileInputId}
                      type="file"
                      className="sr-only"
                      onChange={(e) => {
                        onEvidenceFile(e.target.files);
                        e.target.value = "";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById(fileInputId)?.click()}
                      className="w-full border-[0.5px] border-[var(--color-secondary)] bg-white px-4 py-3 text-left font-code text-sm font-normal text-[var(--color-secondary)] transition-colors hover:border-[var(--color-blue)]/50 hover:text-[var(--color-primary)]"
                    >
                      Choose file…
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="m-0 font-code text-[12px] font-normal uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                  Calibration shift
                </p>
                <ul className="m-0 mt-4 list-none space-y-2 p-0">
                  {asset.traits.map((t) => (
                    <li
                      key={t.name}
                      className="font-code text-sm font-normal tabular-nums text-[var(--color-primary)]"
                    >
                      {t.name}{" "}
                      <span className="text-[var(--color-blue)]">[ {t.delta} ]</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export default ProofPointDrawer;
