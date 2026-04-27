"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSovereignCommand } from "@/context/SovereignCommandContext";
import { useDemoFirstTime } from "@/context/DemoFirstTimeContext";
import { parseOperatingPosture } from "@/components/you/BehavioralOperatingPosture";
import { IdentityRadar } from "@/components/you/IdentityRadar";
import { AXES, ADAPTIVE, performanceGap } from "@/lib/identityRadarModel";
import { cn } from "@/lib/cn";

// ─── Constants ───────────────────────────────────────────────────

const monoStyle: React.CSSProperties = {
  fontFamily: "var(--font-code), ui-monospace, monospace",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--color-secondary)",
};

const ACTION_PULSE_ITEMS = [
  { type: "conflict", ref: "VAR-01", label: "Strategic vs. tactical friction", status: "OPEN" },
  { type: "conflict", ref: "VAR-02", label: "Narrative compression under load", status: "OPEN" },
  { type: "signal",   ref: "SIG-01", label: "$4.2M ARR expansion — commercial impact anchored", status: "SEALED" },
  { type: "signal",   ref: "SIG-02", label: "Coalition signal: LinkedIn export inferred, not verified", status: "INFERRED" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  OPEN:     "var(--color-amber)",
  SEALED:   "var(--color-green)",
  INFERRED: "var(--color-secondary)",
};

// ─── Component ───────────────────────────────────────────────────

export function TotalStateHome() {
  const { archetypeVerdict, auditCalibrationPercent } = useSovereignCommand();
  const { effectiveAuditCalibrationPercent } = useDemoFirstTime();
  const profile = useMemo(() => parseOperatingPosture(archetypeVerdict), [archetypeVerdict]);
  const gap = useMemo(() => performanceGap(), []);

  const OPERATING_MODEL = [
    { label: "OPERATING MODE", value: profile.primaryForce },
    { label: "ENVIRONMENT",    value: profile.posture },
    { label: "PRIORITY BIAS",  value: profile.bias },
  ] as const;

  return (
    <div className="w-full text-left" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-16x)" }}>

      {/* ── Section 1: Arbor Verdict ──────────────────────────── */}
      <section>
        <p className="m-0" style={{ ...monoStyle, marginBottom: "var(--spacing-2x)" }}>
          AUDITOR OBSERVATION // HOME
        </p>
        <p
          className="statement-hero m-0"
          style={{ marginBottom: "var(--spacing-3x)" }}
        >
          Brian, your output shows a consistent ability to deliver high-stakes results while
          maintaining absolute clarity for leadership.
        </p>
        <p
          className="m-0"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 18,
            fontWeight: 400,
            lineHeight: 1.65,
            color: "var(--color-secondary)",
          }}
        >
          The evidence is strongest where your technical decisions lead to direct commercial
          outcomes. The primary gap is in proving your influence on team coalition and long-term
          strategy.
        </p>
      </section>

      {/* ── Section 2: Identity Radar + Operating Model ───────── */}
      <section>
        <div
          className="flex flex-col lg:flex-row lg:items-start"
          style={{ gap: "var(--spacing-16x)" }}
        >
          {/* Radar SVG */}
          <div className="relative shrink-0" style={{ width: 280, height: 280 }}>
            <IdentityRadar auditPercent={effectiveAuditCalibrationPercent} showPanel={false} />
          </div>

          {/* Operating Model Grid */}
          <div className="flex-1">
            <p className="m-0" style={{ ...monoStyle, marginBottom: "var(--spacing-6x)" }}>
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
                    paddingLeft: i > 0 ? "var(--spacing-6x)" : 0,
                    paddingRight: i < 2 ? "var(--spacing-6x)" : 0,
                    borderLeft: i > 0 ? "1px solid var(--color-border)" : "none",
                  }}
                >
                  <p className="m-0" style={{ ...monoStyle, marginBottom: "var(--spacing-2x)" }}>
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

            {/* Axis bars — compact */}
            <div className="mt-6 space-y-3">
              {AXES.map((axis, i) => {
                const value = ADAPTIVE[i];
                const isFlagged = i === gap.index;
                return (
                  <div key={axis} className="axis-row">
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Action Pulse ───────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <p className="m-0" style={monoStyle}>ACTION PULSE</p>
          <Link
            href="/week"
            className="btn-primary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
          >
            Draft Weekly Update ›
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3x)" }}>
          {ACTION_PULSE_ITEMS.map((item) => (
            <div
              key={item.ref}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-3x)",
                padding: "var(--spacing-4x) 0",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              {/* Status dot */}
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: STATUS_COLORS[item.status] ?? "var(--color-secondary)",
                  flexShrink: 0,
                }}
                aria-hidden
              />
              {/* Ref */}
              <span style={{ ...monoStyle, color: STATUS_COLORS[item.status] ?? "var(--color-secondary)", width: 52, flexShrink: 0 }}>
                {item.ref}
              </span>
              {/* Label */}
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  fontWeight: 400,
                  color: "var(--color-primary)",
                  flex: 1,
                }}
              >
                {item.label}
              </span>
              {/* Status badge */}
              <span style={{ ...monoStyle, color: STATUS_COLORS[item.status] ?? "var(--color-secondary)" }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
