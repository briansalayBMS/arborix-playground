"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────

export type SignalCard = {
  title: string;
  category: string;
  status: "SEALED" | "INFERRED";
};

type Source = { line: string; snippet: string };

// ─── Signal trace data ────────────────────────────────────────────

const SEALED_DATA: Record<string, { sources: Source[]; logicBridge: string[] }> = {
  "Settled Q3 Roadmap Scope": {
    sources: [
      {
        line:    "JIRA // PROJ-442 // Q3 ROADMAP EPIC // CLOSED APR 24",
        snippet: "Epic closed with 0 blockers. 4 of 4 acceptance criteria met.",
      },
      {
        line:    'SLACK // #PRODUCT-STRATEGY // "STAKEHOLDERS ALIGNED ON SCOPE" // 14:22',
        snippet: "@brian confirmed scope. Team aligned. Moving to execution.",
      },
      {
        line:    "G-CAL // APR 24 // ROADMAP SYNC // 4 LEADS // 45 MIN",
        snippet: "Q3 planning sync - scope finalized across design, eng, and GTM.",
      },
    ],
    logicBridge: [
      "Meeting attendees correlate with 92% of Q3 roadmap stakeholder list",
      "Slack sentiment: Approval confirmed from 3 of 4 decision-makers",
      "Jira closure timestamp: 4 minutes after Slack thread concluded",
    ],
  },
  "Closed Sovereign Architecture Epic": {
    sources: [
      {
        line:    "JIRA // PLAT-1240 // SOVEREIGN ARCH EPIC // CLOSED APR 24",
        snippet: "All 6 milestones completed. No open blockers at closure.",
      },
      {
        line:    'SLACK // #PLATFORM-ENG // "EPIC CLOSED, H2 FOUNDATION READY" // 16:41',
        snippet: "Closed PLAT-1240. Scalability layer now in place for H2 roadmap.",
      },
      {
        line:    "G-CAL // APR 23 // ARCHITECTURE REVIEW // 3 LEADS // 60 MIN",
        snippet: "Final architecture review - sign-off from all three tech leads.",
      },
    ],
    logicBridge: [
      "Epic closure verified against 6 of 6 acceptance criteria in Jira",
      "Slack confirmation received from lead engineer within 17 minutes of close",
      "Architecture review attendees match the H2 planning stakeholder list",
    ],
  },
};

const INFERRED_GAP: Record<string, string> = {
  "VP Strategy Review":
    "A 60-minute G-Cal event with the VP of Product was detected. No follow-up documentation or Slack signal found.",
};

// ─── Tokens ──────────────────────────────────────────────────────

const scp = (color = "var(--color-secondary)"): React.CSSProperties => ({
  fontFamily: "var(--font-code), ui-monospace, monospace",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color,
});

const inter = (size: number, weight: number, color = "var(--color-primary)"): React.CSSProperties => ({
  fontFamily: "var(--font-sans)",
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.5,
});

// ─── Drawer ───────────────────────────────────────────────────────

