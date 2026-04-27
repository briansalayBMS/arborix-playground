"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useDemoFirstTime } from "@/context/DemoFirstTimeContext";
import { useSovereignCommand } from "@/context/SovereignCommandContext";
import { useRightRailDrawer } from "@/context/RightRailDrawerContext";
import { cn } from "@/lib/cn";
import { parseOperatingPosture } from "@/components/you/BehavioralOperatingPosture";
import { IdentityRadar } from "@/components/you/IdentityRadar";
import { SovereignLedger } from "@/components/sovereign/SovereignLedger";
import { AXES, ADAPTIVE, NATURAL, performanceGap } from "@/lib/identityRadarModel";
import { IDENTITY_ANCHOR } from "@/constants/identityAnchor";
import { useExternalView } from "@/context/ExternalViewContext";
import { AuditTooltip } from "@/components/layout/GlobalHUD";

// ─── Content data ───────────────────────────────────────────────

const FORENSIC_GAPS = [
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

const SURGICAL_INQUIRY =
  "If you were forced to demote one flagship initiative to 'maintenance' for two quarters, which would you choose, and what irreversible signal would you need from the org to justify it?";

const EVIDENCE_CARDS = [
  {
    key: "arr",
    metadata: "Impact",
    number: "$4.2",
    unit: "M",
    description: "ARR expansion, zero discounting. Procurement cited narrative as decisive.",
    delta: "+0.04 commercial ›",
  },
  {
    key: "variance",
    metadata: "Signal",
    number: "31",
    unit: "%",
    description: "Month-close variance reduction. Finance adopted instrumentation.",
    delta: "+0.03 signal ›",
  },
  {
    key: "level",
    metadata: "Velocity",
    number: "L6",
    unit: "→L7",
    description: "Trajectory confirmed. Cross-functional launch, measurable NPS lift.",
    delta: "+0.02 growth ›",
  },
] as const;

const AXIS_DEFINITIONS: Record<string, { label: string; definition: string }> = {
  Dominance:       { label: "Strategy",  definition: "Upstream framing and market positioning" },
  Influence:       { label: "Influence", definition: "Coalition building and stakeholder alignment" },
  Steadiness:      { label: "Execution", definition: "Delivery velocity and output quality" },
  Conscientiousness: { label: "Craft",   definition: "Depth of functional expertise" },
  Agility:         { label: "Agency",    definition: "Self-direction without institutional support" },
  Pace:            { label: "Pace",      definition: "Decision speed under pressure" },
  Priority:        { label: "Priority",  definition: "Trade sequencing and resource allocation" },
  Empathy:         { label: "Empathy",   definition: "Coalition depth and stakeholder care" },
};

const ENHANCEMENT_TILES = [
  { key: "disc",     title: "Calibrate Personality", body: "Run the DISC hook." },
  { key: "feedback", title: "Request Feedback",       body: "Initiate a 360 signal." },
  { key: "signal",   title: "Log Signal",             body: "Mount a raw artifact." },
  { key: "journal",  title: "Professional Journal",   body: "Add a narrative entry." },
] as const;

const EVIDENCE_RECORDS: Record<string, Parameters<ReturnType<typeof useRightRailDrawer>["open"]>[0]> = {
  "REC-001": {
    recordId: "REC-001",
    assetTitle: "LinkedIn_Profile.pdf",
    sourcePath: "local:/vault/you/linkedin_profile_export",
    fileType: "PDF",
    timestamp: "2026-04-02",
    forensicVerdict:
      "High-fidelity execution pattern confirmed across 6 role transitions. Delivery claims anchor to measurable outcomes with external validation from procurement and finance stakeholders.",
    sources: [
      { id: "SRC-001-A", tag: "DOC", label: "LinkedIn_Export.pdf", pageHint: "p.4" },
      { id: "SRC-001-B", tag: "LOG", label: "Project_Arborix_W12.md" },
    ],
    selectionKey: "narrative:REC-001",
  },
  "REC-042": {
    recordId: "REC-042",
    assetTitle: "Executive_Narrative_Q1.pdf",
    sourcePath: "local:/vault/you/narrative_q1",
    fileType: "PDF",
    timestamp: "2026-04-10",
    forensicVerdict:
      "Narrative closure under executive scrutiny documented across Q1 review cycle. Auditor notes strong alignment between stated outcomes and ledger-confirmed delivery artifacts.",
    sources: [{ id: "SRC-042-A", tag: "DOC", label: "Narrative_Q1.pdf", pageHint: "p.2" }],
    selectionKey: "narrative:REC-042",
  },
  "REC-017": {
    recordId: "REC-017",
    assetTitle: "Horizon_Management_Log.md",
    sourcePath: "local:/vault/you/horizon_log",
    fileType: "MD",
    timestamp: "2026-04-14",
    forensicVerdict:
      "Horizon management signal is the primary calibration gap: upstream intent is inferred from artifacts rather than explicit decision records. Sealing this record tightens Priority weight on the radar.",
    sources: [
      { id: "SRC-017-A", tag: "LOG", label: "Horizon_Log_W14.md" },
      { id: "SRC-017-B", tag: "DEP", label: "Deposition_Transcript_Q2" },
    ],
    selectionKey: "narrative:REC-017",
  },
};

// ─── Tab / completeness constants ───────────────────────────────

type FeedTab = "internal" | "external";

const INTERNAL_HEADLINE =
  "Brian // Audit 01: Your data proves you are a closer who gets results. However, we have a gap in proof regarding how you lead people and build partnerships.";
const EXTERNAL_HEADLINE =
  "Executive Product Leadership: Architecting AI-Native Systems and Technical Strategy.";

const COMPLETENESS = 55; // hardcoded — wire to real signal when ready

// ─── Shared mono style ──────────────────────────────────────────

const monoStyle: React.CSSProperties = {
  fontFamily: "var(--font-code), ui-monospace, monospace",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--color-primary)",
};

