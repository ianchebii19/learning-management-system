import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } =await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Check if course is published first
    const isCoursePublished = await db.course.findFirst({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    if (!isCoursePublished) {
      return new NextResponse("Course must be published first", { status: 400 });
    }

    // Check if all previous chapters are published
    const unpublishedChapters = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: false,
        position: {
          lt: chapter.position,
        },
      },
    });

    if (unpublishedChapters.length > 0) {
      return new NextResponse(
        "All previous chapters must be published first",
        { status: 400 }
      );
    }

    const updatedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
      },
      data: {
        isPublished: !chapter.isPublished,
      },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}