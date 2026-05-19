import type { LedgerItem } from "@/lib/api/types";
import type { ImpactCard } from "@/lib/placeholder/you-data";
import { buildSourceForItem, sortByConfidenceDesc } from "./_shared";

function extractMetric(claim: string): string | null {
  const dollar = claim.match(/\$\d+(?:\.\d+)?[KMB]/i);
  if (dollar) return dollar[0];
  const pct = claim.match(/\d+(?:\.\d+)?%/);
  if (pct) return pct[0];
  const level = claim.match(/L\d+\s*(?:→|->)\s*L\d+/i);
  if (level) return level[0].replace("->", "→").replace(/\s+/g, "");
  return null;
}

function overlaySlot(
  slot: ImpactCard,
  item: LedgerItem | undefined,
): ImpactCard {
  if (!item) return slot;
  const claim = item.claim ?? "";
  const extracted = extractMetric(claim);
  const paneSource = buildSourceForItem(item);
  return {
    id: item.id,
    label: slot.label,
    metric: extracted ?? slot.metric,
    narrative:
      item.supporting_detail && item.supporting_detail.trim().length > 0
        ? item.supporting_detail
        : claim || slot.narrative,
    delta: slot.delta,
    paneSubtitle: slot.paneSubtitle,
    sources: paneSource ? [paneSource] : slot.sources,
  };
}

export function applyImpactCardsOverlay(
  placeholder: ImpactCard[],
  ledgerItems: LedgerItem[],
): ImpactCard[] {
  if (ledgerItems.length === 0) return placeholder;

  const top = sortByConfidenceDesc(ledgerItems).slice(0, 3);
  return [
    overlaySlot(placeholder[0], top[0]),
    overlaySlot(placeholder[1], top[1]),
    overlaySlot(placeholder[2], top[2]),
  ];
}
