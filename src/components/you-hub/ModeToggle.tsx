"use client";

import styles from "./ModeToggle.module.css";

export type YouMode = "internal" | "external";

interface ModeToggleProps {
  mode: YouMode;
  onChange: (mode: YouMode) => void;
}

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className={styles.tabs} role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={mode === "internal"}
        className={`${styles.tab} ${mode === "internal" ? styles.active : ""}`}
        onClick={() => onChange("internal")}
      >
        YOUR SUMMARY
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "external"}
        className={`${styles.tab} ${mode === "external" ? styles.active : ""}`}
        onClick={() => onChange("external")}
      >
        EXTERNAL SUMMARY
      </button>
    </div>
  );
}
