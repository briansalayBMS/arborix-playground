"use client";

import { ArrowRight } from "lucide-react";
import { useRightPane } from "@/context/RightPaneContext";
import { IdentityRadar } from "@/components/you/IdentityRadar";
import type { PersonalityArchetype } from "@/lib/placeholder/you-data";
import styles from "./PersonalitySection.module.css";

interface PersonalitySectionProps {
  personality: PersonalityArchetype;
  onTakeAssessment: () => void;
}

export default function PersonalitySection({
  personality,
  onTakeAssessment,
}: PersonalitySectionProps) {
  const { openWithContext } = useRightPane();
  const overrideValues = personality.axes.map((axis) => axis.value);

  const handleOpenRadar = () => {
    openWithContext({
      type: "radarDetail",
      subject: personality.name,
      placeholder: personality.radarArborRead,
      sources: personality.radarSources,
      detail: {
        title: `${personality.name} — axis breakdown`,
        subtitle: "Operating posture, axis by axis",
        body: personality.radarArborRead,
        linkedItems: personality.axes.map((axis) => ({
          id: axis.name,
          label: `${axis.name} — ${axis.value.toFixed(2)} · ${axis.arborRead}`,
        })),
      },
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>Personality</div>

      <button
        type="button"
        className={styles.archetypeHeadButton}
        onClick={handleOpenRadar}
        aria-label="View the axis-by-axis breakdown"
      >
        <div className={styles.archetypeName}>{personality.name}</div>
        <div className={styles.subtitle}>{personality.subtitle}</div>
      </button>

      <p className={styles.description}>{personality.description}</p>

      <button
        type="button"
        className={styles.radarButton}
        onClick={handleOpenRadar}
        aria-label="View the axis-by-axis breakdown"
      >
        <div className={styles.radarColumn}>
          <IdentityRadar
            auditPercent={70}
            showPanel={false}
            overrideValues={overrideValues}
          />
        </div>
      </button>

      <button
        type="button"
        className={styles.affordance}
        onClick={onTakeAssessment}
      >
        <span className={styles.nowrapAction}>
          Take the full 24-question assessment
          <ArrowRight size={14} strokeWidth={1.5} className={styles.arrow} />
        </span>
      </button>
    </section>
  );
}