// ─── EvidenceLink ────────────────────────────────────────────────

function EvidenceLink({
  children,
  recordId,
  onOpen,
}: {
  children: React.ReactNode;
  recordId: string;
  onOpen: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      className="relative cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(recordId)}
      style={{
        textDecoration: hovered ? "underline dotted" : "none",
        textDecorationColor: "rgba(0,113,227,0.3)",
        textUnderlineOffset: "3px",
      }}
    >
      {children}
      <sup
        aria-hidden
        style={{
          opacity: hovered ? 1 : 0,
          color: "var(--color-blue)",
          fontSize: 12,
          marginLeft: 1,
          transition: "opacity 0.12s ease",
        }}
      >
        ›
      </sup>
    </span>
  );
}

// ─── RadarCard ──────────────────────────────────────────────────

function RadarCard({
  auditPercent,
  archetypeTitle,
  archetypeSubtitle,
  gapIndex,
  withTooltips = false,
  withDeltaLegend = false,
}: {
  auditPercent: number;
  archetypeTitle: string;
  archetypeSubtitle: string;
  gapIndex: number;
  withTooltips?: boolean;
  withDeltaLegend?: boolean;
}) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleTooltip(axis: string) {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => setActiveTooltip(axis), 300);
  }

  function clearTooltip() {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setActiveTooltip(null);
  }

  useEffect(() => () => { if (tooltipTimer.current) clearTimeout(tooltipTimer.current); }, []);

  return (
    <div className="surface-card p-8">
      <p className="label-card mb-6">IDENTITY RADAR</p>
      <div className="flex flex-col lg:flex-row lg:items-start" style={{ gap: "var(--spacing-16x)" }}>
        <div className="relative shrink-0" style={{ width: 280, height: 280 }}>
          <IdentityRadar auditPercent={auditPercent} showPanel={false} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div>
            <p className="statement-hero m-0">
              {archetypeTitle}
            </p>
            <p className="text-description mt-2">{archetypeSubtitle}</p>
          </div>

          {withDeltaLegend ? (
            /* ── Internal: forensic delta table ── */
            <div className="space-y-2">
              {AXES.map((axis, i) => {
                const nat = NATURAL[i];
                const ada = ADAPTIVE[i];
                const delta = Math.abs(nat - ada).toFixed(2);
                const logic = nat > ada ? "NATURAL > ADAPTIVE" : "ADAPTIVE > NATURAL";
                const isFlagged = i === gapIndex;
                const label = axis === "Conscientiousness" ? "CONSC." : axis.toUpperCase();
                return (
                  <div key={axis} className="flex items-center gap-2">
                    {isFlagged ? (
                      <span style={{ ...monoStyle, color: "var(--color-amber)" }} aria-label="unverified">
                        [!]
                      </span>
                    ) : null}
                    <span
                      style={{
                        ...monoStyle,
                        color: isFlagged ? "var(--color-amber)" : "var(--color-primary)",
                      }}
                    >
                      {label} |{" "}
                      <AuditTooltip definition={TOOLTIP_DEFINITIONS.delta} side="bottom">
                        <span style={{ borderBottom: "1px dotted currentColor", cursor: "help" }}>Δ</span>
                      </AuditTooltip>
                      {" "}{delta} | {logic}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── External: visual axis bars with tooltips ── */
            <div className="space-y-4">
              {AXES.map((axis, i) => {
                const value = ADAPTIVE[i];
                const isFlagged = i === gapIndex;
                const def = AXIS_DEFINITIONS[axis];
                const showTip = withTooltips && activeTooltip === axis;
                return (
                  <div
                    key={axis}
                    className="axis-row"
                    style={{ position: "relative" }}
                    onMouseEnter={withTooltips ? () => scheduleTooltip(axis) : undefined}
                    onMouseLeave={withTooltips ? clearTooltip : undefined}
                  >
                    <span className={cn("axis-label", isFlagged && "text-[var(--color-amber)]")}>
                      {axis === "Conscientiousness" ? "Consc." : axis}
                    </span>
                    <div className="axis-track">
                      <div
                        className={cn("axis-fill", isFlagged && "axis-fill-flagged")}
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                    <span className="axis-value">{value.toFixed(2)}</span>

                    {showTip && def ? (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "calc(100% + 6px)",
                          left: 0,
                          zIndex: 50,
                          backgroundColor: "var(--color-card)",
                          borderRadius: 8,
                          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                          padding: "8px 12px",
                          whiteSpace: "nowrap",
                          pointerEvents: "none",
                        }}
                      >
                        <p className="m-0" style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--color-primary)", marginBottom: 2 }}>
                          {def.label}
                        </p>
                        <p className="m-0" style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 400, color: "var(--color-secondary)" }}>
                          {def.definition}
                        </p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Audit Tooltip ──────────────────────────────────────────────

const TOOLTIP_DEFINITIONS = {
  auditRecord:
    "A detected mismatch between your evidence and your narrative. Requires reconciliation to reach Audit 02.",
  targeting:
    "Surgical Link. Answering this inquiry provides the missing data required to close this specific Audit Record.",
  delta:
    "Variance Score. Measures the friction between your natural instincts and your current adaptive professional output. Lower is more sustainable.",
} as const;

// ─── Share Popover ───────────────────────────────────────────────

function SharePopover({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const link = `https://arborix.app/s/ext-${IDENTITY_ANCHOR.name.toLowerCase().replace(" ", "-")}`;

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 39 }} onClick={onClose} aria-hidden />
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          zIndex: 40,
          width: 300,
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          padding: "16px 20px",
        }}
        role="dialog"
        aria-label="Share sovereign record"
      >
        <p style={{ ...monoStyle, fontSize: 12, color: "var(--color-secondary)", margin: "0 0 12px 0" }}>
          SOVEREIGN SHARE LINK
        </p>
        <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
          <input
            readOnly
            value={link}
            style={{
              flex: 1,
              fontFamily: "var(--font-code), ui-monospace, monospace",
              fontSize: 12,
              color: "var(--color-primary)",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg)",
              padding: "6px 8px",
              borderRadius: 3,
              outline: "none",
              letterSpacing: "0.04em",
            }}
          />
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(link).catch(() => {});
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            }}
            style={{
              ...monoStyle,
              fontSize: 12,
              background: copied ? "var(--color-green)" : "var(--color-primary)",
              color: "var(--color-card)",
              border: 0,
              borderRadius: 3,
              padding: "6px 10px",
              cursor: "pointer",
              transition: "background 0.15s ease",
              whiteSpace: "nowrap",
            }}
          >
            {copied ? "COPIED" : "COPY"}
          </button>
        </div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 300, color: "var(--color-secondary)", margin: "8px 0 0" }}>
          Generated Apr 26, 2026 · View only
        </p>
      </div>
    </>
  );
}

