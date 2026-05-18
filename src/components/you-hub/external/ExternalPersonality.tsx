"use client";

import { useRightPane } from "@/context/RightPaneContext";
import { IdentityRadar } from "@/components/you/IdentityRadar";
import type { PersonalityArchetype } from "@/lib/placeholder/you-data";
import styles from "./ExternalPersonality.module.css";

interface ExternalPersonalityProps {
  personality: PersonalityArchetype;
}

export default function ExternalPersonality({
  personality,
}: ExternalPersonalityProps) {
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
        <div className={styles.subtitle}>Dominant operating posture</div>
      </button>

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
    </section>
  );
}
