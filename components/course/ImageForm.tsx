
// @ts-nocheck

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Pencil, ImageIcon, X } from "lucide-react";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "../FileUpload";

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const { handleSubmit, setValue, watch } = form;
  const imageUrl = watch("imageUrl");

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course image updated successfully");
      router.refresh();
      toggleEdit();
    } catch (error) {
      console.error("Error updating course image:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsSubmitting(true);
      await axios.patch(`/api/courses/${courseId}`, { imageUrl: null });
      setValue("imageUrl", "");
      toast.success("Image removed successfully");
      router.refresh();
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Course Image
        </div>
        <Button onClick={toggleEdit} variant="ghost" disabled={isSubmitting}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              {imageUrl ? "Change" : "Add"} Image
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        imageUrl ? (
          <div className="relative mt-4 aspect-video rounded-md overflow-hidden">
            <Image
              src={imageUrl}
              alt="Course image"
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-4">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        )
      ) : (
        <div className="mt-4">
          <FileUpload
            endpoint="courseImage"
            onChange={(url: string) => {
              if (url) {
                setValue("imageUrl", url);
                handleSubmit(onSubmit)();
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-2">
            Recommended ratio: 16:9
          </div>

          {imageUrl && (
            <div className="mt-4">
              <Button
                type="button"
                onClick={handleRemoveImage}
                variant="destructive"
                size="sm"
                disabled={isSubmitting}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Remove Image
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageForm;