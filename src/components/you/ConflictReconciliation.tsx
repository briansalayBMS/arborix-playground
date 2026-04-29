"use client";

import { useState } from "react";

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
        background: "var(--color-surface)",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      {/* Card header */}
      <div style={{
        borderBottom: "0.5px solid var(--color-border)",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
      }}>
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: "13px",
          fontWeight: 400,
          letterSpacing: "0.05em",
          textTransform: "uppercase" as const,
          color: "var(--color-secondary)",
        }}>
          Conflict Reconciliation
        </span>
      </div>

      {/* Two-column body */}
      <div style={{ display: "flex", alignItems: "stretch" }}>

        {/* Left pane */}
        <div style={{
          width: "40%",
          padding: "32px",
          background: highlightGaps ? "rgba(0,113,227,0.03)" : "transparent",
          transition: "background 0.3s ease",
        }}>
          {FORENSIC_GAPS.map((gap, i) => (
            <div
              key={gap.ref}
              onMouseEnter={() => setHoveredGap(gap.ref)}
              onMouseLeave={() => setHoveredGap(null)}
              style={{
                paddingBottom: i < FORENSIC_GAPS.length - 1 ? "24px" : 0,
                marginBottom: i < FORENSIC_GAPS.length - 1 ? "24px" : 0,
                borderBottom: i < FORENSIC_GAPS.length - 1 ? "0.5px solid var(--color-border)" : "none",
              }}
            >
              {i === 0 && (
                <>
                  <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    fontWeight: 400,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase" as const,
                    color: "var(--color-secondary)",
                    display: "block",
                    marginBottom: "12px",
                  }}>Open Conflicts</span>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    color: "var(--color-amber)",
                    display: "block",
                    marginBottom: "16px",
                  }}>VAR-01 · VAR-02</span>
                </>
              )}

              <p style={{
                fontFamily: "var(--font-serif)",
                fontSize: "20px",
                fontWeight: 400,
                lineHeight: 1.3,
                color: "var(--color-primary)",
                margin: "0 0 10px 0",
              }}>
                {gap.title}
              </p>

              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: 1.6,
                color: "var(--color-primary)",
                margin: 0,
              }}>
                {gap.body}
              </p>
            </div>
          ))}
        </div>

        {/* Column divider */}
        <div style={{ width: "0.5px", flexShrink: 0, background: "var(--color-border)" }} />

        {/* Right pane */}
        <div style={{
          flex: 1,
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          background: isAnyHovered ? "rgba(0,0,0,0.01)" : "transparent",
          transition: "background 0.2s ease",
        }}>

          <span style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase" as const,
            color: "var(--color-blue)",
            display: "block",
            marginBottom: "12px",
          }}>
            Your Next Question
          </span>

          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            fontWeight: 400,
            letterSpacing: "0.04em",
            textTransform: "uppercase" as const,
            color: "var(--color-secondary)",
            display: "block",
            marginBottom: "20px",
          }}>
            Resolving: VAR-01 + VAR-02
          </span>

          <p style={{
            fontFamily: "var(--font-serif)",
            fontSize: "24px",
            fontWeight: 400,
            lineHeight: 1.25,
            color: "var(--color-primary)",
            margin: "0 0 auto 0",
            flex: 1,
          }}>
            {inquiryText}
          </p>

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "32px",
          }}>
            <button
              type="button"
              onClick={() => onOpenDeposition(inquiryText)}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "16px",
                fontWeight: 400,
                color: "var(--color-blue)",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              Respond to this ›
            </button>
            <span style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              fontWeight: 300,
              color: "var(--color-secondary)",
            }}>
              ~3 min
            </span>
          </div>

          <div style={{
            marginTop: "20px",
            borderTop: "0.5px solid var(--color-border)",
            paddingTop: "16px",
          }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              fontWeight: 400,
              letterSpacing: "0.05em",
              textTransform: "uppercase" as const,
              color: "var(--color-blue)",
              margin: 0,
            }}>
              [ +15% Record Resolution on Completion ]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
