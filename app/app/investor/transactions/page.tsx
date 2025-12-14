import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { TransactionList } from "@/components/transaction-list";

export default async function InvestorTransactionsPage({
  searchParams,
}: {
  searchParams: { filter?: string; dealCode?: string };
}) {
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
      <TransactionList
        userEmail={user.email || ""}
        userRole="Investor"
        filter={searchParams.filter}
        dealCode={searchParams.dealCode}
      />
    </AppShell>
  );
}

