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
import { Pencil } from "lucide-react";
import { Input } from "../ui/input";

const formSchema = z.object({
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number",
  }).refine((value) => value === 0 || value >= 1, {
    message: "Price must be at least 1 or free (0)",
  }),
});

interface PriceFormProps {
  initialData: {
    price: number | null;
  };
  courseId: string;
}

const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price ?? undefined,
    },
  });

  const toggleEdit = () => setIsEditing((current) => !current);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course price updated successfully");
      router.refresh();
      toggleEdit();
    } catch (error) {
      console.error("Error updating course price:", error);
      toast.error("Something went wrong while updating the course price");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Price
        <Button onClick={toggleEdit} variant="ghost" disabled={isSubmitting}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Price
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p
          className={cn(
            "text-sm mt-2",
            initialData.price === null ? "italic text-gray-400" : "text-gray-700"
          )}
        >
          {initialData.price !== null 
            ? `$${initialData.price.toFixed(2)}` 
            : "No price set"}
        </p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      disabled={isSubmitting}
                      placeholder="Set course price (0 for free)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={isSubmitting || !form.formState.isDirty}
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default PriceForm;