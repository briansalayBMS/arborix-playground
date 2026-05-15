"use client";

import ArborSpeech from "@/components/arbor-speech/ArborSpeech";
import styles from "./SynthesizedView.module.css";

export default function SynthesizedView() {
  return (
    <div className={styles.view}>
      <div className={styles.label}>ARBOR&apos;S READ</div>
      <ArborSpeech accent="make ambiguous problems legible">
        Brian, you have spent the last five years building product
        organizations from zero. The pattern across your work is clear — you
        are at your strongest when you can shape both the strategy and the
        systems that deliver it. Two things stand out: you make ambiguous
        problems legible, and you build teams that hold under pressure. The
        question worth sitting with is what kind of leverage you want to
        optimize for next.
      </ArborSpeech>
      <button className={styles.evidenceLink}>See the evidence →</button>
    </div>
  );
}
