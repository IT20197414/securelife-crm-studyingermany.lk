import { NextResponse } from "next/server";
import { readDatabaseState, writeDatabaseState } from "@/lib/server-db";
import { CRMState } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const state = readDatabaseState();
  return NextResponse.json(state);
}

export async function PUT(request: Request) {
  const body = (await request.json()) as CRMState;
  const state = writeDatabaseState(body);
  return NextResponse.json(state);
}
