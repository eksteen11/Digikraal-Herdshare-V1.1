import { NextResponse } from "next/server";
import { getServerSessionFromRequest } from "@/lib/auth";
import { getTransactions, getUserByEmail } from "@/lib/airtable";
import { parseCurrency } from "@/lib/currency";

export async function GET(request: Request) {
  try {
    const session = await getServerSessionFromRequest(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");
    const dealCode = searchParams.get("dealCode");

    let transactions;

    if (user.role === "Admin") {
      // Admin sees everything
      transactions = await getTransactions({
        dealCode: dealCode || undefined,
      });
    } else if (user.role === "Investor") {
      // Investor sees their transactions
      const userRecord = await getUserByEmail(user.email || "");
      if (!userRecord) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      const investorName = userRecord.fields["User Name"] || user.name || "";
      transactions = await getTransactions({
        investorName: investorName,
        dealCode: dealCode || undefined,
      });
    } else if (user.role === "Farmer" || user.role === "Partner") {
      // Farmer/Partner sees their transactions
      const userRecord = await getUserByEmail(user.email || "");
      if (!userRecord) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      const partnerName = userRecord.fields["User Name"] || user.name || "";
      transactions = await getTransactions({
        partnerName: partnerName,
        dealCode: dealCode || undefined,
      });
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Apply filters if specified
    if (filter) {
      if (filter === "profit") {
        transactions = transactions
          .filter((tx) => {
            const profit = parseCurrency(tx.fields["Investor Profit"] || "0");
            return profit > 0;
          })
          .sort((a, b) => {
            const profitA = parseCurrency(a.fields["Investor Profit"] || "0");
            const profitB = parseCurrency(b.fields["Investor Profit"] || "0");
            return profitB - profitA;
          });
      } else if (filter === "purchases") {
        transactions = transactions.filter(
          (tx) => parseFloat(tx.fields["Quantity - Purchase"] || "0") > 0
        );
      } else if (filter === "sales") {
        transactions = transactions.filter(
          (tx) => parseFloat(tx.fields["Quantity - Sell"] || "0") > 0
        );
      }
    }

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

