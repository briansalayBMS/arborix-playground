"use client";

import { Check, Link2 } from "lucide-react";
import { useRightPane } from "@/context/RightPaneContext";
import type { Source } from "@/components/right-pane/RightPane";
import type { LedgerItem } from "@/lib/api/types";
import styles from "./RecordRow.module.css";

const SOURCE_LABEL: Record<string, string> = {
  resume: "from your resume",
  linkedin: "from your LinkedIn",
  conversation: "from your last session",
  self_reported: "added by you",
  feedback: "from peer feedback",
};

const BAND_CLASS: Record<string, string> = {
  conflict: styles.bandConflict,
  flagged: styles.bandFlagged,
  action: styles.bandAction,
  verified: styles.bandVerified,
};

function sourceLabel(source?: string): string | null {
  if (!source) return null;
  return SOURCE_LABEL[source] ?? source;
}

function buildPaneSource(item: LedgerItem): Source | null {
  if (!item.source) return null;
  const label = sourceLabel(item.source);
  return {
    id: `ledger-${item.id}-source`,
    type: item.source === "conversation" ? "session" : "document",
    title: label ?? item.source,
    excerpt: item.supporting_detail ?? undefined,
  };
}

interface RecordRowProps {
  item: LedgerItem;
  categoryLabel: string;
}

export default function RecordRow({ item, categoryLabel }: RecordRowProps) {
  const { openWithContext } = useRightPane();

  const openDetail = () => {
    const paneSource = buildPaneSource(item);
    openWithContext({
      type: "ledgerItemDetail",
      subject: item.claim ?? categoryLabel,
      placeholder: item.supporting_detail ?? "",
      sources: paneSource ? [paneSource] : undefined,
      detail: {
        title: categoryLabel,
        subtitle: item.claim ?? "",
        body: item.supporting_detail ?? undefined,
      },
    });
  };

  const bandClass = item.confidence_band ? BAND_CLASS[item.confidence_band] : undefined;
  const srcLabel = sourceLabel(item.source);

  return (
    <button
      type="button"
      className={styles.row}
      onClick={openDetail}
    >
      <p className={styles.claim}>{item.claim ?? "(claim missing)"}</p>
      {item.supporting_detail && (
        <p className={styles.supporting}>{item.supporting_detail}</p>
      )}
      <div className={styles.meta}>
        {item.confidence_band && (
          <span
            className={`${styles.bandDot} ${bandClass ?? ""}`}
            aria-label={`confidence ${item.confidence_band}`}
          />
        )}
        {item.validated && (
          <Check
            size={12}
            strokeWidth={2.5}
            className={styles.validatedCheck}
            aria-label="validated"
          />
        )}
        {srcLabel && <span className={styles.source}>{srcLabel}</span>}
        <span className={styles.chainlink} aria-hidden>
          <Link2 size={14} strokeWidth={1.5} />
        </span>
      </div>
    </button>
  );
}
