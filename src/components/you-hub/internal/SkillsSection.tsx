"use client";

import { ArrowRight, Link2 } from "lucide-react";
import { useRightPane } from "@/context/RightPaneContext";
import type { Skill } from "@/lib/placeholder/you-data";
import styles from "./SkillsSection.module.css";

interface SkillsSectionProps {
  skills: Skill[];
  onSendForPeerRatings: () => void;
}

export default function SkillsSection({
  skills,
  onSendForPeerRatings,
}: SkillsSectionProps) {
  const { openWithContext } = useRightPane();

  const handleOpenSkill = (skill: Skill) => {
    openWithContext({
      type: "skillDetail",
      subject: skill.name,
      placeholder: skill.arborExplanation,
      sources: skill.sources,
      detail: {
        title: skill.name.toUpperCase(),
        subtitle: skill.selfRating,
        body: skill.arborExplanation,
      },
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>Skills</div>
      <ul className={styles.list}>
        {skills.map((skill) => (
          <li key={skill.name} className={styles.row}>
            <span className={styles.name}>{skill.name}</span>
            <div className={styles.right}>
              {skill.selfRating && (
                <span className={styles.rating}>{skill.selfRating}</span>
              )}
              <button
                type="button"
                className={styles.chainlinkButton}
                onClick={() => handleOpenSkill(skill)}
                aria-label={`View sources behind ${skill.name} rating`}
              >
                <Link2 size={14} strokeWidth={1.5} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={styles.affordance}
        onClick={onSendForPeerRatings}
      >
        <span className={styles.nowrapAction}>
          Send to colleagues for peer ratings
          <ArrowRight size={14} strokeWidth={1.5} className={styles.arrow} />
        </span>
      </button>
    </section>
  );
}
