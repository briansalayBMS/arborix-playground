"use client";

import { Check } from "lucide-react";
import styles from "./ExternalHero.module.css";

interface ExternalHeroProps {
  title: string;
  narrative: string;
  verifiedDate: string;
}

export default function ExternalHero({
  title,
  narrative,
  verifiedDate,
}: ExternalHeroProps) {
  return (
    <header className={styles.hero}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.narrative}>{narrative}</p>
      <div className={styles.verifiedRow}>
        <Check
          size={12}
          strokeWidth={2.5}
          className={styles.verifiedCheck}
          aria-hidden
        />
        <span className={styles.verifiedLabel}>VERIFIED BY ARBORIX LEDGER</span>
        <span className={styles.verifiedSeparator}>·</span>
        <span className={styles.verifiedDate}>
          LAST VERIFIED {verifiedDate.toUpperCase()}
        </span>
      </div>
    </header>
  );
}
