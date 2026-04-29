"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoFirstTime } from "@/context/DemoFirstTimeContext";
import { IdentityRadar } from "@/components/you/IdentityRadar";
import { ImpactLedgerCard } from "@/components/home/ImpactLedgerCard";
import { ManagerUpdateModal } from "@/components/home/ManagerUpdateModal";

// ─── Hardcoded content ────────────────────────────────────────────

const HEADLINE =
  "Hi Brian, your execution velocity is exceptional, but your strategic signal is currently flat.";

const BODY =
  "Your execution is strong but your strategic signal needs attention. Two wins are verified, one needs a paper trail, and three directives are ready. Work through them with Arbor below or calibrate the priority first.";

const OPERATING_MODEL = [
  { label: "OPERATING MODE", value: "High-Velocity Executor" },
  { label: "ENVIRONMENT",    value: "Direct tactical contribution" },
  { label: "CURRENT RISK",   value: "Leadership Narrative (Unverified)" },
] as const;

const HOME_AXES = [
  { label: "Strategic",        value: 0.42, flagged: true  },
  { label: "Execution",        value: 0.88, flagged: false },
  { label: "Op. Influence",    value: 0.35, flagged: false },
  { label: "Systemic Growth",  value: 0.50, flagged: false },
  { label: "Team Calibration", value: 0.60, flagged: false },
] as const;

const HOME_RADAR_VALUES = [0.42, 0.88, 0.35, 0.50, 0.60, 0.55, 0.70, 0.50] as const;

const DIRECTIVES = [
  {
    vector: "STRATEGY //",
    title: "Anchor the technical narrative to the H2 budget before the window closes.",
    context: "The roadmap is settled but the VP of Eng has not seen the technical narrative. Budget lock is in 3 weeks.",
    radarLine: "STRATEGIC SCALABILITY // +0.18 RADAR LIFT",
    confidence: "Verified",
    drawerText: "I have flagged H2 Budget Alignment as your highest strategic lever. The VP of Eng has not seen the architecture narrative and budget lock is in 3 weeks. Are we aligned on this move, or is there a different signal I should be looking at?"
  },
  {
    vector: "INFLUENCE //",
    title: "Close the VP Strategy Review loop before it becomes a liability.",
    context: "The meeting happened. No follow-up was documented. Stakeholder alignment without a paper trail does not count.",
    radarLine: "OPERATIONAL LEADERSHIP // +0.12 RADAR LIFT",
    confidence: "Needs one artifact to confirm",
    drawerText: "The VP Strategy Review is your weakest signal right now. The meeting happened but there is no paper trail. One paragraph from you closes this gap. Should we write it now, or is there something more pressing?"
  },
  {
    vector: "TEAM //",
    title: "Delegate the feedback loop to clear your strategic horizon.",
    context: "Execution is at ceiling. The only move that shifts your radar is offloading IC delivery to create space for H2 planning.",
    radarLine: "HORIZON CLEARANCE // +0.09 RADAR LIFT",
    confidence: "More context needed",
    drawerText: "Your execution load is compressing your strategic horizon. Delegating the Feedback Loop closure is the fastest path to clearing that. Want me to draft the handoff brief, or is there something else on your mind?"
  }
]

// ─── Tokens ──────────────────────────────────────────────────────

const mono: React.CSSProperties = {
  fontFamily: "var(--font-code), ui-monospace, monospace",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--color-secondary)",
};

// ─── Component ───────────────────────────────────────────────────

