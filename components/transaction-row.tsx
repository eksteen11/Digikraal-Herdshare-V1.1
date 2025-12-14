import { formatCurrency, parseCurrency } from "@/lib/currency";
import { formatPercent, parsePercent } from "@/lib/percent";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import type { AirtableTransaction } from "@/lib/airtable";

interface TransactionRowProps {
  transaction: AirtableTransaction;
  onClick?: () => void;
  className?: string;
}

export function TransactionRow({ transaction, onClick, className }: TransactionRowProps) {
  const { fields } = transaction;

  const dealCode = fields["Deal Code"] || "N/A";
  const dealName = fields["Deal Name"] || "N/A";
  const type = fields["Type"] || "N/A";
  const date = fields["Date - Sales"] || fields["Date - Purchases"] || "N/A";
  const quantity = fields["Quantity - Sell"] || fields["Quantity - Purchase"] || "0";
  const profit = fields["Investor Profit"] || fields["Partner Profit"] || fields["Net Profit"];
  const profitValue = profit ? parseCurrency(profit) : null;

  return (
    <div
      className={cn(
        "border-b last:border-b-0 p-4 hover:bg-muted/50 transition-colors",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{dealName}</span>
            <Badge variant="outline" className="text-xs">
              {dealCode}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {type}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            <span>{date}</span>
            <span className="mx-2">•</span>
            <span>Qty: {quantity}</span>
          </div>
        </div>
        {profitValue !== null && (
          <div
            className={cn(
              "text-right font-medium",
              profitValue >= 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {formatCurrency(profitValue)}
          </div>
        )}
      </div>
    </div>
  );
}