// ─── Resolution Center ──────────────────────────────────────────

function ResolutionCenter({
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
                marginBottom: i < FORENSIC_GAPS.length - 1 ? "var(--spacing-6x)" : 0,
                borderBottom: i < FORENSIC_GAPS.length - 1 ? "1px dashed var(--color-border)" : "none",
              }}
            >
              {/* Clickable record ID with audit tooltip */}
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

              {/* Title + body */}
              <div style={{ opacity: 0.8 }}>
                <p className="statement-title m-0 mb-2" style={{ fontWeight: 700 }}>
                  {gap.title}
                </p>
                <p className="gap-body m-0">{gap.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Suture separator — becomes var(--color-primary) when a gap is hovered */}
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
          {/* Header */}
          <p
            className="m-0 mb-3 uppercase"
            style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 400, letterSpacing: "0.05em", color: "var(--color-blue)" }}
          >
            SURGICAL INQUIRY
          </p>

          {/* Per-ref targeting tags with tooltip — glow when their gap is hovered */}
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

          {/* Question */}
          <p className="statement-question m-0" style={{ flex: 1 }}>{inquiryText}</p>

          {/* Actions */}
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

          {/* Resolution payoff */}
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

// ─── Header Block ────────────────────────────────────────────────

function JumpLink({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      style={{
        cursor: "pointer",
        textDecoration: hovered ? "underline dotted" : "none",
        textDecorationColor: "rgba(0,113,227,0.35)",
        textUnderlineOffset: 3,
        transition: "opacity 0.12s ease",
        opacity: hovered ? 0.75 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() =>
        document
          .getElementById("resolution-center")
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    >
      {children}
    </span>
  );
}

function HeaderBlock({
  profile,
  isExternal,
}: {
  profile: { primaryForce: string; posture: string; bias: string };
  isExternal: boolean;
}) {
  const OPERATING_MODEL = [
    { label: "OPERATING MODE", value: profile.primaryForce },
    { label: "ENVIRONMENT",   value: profile.posture },
    { label: "PRIORITY BIAS", value: profile.bias },
  ] as const;

  const metadataLabel = isExternal
    ? "EXECUTIVE PROFILE // RECORD ID: 01-VERDICT"
    : "AUDITOR OBSERVATION // RECORD ID: 01-VERDICT";

  return (
    <div>
      {/* Metadata */}
      <p
        className="m-0"
        style={{ ...monoStyle, fontSize: 12, color: "var(--color-secondary)", marginBottom: "var(--spacing-2x)" }}
      >
        {metadataLabel}
      </p>

      {/* Headline — Instrument Serif 40px */}
      <p
        className="statement-hero m-0"
        style={{ marginBottom: "var(--spacing-3x)" }}
      >
        {isExternal
          ? "Brian Salay is a Product Design Leader who anchors executive strategy in high-fidelity execution."
          : "Brian, your output shows a consistent ability to deliver high-stakes results while maintaining absolute clarity for leadership."}
      </p>

      {/* Body — Inter 18px */}
      <p
        className="m-0"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 18,
          fontWeight: 400,
          lineHeight: 1.65,
          color: "var(--color-secondary)",
          marginBottom: "var(--spacing-6x)",
        }}
      >
        {isExternal ? (
          "You translate ambiguous market pressure into shippable revenue narratives, then stand behind the instrumentation that makes those claims defensible where capital is allocated. Judgment under uncertainty is the through-line: you compress complexity without erasing tradeoffs, and you leave organizations with artifacts they can operate, not decks they can only applaud."
        ) : (
          <>
            The evidence is strongest where your technical decisions lead to direct commercial
            outcomes. The primary gap is in proving your influence on{" "}
            <JumpLink>team coalition</JumpLink> and{" "}
            <JumpLink>long-term strategy</JumpLink>.
          </>
        )}
      </p>

      {/* Arborix trust seal — both views */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--spacing-6x)",
          opacity: 0.6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Check
            size={11}
            strokeWidth={2.5}
            style={{ color: "var(--color-green)", flexShrink: 0 }}
            aria-hidden
          />
          <span style={{ ...monoStyle, fontSize: 12, color: "var(--color-secondary)" }}>
            VERIFIED BY ARBORIX LEDGER
          </span>
        </div>
        <span style={{ ...monoStyle, fontSize: 12, color: "var(--color-secondary)" }}>
          LAST VERIFIED APR 27, 2026
        </span>
      </div>

      {/* Core Operating Model — 3-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderTop: "1px solid var(--color-border)",
          paddingTop: "var(--spacing-6x)",
        }}
      >
        {OPERATING_MODEL.map(({ label, value }, i) => (
          <div
            key={label}
            style={{
              paddingLeft: i > 0 ? "var(--spacing-6x)" : 0,
              paddingRight: i < 2 ? "var(--spacing-6x)" : 0,
              borderLeft: i > 0 ? "1px solid var(--color-border)" : "none",
            }}
          >
            <p
              className="m-0"
              style={{ ...monoStyle, fontSize: 12, color: "var(--color-secondary)", marginBottom: "var(--spacing-2x)" }}
            >
              {label}
            </p>
            <p
              className="m-0"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: 400,
                lineHeight: 1.4,
                color: "var(--color-primary)",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Internal view ──────────────────────────────────────────────

function InternalStack({
  auditPercent,
  archetypeTitle,
  archetypeSubtitle,
  gapIndex,
  inquiryText,
  inquiryRef,
  highlightGaps,
  profile,
  onOpenDeposition,
}: {
  auditPercent: number;
  archetypeTitle: string;
  archetypeSubtitle: string;
  gapIndex: number;
  inquiryText: string;
  inquiryRef: React.RefObject<HTMLDivElement>;
  highlightGaps: boolean;
  profile: { primaryForce: string; posture: string; bias: string };
  onOpenDeposition: (q?: string) => void;
}) {
  function scrollToInquiry() {
    inquiryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex flex-col" style={{ gap: "var(--spacing-16x)" }}>

      {/* Header Block — dynamic verdict inside this tab panel */}
      <HeaderBlock profile={profile} isExternal={false} />

      {/* 1 — Identity Radar with delta legend */}
      <RadarCard
        auditPercent={auditPercent}
        archetypeTitle={archetypeTitle}
        archetypeSubtitle={archetypeSubtitle}
        gapIndex={gapIndex}
        withDeltaLegend
      />

      {/* 2+3 — Resolution Center */}
      <ResolutionCenter
        inquiryText={inquiryText}
        inquiryRef={inquiryRef}
        onOpenDeposition={onOpenDeposition}
        highlightGaps={highlightGaps}
      />

    </div>
  );
}

