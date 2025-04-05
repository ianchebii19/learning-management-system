import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CourseEnrollButton from "@/components/courses/courseEnrolement";
import { CourseProgress } from "@/components/courses/courseprogress";

interface PurchasePageProps {
  params: {
    courseId: string;
  };
  searchParams: {
    success?: string;
    canceled?: string;
  };
}

export default async function PurchasePage({
  params,
  searchParams,
}: PurchasePageProps) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      isPublished: true,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        select: {
          id: true,
        },
      },
      purchases: {
        where: {
          userId,
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const purchase = course.purchases[0];
  const progressCount = await db.userProgress.count({
    where: {
      userId,
      isCompleted: true,
      chapter: {
        courseId: params.courseId,
      },
    },
  });

  const progressPercentage = course.chapters.length > 0 
    ? (progressCount / course.chapters.length) * 100 
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="relative aspect-video mb-6">
            {course.imageUrl ? (
            <Image
                src={course.imageUrl}
                alt={course.title}
                className="object-cover w-full h-full rounded-lg"
                width={400}
                height={225}
              />
            ) : (
              <div className="bg-gray-200 w-full h-full flex items-center justify-center rounded-lg">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>

          {purchase ? (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-green-600 font-medium">
                  You are enrolled in this course
                </span>
              </div>
              <CourseProgress
                value={progressPercentage}
                variant={progressPercentage === 100 ? "success" : "default"}
              />
              <Button className="mt-4 w-full" asChild>
                <Link href={`/dashboard/courses/${course.id}`}>
                  Continue Learning
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-6 w-6 text-yellow-500" />
                <span className="text-yellow-600 font-medium">
                  Not enrolled yet
                </span>
              </div>
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price}
              />
            </div>
          )}

          {searchParams.success && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
              Payment successful! You now have access to this course.
            </div>
          )}

          {searchParams.canceled && (
            <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded-md">
              Payment was canceled. You can try again if you would like.
            </div>
          )}
        </div>

        <div className="md:w-80 space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">What is included</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{course.chapters.length} chapters</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Lifetime access</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Certificate of completion</span>
              </li>
            </ul>
          </div>

          {course.price && !purchase && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Price</h3>
              <p className="text-2xl font-bold">
                ${course.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                One-time payment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}