import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { InvestorDashboard } from "@/components/investor-dashboard";

export default async function InvestorPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;
  if (user.role !== "Investor") {
    redirect("/app");
  }

  return (
    <AppShell>
      <InvestorDashboard userEmail={user.email || ""} userName={user.name || ""} />
    </AppShell>
  );
}

