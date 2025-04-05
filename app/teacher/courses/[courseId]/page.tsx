// @ts-nocheck

import AttachmentForm from "@/components/course/AttachmentForm";
import CategoryForm from "@/components/course/CategoryForm";
import ChapterForm from "@/components/course/ChapterForm";
import DescriptionForm from "@/components/course/DescriptionForm";
import ImageForm from "@/components/course/ImageForm";
import PriceForm from "@/components/course/PriceForm";
import { PublishChapter } from "@/components/course/PublishCourse";
import TitleForm from "@/components/course/TitleForm";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some(chapter => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">

          <div className="flex items-center gap-2">
            <div>
            <TitleForm initialData={course} courseId={params.courseId} />
            </div>
            <div>
              <PublishChapter initialData={course} courseId={params.courseId} />
            </div>
          </div>
          
          <DescriptionForm
            initialData={{
              ...course,
              description: course.description || ""
            }}
            courseId={params.courseId}
          />
          <ImageForm initialData={course} courseId={params.courseId} />
          <CategoryForm
            initialData={course}
            courseId={params.courseId}
            options={categoryOptions}
          />
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-600 mb-4">
              Course Chapters
            </h2>
            <ChapterForm
              initialData={{
                chapters: course.chapters,
              }}
              courseId={params.courseId}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-600">
              Sell Your Course
            </h2>
            <PriceForm initialData={course} courseId={params.courseId} />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-600">
              Course Resources
            </h2>
            <AttachmentForm
              initialData={course}
              courseId={params.courseId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}