// ─── External view ──────────────────────────────────────────────

function ExternalStack({
  auditPercent,
  archetypeTitle,
  archetypeSubtitle,
  gapIndex,
  profile,
}: {
  auditPercent: number;
  archetypeTitle: string;
  archetypeSubtitle: string;
  gapIndex: number;
  profile: { primaryForce: string; posture: string; bias: string };
}) {
  return (
    <div className="flex flex-col" style={{ gap: "var(--spacing-16x)" }}>

      {/* Header Block — brand verdict inside this tab panel */}
      <HeaderBlock profile={profile} isExternal={true} />

      <RadarCard
        auditPercent={auditPercent}
        archetypeTitle={archetypeTitle}
        archetypeSubtitle={archetypeSubtitle}
        gapIndex={gapIndex}
        withTooltips
      />

      {/* Evidence cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {EVIDENCE_CARDS.map((card) => (
          <div key={card.key} className="surface-card flex flex-col p-6">
            <p className="text-metadata m-0 mb-4">{card.metadata}</p>
            <div className="mb-3 flex items-baseline gap-1">
              <span className="data-number">{card.number}</span>
              <span className="data-unit">{card.unit}</span>
            </div>
            <p className="text-description m-0 flex-1">{card.description}</p>
            <p className="text-delta m-0 mt-4">{card.delta}</p>
          </div>
        ))}
      </div>

      {/* CTA row */}
      <div className="flex items-center justify-end gap-3">
        <button type="button" className="btn-ghost">Request ledger access</button>
        <button type="button" className="btn-primary">Download verified dossier</button>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────

export function YouHubPage() {
  const { archetypeVerdict, openDeposition, mostPressingQuestion } = useSovereignCommand();
  const { effectiveAuditCalibrationPercent } = useDemoFirstTime();
  const { open: openInspector } = useRightRailDrawer();
  const { setIsExternalView } = useExternalView();

  const [tab, setTab] = useState<FeedTab>("internal");
  const [gapsHighlighted, setGapsHighlighted] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inquiryRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  useEffect(() => setMounted(true), []);

  // Sync tab state → global external view flag; reset on unmount
  useEffect(() => {
    setIsExternalView(tab === "external");
    return () => setIsExternalView(false);
  }, [tab, setIsExternalView]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    if (p.get("resumeDeposition") !== "1") return;
    openDeposition();
    window.history.replaceState(null, "", "/you");
  }, [openDeposition]);

  // Listen for global HUD conflict-click event (cross-component gap highlight)
  useEffect(() => {
    const handler = () => {
      setGapsHighlighted(true);
      window.setTimeout(() => setGapsHighlighted(false), 1500);
    };
    document.addEventListener("arborix:highlight-resolution", handler);
    return () => document.removeEventListener("arborix:highlight-resolution", handler);
  }, []);

  // Handle hash-based navigation from other pages (e.g., /you#resolution-center)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#resolution-center") return;
    window.history.replaceState(null, "", "/you");
    window.setTimeout(() => {
      document.getElementById("resolution-center")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setGapsHighlighted(true);
      window.setTimeout(() => setGapsHighlighted(false), 1500);
    }, 200);
  }, []);

  const profile = useMemo(() => parseOperatingPosture(archetypeVerdict), [archetypeVerdict]);
  const gap = useMemo(() => performanceGap(), []);
  const inquiryText = mostPressingQuestion.trim() || SURGICAL_INQUIRY;

  function handleOpenInspector(recordId: string) {
    const payload = EVIDENCE_RECORDS[recordId];
    if (payload) openInspector(payload);
  }

  function scrollToInquiry() {
    inquiryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!mounted) return null;

  return (
    <div className="w-full text-left">
      {/* Tab bar — 16px below HUD (GlobalHUD controls top gap) */}
      <div
        className="tab-feed-row items-center"
        style={{ marginBottom: "var(--spacing-8x)" }}
      >
        <div className="flex" style={{ gap: "var(--spacing-8x)" }}>
          <button
            type="button"
            onClick={() => setTab("internal")}
            className={cn("tab-feed", tab === "internal" && "tab-feed-active")}
          >
            YOUR SUMMARY
          </button>
          <button
            type="button"
            onClick={() => setTab("external")}
            className={cn("tab-feed", tab === "external" && "tab-feed-active")}
          >
            EXTERNAL SUMMARY
          </button>
        </div>

        {/* Share — external view only, strictly hidden in internal */}
        {tab === "external" ? (
          <div style={{ position: "relative", marginLeft: "auto", paddingBottom: "var(--spacing-4x)" }}>
            <button
              type="button"
              aria-label="Share sovereign record"
              onClick={() => setShareOpen((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: 0,
                padding: 4,
                cursor: "pointer",
                color: shareOpen ? "var(--color-primary)" : "var(--color-secondary)",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--color-primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = shareOpen ? "var(--color-primary)" : "var(--color-secondary)"; }}
            >
              {/* Clinical tray-arrow (upload/share) icon — 1px stroke, square caps */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="square"
                strokeLinejoin="miter"
                aria-hidden
              >
                <line x1="7" y1="9" x2="7" y2="2" />
                <polyline points="4,5 7,2 10,5" />
                <polyline points="2,9 2,13 12,13 12,9" />
              </svg>
            </button>
            {shareOpen && <SharePopover onClose={() => setShareOpen(false)} />}
          </div>
        ) : null}
      </div>

      {/* Feed */}
      {tab === "internal" ? (
        <InternalStack
          auditPercent={effectiveAuditCalibrationPercent}
          archetypeTitle={profile.title}
          archetypeSubtitle="Your dominant operating posture"
          gapIndex={gap.index}
          inquiryText={inquiryText}
          inquiryRef={inquiryRef}
          highlightGaps={gapsHighlighted}
          profile={{ primaryForce: profile.primaryForce, posture: profile.posture, bias: profile.bias }}
          onOpenDeposition={openDeposition}
        />
      ) : (
        <ExternalStack
          auditPercent={effectiveAuditCalibrationPercent}
          archetypeTitle={profile.title}
          archetypeSubtitle="Your dominant operating posture"
          gapIndex={gap.index}
          profile={{ primaryForce: profile.primaryForce, posture: profile.posture, bias: profile.bias }}
        />
      )}

      <div style={{ marginTop: "var(--spacing-16x)" }}>
        <SovereignLedger domain="YOU" />
      </div>
    </div>
  );
}
