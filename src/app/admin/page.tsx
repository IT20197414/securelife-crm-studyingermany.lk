import { AdminConsole } from "@/components/admin-console";
import { SiteShell } from "@/components/site-shell";

export default function AdminPage() {
  return (
    <SiteShell title="CRM Dashboard" subtitle="Admin and advisor workspace">
      <AdminConsole />
    </SiteShell>
  );
}
