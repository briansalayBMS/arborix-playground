import type { LedgerItem } from "@/lib/api/types";
import type { Skill } from "@/lib/placeholder/you-data";
import { buildSourceForItem, sortByConfidenceDesc } from "./_shared";

const CONFIDENCE_BAND_TO_RATING: Record<string, string> = {
  verified: "Top 10%",
  action: "Top 25%",
  flagged: "2nd quartile",
  conflict: "Building",
};

export function applySkillsOverlay(
  placeholder: Skill[],
  ledgerItems: LedgerItem[],
): Skill[] {
  if (ledgerItems.length === 0) return placeholder;

  const sorted = sortByConfidenceDesc(ledgerItems);
  const skills: Skill[] = [];

  for (const item of sorted) {
    if (!item.claim || item.claim.trim().length === 0) continue;
    const selfRating = item.confidence_band
      ? CONFIDENCE_BAND_TO_RATING[item.confidence_band]
      : undefined;
    const paneSource = buildSourceForItem(item);
    skills.push({
      name: item.claim,
      selfRating,
      arborExplanation: item.supporting_detail ?? "",
      sources: paneSource ? [paneSource] : [],
    });
  }

  return skills.length > 0 ? skills : placeholder;
}
