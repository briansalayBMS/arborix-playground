import type { LedgerItem, LedgerResponse } from "@/lib/api/types";
import type { YouPlaceholderData } from "@/lib/placeholder/you-data";
import { applySkillsOverlay } from "./ledger-overlays/skills";
import { applyOperatingProfileOverlay } from "./ledger-overlays/operating-profile";
import { applyImpactCardsOverlay } from "./ledger-overlays/impact-cards";
import { applyOpenQuestionsOverlay } from "./ledger-overlays/open-questions";

function filterByCategory(items: LedgerItem[], category: string): LedgerItem[] {
  return items.filter((item) => item.category === category);
}

export function applyLedgerOverlay(
  data: YouPlaceholderData,
  ledger: LedgerResponse | null,
): YouPlaceholderData {
  if (!ledger) return data;

  const youItems = ledger.you;
  const workItems = ledger.work;

  const skillItems = filterByCategory(youItems, "skill");
  const growthAreaItems = filterByCategory(youItems, "growth_area");
  const achievementItems = filterByCategory(workItems, "achievement");

  return {
    ...data,
    operatingProfile: applyOperatingProfileOverlay(
      data.operatingProfile,
      youItems,
    ),
    skills: applySkillsOverlay(data.skills, skillItems),
    impactCards: applyImpactCardsOverlay(data.impactCards, achievementItems),
    conflicts: applyOpenQuestionsOverlay(data.conflicts, growthAreaItems),
  };
}
