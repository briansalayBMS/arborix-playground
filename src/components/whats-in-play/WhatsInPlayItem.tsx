import { ArrowRight } from "lucide-react";
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

export default function WhatsInPlayItem({
  type,
  pov,
  attribution,
  action,
  onAction,
  onAttributionClick,
}: WhatsInPlayItemProps) {
  // Strip the arrow from the action text if present
  const actionText = action.replace(/\s*→\s*$/, "");

  // Extract last word for nowrap binding with arrow
  const words = actionText.trim().split(/\s+/);
  const lastWord = words[words.length - 1];
  const beforeLastWord = words.slice(0, -1).join(' ');

  return (
    <div className={styles.item}>
      <div className={styles.typeLabel}>{typeLabels[type]}</div>

      <p className={styles.pov}>{pov}</p>

      <button
        className={styles.attribution}
        onClick={onAttributionClick}
        type="button"
        // TODO: Wire this to open the right pane with evidence details
      >
        {attribution}
      </button>

      <button
        className={styles.action}
        onClick={onAction}
        type="button"
        // TODO: Wire this to open the right pane with the POV context pre-loaded
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
