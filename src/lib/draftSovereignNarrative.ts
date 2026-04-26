/** Build draft copy for the Boardroom card. No em dashes. */

const RESUME_SEED =
  "Initial audit identifies headline ownership across expansion, instrumentation, and executive narrative as primary operating themes from intake and resume signals.";

export function hasDepositionTestimony(loggedTestimony: string[]): boolean {
  return loggedTestimony.some((entry) => entry.includes("Deposition round"));
}

/** Extract a short answer snippet from a deposition ledger block. */
function extractLatestAnswerSnippet(block: string): string | null {
  const lines = block.split("\n");
  const i = lines.findIndex((l) => l.startsWith("A:"));
  if (i === -1) return null;
  const rest = lines
    .slice(i)
    .map((l) => (l.startsWith("A:") ? l.slice(2).trim() : l.trim()))
    .filter(Boolean)
    .join(" ");
  const clipped = rest.replace(/\s+/g, " ").trim();
  if (!clipped) return null;
  return clipped.length > 220 ? `${clipped.slice(0, 217).trim()}…` : clipped;
}

/** Last deposition block in chronological order from ledger entries. */
function lastDepositionBlock(entries: string[]): string | null {
  for (let j = entries.length - 1; j >= 0; j--) {
    if (entries[j]?.includes("Deposition round")) return entries[j] ?? null;
  }
  return null;
}

export function buildDraftSovereignNarrative(params: {
  loggedTestimony: string[];
  activeInquirySummary: string;
  latestDepositionPreview: string;
}): string {
  const { loggedTestimony, activeInquirySummary, latestDepositionPreview } = params;
  const block = lastDepositionBlock(loggedTestimony);
  const fromBlock = block ? extractLatestAnswerSnippet(block) : null;
  const snippet = (fromBlock ?? latestDepositionPreview).replace(/\s+/g, " ").trim();
  const inquiry = activeInquirySummary.replace(/\s+/g, " ").trim();

  const parts: string[] = [];
  parts.push(RESUME_SEED);
  if (inquiry) {
    parts.push(`Active inquiry line on file: ${inquiry}.`);
  }
  if (snippet) {
    parts.push(
      `Recent deposition links this to trade-off resolution and agency: ${snippet}`,
    );
  }
  parts.push(
    "Document remains draft and unsealed until full deposition chain and seal action on the YOU pillar.",
  );
  return parts.join(" ");
}
