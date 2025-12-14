"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MetricCard } from "./metric-card";
import { formatCurrency } from "@/lib/currency";
import { formatPercent } from "@/lib/percent";
import { DollarSign, TrendingUp, Package, ShoppingCart, Calendar, BarChart3 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface InvestorDashboardProps {
  userEmail: string;
  userName: string;
}

interface Metrics {
  capitalInvested: number;
  totalItemsBought: number;
  totalItemsSold: number;
  totalProfit: number;
  averageDaysHeld: number;
  roi: number;
  annualizedRoi: number;
}

export function InvestorDashboard({ userEmail, userName }: InvestorDashboardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metrics>({
    capitalInvested: 0,
    totalItemsBought: 0,
    totalItemsSold: 0,
    totalProfit: 0,
    averageDaysHeld: 0,
    roi: 0,
    annualizedRoi: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/investor/metrics");
        if (!response.ok) throw new Error("Failed to fetch metrics");
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Error loading investor data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {userName}</h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your investments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Capital Invested"
          value={formatCurrency(metrics.capitalInvested)}
          icon={DollarSign}
          onClick={() => router.push("/app/investor/transactions?filter=capital")}
        />
        <MetricCard
          title="Total Items Bought"
          value={Math.round(metrics.totalItemsBought)}
          icon={Package}
          onClick={() => router.push("/app/investor/transactions?filter=purchases")}
        />
        <MetricCard
          title="Total Items Sold"
          value={Math.round(metrics.totalItemsSold)}
          icon={ShoppingCart}
          onClick={() => router.push("/app/investor/transactions?filter=sales")}
        />
        <MetricCard
          title="Total Profit"
          value={formatCurrency(metrics.totalProfit)}
          icon={TrendingUp}
          subtitle={metrics.totalProfit >= 0 ? "Positive" : "Negative"}
          trend={
            metrics.capitalInvested > 0
              ? {
                  value: Math.round((metrics.totalProfit / metrics.capitalInvested) * 100),
                  isPositive: metrics.totalProfit >= 0,
                }
              : undefined
          }
          onClick={() => router.push("/app/investor/transactions?filter=profit")}
          className={
            metrics.totalProfit >= 0 ? "border-green-200" : "border-red-200"
          }
        />
        <MetricCard
          title="Average Days Held"
          value={Math.round(metrics.averageDaysHeld)}
          icon={Calendar}
          subtitle="days"
          onClick={() => router.push("/app/investor/transactions?filter=days")}
        />
        <MetricCard
          title="ROI"
          value={formatPercent(metrics.roi)}
          icon={BarChart3}
          trend={{
            value: Math.round(metrics.roi * 100),
            isPositive: metrics.roi >= 0,
          }}
          onClick={() => router.push("/app/investor/transactions?filter=roi")}
          className={metrics.roi >= 0 ? "border-green-200" : "border-red-200"}
        />
        {metrics.annualizedRoi !== 0 && (
          <MetricCard
            title="Annualized ROI"
            value={formatPercent(metrics.annualizedRoi)}
            icon={TrendingUp}
            subtitle="Projected annual return"
            trend={{
              value: Math.round(metrics.annualizedRoi * 100),
              isPositive: metrics.annualizedRoi >= 0,
            }}
            onClick={() => router.push("/app/investor/transactions?filter=annualized")}
            className={
              metrics.annualizedRoi >= 0 ? "border-green-200" : "border-red-200"
            }
          />
        )}
      </div>
    </div>
  );
}

