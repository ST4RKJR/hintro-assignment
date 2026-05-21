export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  login_method: string;
  status: string;
  is_hintro_admin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  plan: string;
  billing_cycle: string;
  status: string;
}

export interface UsageMetric {
  used: number;
  limit: number;
  percentage: number;
}

export interface UsageData {
  kb_files: UsageMetric;
  vocab_terms: number;
  notes: number;
}

export interface DashboardData {
  user: UserProfile;
  subscription: Subscription | null;
  usage: UsageData;
}

export interface CallStats {
  totalSessions: number;
  averageDuration: number;
  totalAIInteractions: number;
  lastSession: string[];
}

export interface Participant {
  name: string;
  isUser: boolean;
}

export interface CallSession {
  _id: string;
  user_id: string;
  status: string;
  client: string;
  description: string;
  started_at: string;
  ended_at: string;
  total_duration_seconds: number;
  language: string[];
  auto_gen_ai_response: boolean;
  save_transcript: boolean;
  transcript: string | null;
  transcript_final: boolean;
  ai_interactions: number;
  call_framework_id: string | null;
  participants: Participant[];
  ended_reason: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CallHistoryResponse {
  callSessions: CallSession[];
  pagination: PaginationInfo;
}

export interface FeedbackData {
  id: string;
  rating: number; // 1-5
  category: string;
  details: string;
  email: string;
  timestamp: string;
}
