import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";

export default async function AdminPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;
  if (user.role !== "Admin") {
    redirect("/app");
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            System overview and management
          </p>
        </div>

        <div className="rounded-lg border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            The admin dashboard is currently under construction. Full system KPIs, 
            transaction management, and proof generation features will be available soon.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

