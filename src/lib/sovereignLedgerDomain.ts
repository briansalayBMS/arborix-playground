/** Forensic ledger pillar. Mock evidence lists per hub. */

export type SovereignLedgerDomain = "YOU" | "COMPANY" | "WORK";

type Evidence = { recordId: string; asset: string };

export const SOVEREIGN_LEDGER_EVIDENCE: Record<SovereignLedgerDomain, readonly Evidence[]> = {
  YOU: [
    { recordId: "YOU-001", asset: "LinkedIn_Profile.pdf" },
    { recordId: "YOU-002", asset: "Resume_2026.pdf" },
    { recordId: "YOU-003", asset: "Personality_Deposition_01" },
  ],
  COMPANY: [
    { recordId: "COM-001", asset: "Company_Mission.pdf" },
    { recordId: "COM-002", asset: "Q1_Org_Chart.png" },
    { recordId: "COM-003", asset: "Values_Document.pdf" },
  ],
  WORK: [
    { recordId: "WRK-001", asset: "Q1_OKRs.json" },
    { recordId: "WRK-002", asset: "Weekly_Log_W14.md" },
    { recordId: "WRK-003", asset: "Project_Zeus_Brief.pdf" },
  ],
};

export function adjustForLedgerDomain(domain: SovereignLedgerDomain): string {
  switch (domain) {
    case "YOU":
      return "+0.03 YOU radar weight";
    case "WORK":
      return "+0.02 WORK signal";
    case "COMPANY":
      return "+0.02 COMPANY trace";
  }
}

export function sealedStorageKey(domain: SovereignLedgerDomain): string {
  return `arborix:sovereign-ledger-sealed:${domain}`;
}

export function activeToggleStorageKey(domain: SovereignLedgerDomain): string {
  return `arborix:sovereign-ledger-active:${domain}`;
}

export function customRowsStorageKey(domain: SovereignLedgerDomain): string {
  return `arborix:sovereign-ledger-custom:${domain}`;
}

export type LedgerArtifactDetail = {
  source: string;
  fileType: string;
  dateMounted: string;
  auditorNotes: string;
};

/** Discrete exhibits for Asset Inspector multi-source attribution (chain of custody). */
export type ArtifactSource = {
  id: string;
  tag: string;
  label: string;
  pageHint?: string;
};

/** Per-record source lists; user-mounted rows resolve via `resolveArtifactSources`. */
export const RECORD_ARTIFACT_SOURCES: Record<string, readonly ArtifactSource[]> = {
  "YOU-001": [
    { id: "SRC-YOU001-A", tag: "DOC", label: "LinkedIn_Export.pdf", pageHint: "p.4" },
    { id: "SRC-YOU001-B", tag: "LOG", label: "Project_Arborix_W12.md" },
  ],
  "YOU-002": [
    { id: "SRC-YOU002-A", tag: "DOC", label: "Resume_2026.pdf", pageHint: "p.2" },
    { id: "SRC-YOU002-B", tag: "REG", label: "ATS_Parse_Export.json" },
  ],
  "YOU-003": [
    { id: "SRC-YOU003-A", tag: "DEP", label: "Personality_Testimony_Q2" },
    { id: "SRC-YOU003-B", tag: "LOG", label: "Session_Transcript_Raw.md" },
  ],
  "COM-001": [
    { id: "SRC-COM001-A", tag: "DOC", label: "Mission_Statement_v3.pdf" },
    { id: "SRC-COM001-B", tag: "LOG", label: "Board_Readout_W9.pdf" },
  ],
  "COM-002": [
    { id: "SRC-COM002-A", tag: "DOC", label: "Org_Chart_Q1.png" },
    { id: "SRC-COM002-B", tag: "REG", label: "HRIS_Node_Map.json" },
  ],
  "COM-003": [
    { id: "SRC-COM003-A", tag: "DOC", label: "Values_Framework.pdf" },
  ],
  "WRK-001": [
    { id: "SRC-WRK001-A", tag: "REG", label: "Q1_OKRs.json" },
    { id: "SRC-WRK001-B", tag: "LOG", label: "Cycle_Closeout_Notes.md" },
  ],
  "WRK-002": [
    { id: "SRC-WRK002-A", tag: "LOG", label: "Weekly_Log_W14.md" },
  ],
  "WRK-003": [
    { id: "SRC-WRK003-A", tag: "DOC", label: "Project_Zeus_Brief.pdf", pageHint: "p.12" },
    { id: "SRC-WRK003-B", tag: "DEP", label: "Signoff_Attestation_Q2" },
  ],
};

export function formatSourceListLine(s: ArtifactSource): string {
  const page = s.pageHint ? ` (${s.pageHint})` : "";
  return `- [${s.tag}] ${s.label}${page}`;
}

export function resolveArtifactSources(
  recordId: string,
  assetTitle: string,
  detail: LedgerArtifactDetail,
): ArtifactSource[] {
  const preset = RECORD_ARTIFACT_SOURCES[recordId];
  if (preset) return [...preset];
  if (recordId.startsWith("MNT-")) {
    return [
      {
        id: `${recordId}-EX1`,
        tag: "MNT",
        label: assetTitle,
        pageHint: detail.source.replace(/^file:/, ""),
      },
    ];
  }
  return [
    {
      id: `${recordId}-EX1`,
      tag: "REG",
      label: assetTitle,
      pageHint: detail.source,
    },
  ];
}

