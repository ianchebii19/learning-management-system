"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

interface CourseProgressProps {
  value: number;
  variant?: "default" | "success";
  size?: "default" | "sm";
}

export const CourseProgress = ({
  value,
  variant,
  size = "default",
}: CourseProgressProps) => {
  return (
    <div className={cn(
      "flex items-center gap-2",
      size === "sm" ? "text-xs" : "text-sm"
    )}>
      <Progress
        value={value}
        className={cn(
          "h-2",
          variant === "success" && "bg-emerald-100"
        )}
        indicatorClassName={cn(
          variant === "success" ? "bg-emerald-500" : "bg-blue-500"
        )}
      />
      <div className={cn(
        "flex items-center gap-1",
        variant === "success" ? "text-emerald-700" : "text-blue-700"
      )}>
        {variant === "success" && (
          <CheckCircle className="h-4 w-4" />
        )}
        <span>
          {Math.round(value)}% Complete
        </span>
      </div>
    </div>
  );
};