export function SignalTraceDrawer({
  card,
  onClose,
}: {
  card: SignalCard | null;
  onClose: () => void;
}) {
  const [notes,          setNotes]          = useState("");
  const [sealInput,      setSealInput]      = useState("");
  const [privateOn,      setPrivateOn]      = useState<boolean[]>([false, false, false]);

  const sealed = card ? SEALED_DATA[card.title] : null;
  const gap    = card ? INFERRED_GAP[card.title] : null;

  const statusColor = card?.status === "SEALED" ? "var(--color-green)" : "var(--color-amber)";

  return (
    <AnimatePresence>
      {card && (
        <>
          {/* Transparent click-outside scrim */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 49 }}
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer panel */}
          <motion.div
            key="signal-trace"
            initial={{ x: 480 }}
            animate={{ x: 0 }}
            exit={{ x: 480 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
              width: 480,
              background: "var(--color-card)",
              borderLeft: "1px solid var(--color-border)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
            role="dialog"
            aria-label="Signal trace"
          >
            {/* ── Header ───────────────────────────────────────── */}
            <div
              style={{
                padding: "24px 28px 20px",
                borderBottom: "1px solid var(--color-border)",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <p className="m-0" style={{ ...scp(), marginBottom: 6 }}>SIGNAL TRACE</p>
                  <p className="statement-title m-0">{card.title}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <span style={scp(statusColor)}>{card.status}</span>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    style={{
                      background: "transparent",
                      border: 0,
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                      fontSize: 18,
                      fontWeight: 300,
                      lineHeight: 1,
                      color: "var(--color-secondary)",
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            {/* ── Body ─────────────────────────────────────────── */}
            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 32 }}>

              {/* Section 1 — Provenance */}
              {sealed && (
                <section>
                  <p className="m-0" style={{ ...scp(), marginBottom: 12 }}>SIGNAL SOURCES</p>
                  <div>
                    {sealed.sources.map((src, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "8px 0",
                          borderBottom: "1px solid var(--color-border)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                          <p className="m-0" style={scp("var(--color-primary)")}>
                            {src.line}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setPrivateOn((prev) => {
                                const next = [...prev];
                                next[i] = !next[i];
                                return next;
                              })
                            }
                            style={{
                              ...inter(11, 400, "var(--color-secondary)"),
                              background: "transparent",
                              border: 0,
                              cursor: "pointer",
                              padding: 0,
                              flexShrink: 0,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {privateOn[i] ? "Private" : "Mark as private"}
                          </button>
                        </div>
                        <p className="m-0" style={{ ...inter(13, 400, "var(--color-secondary)"), fontStyle: "italic", marginTop: 4 }}>
                          {src.snippet}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Section 2 — Logic Bridge */}
              {sealed && (
                <section>
                  <p className="m-0" style={{ ...scp(), marginBottom: 12 }}>SYNTHESIS</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                    {sealed.logicBridge.map((bullet, i) => (
                      <li key={i} style={{ display: "flex", gap: 8 }}>
                        <span style={{ ...inter(13, 400, "var(--color-secondary)"), flexShrink: 0 }}>·</span>
                        <p className="m-0" style={inter(13, 400, "var(--color-secondary)")}>{bullet}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Section 3 — Verification state */}
              <section>
                <p className="m-0" style={{ ...scp(), marginBottom: 12 }}>VERIFICATION</p>

                {card.status === "SEALED" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "var(--color-green)", fontSize: 14, lineHeight: 1 }}>✓</span>
                      <p className="m-0" style={scp("var(--color-green)")}>DIRECT PROOF - RECORD SEALED</p>
                    </div>
                    <button
                      type="button"
                      style={{
                        ...scp(),
                        background: "transparent",
                        border: 0,
                        cursor: "pointer",
                        padding: 0,
                        textAlign: "left",
                        width: "fit-content",
                      }}
                    >
                      [ EXPORT RECEIPT ]
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <p className="m-0" style={scp("var(--color-amber)")}>EVIDENCE GAP DETECTED</p>
                    <p className="m-0" style={inter(13, 400, "var(--color-secondary)")}>
                      {gap}
                    </p>
                    <p className="m-0" style={inter(14, 400)}>
                      Was a decision reached? Drop a link or summary to seal this win.
                    </p>
                    <input
                      type="text"
                      value={sealInput}
                      onChange={(e) => setSealInput(e.target.value)}
                      placeholder="Paste link or summarize the outcome..."
                      style={{
                        ...inter(14, 400),
                        width: "100%",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        padding: 12,
                        outline: "none",
                        boxSizing: "border-box",
                        background: "var(--color-card)",
                      }}
                    />
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ width: "100%" }}
                    >
                      Seal this win
                    </button>
                  </div>
                )}
              </section>

              {/* Section 4 — Private notes */}
              <section>
                <p className="m-0" style={{ ...scp(), marginBottom: 12 }}>YOUR NOTES</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add context only you can see. Notes stay in your internal record."
                  style={{
                    ...inter(14, 300),
                    width: "100%",
                    height: 80,
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    padding: 12,
                    resize: "none",
                    outline: "none",
                    boxSizing: "border-box",
                    background: "var(--color-card)",
                    lineHeight: 1.6,
                  }}
                />
                <p className="text-timestamp m-0" style={{ marginTop: 6 }}>
                  Private notes are never shared externally
                </p>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
