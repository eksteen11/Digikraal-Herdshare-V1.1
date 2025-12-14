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
    if (user.role !== "Investor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get user to find their name for filtering
    const userRecord = await getUserByEmail(user.email || "");
    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const investorName = userRecord.fields["User Name"] || user.name || "";

    // Get all transactions for this investor
    const transactions = await getTransactions({
      investorName: investorName,
    });

    // Calculate capital invested from user record
    const capitalInvested = parseCurrency(
      userRecord.fields["Total Investment Amount"] || "0"
    );

    // Calculate metrics from transactions
    let totalItemsBought = 0;
    let totalItemsSold = 0;
    let totalProfit = 0;
    let totalDays = 0;
    let daysCount = 0;

    transactions.forEach((tx) => {
      const qtyPurchase = parseFloat(tx.fields["Quantity - Purchase"] || "0");
      const qtySell = parseFloat(tx.fields["Quantity - Sell"] || "0");
      const profit = parseCurrency(tx.fields["Investor Profit"] || "0");
      const days = parseFloat(tx.fields["Days"] || "0");

      totalItemsBought += qtyPurchase;
      totalItemsSold += qtySell;
      totalProfit += profit;

      if (days > 0) {
        totalDays += days;
        daysCount++;
      }
    });

    const averageDaysHeld = daysCount > 0 ? totalDays / daysCount : 0;

    // Calculate ROI
    const roi = capitalInvested > 0 ? totalProfit / capitalInvested : 0;

    // Calculate annualized ROI
    const annualizedRoi =
      averageDaysHeld > 0 ? Math.pow(1 + roi, 365 / averageDaysHeld) - 1 : 0;

    return NextResponse.json({
      capitalInvested,
      totalItemsBought,
      totalItemsSold,
      totalProfit,
      averageDaysHeld,
      roi,
      annualizedRoi,
    });
  } catch (error) {
    console.error("Error fetching investor metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

