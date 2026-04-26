/** Consolidated master ledger mock rows for /home. */

import type { ArtifactSource } from "@/lib/sovereignLedgerDomain";

export type MasterLedgerDomain = "YOU" | "COMPANY" | "WORK" | "SYSTEM";

export type MasterLedgerRow = {
  recordId: string;
  domain: MasterLedgerDomain;
  asset: string;
  adjust: string;
  verification: string;
  sourcePath: string;
  fileType: string;
  timestamp: string;
  forensicVerdict: string;
  sources: readonly ArtifactSource[];
};

export const MASTER_LEDGER_MOCK: readonly MasterLedgerRow[] = [
  {
    recordId: "REC_001",
    domain: "YOU",
    asset: "Personality_Deposition_01",
    adjust: "+15% RES",
    verification: "SEALED",
    sourcePath: "sovereign:deposition/session_01",
    fileType: "TRANSCRIPT",
    timestamp: "2026-04-14",
    sources: [
      { id: "SRC-REC001-A", tag: "DEP", label: "Personality_Testimony_Q2" },
      { id: "SRC-REC001-B", tag: "DOC", label: "Session_Transcript_Redacted.pdf", pageHint: "p.4" },
    ],
    forensicVerdict:
      "Master aggregate ties this YOU transcript to RES calibration. The deposition narrative binds Empathy and Dominance offsets; sealing commits the transcript to the sovereign record used for radar blending and supports the Initiator trace when the pillar line is active.",
  },
  {
    recordId: "REC_002",
    domain: "COMPANY",
    asset: "Org_Chart_Extraction",
    adjust: "+5% FRIC",
    verification: "VERIFIED",
    sourcePath: "hris:exports/org_chart_q1",
    fileType: "PNG",
    timestamp: "2026-04-01",
    sources: [
      { id: "SRC-REC002-A", tag: "DOC", label: "Org_Chart_Q1.png" },
      { id: "SRC-REC002-B", tag: "LOG", label: "HRIS_Sync_Log_W12.md" },
    ],
    forensicVerdict:
      "Org structure metadata informs reporting-line friction signals. In the master ledger this raises FRIC weighting for COMPANY trace reads across hubs.",
  },
  {
    recordId: "REC_003",
    domain: "WORK",
    asset: "Q1_OKR_Metadata",
    adjust: "+10% VEL",
    verification: "SEALED",
    sourcePath: "okr:cycle/q1_metadata",
    fileType: "JSON",
    timestamp: "2026-04-10",
    sources: [
      { id: "SRC-REC003-A", tag: "REG", label: "Q1_OKRs.json" },
      { id: "SRC-REC003-B", tag: "LOG", label: "Delivery_Proof_W14.md" },
    ],
    forensicVerdict:
      "OKR graph drives WORK signal contribution to Pace and Priority. Sealed state locks velocity proof used in the master execution layer.",
  },
];

export function buildMasterInspectorAnalysis(
  recordId: string,
  sources: readonly ArtifactSource[],
  narrative: string,
): string {
  const ids = sources.map((s) => s.id).join(", ");
  return `Chain of custody for ${recordId} ties to exhibits ${ids}. The auditor cross-checked these artifacts before locking calibration. ${narrative}`;
}
