// @ts-nocheck

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Chapter } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PublishCourseProps {
  initialData: Chapter;
  courseId: string;
}

export const PublishChapter = ({
  initialData,
  courseId,
}: PublishCourseProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDialog = () => setIsOpen(!isOpen);

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      await axios.patch(
        `/api/courses/${courseId}`,
        { isPublished: !initialData.isPublished }
      );
      toast.success(
        initialData.isPublished
          ? "Course unpublished successfully"
          : "Course published successfully"
      );
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-x-2">
        <Button
          onClick={toggleDialog}
          variant={initialData.isPublished ? "destructive" : "outline"}
          size="sm"
          className="gap-2"
        >
          {initialData.isPublished ? (
            <>
              <EyeOff className="h-4 w-4" />
              Unpublish
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Publish
            </>
          )}
        </Button>
        <Badge variant={initialData.isPublished ? "success" : "secondary"}>
          {initialData.isPublished ? "Published" : "Draft"}
        </Badge>
      </div>

      <Dialog open={isOpen} onOpenChange={toggleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {initialData.isPublished ? "Unpublish Course?" : "Publish Course?"}
            </DialogTitle>
            <DialogDescription>
              {initialData.isPublished
                ? "This will make the Course unavailable to students. Are you sure?"
                : "This will make the Course available to students. Are you ready to publish?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={toggleDialog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              variant={initialData.isPublished ? "destructive" : "default"}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : initialData.isPublished ? (
                "Confirm Unpublish"
              ) : (
                "Confirm Publish"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};