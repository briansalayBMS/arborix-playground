"use client";

import styles from "./HubSection.module.css";

interface HubSectionProps {
  label: string;
  title: string;
  summary: string;
  cta: string;
  onLaunch: () => void;
}

export default function HubSection({
  label,
  title,
  summary,
  cta,
  onLaunch,
}: HubSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.label}>{label}</div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.summary}>{summary}</p>
      <button className={styles.cta} onClick={onLaunch}>
        {cta}
      </button>
    </div>
  );
}
