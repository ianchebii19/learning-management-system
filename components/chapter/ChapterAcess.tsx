// @ts-nocheck

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
import { Pencil, Loader2, Eye } from "lucide-react";
import { Chapter } from "@prisma/client";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const formSchema = z.object({
  isFree: z.boolean().default(false)
});

interface ChapterAccessProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const ChapterAccess = ({ initialData, courseId, chapterId }: ChapterAccessProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: Boolean(initialData.isFree)
    },
  });

  const { isValid } = form.formState;

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      form.reset({ isFree: Boolean(initialData.isFree) });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter access updated");
      router.refresh();
    } catch (error) {
      console.error("Error updating chapter access:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>Access Settings</span>
        </div>
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
              Edit access
            </>
          )}
        </Button>
      </div>
      
      {!isEditing ? (
        <div className={cn(
          "mt-2 text-sm",
          !initialData.isFree && "text-slate-500 italic"
        )}>
          {initialData.isFree ? (
            "This chapter is free to preview"
          ) : (
            "This chapter is not free"
          )}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <Label>
                      Check this box to make this chapter free for preview
                    </Label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
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

export default ChapterAccess;