"use client";

import Link from "next/link";
import { CourseWithChapters } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CourseSidebarProps {
  course: CourseWithChapters;
  purchase: boolean;
}

export const CourseSidebar = ({ course, purchase }: CourseSidebarProps) => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/dashboard/courses/${course.id}/chapters/${chapter.id}`}
            className={cn(
              "p-4 border-b hover:bg-gray-50 transition",
              chapter.progress === 100 && "bg-green-50"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">{chapter.title}</p>
                <p className="text-xs text-gray-500 truncate">
                  {chapter.description}
                </p>
              </div>
              {!course.isFree && !purchase && (
                <Badge variant="destructive">Locked</Badge>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};