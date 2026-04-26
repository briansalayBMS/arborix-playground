export type RedactionRange = { start: number; end: number };

export function mergeRedactionRanges(
  ranges: RedactionRange[],
  add: RedactionRange,
): RedactionRange[] {
  const next = [...ranges, add].sort((a, b) => a.start - b.start);
  const merged: RedactionRange[] = [];
  for (const r of next) {
    const last = merged[merged.length - 1];
    if (last && r.start <= last.end) {
      last.end = Math.max(last.end, r.end);
    } else {
      merged.push({ start: r.start, end: r.end });
    }
  }
  return merged;
}

export function displayStringWithRedactions(
  text: string,
  ranges: RedactionRange[],
): string {
  const chars = text.split("");
  for (const r of ranges) {
    for (let i = r.start; i < r.end && i < chars.length; i++) {
      chars[i] = "█";
    }
  }
  return chars.join("");
}

export function countRedactionChars(ranges: RedactionRange[]): number {
  return ranges.reduce((n, r) => n + (r.end - r.start), 0);
}
