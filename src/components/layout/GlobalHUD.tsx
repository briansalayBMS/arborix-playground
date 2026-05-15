"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSovereignCommand } from "@/context/SovereignCommandContext";
import { useExternalView } from "@/context/ExternalViewContext";
import { IDENTITY_ANCHOR } from "@/constants/identityAnchor";

// ─── Mono style ──────────────────────────────────────────────────

const mono: React.CSSProperties = {
  fontFamily: "var(--font-code), ui-monospace, monospace",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--color-primary)",
};

// ─── Health scan data ─────────────────────────────────────────────

type NodeStatus = "G" | "A" | "R";

const HEALTH_NODES: Array<{ label: string; status: NodeStatus; note: string }> = [
  { label: "Pace",           status: "G", note: "Verified via Calendar Sync" },
  { label: "Impact",         status: "G", note: "Anchored to Action Ledger" },
  { label: "Coalition",      status: "A", note: "Inferred from LinkedIn export" },
  { label: "Horizon Mgmt",   status: "A", note: "Pattern-matched, no direct evidence" },
  { label: "Narrative Span", status: "R", note: "Conflict: resume dates vs. calendar" },
];

const SOURCE_QUALITY: Array<{ label: string; quality: "HIGH" | "LOW"; note?: string }> = [
  { label: "Action Ledger",          quality: "HIGH" },
  { label: "Calendar Sync",          quality: "HIGH" },
  { label: "Historical Resume Text", quality: "LOW", note: "Unverified" },
];

export const CONFLICT_COUNT = HEALTH_NODES.filter((n) => n.status === "R").length;

const NODE_STATUS_COLORS: Record<NodeStatus, string> = {
  G: "var(--color-green)",
  A: "var(--color-amber)",
  R: "var(--color-red)",
};

const STATUS_LABELS: Record<NodeStatus, string> = {
  G: "ANCHORED",
  A: "INFERRED",
  R: "VARIANCE",
};

// ─── AuditTooltip (exported — used in YouHubPage for Δ and conflict labels) ──

export function AuditTooltip({
  definition,
  children,
  side = "top",
}: {
  definition: string;
  children: React.ReactNode;
  side?: "top" | "bottom";
}) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-block", cursor: "help" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible ? (
        <span
          style={{
            position: "absolute",
            [side === "top" ? "bottom" : "top"]: "calc(100% + 6px)",
            left: 0,
            zIndex: 60,
            width: 240,
            background: "var(--color-primary)",
            color: "var(--color-card)",
            borderRadius: 6,
            padding: "8px 12px",
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 300,
            lineHeight: 1.55,
            pointerEvents: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            whiteSpace: "normal",
          }}
          role="tooltip"
        >
          {definition}
        </span>
      ) : null}
    </span>
  );
}

// ─── HudLink — for name and audit ID (navigable segments) ────────

function HudLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      style={{
        ...mono,
        color: "var(--color-primary)",
        textDecoration: "none",
        opacity: hovered ? 0.7 : 1,
        borderBottom: hovered ? "1px solid currentColor" : "1px solid transparent",
        paddingBottom: 1,
        transition: "opacity 0.15s ease, border-color 0.15s ease",
        lineHeight: 1.4,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  );
}

// ─── HudButton — for clickable non-link segments ─────────────────

function HudButton({
  onClick,
  textColor = "var(--color-primary)",
  hoverBg = "rgba(0,113,227,0.08)",
  children,
}: {
  onClick: () => void;
  textColor?: string;
  hoverBg?: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...mono,
        background: hovered ? hoverBg : "transparent",
        borderRadius: 3,
        padding: "2px 5px",
        color: textColor,
        border: 0,
        cursor: "pointer",
        transition: "background 0.15s ease, opacity 0.15s ease",
        lineHeight: 1.4,
        opacity: hovered ? 0.85 : 1,
      }}
    >
      {children}
    </button>
  );
}

// ─── Ledger Health Scan popover ───────────────────────────────────

