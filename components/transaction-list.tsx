"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TransactionRow } from "./transaction-row";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { ArrowLeft, Search } from "lucide-react";
import type { AirtableTransaction } from "@/lib/airtable";

interface TransactionListProps {
  userEmail: string;
  userRole: "Investor" | "Farmer" | "Admin";
  filter?: string;
  dealCode?: string;
}

export function TransactionList({
  userEmail,
  userRole,
  filter,
  dealCode,
}: TransactionListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<AirtableTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadTransactions() {
      try {
        const params = new URLSearchParams();
        if (filter) params.set("filter", filter);
        if (dealCode) params.set("dealCode", dealCode);

        const response = await fetch(`/api/transactions?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [filter, dealCode]);

  const filteredTransactions = transactions.filter((tx) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      tx.fields["Deal Code"]?.toLowerCase().includes(search) ||
      tx.fields["Deal Name"]?.toLowerCase().includes(search) ||
      tx.fields["Item #"]?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-sm text-muted-foreground">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by deal code, name, or item #..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      ) : (
        <div className="border rounded-lg bg-white">
          {filteredTransactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              onClick={() =>
                router.push(`/app/investor/deals/${transaction.fields["Deal Code"]}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

