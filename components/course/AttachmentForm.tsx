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
import { Pencil, File, X, Loader2 } from "lucide-react";
import { Attachment, Course } from "@prisma/client";
import { FileUpload } from "../FileUpload";
import Link from "next/link";

const formSchema = z.object({
  url: z.string().min(1, {
    message: "File is required",
  }),
});

interface AttachmentFormProps {
  initialData: Course & { attachments?: Attachment[] };
  courseId: string;
}

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("File uploaded successfully");
      router.refresh();
      form.reset();
      toggleEdit();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    try {
      setDeletingId(attachmentId);
      await axios.delete(`/api/courses/${courseId}/attachments/${attachmentId}`);
      toast.success("File removed successfully");
      router.refresh();
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error("Failed to remove file");
    } finally {
      setDeletingId(null);
    }
  };

  const attachments = initialData.attachments || [];

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <File className="h-5 w-5" />
          <span>Course Resources</span>
          <span className="text-xs text-gray-500 ml-2">
            ({attachments.length} files)
          </span>
        </div>
        <Button 
          onClick={toggleEdit} 
          variant="ghost" 
          disabled={isSubmitting}
          size="sm"
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Add File
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        attachments.length === 0 ? (
          <div className="flex items-center justify-center h-20 bg-slate-200 rounded-md mt-4">
            <p className="text-sm text-slate-500">No files uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-2 mt-4">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-white rounded-md border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <File className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  <Link
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate"
                    title={attachment.name || "Download File"}
                  >
                    {attachment.name || attachment.url.split('/').pop() || "Download File"}
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(attachment.id)}
                  disabled={deletingId === attachment.id}
                >
                  {deletingId === attachment.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="mt-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FileUpload
              endpoint="courseAttachment"
              onChange={(url) => {
                if (url) {
                  form.setValue("url", url);
                  form.handleSubmit(onSubmit)();
                }
              }}
            />
            <div className="text-xs text-muted-foreground mt-2">
              Supported files: PDF, DOC, PPT, XLS, ZIP (Max 20MB)
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;