function LedgerHealthScan({
  auditPercent,
  onClose,
  onReconcile,
}: {
  auditPercent: number;
  onClose: () => void;
  onReconcile: () => void;
}) {
  const sec: React.CSSProperties = { padding: "16px 20px", borderBottom: "1px solid var(--color-border)" };
  const secLabel: React.CSSProperties = { ...mono, fontSize: 12, color: "var(--color-secondary)", margin: "0 0 12px 0" };
  const bodyText: React.CSSProperties = { fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 300, color: "var(--color-secondary)", margin: "2px 0 0" };

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 39 }} onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-label="Ledger Health Scan"
        style={{
          position: "fixed",
          top: 48,
          left: "calc(var(--main-with-nav-ml) + 2rem)",
          width: 360,
          maxHeight: "calc(100vh - 80px)",
          overflowY: "auto",
          zIndex: 40,
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        {/* Dossier header */}
        <div style={sec}>
          <p style={secLabel}>[ LEDGER HEALTH SCAN // APR 26, 2026 ]</p>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
            <p style={{ margin: 0, ...mono, fontSize: 12, color: "var(--color-primary)" }}>
              FILE INTEGRITY: {auditPercent}% VERIFIED // {CONFLICT_COUNT} OPEN VARIANCE{CONFLICT_COUNT !== 1 ? "S" : ""}
            </p>
            <span style={{ ...mono, fontSize: 12, color: "var(--color-blue)", whiteSpace: "nowrap", flexShrink: 0 }}>
              TARGET: SESSION 02 (+20%)
            </span>
          </div>
        </div>

        {/* AUDIT COVERAGE */}
        <div style={sec}>
          <p style={secLabel}>AUDIT COVERAGE</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {HEALTH_NODES.map((node) => (
              <div key={node.label} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ ...mono, fontSize: 12, color: NODE_STATUS_COLORS[node.status], flexShrink: 0, width: 64 }}>
                  {STATUS_LABELS[node.status]}
                </span>
                <div>
                  <p style={{ margin: 0, ...mono, fontSize: 12, color: "var(--color-primary)" }}>
                    {node.label.toUpperCase()}
                  </p>
                  <p style={bodyText}>{node.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SOURCE RELIABILITY */}
        <div style={sec}>
          <p style={secLabel}>SOURCE RELIABILITY</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SOURCE_QUALITY.map((src) => (
              <div key={src.label} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ ...mono, fontSize: 12, color: src.quality === "HIGH" ? "var(--color-green)" : "var(--color-amber)", flexShrink: 0, width: 32 }}>
                  {src.quality}
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, color: "var(--color-primary)" }}>
                  {src.label}
                  {src.note ? <span style={{ color: "var(--color-secondary)", fontWeight: 300 }}> ({src.note})</span> : null}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* VERDICT */}
        <div style={sec}>
          <p style={secLabel}>VERDICT</p>
          <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, color: "var(--color-primary)", lineHeight: 1.6 }}>
            File integrity is moderate. Two dimensions are inferred without direct evidence —
            sealing VAR-01 and VAR-02 will advance coverage to ~74%.
          </p>
        </div>

        {/* VERSION LOGIC */}
        <div style={sec}>
          <p style={secLabel}>VERSION LOGIC</p>
          <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 300, color: "var(--color-secondary)", lineHeight: 1.6 }}>
            Audit 01 is your current baseline. Audit 02 is generated once you resolve the active
            conflict or reach 75% verification.
          </p>
        </div>

        {/* CTA */}
        <div style={{ padding: "16px 20px" }}>
          <button
            type="button"
            onClick={onReconcile}
            className="btn-primary"
            style={{ width: "100%", textAlign: "center", justifyContent: "center", display: "flex" }}
          >
            RECONCILE NEXT VARIANCE ›
          </button>
        </div>
      </div>
    </>
  );
}

// ─── GlobalHUD ───────────────────────────────────────────────────

export function GlobalHUD() {
  const { auditCalibrationPercent } = useSovereignCommand();
  const { isExternalView } = useExternalView();
  const pathname = usePathname();
  const router = useRouter();
  const [scanOpen, setScanOpen] = useState(false);

  const conflictLabel =
    CONFLICT_COUNT === 1 ? "1 WORTH A CLOSER LOOK" : `${CONFLICT_COUNT} CLOSER LOOK`;

  function scrollToResolution() {
    document.getElementById("resolution-center")?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.dispatchEvent(new CustomEvent("arborix:highlight-resolution"));
  }

  function handleConflictClick() {
    setScanOpen(false);
    if (pathname === "/you") {
      scrollToResolution();
    } else {
      router.push("/you#resolution-center");
    }
  }

  function handleReconcile() {
    setScanOpen(false);
    handleConflictClick();
  }

  const Sep = () => (
    <span style={{ ...mono, color: "var(--color-tertiary)", margin: "0 8px", userSelect: "none" } as React.CSSProperties}>
      {"//"}
    </span>
  );

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 25,
        background: "rgba(245,245,243,0.92)",
        backdropFilter: "blur(8px) saturate(1.15)",
        WebkitBackdropFilter: "blur(8px) saturate(1.15)",
        borderBottom: "1px solid var(--color-border)",
        padding: "10px 0",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: "var(--spacing-4x)",
      }}
    >
      {/* NAME → /account */}
      <HudLink href={IDENTITY_ANCHOR.href}>
        {IDENTITY_ANCHOR.name.toUpperCase()}
      </HudLink>

      <Sep />

      {isExternalView ? (
        /* Redacted external variant — static, non-interactive */
        <span style={{ ...mono, color: "var(--color-primary)" }}>
          STATUS: SOVEREIGN VERIFIED
        </span>
      ) : (
        <>
          {/* SESSION 01 → /you with tooltip */}
          <AuditTooltip definition="Current verified snapshot. Resolving conflicts triggers Audit 02.">
            <HudLink href="/you">
              <span style={{ borderBottom: "1px dotted var(--color-secondary)", paddingBottom: 1 }}>
                SESSION 01
              </span>
            </HudLink>
          </AuditTooltip>

          <Sep />

          {/* VERIFIED % → opens Ledger Health Scan */}
          <HudButton onClick={() => setScanOpen((v) => !v)}>
            {auditCalibrationPercent}% VERIFIED
          </HudButton>

          <Sep />

          {/* CONFIDENCE — informational, not clickable */}
          <span style={{ ...mono, color: "var(--color-primary)" }}>MODERATE CONFIDENCE</span>

          <Sep />

          {/* CONFLICTS — amber, scrolls to Resolution Center */}
          <HudButton
            onClick={handleConflictClick}
            textColor="var(--color-amber)"
            hoverBg="rgba(255,159,10,0.08)"
          >
            {conflictLabel}
          </HudButton>
        </>
      )}

      {/* Scan popover */}
      {scanOpen && (
        <LedgerHealthScan
          auditPercent={auditCalibrationPercent}
          onClose={() => setScanOpen(false)}
          onReconcile={handleReconcile}
        />
      )}
    </div>
  );
}
