import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || undefined;

    const courses = await db.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        category: true,
        chapters: {
          select: {
            id: true,
          },
          where: {
            isPublished: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
    });

    // Calculate progress for each course if user is logged in
    const coursesWithProgress = userId
      ? await Promise.all(
          courses.map(async (course) => {
            const publishedChapters = await db.chapter.count({
              where: {
                courseId: course.id,
                isPublished: true,
              },
            });

            const completedChapters = await db.userProgress.count({
              where: {
                userId,
                isCompleted: true,
                chapter: {
                  courseId: course.id,
                },
              },
            });

            const progress =
              publishedChapters > 0
                ? (completedChapters / publishedChapters) * 100
                : 0;

            return {
              ...course,
              progress,
            };
          })
        )
      : courses;

    return NextResponse.json(coursesWithProgress);
  } catch (error) {
    console.error("[COURSES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}