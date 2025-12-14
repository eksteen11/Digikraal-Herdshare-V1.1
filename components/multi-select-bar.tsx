"use client";

import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface MultiSelectBarProps {
  selectedCount: number;
  onClear: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  }>;
  className?: string;
}

export function MultiSelectBar({
  selectedCount,
  onClear,
  actions = [],
  className,
}: MultiSelectBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "sticky bottom-16 md:bottom-0 z-40 border-t bg-white shadow-lg p-4",
        "flex items-center justify-between gap-4",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
        </span>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "default"}
            size="sm"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

