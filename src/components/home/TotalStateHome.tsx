"use client";

import { useState } from "react";
import { useDemoFirstTime } from "@/context/DemoFirstTimeContext";
import { IdentityRadar } from "@/components/you/IdentityRadar";
import { ImpactLedgerCard } from "@/components/home/ImpactLedgerCard";
import { ManagerUpdateModal } from "@/components/home/ManagerUpdateModal";

// ─── Hardcoded content ────────────────────────────────────────────

const HEADLINE =
  "Your execution velocity is exceptional, but your strategic signal is currently flat.";

const BODY =
  "There is a consistent 14-week bias toward high-volume tactical delivery. You are effectively clearing the roadmap, but the record lacks the leadership artifacts needed to verify your executive impact.";

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

  return (
    <div
      className="w-full text-left"
      style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-16x)" }}
    >

      {/* ── Section 1: Verdict ───────────────────────────────── */}
      <section>
        <p className="m-0" style={{ ...mono, marginBottom: "var(--spacing-2x)" }}>
          AUDITOR OBSERVATION // HOME
        </p>
        <p className="statement-hero m-0" style={{ marginBottom: "var(--spacing-3x)" }}>
          {HEADLINE}
        </p>
        <p
          className="m-0"
          style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "var(--color-secondary)" }}
        >
          {BODY}
        </p>
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
  );
}