/** High-fidelity inspector copy keyed by record id (no em dashes). */
export const LEDGER_ARTIFACT_DETAILS: Record<string, LedgerArtifactDetail> = {
  "YOU-001": {
    source: "local:/vault/you/linkedin_profile_export",
    fileType: "PDF",
    dateMounted: "2026-04-02",
    auditorNotes:
      "Public career graph increases Influence and Pace weights on the radar because external titles anchor perceived executive reach.",
  },
  "YOU-002": {
    source: "local:/vault/you/resume_2026",
    fileType: "PDF",
    dateMounted: "2026-04-05",
    auditorNotes:
      "Structured role history tightens Conscientiousness and Priority signals versus the adaptive trace; gaps between claims and dates read as calibration error until sealed.",
  },
  "YOU-003": {
    source: "sovereign:deposition/session_01",
    fileType: "TRANSCRIPT",
    dateMounted: "2026-04-14",
    auditorNotes:
      "Deposition narrative binds Empathy and Dominance offsets; sealing commits the transcript to the sovereign record used for radar blending.",
  },
  "COM-001": {
    source: "company:mission_statement_v3",
    fileType: "PDF",
    dateMounted: "2026-03-18",
    auditorNotes:
      "North star language shifts COMPANY trace weighting toward Priority and Influence in cross-hub reads.",
  },
  "COM-002": {
    source: "hris:exports/org_chart_q1",
    fileType: "PNG",
    dateMounted: "2026-04-01",
    auditorNotes:
      "Org structure metadata informs reporting-line friction signals used in forensic COMPANY alignment.",
  },
  "COM-003": {
    source: "culture:values_framework",
    fileType: "PDF",
    dateMounted: "2026-03-22",
    auditorNotes:
      "Values document tightens Steadiness versus Agility interpretation on the enterprise pillar ledger.",
  },
  "WRK-001": {
    source: "okr:cycle/q1_metadata",
    fileType: "JSON",
    dateMounted: "2026-04-10",
    auditorNotes:
      "OKR graph drives WORK signal contribution to Pace and Priority on the execution layer.",
  },
  "WRK-002": {
    source: "ops:journals/weekly_w14",
    fileType: "MD",
    dateMounted: "2026-04-12",
    auditorNotes:
      "Weekly narrative adjusts perceived load versus commit; sealing locks the week into velocity calibration.",
  },
  "WRK-003": {
    source: "projects:zeus/brief_signed",
    fileType: "PDF",
    dateMounted: "2026-04-15",
    auditorNotes:
      "Program brief increases Agility and Dominance weight on portfolio proof for the WORK ledger.",
  },
};

/** Forensic verdict body for pillar Asset Inspector (no em dashes). */
export function buildPillarForensicVerdict(
  domain: SovereignLedgerDomain,
  recordId: string,
  assetTitle: string,
  auditorNotes: string,
  archetypeVerdict: string | null,
): string {
  const base = auditorNotes.replace(/\u2014/g, "-");
  const arch = (archetypeVerdict ?? "").toLowerCase();
  const mentionsInitiator = arch.includes("initiator");
  const isYouPersonalityLine =
    domain === "YOU" &&
    (recordId === "YOU-003" || assetTitle.toLowerCase().includes("personality"));
  if (domain === "YOU" && (mentionsInitiator || isYouPersonalityLine)) {
    return `${base} This line is consistent with the Initiator posture: with Active ON and a seal where policy requires, it increases Influence and Pace on the Identity radar.`;
  }
  if (domain === "YOU") {
    return `${base} On the YOU pillar this shifts radar weights when Active is ON and the line is sealed where policy requires.`;
  }
  if (domain === "COMPANY") {
    return `${base} On the COMPANY pillar this shifts organizational trace and friction signals used in cross-hub reads.`;
  }
  if (domain === "WORK") {
    return `${base} On the WORK pillar this moves execution velocity and delivery proof on the record.`;
  }
  return base;
}

/** Full auditor analysis with explicit exhibit IDs for chain of custody. */
export function buildAuditorChainAnalysis(
  domain: SovereignLedgerDomain,
  recordId: string,
  assetTitle: string,
  auditorNotes: string,
  archetypeVerdict: string | null,
  sources: readonly ArtifactSource[],
): string {
  const pillar = buildPillarForensicVerdict(
    domain,
    recordId,
    assetTitle,
    auditorNotes,
    archetypeVerdict,
  );
  const ids = sources.map((s) => s.id).join(", ");
  return `Chain of custody for ${recordId} ties to exhibits ${ids}. The auditor cross-checked these artifacts before locking calibration. ${pillar}`;
}

/** Narrow analysis when a single source row is focused. */
export function auditorAnalysisForFocusedSource(
  fullAnalysis: string,
  sources: readonly ArtifactSource[],
  focusId: string | null,
): string {
  if (!focusId) return fullAnalysis;
  const s = sources.find((x) => x.id === focusId);
  if (!s) return fullAnalysis;
  const page = s.pageHint ? ` scope ${s.pageHint}` : "";
  return `Evidence focus: ${s.id} [${s.tag}] ${s.label}${page}. The auditor re-weights the claim using this exhibit as the primary line of proof. ${fullAnalysis}`;
}

export function inferFileTypeFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("://")) return "URL";
  const ext = name.includes(".") ? lower.split(".").pop() ?? "" : "";
  if (ext === "pdf") return "PDF";
  if (ext === "png" || ext === "jpg" || ext === "jpeg") return "IMG";
  if (ext === "json") return "JSON";
  if (ext === "md" || ext === "mdx") return "MD";
  if (!ext) return "ASSET";
  return ext.toUpperCase().slice(0, 8);
}
