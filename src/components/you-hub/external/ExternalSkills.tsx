"use client";

import { Link2 } from "lucide-react";
import { useRightPane } from "@/context/RightPaneContext";
import type { Skill } from "@/lib/placeholder/you-data";
import styles from "./ExternalSkills.module.css";

interface ExternalSkillsProps {
  skills: Skill[];
}

export default function ExternalSkills({ skills }: ExternalSkillsProps) {
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
          <li key={skill.name} className={styles.badge}>
            <span className={styles.name}>{skill.name}</span>
            <span className={styles.separator} aria-hidden>
              ·
            </span>
            <span className={styles.rating}>{skill.selfRating}</span>
            <button
              type="button"
              className={styles.chainlinkButton}
              onClick={() => handleOpenSkill(skill)}
              aria-label={`View sources behind ${skill.name} rating`}
            >
              <Link2 size={13} strokeWidth={1.5} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
