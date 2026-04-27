/**
 * Arborix design system — technical / forensic spec.
 * @see src/app/globals.css for CSS variable wiring
 */

export const designTokens = {
  /** 4px base grid unit (spacing, alignment). */
  grid: 4,

  color: {
    /** Page chrome */
    background: "#FFFFFF",
    /** Secondary labels, metadata */
    meta: "var(--color-secondary)",
    /** Deep slate — primary text */
    foreground: "var(--color-primary)",
    /** Arborix cyan — signal / focus */
    accent: "var(--color-blue)",
    /** Soft blue hairlines, grids, borders */
    border: "#C0D6E9",
  },

  /** Typography scale (matches Tailwind semantic intent). */
  type: {
    /** 32px — headlines (Performance posture, Skills Audit, …) */
    headlinePx: 32,
    /** 16px — subheads */
    subheadPx: 16,
    /** 14px — body / tabular data */
    bodyPx: 14,
    /** 12px — metadata, mono IDs, radar axis labels */
    metaPx: 12,
  },

  radius: {
    /** Sovereign layout — sharp UI */
    none: "0px",
    /** Drawers / sheets only — top corners */
    sheetTop: "12px",
  },

  hairlinePx: 0.5,
} as const;

export type DesignColorToken = keyof typeof designTokens.color;
