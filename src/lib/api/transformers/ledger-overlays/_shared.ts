import type { Source } from "@/components/right-pane/RightPane";
import type { LedgerItem } from "@/lib/api/types";

const SOURCE_LABEL: Record<string, string> = {
  resume: "from your resume",
  linkedin: "from your LinkedIn",
  conversation: "from your last session",
  self_reported: "added by you",
  feedback: "from peer feedback",
};

export function buildSourceForItem(item: LedgerItem): Source | null {
  if (!item.source) return null;
  const label = SOURCE_LABEL[item.source] ?? item.source;
  return {
    id: `ledger-${item.id}-source`,
    type: item.source === "conversation" ? "session" : "document",
    title: label,
    excerpt: item.supporting_detail ?? undefined,
  };
}

export function sortByConfidenceDesc<T extends { confidence?: number }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0));
}
