import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatCurrency, parseCurrency } from "@/lib/currency";
import { formatPercent, parsePercent } from "@/lib/percent";
import { cn } from "@/lib/utils";

interface DealCardProps {
  dealCode: string;
  dealName: string;
  type?: string;
  quantity?: string;
  profit?: string;
  roi?: string;
  days?: string;
  onClick?: () => void;
  className?: string;
}

export function DealCard({
  dealCode,
  dealName,
  type,
  quantity,
  profit,
  roi,
  days,
  onClick,
  className,
}: DealCardProps) {
  const profitValue = profit ? parseCurrency(profit) : null;
  const roiValue = roi ? parsePercent(roi) : null;

  return (
    <Card
      className={cn(
        "transition-all",
        onClick && "cursor-pointer hover:shadow-md active:scale-[0.98]",
        className
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{dealName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{dealCode}</p>
          </div>
          {type && (
            <Badge variant="secondary" className="ml-2">
              {type}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {quantity && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-medium">{quantity}</span>
            </div>
          )}
          {profitValue !== null && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Profit:</span>
              <span
                className={cn(
                  "font-medium",
                  profitValue >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {formatCurrency(profitValue)}
              </span>
            </div>
          )}
          {roiValue !== null && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ROI:</span>
              <span
                className={cn(
                  "font-medium",
                  roiValue >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {formatPercent(roiValue)}
              </span>
            </div>
          )}
          {days && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Days Held:</span>
              <span className="font-medium">{days}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

