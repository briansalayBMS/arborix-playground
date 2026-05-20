"use client";

import { Link2 } from "lucide-react";
import { useChatBar } from "@/context/ChatBarContext";
import type { OperatingProfileElement } from "@/lib/placeholder/you-data";
import styles from "./ExternalOperatingProfile.module.css";

interface ExternalOperatingProfileProps {
  elements: OperatingProfileElement[];
}

export default function ExternalOperatingProfile({
  elements,
}: ExternalOperatingProfileProps) {
  const { openWithContext } = useChatBar();

  const handleOpenDetail = (element: OperatingProfileElement) => {
    openWithContext({
      type: "operatingProfileDetail",
      subject: element.label,
      placeholder: element.arborExplanation,
      sources: element.sources,
      detail: {
        title: element.label,
        subtitle: element.value,
        body: element.arborExplanation,
      },
    });
  };

  return (
    <div className={styles.strip}>
      {elements.map((element, index) => (
        <span key={element.key} className={styles.group}>
          <span className={styles.label}>{element.label}</span>
          <span className={styles.value}>
            {element.value}
            <button
              type="button"
              className={styles.chainlinkButton}
              onClick={() => handleOpenDetail(element)}
              aria-label={`View sources behind ${element.label.toLowerCase()}`}
            >
              <Link2 size={13} strokeWidth={1.5} />
            </button>
          </span>
          {index < elements.length - 1 && (
            <span className={styles.separator} aria-hidden>
              ·
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
