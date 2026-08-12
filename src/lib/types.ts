export type PlanTone = "emerald" | "amber" | "rose";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Follow-up"
  | "Interested"
  | "Enrolled"
  | "Lost";

export type LeadSource =
  | "Website Quote"
  | "Talk to Advisor"
  | "Phone Call"
  | "Email"
  | "Referral"
  | "Walk-in"
  | "Manual Entry";

export type UserRole = "Admin" | "Advisor";

export type CRMUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type Plan = {
  id: string;
  name: string;
  tier: string;
  description: string;
  coverageAmount: number;
  premium: number;
  minAge: number;
  maxAge: number;
  policyTerm: string;
  benefits: string[];
  tone: PlanTone;
};

export type Lead = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  age: number;
  interestedPlan: string;
  source: LeadSource;
  status: LeadStatus;
  assignedUserId: string | null;
  recommendedPlanId: string | null;
  notes: string[];
  createdAt: string;
};

export type Session = {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
};

export type CRMState = {
  plans: Plan[];
  leads: Lead[];
  users: CRMUser[];
  session: Session | null;
};
