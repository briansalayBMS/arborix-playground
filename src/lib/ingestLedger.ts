export type LedgerDomain = "YOU" | "COMPANY" | "WORK";

export type ArtifactKind = "URL" | "FILE" | "TEXT";

export type IngestLogRow = {
  id: string;
  source: string;
  type: ArtifactKind;
  ingestedAt: string;
  /** Optional user intent / pre-label from mount station. */
  intent?: string;
  /** Structural auto-detect (before user correction). */
  autoDetectedDomain: LedgerDomain;
  /** Current domain assignment (starts at auto; user may override). */
  domain: LedgerDomain;
  sealed: boolean;
  /** Auditor must resolve before a clean seal. */
  verificationRequired: boolean;
};

export const INGEST_LEDGER_STORAGE_KEY = "arborix:ingest-ledger-v2";
const INGEST_LEDGER_STORAGE_KEY_LEGACY = "arborix:ingest-ledger-v1";

/** Heuristic routing only — does not read optional intent. */
export function suggestFromHeuristicsOnly(type: ArtifactKind, source: string): LedgerDomain {
  const leaf = source.split(/[/\\]/).pop() ?? source;
  const lower = leaf.toLowerCase();

  if (type === "TEXT") return "YOU";

  if (type === "FILE") {
    if (/\b(review|q[1-4]|okr|performance|roadmap|sprint|quarter)\b/i.test(lower)) {
      return "WORK";
    }
    if (/\b(charter|policy|handbook|values|compliance)\b/i.test(lower)) {
      return "COMPANY";
    }
    return "COMPANY";
  }

  const s = source.toLowerCase();
  if (/\b(wiki|company|corp|intranet)\b/.test(s) || s.includes("internal.")) {
    return "COMPANY";
  }
  if (/\.(gov|org)\b/.test(s)) return "WORK";
  return "WORK";
}

/** Map free-text intent to a domain when the user pre-labels. */
export function mapIntentToDomain(intent: string): LedgerDomain | null {
  const s = intent.trim().toLowerCase();
  if (!s) return null;
  if (/\b(personal|private|journal|therapy|health|me|myself|home)\b/.test(s)) return "YOU";
  if (/\b(company|org|policy|hr|leadership|charter|culture|handbook)\b/.test(s)) {
    return "COMPANY";
  }
  if (/\b(work|project|okr|delivery|sprint|quarter|client|roadmap)\b/.test(s)) return "WORK";
  return null;
}

/** Auto domain: explicit intent wins when it maps; else heuristics. */
export function computeAutoDomain(
  type: ArtifactKind,
  source: string,
  intent?: string,
): LedgerDomain {
  const fromIntent = intent?.trim() ? mapIntentToDomain(intent) : null;
  if (fromIntent) return fromIntent;
  return suggestFromHeuristicsOnly(type, source);
}

const IDENTITY_SIGNAL =
  /\b(ssn|social security|passport|identity|personal data|phi|hipaa|dob|date of birth|medical|therapy)\b/i;

export function hasHighDensityIdentitySignal(source: string): boolean {
  return IDENTITY_SIGNAL.test(source);
}

/**
 * True when Arborix should not treat the record as clean without human review.
 * `domain` is the current routing assignment (auto or user-corrected).
 */
export function computeVerificationRequired(
  type: ArtifactKind,
  source: string,
  intent: string | undefined,
  domain: LedgerDomain,
): boolean {
  const heuristic = suggestFromHeuristicsOnly(type, source);
  const intentD = intent?.trim() ? mapIntentToDomain(intent) : null;

  if (intentD && intentD !== heuristic) {
    if (domain !== intentD && domain !== heuristic) return true;
  }

  if (domain === "WORK" && hasHighDensityIdentitySignal(source)) return true;

  if (domain === "YOU" && /\b(charter|policy|company handbook|incorporated)\b/i.test(source)) {
    return true;
  }

  return false;
}

export function formatArtifactLabel(source: string): string {
  const leaf = source.split(/[/\\]/).pop() ?? source;
  return leaf.length > 40 ? `${leaf.slice(0, 37)}…` : leaf;
}

export function buildInquiryMessage(row: IngestLogRow): string {
  const label = formatArtifactLabel(row.source);
  const heuristic = suggestFromHeuristicsOnly(row.type, row.source);
  const intentDomain = row.intent?.trim() ? mapIntentToDomain(row.intent) : null;

  if (row.domain === "WORK" && hasHighDensityIdentitySignal(row.source)) {
    return `Artifact '${label}' is mapped to WORK but contains high-density identity data. Confirm domain.`;
  }
  if (intentDomain && intentDomain !== heuristic) {
    return `Artifact '${label}' intent conflicts with structural routing (${row.autoDetectedDomain} auto). Confirm domain.`;
  }
  return `Artifact '${label}' requires verification before seal.`;
}

export function cycleLedgerDomain(d: LedgerDomain): LedgerDomain {
  if (d === "YOU") return "COMPANY";
  if (d === "COMPANY") return "WORK";
  return "YOU";
}

type LegacyRow = {
  id?: string;
  source?: string;
  type?: ArtifactKind;
  ingestedAt?: string;
  calibration?: string;
  needsTestimony?: boolean;
  suggestedDomain?: LedgerDomain;
  autoDetectedDomain?: LedgerDomain;
  domain?: LedgerDomain;
  sealed?: boolean;
  status?: string;
  intent?: string;
  verificationRequired?: boolean;
};

export function normalizeIngestLedgerRow(raw: unknown): IngestLogRow | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as LegacyRow;
  if (!r.id || !r.source || !r.type || !r.ingestedAt) return null;

  const autoDetectedDomain =
    r.autoDetectedDomain ?? r.suggestedDomain ?? computeAutoDomain(r.type, r.source, r.intent);
  const domain = r.domain ?? autoDetectedDomain;
  const sealed = Boolean(r.sealed);
  const intent = r.intent;

  let verificationRequired = r.verificationRequired;
  if (verificationRequired === undefined) {
    verificationRequired = sealed
      ? false
      : computeVerificationRequired(r.type, r.source, intent, domain);
  }

  return {
    id: r.id.startsWith("ARX-") ? r.id.replace(/^ARX-/, "AX-") : r.id,
    source: r.source,
    type: r.type,
    ingestedAt: r.ingestedAt,
    intent,
    autoDetectedDomain,
    domain,
    sealed,
    verificationRequired,
  };
}

export function loadIngestLedger(): IngestLogRow[] | null {
  if (typeof window === "undefined") return null;
  try {
    let raw = window.localStorage.getItem(INGEST_LEDGER_STORAGE_KEY);
    if (!raw) {
      raw = window.localStorage.getItem(INGEST_LEDGER_STORAGE_KEY_LEGACY);
    }
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const next = parsed
      .map(normalizeIngestLedgerRow)
      .filter((x): x is IngestLogRow => x !== null);
    return next.length > 0 ? next : null;
  } catch {
    return null;
  }
}

export function saveIngestLedger(rows: IngestLogRow[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(INGEST_LEDGER_STORAGE_KEY, JSON.stringify(rows));
  } catch {
    /* ignore quota */
  }
}
