"use client";

import { Link2 } from "lucide-react";
import { useChatBar } from "@/context/ChatBarContext";
import type { Goal } from "@/lib/placeholder/you-data";
import styles from "./GoalRow.module.css";

interface GoalRowProps {
  goal: Goal;
}

export default function GoalRow({ goal }: GoalRowProps) {
  const { openWithContext } = useChatBar();

  const handleTitleClick = () => {
    openWithContext({
      type: "goalDetail",
      subject: goal.title,
      placeholder: goal.arborPov,
      sources: goal.sources,
      detail: {
        title: goal.title,
        subtitle: "Active goal",
        body: goal.arborPov,
        linkedItems: [],
      },
    });
  };

  const handleChainlinkClick = () => {
    openWithContext({
      type: "sources",
      povId: goal.id,
      sources: goal.sources,
      placeholder: "These sources shaped this read.",
    });
  };

  const povWords = goal.arborPovSurface.trim().split(/\s+/);
  const povLastWord = povWords[povWords.length - 1];
  const povBeforeLastWord = povWords.slice(0, -1).join(" ");

  return (
    <div className={styles.row}>
      <div className={styles.number}>{goal.priority}</div>
      <div className={styles.content}>
        <button
          type="button"
          className={styles.title}
          onClick={handleTitleClick}
        >
          {goal.title}
        </button>
        <p className={styles.pov}>
          {povBeforeLastWord && `${povBeforeLastWord} `}
          <span className={styles.nowrapPov}>
            {povLastWord}
            <button
              type="button"
              className={styles.chainlinkButton}
              onClick={handleChainlinkClick}
              aria-label="View sources for this goal"
            >
              <Link2 size={14} strokeWidth={1.5} />
            </button>
          </span>
        </p>
        <div className={styles.activity}>
          <span className={styles.activityState}>{goal.activityState}</span>
          <span className={styles.activitySeparator}>·</span>
          <span className={styles.activityTouched}>{goal.lastTouched}</span>
        </div>
      </div>
    </div>
  );
}
