"use client";

import { ArrowRight } from "lucide-react";
import type { Goal } from "@/lib/placeholder/you-data";
import GoalRow from "./GoalRow";
import styles from "./GoalsSection.module.css";

interface GoalsSectionProps {
  goals: Goal[];
  onAddGoal: () => void;
  onCompareGoals: () => void;
}

export default function GoalsSection({
  goals,
  onAddGoal,
  onCompareGoals,
}: GoalsSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>Goals</div>
      <div className={styles.list}>
        {goals.map((goal) => (
          <GoalRow key={goal.id} goal={goal} />
        ))}
      </div>
      <div className={styles.affordances}>
        <button type="button" className={styles.affordance} onClick={onAddGoal}>
          <span className={styles.nowrapAction}>
            Add a goal
            <ArrowRight size={14} strokeWidth={1.5} className={styles.arrow} />
          </span>
        </button>
        <button
          type="button"
          className={styles.affordance}
          onClick={onCompareGoals}
        >
          <span className={styles.nowrapAction}>
            Compare your goals
            <ArrowRight size={14} strokeWidth={1.5} className={styles.arrow} />
          </span>
        </button>
      </div>
    </section>
  );
}