export function TotalStateHome() {
  const { effectiveAuditCalibrationPercent } = useDemoFirstTime();
  const [previewOpen, setPreviewOpen] = useState(false);
  const router = useRouter();

  function openDirective(text: string) {
    document.dispatchEvent(
      new CustomEvent("arborix:open-directive", { detail: { text } }),
    );
  }

  return (
    <div className="page-content">
    <div
      className="w-full text-left"
      style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-16x)" }}
    >

      {/* ── Section 1: Verdict ───────────────────────────────── */}
      <section>
        <p className="statement-hero m-0" style={{ marginBottom: "var(--spacing-3x)", maxWidth: '720px' }}>
          {HEADLINE}
        </p>
        <p
          className="m-0"
          style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 300, lineHeight: 1.65, color: "var(--color-secondary)", maxWidth: '640px' }}
        >
          {BODY}
        </p>
      </section>

      {/* ── Section 1b: Impact Forecast ──────────────────────── */}
      <section>
        <p className="label-card m-0" style={{ marginBottom: "var(--spacing-6x)" }}>
          IMPACT FORECAST // PROPOSED DIRECTIVES
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4x)" }}>
          {DIRECTIVES.map((d) => (
            <div
              key={d.title}
              className="arb-card-standard"
              style={{ marginBottom: 2, display: "flex", flexDirection: "column", gap: "var(--spacing-4x)" }}
            >
              {/* Top row: vector label */}
              <span style={mono}>{d.vector}</span>

              {/* Directive title — Instrument Serif 24px */}
              <p
                className="m-0"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 24,
                  fontWeight: 400,
                  lineHeight: 1.3,
                  color: "var(--color-primary)",
                }}
              >
                {d.title}
              </p>

              {/* Context line — Inter 16px/300 */}
              <p
                className="m-0"
                style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 300, lineHeight: 1.6, color: "var(--color-secondary)" }}
              >
                {d.context}
              </p>

              {/* Radar line: goal + lift consolidated */}
              <span style={{ ...mono, color: "var(--color-secondary)" }}>{d.radarLine}</span>

              {/* Divider */}
              <div style={{ borderTop: "1px solid var(--color-border)" }} />

              {/* Footer row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button
                  type="button"
                  className="text-delta border-0 bg-transparent p-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => openDirective(d.drawerText)}
                >
                  Work on this with Arbor ›
                </button>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 400, color: "var(--color-secondary)" }}>{d.confidence}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn-ghost label-card"
          style={{ width: "100%", marginTop: "var(--spacing-4x)" }}
          onClick={() => router.push("/priorities")}
        >
          CALIBRATE PRIORITY // PAIRWISE ROI
        </button>
      </section>

      {/* ── Section 2: Radar + Operating Model ───────────────── */}
      <section>
        <div className="flex flex-col lg:flex-row lg:items-start" style={{ gap: "var(--spacing-16x)" }}>

          <div className="relative shrink-0" style={{ width: 280, height: 280 }}>
            <IdentityRadar
              auditPercent={effectiveAuditCalibrationPercent}
              showPanel={false}
              overrideValues={HOME_RADAR_VALUES}
            />
          </div>

          <div className="flex-1">
            <p className="m-0" style={{ ...mono, marginBottom: "var(--spacing-6x)" }}>
              OPERATING MODEL
            </p>
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
                    paddingLeft:  i > 0 ? "var(--spacing-6x)" : 0,
                    paddingRight: i < 2 ? "var(--spacing-6x)" : 0,
                    borderLeft:   i > 0 ? "1px solid var(--color-border)" : "none",
                  }}
                >
                  <p className="m-0" style={{ ...mono, marginBottom: "var(--spacing-2x)" }}>{label}</p>
                  <p className="m-0" style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400, lineHeight: 1.4, color: "var(--color-primary)" }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              {HOME_AXES.map(({ label, value, flagged }) => (
                <div key={label} className="axis-row">
                  <span className="axis-label" style={flagged ? { color: "var(--color-amber)" } : undefined}>
                    {label}
                  </span>
                  <div className="axis-track">
                    <div
                      className={flagged ? "axis-fill axis-fill-flagged" : "axis-fill"}
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                  <span className="axis-value">{value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Impact Ledger ──────────────────────────── */}
      <section style={{ marginTop: "var(--spacing-16x)" }}>
        <p className="m-0" style={{ ...mono, marginBottom: "var(--spacing-6x)" }}>
          IMPACT LEDGER
        </p>
        <ImpactLedgerCard onPreviewOpen={() => setPreviewOpen(true)} />
      </section>

      {previewOpen && <ManagerUpdateModal onClose={() => setPreviewOpen(false)} />}
    </div>
    </div>
  );
}
