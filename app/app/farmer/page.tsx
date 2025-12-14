import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";

export default async function FarmerPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;
  if (user.role !== "Farmer" && user.role !== "Partner") {
    redirect("/app");
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Stock management and sales
          </p>
        </div>

        <div className="rounded-lg border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Farmer Dashboard</h2>
          <p className="text-muted-foreground">
            The farmer dashboard is currently under construction. Stock overview, 
            sale creation wizard, and payout tracking features will be available soon.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

