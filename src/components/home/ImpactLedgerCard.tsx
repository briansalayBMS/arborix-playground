"use client";

import { useState } from "react";
import { SignalTraceDrawer, type SignalCard } from "@/components/home/SignalTraceDrawer";

// ─── Data ─────────────────────────────────────────────────────────

const IMPACT_CARDS = [
  { category: "STRATEGY",  title: "Settled Q3 Roadmap Scope",         impact: "Alignment anchored across 4 teams",                status: "SEALED"   as const },
  { category: "EXECUTION", title: "Closed Sovereign Architecture Epic", impact: "H2 scalability foundation sealed",                status: "SEALED"   as const },
  { category: "INFLUENCE", title: "VP Strategy Review",                 impact: "Executive calibration secured on platform vision", status: "INFERRED" as const },
] as const;

const SYNTHESIS_BODY =
  "This week was defined by structural hardening. By anchoring the Q3 scope and closing the Sovereign foundation, you have moved the record from tactical delivery to platform strategy. This shift reinforces your executive signal.";

// ─── Tokens ──────────────────────────────────────────────────────

const mono: React.CSSProperties = {
  fontFamily: "var(--font-code), ui-monospace, monospace",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--color-secondary)",
};

const STATUS_COLOR = { SEALED: "var(--color-green)", INFERRED: "var(--color-amber)" } as const;
const divider = { borderTop: "1px solid var(--color-border)" } as const;

// ─── Component ───────────────────────────────────────────────────

export function ImpactLedgerCard({ onPreviewOpen }: { onPreviewOpen: () => void }) {
  const [activeCard, setActiveCard] = useState<SignalCard | null>(null);

  function openCard(card: typeof IMPACT_CARDS[number]) {
    setActiveCard({ title: card.title, category: card.category, status: card.status });
  }

  return (
    <>
      <SignalTraceDrawer card={activeCard} onClose={() => setActiveCard(null)} />
      <div
        className="surface-card"
        style={{ padding: 40, borderRadius: 20, display: "flex", flexDirection: "column", gap: "var(--spacing-6x)" }}
      >
        {/* Card header */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <p className="label-card m-0">YOUR WEEK</p>
          <p className="text-timestamp m-0">APR 21-27</p>
        </div>

        <div style={divider} />

        {/* Commercial Pulse */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--spacing-8x)", paddingTop: 24 }}>
          {[
            { label: "VERIFICATION DEBT",   value: "12 items unverified", color: "var(--color-amber)" },
            { label: "STRATEGIC ALIGNMENT", value: "High",                color: "var(--color-green)" },
            { label: "NETWORK INFLUENCE",   value: "Expanding",           color: "var(--color-blue)"  },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p className="m-0" style={{ ...mono, marginBottom: 8 }}>{label}</p>
              <p className="m-0" style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 500, color, lineHeight: 1.3 }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        <div style={divider} />

        {/* Accomplishment cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {IMPACT_CARDS.map((card, i) => (
            <div
              key={card.title}
              className={i === 2 ? "sm:col-span-2" : ""}
              role="button"
              tabIndex={0}
              onClick={() => openCard(card)}
              onKeyDown={(e) => e.key === "Enter" && openCard(card)}
              style={{ background: "var(--color-bg)", borderRadius: "var(--radius-lg)", padding: "20px 24px", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="m-0" style={{ ...mono, marginBottom: 8 }}>{card.category}</p>
                  <p className="m-0" style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 500, color: "var(--color-primary)", marginBottom: 4 }}>
                    {card.title}
                  </p>
                  <p className="m-0" style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 300, color: "var(--color-secondary)" }}>
                    {card.impact}
                  </p>

                  {/* INFERRED-only: inline resolution path */}
                  {card.status === "INFERRED" && (
                    <>
                      <div style={{ borderTop: "1px solid var(--color-border)", margin: "12px 0" }} />
                      <p className="m-0" style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400, color: "var(--color-amber)", marginBottom: 6 }}>
                        Unverified - no follow-up documentation detected
                      </p>
                      <button
                        type="button"
                        className="text-delta border-0 bg-transparent p-0"
                        style={{ cursor: "pointer", display: "block" }}
                        onClick={(e) => { e.stopPropagation(); openCard(card); }}
                      >
                        Answer one question to seal this win ›
                      </button>
                    </>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, paddingTop: 2 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: STATUS_COLOR[card.status], flexShrink: 0 }} aria-hidden />
                  <span style={{ ...mono, color: STATUS_COLOR[card.status] }}>{card.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Synthesis — flows directly below cards */}
        <p className="m-0" style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 300, lineHeight: 1.75, color: "var(--color-primary)" }}>
          {SYNTHESIS_BODY}
        </p>

        {/* CTA */}
        <button
          type="button"
          className="btn-primary"
          onClick={onPreviewOpen}
          style={{ width: "100%", justifyContent: "center", fontFamily: "var(--font-sans)" }}
        >
          Preview manager update ›
        </button>
      </div>
    </>
  );
}
