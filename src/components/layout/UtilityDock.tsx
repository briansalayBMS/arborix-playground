"use client";

import { cn } from "@/lib/cn";

const DOCK_MODULES = [
  {
    key: "calibrate",
    label: "CALIBRATE",
    tagline: "Update behavioral baseline (DISC)",
  },
  {
    key: "feedback",
    label: "REQUEST FEEDBACK",
    tagline: "Bridge narrative gaps",
  },
  {
    key: "signal",
    label: "LOG SIGNAL",
    tagline: "Feed the Action Ledger",
  },
  {
    key: "journal",
    label: "JOURNAL",
    tagline: "Capture raw intent",
  },
] as const;

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "var(--color-primary)",
  margin: 0,
};

const taglineStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 12,
  fontWeight: 300,
  color: "var(--color-secondary)",
  margin: 0,
  marginTop: 4,
};

export function UtilityDock() {
  return (
    <div
      style={{
        borderTop: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg)",
        marginTop: "var(--spacing-16x)",
      }}
    >
      <div className="grid grid-cols-4">
        {DOCK_MODULES.map((mod, i) => (
          <button
            key={mod.key}
            type="button"
            className={cn(
              "px-8 py-6 text-left transition-colors",
              "outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[var(--color-blue)]",
              "hover:bg-[var(--color-card)]",
              i > 0 && "border-l border-[var(--color-border)]",
            )}
          >
            <p style={labelStyle}>{mod.label}</p>
            <p style={taglineStyle}>{mod.tagline}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
