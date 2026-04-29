"use client";

const ITEMS = [
  {
    rank: 1,
    vector: "STRATEGY //",
    title: "Anchor technical narrative to H2 budget",
    lift: "+0.18 STRATEGIC",
  },
  {
    rank: 2,
    vector: "INFLUENCE //",
    title: "Close VP Strategy Review loop",
    lift: "+0.12 INFLUENCE",
  },
  {
    rank: 3,
    vector: "TEAM //",
    title: "Delegate IC delivery to clear strategic horizon",
    lift: "+0.09 STRATEGIC",
  },
  {
    rank: 4,
    vector: "EXECUTION //",
    title: "Close the feedback loop",
    lift: "+0.08 EXECUTION",
  },
] as const;

const mono: React.CSSProperties = {
  fontFamily: "var(--font-code), ui-monospace, monospace",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: "var(--color-secondary)",
};

export function PairwiseROI() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-16x)" }}>
      {/* Header */}
      <div>
        <p className="mono-label m-0" style={{ color: "var(--color-secondary)", marginBottom: "var(--spacing-2x)" }}>
          instrument · you · personal priorities
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 32,
            fontWeight: 400,
            lineHeight: 1.2,
            color: "var(--color-primary)",
            margin: 0,
          }}
        >
          Pairwise ROI
        </h1>
      </div>

      {/* Priority items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2x)" }}>
        <p className="label-card m-0" style={{ marginBottom: "var(--spacing-4x)" }}>
          PRIORITY RANKING
        </p>
        {ITEMS.map((item) => (
          <div
            key={item.vector}
            className="surface-card"
            style={{
              padding: "24px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--spacing-8x)",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--spacing-6x)", flex: 1 }}>
              <span style={{ ...mono, color: "var(--color-border)", minWidth: 16 }}>
                {item.rank}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-1x)" }}>
                <span style={mono}>{item.vector}</span>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 18,
                    fontWeight: 400,
                    lineHeight: 1.3,
                    color: "var(--color-primary)",
                    margin: 0,
                  }}
                >
                  {item.title}
                </p>
              </div>
            </div>
            <span
              style={{
                ...mono,
                color: "var(--color-green)",
                whiteSpace: "nowrap",
              }}
            >
              {item.lift}
            </span>
          </div>
        ))}
      </div>

      {/* Arbor Recommendation */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid var(--color-border)",
          borderRadius: 20,
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-4x)",
        }}
      >
        <span style={{ ...mono, color: "var(--color-secondary)" }}>
          ARBOR RECOMMENDATION
        </span>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 16,
            fontWeight: 300,
            lineHeight: 1.6,
            color: "var(--color-primary)",
            margin: 0,
          }}
        >
          Based on your 42% Strategic Signal, anchoring the H2 budget provides
          the highest radar lift at +0.18. This resolves the 14-week tactical
          bias and moves your Strategy axis from 42% to 60%. Commit to this
          first.
        </p>
      </div>
    </div>
  );
}
