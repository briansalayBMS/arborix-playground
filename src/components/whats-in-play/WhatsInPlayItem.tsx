"use client";

import { ArrowRight } from "lucide-react";
import { useRightPane } from "@/context/RightPaneContext";
import styles from "./WhatsInPlayItem.module.css";

export type POVType = "observation" | "conflict" | "partial-read";

interface WhatsInPlayItemProps {
  type: POVType;
  pov: string;
  attribution: string;
  action: string;
  onAction?: () => void;
  onAttributionClick?: () => void;
}

const typeLabels: Record<POVType, string> = {
  observation: "OBSERVATION",
  conflict: "CONFLICT",
  "partial-read": "PARTIAL READ",
};

const contextConfig: Record<POVType, {
  evidenceSubject: string;
  evidencePlaceholder: string;
  chatSubject: string;
  chatPlaceholder: string;
}> = {
  observation: {
    evidenceSubject: "third person observation",
    evidencePlaceholder: "The 3 resume passages supporting this observation will load here once backend is wired.",
    chatSubject: "third person observation",
    chatPlaceholder: "Chat pre-loaded on this observation will open here once chat is wired.",
  },
  conflict: {
    evidenceSubject: "director role conflict",
    evidencePlaceholder: "The goal record and 6 quarterly observations supporting this conflict will load here once backend is wired.",
    chatSubject: "director role conflict",
    chatPlaceholder: "Chat pre-loaded on this conflict will open here once chat is wired.",
  },
  "partial-read": {
    evidenceSubject: "operating style read",
    evidencePlaceholder: "The 5 resume rows supporting this read will load here once backend is wired.",
    chatSubject: "personality questions",
    chatPlaceholder: "The personality questions flow (or a chat-driven version) will load here once that flow is built.",
  },
};

export default function WhatsInPlayItem({
  type,
  pov,
  attribution,
  action,
  onAction,
  onAttributionClick,
}: WhatsInPlayItemProps) {
  const { openWithContext } = useRightPane();
  const config = contextConfig[type];

  // Strip the arrow from the action text if present
  const actionText = action.replace(/\s*→\s*$/, "");

  // Extract last word for nowrap binding with arrow
  const words = actionText.trim().split(/\s+/);
  const lastWord = words[words.length - 1];
  const beforeLastWord = words.slice(0, -1).join(' ');

  const handleAttributionClick = () => {
    openWithContext({
      type: "evidence",
      subject: config.evidenceSubject,
      placeholder: config.evidencePlaceholder,
    });
    onAttributionClick?.();
  };

  const handleActionClick = () => {
    openWithContext({
      type: "chat",
      subject: config.chatSubject,
      placeholder: config.chatPlaceholder,
    });
    onAction?.();
  };

  return (
    <div className={styles.item}>
      <div className={styles.typeLabel}>{typeLabels[type]}</div>

      <p className={styles.pov}>{pov}</p>

      <button
        className={styles.attribution}
        onClick={handleAttributionClick}
        type="button"
      >
        {attribution}
      </button>

      <button
        className={styles.action}
        onClick={handleActionClick}
        type="button"
      >
        {beforeLastWord && `${beforeLastWord} `}
        <span className={styles.nowrapAction}>
          {lastWord}
          <ArrowRight size={16} strokeWidth={1.5} className={styles.actionArrow} />
        </span>
      </button>
    </div>
  );
}
