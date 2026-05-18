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
