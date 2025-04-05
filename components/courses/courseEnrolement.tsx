"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface CourseEnrollButtonProps {
  courseId: string;
  price?: number | null;
}

export default function CourseEnrollButton({
  courseId,
  price,
}: CourseEnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/courses/${courseId}/checkout`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to initiate checkout");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="lg"
      className="w-full"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          Processing...
        </span>
      ) : price ? (
        `Enroll for $${price.toFixed(2)}`
      ) : (
        "Enroll for Free"
      )}
    </Button>
  );
}