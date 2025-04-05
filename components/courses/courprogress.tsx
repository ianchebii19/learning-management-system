// @ts-nocheck
"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
  value: number;
  variant?: "default" | "success";
}

export const CourseProgress = ({
  value,
  variant = "default",
}: CourseProgressProps) => {
  return (
    <div>
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
      <p className="text-xs text-gray-500 mt-1 text-right">
        {Math.round(value)}% complete
      </p>
    </div>
  );
};