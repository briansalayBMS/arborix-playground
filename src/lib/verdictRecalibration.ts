import type { LedgerAssetDetail } from "@/components/you/sovereignLedgerData";

/**
 * When sovereign redaction is active, narrative must not cite specific figures.
 */
export function buildRecalibratedVerdict(
  asset: LedgerAssetDetail,
  hasSharpenedStack: boolean,
  hasSovereignRedaction: boolean,
): string {
  if (hasSovereignRedaction) {
    return (
      "This proof point is sealed under sovereign redaction. Evidence supports a **significant commercial outcome** with **material revenue impact**; " +
      "specific figures are withheld per policy. The record remains admissible for executive review without exposing redacted quantities."
    );
  }

  const base = asset.forensicAnalysis;
  if (!hasSharpenedStack) return base;

  return (
    `${base} Testimony and supporting evidence raise resolution on this proof point. Commercial impact is now **corroborated** at sealed-record density.`
  );
}
