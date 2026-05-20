"use client";

import { Link2 } from "lucide-react";
import { useChatBar } from "@/context/ChatBarContext";
import type { OperatingProfileElement } from "@/lib/placeholder/you-data";
import styles from "./OperatingProfile.module.css";

interface OperatingProfileProps {
  elements: OperatingProfileElement[];
}

export default function OperatingProfile({ elements }: OperatingProfileProps) {
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
    <div className={styles.row}>
      {elements.map((element) => {
        const words = element.value.trim().split(/\s+/);
        const lastWord = words[words.length - 1];
        const beforeLastWord = words.slice(0, -1).join(" ");
        return (
          <div key={element.key} className={styles.card}>
            <span className={styles.label}>{element.label}</span>
            <p className={styles.value}>
              {beforeLastWord && `${beforeLastWord} `}
              <span className={styles.nowrap}>
                {lastWord}
                <button
                  type="button"
                  className={styles.chainlinkButton}
                  onClick={() => handleOpenDetail(element)}
                  aria-label={`View sources behind ${element.label.toLowerCase()}`}
                >
                  <Link2 size={14} strokeWidth={1.5} />
                </button>
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
