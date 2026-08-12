import { CRMState, Lead, Plan, CRMUser } from "./types";

export const STORAGE_KEY = "securelife-crm-state";

export function createId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export const defaultPlans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    tier: "Starter protection",
    description:
      "A simple entry-level plan for younger customers who want essential life cover at a manageable premium.",
    coverageAmount: 500000,
    premium: 3500,
    minAge: 18,
    maxAge: 45,
    policyTerm: "10 years",
    benefits: [
      "Core life cover",
      "Easy entry eligibility",
      "Fast approval workflow",
    ],
    tone: "emerald",
  },
  {
    id: "gold",
    name: "Gold",
    tier: "Balanced protection",
    description:
      "A mid-tier plan for customers who want stronger cover, family support, and a better long-term value mix.",
    coverageAmount: 1500000,
    premium: 6800,
    minAge: 21,
    maxAge: 55,
    policyTerm: "15 years",
    benefits: [
      "Higher cover amount",
      "Critical illness add-on",
      "Family-friendly benefits",
    ],
    tone: "amber",
  },
  {
    id: "premium",
    name: "Premium",
    tier: "Maximum protection",
    description:
      "A premium plan for customers who want the strongest coverage and the broadest benefit set available.",
    coverageAmount: 3000000,
    premium: 11000,
    minAge: 25,
    maxAge: 60,
    policyTerm: "20 years",
    benefits: [
      "High cover amount",
      "Critical illness support",
      "Priority advisor handling",
    ],
    tone: "rose",
  },
];

export const defaultUsers: CRMUser[] = [
  {
    id: "admin-1",
    name: "SecureLife Admin",
    email: "admin@securelife.lk",
    password: "admin123",
    role: "Admin",
  },
  {
    id: "advisor-1",
    name: "Nimal Perera",
    email: "advisor1@securelife.lk",
    password: "advisor123",
    role: "Advisor",
  },
  {
    id: "advisor-2",
    name: "Tharushi Silva",
    email: "advisor2@securelife.lk",
    password: "advisor123",
    role: "Advisor",
  },
];

const now = new Date().toISOString();

export const defaultLeads: Lead[] = [
  {
    id: "lead-1",
    fullName: "Kasun Fernando",
    phone: "+94 77 123 4567",
    email: "kasun@example.com",
    age: 31,
    interestedPlan: "Gold",
    source: "Website Quote",
    status: "Follow-up",
    assignedUserId: "advisor-1",
    recommendedPlanId: "gold",
    notes: ["Interested in family cover and critical illness add-on."],
    createdAt: now,
  },
  {
    id: "lead-2",
    fullName: "Dulani Jayasuriya",
    phone: "+94 71 234 5678",
    email: "dulani@example.com",
    age: 24,
    interestedPlan: "Basic",
    source: "Talk to Advisor",
    status: "Contacted",
    assignedUserId: "advisor-2",
    recommendedPlanId: "basic",
    notes: ["Requested a callback after work hours."],
    createdAt: now,
  },
  {
    id: "lead-3",
    fullName: "Chanaka Wijesinghe",
    phone: "+94 70 345 6789",
    email: "chanaka@example.com",
    age: 44,
    interestedPlan: "Premium",
    source: "Phone Call",
    status: "Interested",
    assignedUserId: "advisor-1",
    recommendedPlanId: "premium",
    notes: ["Looking for higher cover and long-term policy term."],
    createdAt: now,
  },
];

export function buildDefaultState(): CRMState {
  return {
    plans: defaultPlans,
    leads: defaultLeads,
    users: defaultUsers,
    session: null,
  };
}

export function recommendPlan(age: number, plans: Plan[]) {
  const inRange = [...plans].filter((plan) => age >= plan.minAge && age <= plan.maxAge);
  if (inRange.length > 0) {
    return inRange.sort((a, b) => b.coverageAmount - a.coverageAmount)[0];
  }

  return [...plans].sort((a, b) => {
    const aDistance = Math.min(Math.abs(age - a.minAge), Math.abs(age - a.maxAge));
    const bDistance = Math.min(Math.abs(age - b.minAge), Math.abs(age - b.maxAge));
    return aDistance - bDistance;
  })[0];
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
}
