// app/dashboard/student/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Clock } from "lucide-react";
import Image from "next/image";
import { CourseProgress } from "@/components/courses/courprogress";

export default async function StudentDashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  // Fetch purchased courses with progress data
  const purchasedCourses = await db.purchase.findMany({
    where: {
      userId: userId,
    },
    select: {
      course: {
        include: {
          category: true,
          chapters: {
            where: {
              isPublished: true,
            },
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  // Calculate progress for each course
  const coursesWithProgress = await Promise.all(
    purchasedCourses.map(async (purchase) => {
      const completedChapters = await db.userProgress.count({
        where: {
          userId: userId,
          isCompleted: true,
          chapter: {
            courseId: purchase.course.id,
          },
        },
      });

      const progressPercentage =
        purchase.course.chapters.length > 0
          ? Math.round((completedChapters / purchase.course.chapters.length) * 100)
          : 0;

      return {
        ...purchase.course,
        progress: progressPercentage,
      };
    })
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Learning Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/browse">Browse More Courses</Link>
        </Button>
      </div>

      {coursesWithProgress.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesWithProgress.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <Link href={`/dashboard/courses/${course.id}`}>
                <CardHeader className="p-0">
                  <div className="relative aspect-video">
                    {course.imageUrl ? (
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        className="object-cover w-full h-full rounded-t-lg"
                        width={400}
                        height={225}
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-full flex items-center justify-center rounded-t-lg">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">
                    {course.title}
                  </CardTitle>
                  {course.category && (
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mb-3">
                      {course.category.name}
                    </span>
                  )}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      {course.progress === 100 ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">Completed</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-blue-600">In Progress</span>
                        </>
                      )}
                    </div>
                    <CourseProgress
                      value={course.progress}
                      variant={course.progress === 100 ? "success" : "default"}
                    />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            You have not purchased any courses yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Browse our catalog to find courses that match your interests
          </p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/browse">Browse Courses</Link>
          </Button>
        </div>
      )}
    </div>
  );
}