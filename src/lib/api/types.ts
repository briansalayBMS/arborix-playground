export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  roles: string[];
  mode: string;
  resume_text: string | null;
  linkedin_text: string | null;
  profile_notes: string | null;
}

export interface OnePagerResponse {
  id: string;
  user_id: string;
  completeness_pct: number;
  performance_content: Record<string, unknown> | null;
  job_search_content: Record<string, unknown> | null;
}

export type LedgerSource =
  | "resume"
  | "linkedin"
  | "conversation"
  | "feedback"
  | "self_reported";

export type LedgerConfidenceBand = "conflict" | "flagged" | "action" | "verified";

export type LedgerDomain = "you" | "company" | "work";

export interface LedgerItem {
  id: string;
  claim?: string;
  supporting_detail?: string | null;
  category?: string;
  source?: LedgerSource | string;
  confidence?: number;
  confidence_band?: LedgerConfidenceBand | string;
  validated?: boolean;
  created_by?: "auditor" | "user" | "arbor" | string;
  created_at?: string;
  updated_at?: string;
  domain?: LedgerDomain | string;
}

export interface LedgerCompleteness {
  you: number;
  company: number;
  work: number;
  overall: number;
}

export interface LedgerResponse {
  you: LedgerItem[];
  company: LedgerItem[];
  work: LedgerItem[];
  completeness: LedgerCompleteness;
  total_items: number;
  validated_items: number;
}
