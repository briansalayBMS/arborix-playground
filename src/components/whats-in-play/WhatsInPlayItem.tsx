"use client";

import { ArrowRight, Link2 } from "lucide-react";
import { useRightPane } from "@/context/RightPaneContext";
import GoalImpactChip from "./GoalImpactChip";
import type { Source } from "@/components/right-pane/RightPane";
import styles from "./WhatsInPlayItem.module.css";

export type POVType = "observation" | "conflict" | "partial-read";

interface GoalLink {
  goalId: string;
  impactStrength: "high" | "medium" | "low";
}

interface Goal {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
}

interface WhatsInPlayItemProps {
  type: POVType;
  pov: string;
  action: string;
  onAction?: () => void;
  goalLinks?: GoalLink[];
  goals?: Record<string, Goal>;
  povId?: string;
  sources?: Source[];
}

const typeLabels: Record<POVType, string> = {
  observation: "OBSERVATION",
  conflict: "CONFLICT",
  "partial-read": "PARTIAL READ",
};

const contextConfig: Record<POVType, {
  chatSubject: string;
  chatPlaceholder: string;
}> = {
  observation: {
    chatSubject: "third person observation",
    chatPlaceholder: "Chat pre-loaded on this observation will open here once chat is wired.",
  },
  conflict: {
    chatSubject: "director role conflict",
    chatPlaceholder: "Chat pre-loaded on this conflict will open here once chat is wired.",
  },
  "partial-read": {
    chatSubject: "personality questions",
    chatPlaceholder: "The personality questions flow (or a chat-driven version) will load here once that flow is built.",
  },
};

export default function WhatsInPlayItem({
  type,
  pov,
  action,
  onAction,
  goalLinks = [],
  goals = {},
  povId,
  sources,
}: WhatsInPlayItemProps) {
  const { openWithContext } = useRightPane();
  const config = contextConfig[type];

  const actionText = action.replace(/\s*→\s*$/, "");
  const words = actionText.trim().split(/\s+/);
  const lastWord = words[words.length - 1];
  const beforeLastWord = words.slice(0, -1).join(" ");

  const hasSources = !!sources && sources.length > 0;
  const povWords = pov.trim().split(/\s+/);
  const povLastWord = povWords[povWords.length - 1];
  const povBeforeLastWord = povWords.slice(0, -1).join(" ");

  const handleActionClick = () => {
    openWithContext({
      type: "chat",
      subject: config.chatSubject,
      placeholder: config.chatPlaceholder,
    });
    onAction?.();
  };

  const handleChainlinkClick = () => {
    if (!hasSources) return;
    openWithContext({
      type: "sources",
      povId,
      povType: type,
      sources,
      placeholder: "These sources shaped this read.",
    });
  };

  return (
    <div className={styles.item}>
      <div className={styles.typeLabel}>{typeLabels[type]}</div>

      <p className={styles.pov}>
        {hasSources ? (
          <>
            {povBeforeLastWord && `${povBeforeLastWord} `}
            <span className={styles.nowrapPov}>
              {povLastWord}
              <button
                className={styles.chainlinkButton}
                onClick={handleChainlinkClick}
                type="button"
                aria-label="View sources for this point of view"
              >
                <Link2 size={14} strokeWidth={1.5} />
              </button>
            </span>
          </>
        ) : (
          pov
        )}
      </p>

      {goalLinks.length > 0 && (
        <div className={styles.goalChipsRow}>
          {goalLinks.map((link) => {
            const goal = goals[link.goalId];
            if (!goal) return null;

            const visibleChips = goalLinks.slice(0, 2);

            return visibleChips.find((g) => g.goalId === link.goalId) ? (
              <GoalImpactChip
                key={link.goalId}
                goalId={link.goalId}
                goalTitle={goal.title}
                impactStrength={link.impactStrength}
              />
            ) : null;
          })}
          {goalLinks.length > 2 && (
            <span className={styles.moreGoalsLabel}>
              +{goalLinks.length - 2} more
            </span>
          )}
        </div>
      )}

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
