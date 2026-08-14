import { AdminConsole } from "@/components/admin-console";
import { SiteShell } from "@/components/site-shell";
import { readDatabaseState } from "@/lib/server-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ login?: string }>;
}) {
  const state = readDatabaseState();
  const params = await searchParams;
  const loginError =
    params?.login === "failed" ? "Invalid email or password. Please try again." : null;

  return (
    <SiteShell title="CRM Dashboard" subtitle="Admin and advisor workspace">
      <AdminConsole initialState={state} loginError={loginError} />
    </SiteShell>
  );
}
