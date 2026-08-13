import { AdminConsole } from "@/components/admin-console";
import { SiteShell } from "@/components/site-shell";
import { readDatabaseState } from "@/lib/server-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function AdminLeadsPage() {
  const state = readDatabaseState();

  return (
    <SiteShell title="CRM Dashboard" subtitle="Admin and advisor workspace">
      <AdminConsole initialState={state} initialTab="leads" />
    </SiteShell>
  );
}
