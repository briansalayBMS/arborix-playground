"use client";

import { ArrowRight } from "lucide-react";
import styles from "./BottomAffordances.module.css";

interface BottomAffordancesProps {
  onRequestLedgerAccess: () => void;
  onDownloadDossier: () => void;
}

export default function BottomAffordances({
  onRequestLedgerAccess,
  onDownloadDossier,
}: BottomAffordancesProps) {
  return (
    <div className={styles.row}>
      <button
        type="button"
        className={styles.affordance}
        onClick={onRequestLedgerAccess}
      >
        <span className={styles.nowrapAction}>
          Request ledger access
          <ArrowRight size={14} strokeWidth={1.5} className={styles.arrow} />
        </span>
      </button>
      <button
        type="button"
        className={styles.affordance}
        onClick={onDownloadDossier}
      >
        <span className={styles.nowrapAction}>
          Download verified dossier
          <ArrowRight size={14} strokeWidth={1.5} className={styles.arrow} />
        </span>
      </button>
    </div>
  );
}
