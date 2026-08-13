import { NextResponse } from "next/server";
import { createId } from "@/lib/crm-data";
import { readDatabaseState, writeDatabaseState } from "@/lib/server-db";
import { LeadSource } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    fullName?: string;
    phone?: string;
    email?: string;
    age?: number;
    interestedPlan?: string;
    source?: LeadSource;
  };

  if (!body.fullName || !body.phone || !body.email || !body.age || !body.interestedPlan) {
    return NextResponse.json({ message: "Missing required lead details." }, { status: 400 });
  }

  const state = readDatabaseState();
  const advisors = state.users.filter((user) => user.role === "Advisor");
  const assigned = advisors[0] ?? null;
  const recommended = state.plans.find((plan) => plan.name === body.interestedPlan);

  const nextState = writeDatabaseState({
    ...state,
    leads: [
      {
        id: createId("lead"),
        fullName: body.fullName,
        phone: body.phone,
        email: body.email,
        age: Number(body.age),
        interestedPlan: body.interestedPlan,
        source: body.source ?? "Website Quote",
        status: "New",
        assignedUserId: assigned?.id ?? null,
        recommendedPlanId: recommended?.id ?? null,
        notes: [],
        createdAt: new Date().toISOString(),
      },
      ...state.leads,
    ],
  });

  return NextResponse.json(nextState.leads[0], { status: 201 });
}
