"use client";

import styles from "./EvidenceList.module.css";

interface EvidenceRow {
  claim: string;
  status: "VERIFIED" | "PENDING";
}

const evidenceRows: EvidenceRow[] = [
  {
    claim: "Built and shipped three product organizations from zero.",
    status: "VERIFIED",
  },
  {
    claim: "Promoted to Senior Director within 18 months at previous role.",
    status: "VERIFIED",
  },
  {
    claim: "Led successful platform migration that reduced infrastructure costs by 40%.",
    status: "PENDING",
  },
  {
    claim: "Mentored five PMs who were promoted within 12 months.",
    status: "VERIFIED",
  },
  {
    claim: "Recognized for strategic communication in two consecutive performance reviews.",
    status: "PENDING",
  },
  {
    claim: "Founded internal community of practice that scaled to 80+ members.",
    status: "VERIFIED",
  },
];

export default function EvidenceList() {
  return (
    <div className={styles.list}>
      <div className={styles.header}>EVIDENCE — 18 ITEMS</div>
      {evidenceRows.map((row, index) => (
        <div key={index} className={styles.row}>
          <div className={styles.claim}>{row.claim}</div>
          <div className={styles.status}>{row.status}</div>
        </div>
      ))}
      <button className={styles.showMore}>Show all 18 →</button>
    </div>
  );
}
