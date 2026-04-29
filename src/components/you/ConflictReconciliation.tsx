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
  fontSize: 13,
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
      className="arb-card"
      style={{ padding: 0, overflow: "hidden" }}
    >
      {/* Container header */}
      <div style={{ borderBottom: "1px solid var(--color-border)", padding: "var(--spacing-4x) var(--spacing-8x)" }}>
        <span className="arb-card-label">CONFLICT RECONCILIATION</span>
      </div>

      {/* Two-column body */}
      <div style={{ display: "flex", alignItems: "stretch", gap: 32 }}>

        {/* Left pane — 40% — Dossier clips */}
        <div
          style={{
            width: "40%",
            padding: "24px",
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
                borderBottom:  i < FORENSIC_GAPS.length - 1 ? "0.5px solid var(--color-border)" : "none",
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
              <div>
                <p className="arb-card-title m-0">{gap.title}</p>
                <p className="arb-card-body m-0" style={{ lineHeight: '1.5', marginTop: '8px' }}>{gap.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Column divider */}
        <div style={{ width: "0.5px", flexShrink: 0, background: "var(--color-border)" }} />

        {/* Right pane — 60% — Your Next Question */}
        <div
          style={{
            flex: 1,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            background: isAnyHovered ? "rgba(0,0,0,0.01)" : "transparent",
            transition: "background 0.2s ease",
          }}
        >
          <span className="arb-card-label" style={{ color: "var(--color-blue)", marginBottom: 12 }}>
            YOUR NEXT QUESTION
          </span>

          <span className="source-code" style={{ color: "var(--color-secondary)", display: "block", marginBottom: "16px" }}>
            RESOLVING: VAR-01 + VAR-02
          </span>

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

          <div style={{ marginTop: "var(--spacing-5x)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--spacing-4x)" }}>
            <p className="m-0" style={{ ...monoStyle, color: "var(--color-blue)", fontSize: 12 }}>
              [ +15% RECORD RESOLUTION ON COMPLETION ]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
