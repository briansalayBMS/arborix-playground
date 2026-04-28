"use client";

import { useState } from "react";
import { AuditTooltip } from "@/components/layout/GlobalHUD";

// ─── Data ─────────────────────────────────────────────────────────

export const FORENSIC_GAPS = [
  {
    ref: "VAR-01",
    title: "Strategic vs. tactical friction",
    body: "You repeatedly absorb strategy work while owning execution depth. The ledger shows outsized craft signal with compressed horizon for upstream framing.",
  },
  {
    ref: "VAR-02",
    title: "Narrative compression under load",
    body: "When timelines compress, your external narrative tightens to outcomes (healthy), but internal reviewers lose traceability to the decision graph.",
  },
] as const;

export const TOOLTIP_DEFINITIONS = {
  auditRecord:
    "A detected mismatch between your evidence and your narrative. Requires reconciliation to reach Audit 02.",
  targeting:
    "Surgical Link. Answering this inquiry provides the missing data required to close this specific Audit Record.",
  delta:
    "Variance Score. Measures the friction between your natural instincts and your current adaptive professional output. Lower is more sustainable.",
} as const;

const monoStyle: React.CSSProperties = {
  fontFamily: "var(--font-code), ui-monospace, monospace",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--color-secondary)",
};

// ─── Component ───────────────────────────────────────────────────

export function ResolutionCenter({
  inquiryText,
  inquiryRef,
  onOpenDeposition,
  highlightGaps = false,
}: {
  inquiryText: string;
  inquiryRef: React.RefObject<HTMLDivElement>;
  onOpenDeposition: (q?: string) => void;
  highlightGaps?: boolean;
}) {
  const [hoveredGap, setHoveredGap] = useState<string | null>(null);
  const isAnyHovered = hoveredGap !== null;

  function handleGapClick(ref: string) {
    setHoveredGap(ref);
    inquiryRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    window.setTimeout(() => setHoveredGap(null), 2000);
  }

  return (
    <div
      id="resolution-center"
      ref={inquiryRef}
      style={{
        borderRadius: "var(--radius-lg)",
        border: "1px solid rgba(0,113,227,0.15)",
        background: "rgba(0,113,227,0.02)",
        overflow: "hidden",
      }}
    >
      {/* Container header */}
      <div style={{ borderBottom: "1px solid rgba(0,113,227,0.10)", padding: "var(--spacing-4x) var(--spacing-8x)" }}>
        <p className="m-0" style={{ ...monoStyle, color: "var(--color-secondary)", fontSize: 12 }}>
          [ SECTION 02 // CONFLICT RECONCILIATION ]
        </p>
      </div>

      {/* Two-column body */}
      <div style={{ display: "flex", alignItems: "stretch" }}>

        {/* Left pane — 40% — Dossier clips */}
        <div
          style={{
            width: "40%",
            padding: "var(--spacing-8x)",
            background: highlightGaps ? "rgba(0,113,227,0.05)" : "transparent",
            transition: "background 0.3s ease",
          }}
        >
          {FORENSIC_GAPS.map((gap, i) => (
            <div
              key={gap.ref}
              onMouseEnter={() => setHoveredGap(gap.ref)}
              onMouseLeave={() => setHoveredGap(null)}
              style={{
                paddingBottom: i < FORENSIC_GAPS.length - 1 ? "var(--spacing-6x)" : 0,
                marginBottom:  i < FORENSIC_GAPS.length - 1 ? "var(--spacing-6x)" : 0,
                borderBottom:  i < FORENSIC_GAPS.length - 1 ? "1px dashed var(--color-border)" : "none",
              }}
            >
              <AuditTooltip definition={TOOLTIP_DEFINITIONS.auditRecord}>
                <button
                  type="button"
                  onClick={() => handleGapClick(gap.ref)}
                  className="m-0 mb-3 border-0 bg-transparent p-0 text-left"
                  style={{
                    ...monoStyle,
                    color: "var(--color-amber)",
                    fontSize: 12,
                    cursor: "pointer",
                    textDecoration: "underline",
                    textDecorationColor: "rgba(255,159,10,0.35)",
                    textDecorationStyle: "dotted",
                    textUnderlineOffset: 2,
                    display: "block",
                  }}
                >
                  [ OPEN CONFLICT // REF: {gap.ref} ]
                </button>
              </AuditTooltip>
              <div style={{ opacity: 0.8 }}>
                <p className="statement-title m-0 mb-2" style={{ fontWeight: 700 }}>{gap.title}</p>
                <p className="gap-body m-0">{gap.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Suture separator */}
        <div
          style={{
            width: 1,
            flexShrink: 0,
            background: isAnyHovered ? "var(--color-primary)" : "rgba(0,113,227,0.12)",
            transition: "background 0.2s ease",
          }}
        />

        {/* Right pane — 60% — Surgical Inquiry */}
        <div
          style={{
            flex: 1,
            padding: "var(--spacing-8x)",
            display: "flex",
            flexDirection: "column",
            background: isAnyHovered ? "rgba(0,0,0,0.01)" : "transparent",
            transition: "background 0.2s ease",
          }}
        >
          <p
            className="m-0 mb-3 uppercase"
            style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 400, letterSpacing: "0.05em", color: "var(--color-blue)" }}
          >
            SURGICAL INQUIRY
          </p>

          <div className="mb-5 flex flex-wrap gap-2">
            {FORENSIC_GAPS.map((gap) => {
              const isTargeted = hoveredGap === gap.ref;
              return (
                <AuditTooltip key={gap.ref} definition={TOOLTIP_DEFINITIONS.targeting} side="bottom">
                  <span
                    style={{
                      ...monoStyle,
                      fontSize: 12,
                      color: isTargeted ? "var(--color-amber)" : "var(--color-secondary)",
                      fontWeight: isTargeted ? 600 : 400,
                      textShadow: isTargeted ? "0 0 10px rgba(255,159,10,0.5)" : "none",
                      background: isTargeted ? "rgba(255,159,10,0.08)" : "transparent",
                      borderRadius: 3,
                      padding: isTargeted ? "2px 6px" : "2px 0",
                      transition: "color 0.15s ease, text-shadow 0.15s ease, background 0.15s ease",
                      display: "inline-block",
                    }}
                  >
                    RESOLVING: CONFLICT {gap.ref}
                  </span>
                </AuditTooltip>
              );
            })}
          </div>

          <p className="statement-question m-0" style={{ flex: 1 }}>{inquiryText}</p>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onOpenDeposition(inquiryText)}
              className="text-delta cursor-pointer border-0 bg-transparent p-0"
            >
              Respond to this ›
            </button>
            <span className="text-timestamp">~3 min</span>
          </div>

          <div style={{ marginTop: "var(--spacing-5x)", borderTop: "1px solid rgba(0,113,227,0.12)", paddingTop: "var(--spacing-4x)" }}>
            <p className="m-0" style={{ ...monoStyle, color: "var(--color-blue)", fontSize: 12 }}>
              [ +15% AUDIT RESOLUTION ON COMPLETION ]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
