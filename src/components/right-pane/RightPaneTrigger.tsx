"use client";

import SovereignBeacon from "@/components/sovereign-beacon/SovereignBeacon";
import styles from "./RightPaneTrigger.module.css";

interface RightPaneTriggerProps {
  onClick: () => void;
}

export default function RightPaneTrigger({ onClick }: RightPaneTriggerProps) {
  return (
    <button
      className={styles.trigger}
      onClick={onClick}
      aria-label="Open Arbor"
    >
      <SovereignBeacon />
    </button>
  );
}
