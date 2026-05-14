"use client";

import Link from "next/link";
import styles from "./ZenHome.module.css";
import ArborSpeech from "@/components/arbor-speech/ArborSpeech";
import WhatsInPlay from "@/components/whats-in-play/WhatsInPlay";

export default function ZenHome() {
  return (
    <main className={styles.main}>
      <div className={styles.section}>
        <ArborSpeech accent="the staff hire">
          Tuesday. Forty-seven minutes before your board update. We left the
          staff hire unresolved on Thursday.
        </ArborSpeech>
      </div>

      <div className={styles.section}>
        <button className={styles.button}>Continue thread →</button>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.section}>
        <WhatsInPlay
          items={[
            {
              id: "staff-hire",
              label: "Staff hire: open since Thursday",
              onSelect: () => {},
            },
            {
              id: "board-update",
              label: "Board update prep: 47 minutes",
              onSelect: () => {},
            },
            {
              id: "q3-review",
              label: "Q3 review draft: needs your eye",
              onSelect: () => {},
            },
          ]}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.recordLink}>
          Profile is 42% complete.{" "}
          <Link href="/your-record">View your record →</Link>
        </div>
      </div>
    </main>
  );
}
