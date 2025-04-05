"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

interface VideoPlayerProps {
  url: string | null;
  isLocked: boolean;
}

export const VideoPlayer = ({ url, isLocked }: VideoPlayerProps) => {
  const router = useRouter();

  if (isLocked) {
    return (
      <div className="bg-black aspect-video flex items-center justify-center flex-col gap-y-2 text-secondary">
        <Lock className="h-8 w-8" />
        <p className="text-white">This chapter is locked</p>
        <Button onClick={() => router.push(`/courses/${courseId}/purchase`)}>
          Purchase Course
        </Button>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="aspect-video bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No video available</p>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-black">
      {/* Replace with your actual video player implementation */}
      <video controls className="w-full h-full">
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};