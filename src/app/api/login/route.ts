import { NextResponse } from "next/server";
import { readDatabaseState, writeDatabaseState } from "@/lib/server-db";
import { Session } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const useDemoAdmin = formData.get("demo") === "admin";
  const email = useDemoAdmin
    ? "admin@securelife.lk"
    : String(formData.get("email") ?? "").trim();
  const password = useDemoAdmin ? "admin123" : String(formData.get("password") ?? "");

  const state = readDatabaseState();
  const user = state.users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password,
  );

  if (!user) {
    writeDatabaseState({ ...state, session: null });
    return NextResponse.redirect(new URL("/admin?login=failed", request.url), 303);
  }

  const session: Session = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  writeDatabaseState({ ...state, session });

  return NextResponse.redirect(new URL("/admin/dashboard", request.url), 303);
}
