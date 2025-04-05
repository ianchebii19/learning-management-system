import ChapterAccess from "@/components/chapter/ChapterAcess";
import ChapterDescription from "@/components/chapter/ChapterDescription";
import { PublishChapter } from "@/components/chapter/PublishChapter";
import ChapterVideoForm from "@/components/chapter/VideoForm";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface ChapterPageProps {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
}

const ChapterPage = async ({ params }: ChapterPageProps) => {
  const { courseId, chapterId } = await params;

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      videoUrl: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      courseId: true,
      position: true,
      isFree: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  return (
    <div className="p-6">
      <Link href={`/teacher/courses/${courseId}`}>
      <Button variant={"outline"}>

        <ArrowLeft /> Back To courses
      </Button>
      
      </Link>

      <div className="flex items-center justify-center text-2xl font-medium mb-3">
        Chapter Page
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="space-y-2">
            <h1 className="text-xl font-medium text-gray-600">{chapter.title}</h1>
          </div>
          <div>
            <ChapterDescription
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
          <div>
            <ChapterAccess
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
        </div>


        <div>

          <div>
            <PublishChapter
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>

          <div>
            <ChapterVideoForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>


        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
