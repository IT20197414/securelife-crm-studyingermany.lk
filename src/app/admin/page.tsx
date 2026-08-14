import { AdminConsole } from "@/components/admin-console";
import { SiteShell } from "@/components/site-shell";
import { readDatabaseState } from "@/lib/server-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function AdminPage({
  searchParams,
}: {
  searchParams?: { login?: string };
}) {
  const state = readDatabaseState();
  const loginError =
    searchParams?.login === "failed" ? "Invalid email or password. Please try again." : null;

  return (
    <SiteShell title="CRM Dashboard" subtitle="Admin and advisor workspace">
      <AdminConsole initialState={state} loginError={loginError} />
    </SiteShell>
  );
}
