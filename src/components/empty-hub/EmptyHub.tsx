"use client";

import SovereignBeacon from "@/components/sovereign-beacon/SovereignBeacon";
import ArborSpeech from "@/components/arbor-speech/ArborSpeech";
import styles from "./EmptyHub.module.css";

interface EmptyHubProps {
  message: string;
}

export default function EmptyHub({ message }: EmptyHubProps) {
  return (
    <div className={styles.container}>
      <SovereignBeacon />
      <ArborSpeech>{message}</ArborSpeech>
    </div>
  );
}
