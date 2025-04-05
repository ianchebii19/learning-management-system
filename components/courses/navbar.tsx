"use client";

import { Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CourseNavbarProps {
  course: Course;
  purchase: boolean;
}

export const CourseNavbar = ({ course, purchase }: CourseNavbarProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between p-4 border-b h-full bg-white">
      <h1 className="font-semibold text-xl">{course.title}</h1>
      {!course.isFree && !purchase && (
        <Button
          onClick={() => router.push(`/courses/${course.id}/purchase`)}
          className="bg-blue-600 hover:bg-blue-500"
        >
          Purchase Course
        </Button>
      )}
    </div>
  );
};