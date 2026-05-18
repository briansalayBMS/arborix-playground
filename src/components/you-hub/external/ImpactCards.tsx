"use client";

import { ArrowRight } from "lucide-react";
import { useRightPane } from "@/context/RightPaneContext";
import type { ImpactCard as ImpactCardData } from "@/lib/placeholder/you-data";
import styles from "./ImpactCards.module.css";

interface ImpactCardsProps {
  cards: ImpactCardData[];
}

export default function ImpactCards({ cards }: ImpactCardsProps) {
  const { openWithContext } = useRightPane();

  const handleDeltaClick = (card: ImpactCardData) => {
    openWithContext({
      type: "impactDetail",
      subject: card.label,
      placeholder: card.narrative,
      sources: card.sources,
      detail: {
        title: card.metric,
        subtitle: card.paneSubtitle,
        body: card.narrative,
      },
    });
  };

  return (
    <div className={styles.row}>
      {cards.map((card) => (
        <article key={card.id} className={styles.card}>
          <div className={styles.label}>{card.label}</div>
          <div className={styles.metric}>{card.metric}</div>
          <p className={styles.narrative}>{card.narrative}</p>
          <button
            type="button"
            className={styles.delta}
            onClick={() => handleDeltaClick(card)}
          >
            <span className={styles.nowrapAction}>
              {card.delta}
              <ArrowRight
                size={14}
                strokeWidth={1.5}
                className={styles.deltaArrow}
              />
            </span>
          </button>
        </article>
      ))}
    </div>
  );
}
