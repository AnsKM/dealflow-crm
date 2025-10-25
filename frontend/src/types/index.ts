export enum DealStage {
  LEAD = "lead",
  QUALIFIED = "qualified",
  PROPOSAL = "proposal",
  NEGOTIATION = "negotiation",
  CLOSED_WON = "closed_won",
  CLOSED_LOST = "closed_lost",
}

export enum ActivityType {
  NOTE = "note",
  CALL = "call",
  EMAIL = "email",
  MEETING = "meeting",
  STAGE_CHANGE = "stage_change",
  SYSTEM = "system",
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  tenant_id: number;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Deal {
  id: number;
  tenant_id: number;
  title: string;
  company_name: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  value: number;
  stage: DealStage;
  health_score: number;
  last_contact_at?: string;
  expected_close_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  next_actions?: string[];
}

export interface DealCreate {
  title: string;
  company_name: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  value: number;
  stage?: DealStage;
  expected_close_date?: string;
  notes?: string;
}

export interface DealUpdate {
  title?: string;
  company_name?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  value?: number;
  stage?: DealStage;
  expected_close_date?: string;
  notes?: string;
}

export interface Activity {
  id: number;
  deal_id: number;
  user_id: number;
  activity_type: ActivityType;
  title: string;
  description?: string;
  created_at: string;
}

export interface ActivityCreate {
  deal_id: number;
  activity_type: ActivityType;
  title: string;
  description?: string;
}

export interface PipelineSummary {
  active_deals: number;
  pipeline_value: number;
  average_health_score: number;
  at_risk_count: number;
  revenue_at_risk: number;
  closing_soon_count: number;
}

export interface DealInsights {
  summary: PipelineSummary;
  weekly_summary: string;
  at_risk_deals: Deal[];
  high_priority_deals: Deal[];
  upcoming_close_deals: Deal[];
  stage_conversion_rates: Record<string, number>;
}
