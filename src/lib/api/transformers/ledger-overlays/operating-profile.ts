import type { LedgerItem } from "@/lib/api/types";
import type { OperatingProfileElement } from "@/lib/placeholder/you-data";
import { buildSourceForItem, sortByConfidenceDesc } from "./_shared";

function overlaySlot(
  slot: OperatingProfileElement,
  item: LedgerItem | undefined,
): OperatingProfileElement {
  if (!item || !item.claim) return slot;
  const paneSource = buildSourceForItem(item);
  return {
    key: slot.key,
    label: slot.label,
    value: item.claim,
    arborExplanation:
      item.supporting_detail && item.supporting_detail.trim().length > 0
        ? item.supporting_detail
        : slot.arborExplanation,
    sources: paneSource ? [paneSource] : slot.sources,
  };
}

export function applyOperatingProfileOverlay(
  placeholder: OperatingProfileElement[],
  ledgerItems: LedgerItem[],
): OperatingProfileElement[] {
  const strengths = sortByConfidenceDesc(
    ledgerItems.filter((item) => item.category === "strength"),
  );
  const growthAreas = sortByConfidenceDesc(
    ledgerItems.filter((item) => item.category === "growth_area"),
  );

  if (strengths.length === 0 && growthAreas.length === 0) return placeholder;

  const slot0 = placeholder[0];
  const slot1 = placeholder[1];
  const slot2 = placeholder[2];

  return [
    overlaySlot(slot0, strengths[0]),
    overlaySlot(slot1, strengths[1]),
    overlaySlot(slot2, growthAreas[0]),
  ];
}
