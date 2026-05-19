import type {
  LedgerCompleteness,
  LedgerItem,
  LedgerResponse,
} from "@/lib/api/types";

const EMPTY_COMPLETENESS: LedgerCompleteness = {
  you: 0,
  company: 0,
  work: 0,
  overall: 0,
};

const EMPTY_RESPONSE: LedgerResponse = {
  you: [],
  company: [],
  work: [],
  completeness: EMPTY_COMPLETENESS,
  total_items: 0,
  validated_items: 0,
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeItem(raw: unknown): LedgerItem | null {
  if (!isObject(raw)) return null;
  const id = raw.id;
  if (typeof id !== "string" || id.length === 0) return null;

  const item: LedgerItem = { id };

  if (typeof raw.claim === "string") item.claim = raw.claim;
  if (typeof raw.supporting_detail === "string" || raw.supporting_detail === null) {
    item.supporting_detail = raw.supporting_detail as string | null;
  }
  if (typeof raw.category === "string") item.category = raw.category;
  if (typeof raw.source === "string") item.source = raw.source;
  if (typeof raw.confidence === "number") item.confidence = raw.confidence;
  if (typeof raw.confidence_band === "string") item.confidence_band = raw.confidence_band;
  if (typeof raw.validated === "boolean") item.validated = raw.validated;
  if (typeof raw.created_by === "string") item.created_by = raw.created_by;
  if (typeof raw.created_at === "string") item.created_at = raw.created_at;
  if (typeof raw.updated_at === "string") item.updated_at = raw.updated_at;
  if (typeof raw.domain === "string") item.domain = raw.domain;

  return item;
}

function normalizeArray(raw: unknown): LedgerItem[] {
  if (!Array.isArray(raw)) return [];
  const items: LedgerItem[] = [];
  for (const entry of raw) {
    const item = normalizeItem(entry);
    if (item) items.push(item);
  }
  return items;
}

function normalizeCompleteness(raw: unknown): LedgerCompleteness {
  if (!isObject(raw)) return EMPTY_COMPLETENESS;
  return {
    you: typeof raw.you === "number" ? raw.you : 0,
    company: typeof raw.company === "number" ? raw.company : 0,
    work: typeof raw.work === "number" ? raw.work : 0,
    overall: typeof raw.overall === "number" ? raw.overall : 0,
  };
}

export function normalizeLedgerResponse(raw: unknown): LedgerResponse {
  if (!isObject(raw)) return EMPTY_RESPONSE;
  return {
    you: normalizeArray(raw.you),
    company: normalizeArray(raw.company),
    work: normalizeArray(raw.work),
    completeness: normalizeCompleteness(raw.completeness),
    total_items: typeof raw.total_items === "number" ? raw.total_items : 0,
    validated_items: typeof raw.validated_items === "number" ? raw.validated_items : 0,
  };
}
