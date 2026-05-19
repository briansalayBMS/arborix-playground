import type { LedgerItem } from "@/lib/api/types";
import type { Conflict } from "@/lib/placeholder/you-data";
import { buildSourceForItem, sortByConfidenceDesc } from "./_shared";

function overlaySlot(slot: Conflict, item: LedgerItem | undefined): Conflict {
  if (!item || !item.claim) return slot;
  const paneSource = buildSourceForItem(item);
  return {
    id: item.id,
    title: item.claim,
    body:
      item.supporting_detail && item.supporting_detail.trim().length > 0
        ? item.supporting_detail
        : slot.body,
    arborQuestion: slot.arborQuestion,
    estimatedTime: slot.estimatedTime,
    sources: paneSource ? [paneSource] : slot.sources,
  };
}

export function applyOpenQuestionsOverlay(
  placeholder: Conflict[],
  ledgerItems: LedgerItem[],
): Conflict[] {
  // TODO: filter where linked_goal_id IS NULL once backend supports
  // goal-growth_area relationship. For now, all growth_area items render.
  if (ledgerItems.length === 0) return placeholder;

  const top = sortByConfidenceDesc(ledgerItems).slice(0, 3);
  return [
    overlaySlot(placeholder[0], top[0]),
    overlaySlot(placeholder[1], top[1]),
    overlaySlot(placeholder[2], top[2]),
  ];
}
