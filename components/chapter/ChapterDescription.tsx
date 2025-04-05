"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Chapter } from "@prisma/client";

const formSchema = z.object({
  description: z.string()
    .min(2, { message: "Description must be at least 2 characters." })
    .max(1000, { message: "Description must be less than 1000 characters." })
    .optional(),
});

interface ChapterDescriptionProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const ChapterDescription = ({ initialData, courseId, chapterId }: ChapterDescriptionProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "",
    },
  });

  const { isValid, isDirty } = form.formState;

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      form.reset({ description: initialData.description || "" });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter description updated");
      router.refresh();
    } catch (error) {
      console.error("Error updating chapter description:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Description
        <Button 
          onClick={toggleEdit} 
          variant="ghost"
          size="sm"
          className={isEditing ? "text-muted-foreground" : ""}
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              {initialData.description ? "Edit description" : "Add description"}
            </>
          )}
        </Button>
      </div>
      
      {!isEditing ? (
        <div className={cn(
          "mt-2 text-sm whitespace-pre-line",
          !initialData.description && "text-slate-500 italic"
        )}>
          {initialData.description || "No description provided"}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Describe what students will learn in this chapter..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting || (!isDirty && !initialData.description)}
                type="submit"
                size="sm"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ChapterDescription;