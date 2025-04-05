// @ts-nocheck

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Pencil, Eye, EyeOff } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";

export default async function CoursePage({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const currentPage = parseInt(searchParams.page || "1");
  const pageSize = 5;
  const skip = (currentPage - 1) * pageSize;

  const [courses, totalCourses] = await Promise.all([
    db.course.findMany({
      where: { userId },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    db.course.count({ where: { userId } }),
  ]);

  const totalPages = Math.ceil(totalCourses / pageSize);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Button className="bg-blue-600 hover:bg-blue-500">
          <Link href="/teacher/create">Create Course</Link>
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">
                  <Link href={`/teacher/courses/${course.id}`} className="hover:underline">
                    {course.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={course.isPublished ? "success" : "secondary"}>
                    {course.isPublished ? (
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" /> Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <EyeOff className="h-4 w-4" /> Draft
                      </span>
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  {course.price ? `$${course.price.toFixed(2)}` : "Free"}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/teacher/courses/${course.id}`}>
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/teacher/courses"
          />
        </div>
      )}
    </div>
  );
}