import type { OnePagerResponse } from "@/lib/api/types";
import type { YouPlaceholderData } from "@/lib/placeholder/you-data";

function readString(blob: Record<string, unknown> | null | undefined, key: string): string | null {
  if (!blob) return null;
  const value = blob[key];
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

export function applyOnePagerOverlay(
  placeholder: YouPlaceholderData,
  response: OnePagerResponse | null,
): YouPlaceholderData {
  if (!response) return placeholder;

  const perf = response.performance_content ?? null;
  const job = response.job_search_content ?? null;

  const internalTitle = readString(perf, "headline") ?? placeholder.internalHero.title;
  const internalBody = readString(perf, "summary") ?? placeholder.internalHero.body;
  const externalTitle = readString(job, "headline") ?? placeholder.externalHero.title;
  const externalNarrative = readString(job, "pitch") ?? placeholder.externalHero.narrative;

  return {
    ...placeholder,
    internalHero: {
      ...placeholder.internalHero,
      title: internalTitle,
      body: internalBody,
    },
    externalHero: {
      title: externalTitle,
      narrative: externalNarrative,
    },
  };
}
