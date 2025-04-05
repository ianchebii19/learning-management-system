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
import { PlusCircle, Pencil, X, Loader2, ChevronsUpDown } from "lucide-react";
import { Input } from "../ui/input";
import { Chapter } from "@prisma/client";
import { Badge } from "../ui/badge";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title must be at least 1 character." }),
});

interface ChapterFormProps {
  initialData: {
    chapters: Chapter[];
  };
  courseId: string;
}

const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const toggleCreating = () => {
    setIsCreating((current) => !current);
    setEditingId(null);
  };

  const handleEdit = (chapter: Chapter) => {
    setEditingId(chapter.id);
    form.setValue("title", chapter.title);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      if (editingId) {
        // Update existing chapter
        await axios.patch(`/api/courses/${courseId}/chapters/${editingId}`, values);
        toast.success("Chapter updated successfully");
      } else {
        // Create new chapter
        await axios.post(`/api/courses/${courseId}/chapters`, values);
        toast.success("Chapter created successfully");
      }
      router.refresh();
      form.reset();
      setEditingId(null);
      setIsCreating(false);
    } catch (error) {
      console.error("Error saving chapter:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async (chapterId: string) => {
    try {
      setDeletingId(chapterId);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success("Chapter deleted");
      router.refresh();
    } catch (error) {
      console.error("Error deleting chapter:", error);
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData
      });
      toast.success("Chapters reordered");
      router.refresh();
    } catch (error) {
      console.error("Error reordering chapters:", error);
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(initialData.chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updateData = items.map((item, index) => ({
      id: item.id,
      position: index
    }));

    onReorder(updateData);
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 relative">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course Chapters
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            "Cancel"
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={isSubmitting}
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                Create
              </Button>
            </div>
          </form>
        </Form>
      )}

      {!isCreating && initialData.chapters.length === 0 && (
        <div className="flex items-center justify-center h-20 bg-slate-200 rounded-md mt-4">
          <p className="text-sm text-slate-500">No chapters yet</p>
        </div>
      )}

      {!isCreating && initialData.chapters.length > 0 && (
        <div className="mt-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {initialData.chapters.map((chapter, index) => (
                    <Draggable 
                      key={chapter.id} 
                      draggableId={chapter.id} 
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "flex items-center gap-x-2 bg-red-100 border rounded-md mb-2 p-3",
                            editingId === chapter.id && "bg-sky-100"
                          )}
                        >
                          <div 
                            {...provided.dragHandleProps}
                            className="flex-shrink-0"
                          >
                            <ChevronsUpDown className="h-4 w-4 text-slate-500" />
                          </div>
                          {editingId === chapter.id ? (
                            <Form {...form}>
                              <form 
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex-1 flex items-center gap-x-2"
                              >
                                <FormField
                                  control={form.control}
                                  name="title"
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormControl>
                                        <Input
                                          disabled={isSubmitting}
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="flex items-center gap-x-1">
                                  <Button
                                    size="sm"
                                    type="submit"
                                    disabled={isSubmitting}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                    onClick={cancelEdit}
                                    disabled={isSubmitting}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </form>
                            </Form>
                          ) : (
                            <>
                              <div className="flex-1">
                                <Link href={`/teacher/courses/${courseId}/chapters/${chapter.id}`}>
                                <p className="font-medium">{chapter.title}</p>
                                </Link>
                                <div className="flex items-center gap-x-2 mt-1">
                                  <Badge variant={chapter.isPublished ? "success" : "secondary"}>
                                    {chapter.isPublished ? "Published" : "Draft"}
                                  </Badge>
                                  <span className="text-xs text-slate-500">
                                    {chapter.position + 1}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(chapter)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => onDelete(chapter.id)}
                                  disabled={deletingId === chapter.id}
                                >
                                  {deletingId === chapter.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <X className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <p className="text-xs text-muted-foreground mt-4">
            Drag and drop to reorder chapters
          </p>
        </div>
      )}
    </div>
  );
};

export default ChapterForm;