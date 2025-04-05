"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Pencil, Video, X } from "lucide-react";
import { Chapter } from "@prisma/client";
import { FileUpload } from "../FileUpload";
import MuxPlayer from "@mux/mux-player-react";

const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: "Video is required",
  }),
});

interface ChapterVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: initialData?.videoUrl || "",
    },
  });

  const { handleSubmit, setValue, watch } = form;
  const videoUrl = watch("videoUrl");

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter video updated successfully");
      router.refresh();
      toggleEdit();
    } catch (error) {
      console.error("Error updating chapter video:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveVideo = async () => {
    try {
      setIsSubmitting(true);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { videoUrl: null });
      setValue("videoUrl", "");
      toast.success("Video removed successfully");
      router.refresh();
    } catch (error) {
      console.error("Error removing video:", error);
      toast.error("Failed to remove video");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Chapter Video
        </div>
        <Button onClick={toggleEdit} variant="ghost" disabled={isSubmitting}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              {videoUrl ? "Change" : "Add"} Video
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        videoUrl ? (
          <div className="relative mt-4 aspect-video rounded-md overflow-hidden bg-black">
            <MuxPlayer
              playbackId={videoUrl}
              streamType="on-demand"
              className="h-full w-full"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-4">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        )
      ) : (
        <div className="mt-4">
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url: string) => {
              if (url) {
                setValue("videoUrl", url);
                handleSubmit(onSubmit)();
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-2">
            Upload a video file (MP4, WebM, MOV)
          </div>

          {videoUrl && (
            <div className="mt-4">
              <Button
                type="button"
                onClick={handleRemoveVideo}
                variant="destructive"
                size="sm"
                disabled={isSubmitting}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Remove Video
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;