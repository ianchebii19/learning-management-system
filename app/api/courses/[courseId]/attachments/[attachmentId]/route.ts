import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify course ownership
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      }
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Verify attachment belongs to course
    const attachment = await db.attachement.findFirst({
      where: {
        id: params.attachmentId,
        courseId: params.courseId,
      }
    });

    if (!attachment) {
      return new NextResponse("Attachment not found", { status: 404 });
    }

    // Delete the attachment record
    await db.attachement.delete({
      where: {
        id: params.attachmentId,
      }
    });

    // TODO: Add your file storage deletion logic here
    // Example for UploadThing:
    // await utapi.deleteFiles(attachment.url.split('/').pop()!);

    return NextResponse.json(attachment);

  } catch (error) {
    console.error("[ATTACHMENT_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}