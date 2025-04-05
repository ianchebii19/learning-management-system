// @ts-nocheck

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Chapter, Course } from "@prisma/client";
import { CourseNavbar } from "@/components/courses/navbar";
import { CourseSidebar } from "@/components/courses/sidebar";
import { VideoPlayer } from "@/components/courses/video";

interface ChapterWithProgress extends Chapter {
  progress: number | null;
}

interface CourseWithChapters extends Course {
  chapters: ChapterWithProgress[];
}

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } =await auth();

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId: userId || "",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: userId || "",
        courseId: params.courseId,
      },
    },
  });

  // If course is not free and not purchased, redirect to payment page
  if (!course.isFree && !purchase) {
    return redirect(`/courses/${params.courseId}/purchase`);
  }

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} purchase={!!purchase} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar
          course={course as CourseWithChapters}
          purchase={!!purchase}
        />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">
        <div className="p-6">
          {/* Display the first chapter by default or selected chapter */}
          {course.chapters.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{course.chapters[0].title}</h2>
              <p className="text-gray-600">{course.chapters[0].description}</p>
              <div className="aspect-video">
                <VideoPlayer
                  url={course.chapters[0].videoUrl}
                  isLocked={!course.isFree && !purchase}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No chapters available</h3>
              <p className="mt-1 text-sm text-gray-500">
                This course does not have any published chapters yet
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CoursePage;