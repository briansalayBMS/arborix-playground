"use client";

import { ArrowRight } from "lucide-react";
import { useChatBar } from "@/context/ChatBarContext";
import type { Conflict } from "@/lib/placeholder/you-data";
import styles from "./ConflictsSection.module.css";

interface ConflictsSectionProps {
  conflicts: Conflict[];
}

export default function ConflictsSection({ conflicts }: ConflictsSectionProps) {
  const { openWithContext } = useChatBar();

  const handleRespond = (conflict: Conflict) => {
    openWithContext({
      type: "chat",
      subject: conflict.title,
      sources: conflict.sources,
      placeholder: conflict.arborQuestion,
      detail: {
        body: conflict.arborQuestion,
      },
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>Open questions</div>
      <div className={styles.list}>
        {conflicts.map((conflict) => (
          <div key={conflict.id} className={styles.row}>
            <div className={styles.left}>
              <div className={styles.title}>{conflict.title}</div>
              <p className={styles.body}>{conflict.body}</p>
            </div>
            <div className={styles.right}>
              <p className={styles.question}>{conflict.arborQuestion}</p>
              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={styles.respondButton}
                  onClick={() => handleRespond(conflict)}
                >
                  <span className={styles.nowrapAction}>
                    Respond to this
                    <ArrowRight
                      size={14}
                      strokeWidth={1.5}
                      className={styles.arrow}
                    />
                  </span>
                </button>
                <span className={styles.estimate}>{conflict.estimatedTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
