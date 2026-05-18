"use client";

import { useRightPane } from "@/context/RightPaneContext";
import styles from "./GoalImpactChip.module.css";

interface GoalImpactChipProps {
  goalId: string;
  goalTitle: string;
  impactStrength: "high" | "medium" | "low";
}

export default function GoalImpactChip({
  goalId,
  goalTitle,
  impactStrength,
}: GoalImpactChipProps) {
  const { openWithContext } = useRightPane();

  const handleClick = () => {
    openWithContext({
      type: "goal",
      subject: goalTitle,
      placeholder: `The goal "${goalTitle}" will load here once the YOU Goals section is wired. The placeholder shows: priority, progress (if any), POVs Arbor currently holds about this goal, and how this POV specifically connects.`,
    });
  };

  // Render strength dots based on impact level
  const renderDots = () => {
    switch (impactStrength) {
      case "high":
        return "●●●";
      case "medium":
        return "●●○";
      case "low":
        return "●○○";
    }
  };

  return (
    <button
      className={styles.chip}
      onClick={handleClick}
      type="button"
      aria-label={`Goal: ${goalTitle}, impact: ${impactStrength}`}
    >
      <span className={styles.title}>{goalTitle}</span>
      <span className={styles.dots}>{renderDots()}</span>
    </button>
  );
}
