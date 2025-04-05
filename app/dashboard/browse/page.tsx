"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  imageUrl: string | null;
  category: {
    name: string;
  } | null;
  chapters: { id: string }[];
  purchases: { id: string }[];
  progress?: number;
  price: number;
}

interface Category {
  id: string;
  name: string;
}

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const coursesResponse = await fetch(
          `/api/course`
        );
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = courses.filter((course) => {
    // Filter by search query
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filter by category
    const matchesCategory =
      !selectedCategory || course.category?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button className="bg-blue-600 hover:bg-blue-500">
            Search
          </Button>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex overflow-x-auto pb-2 gap-2">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="whitespace-nowrap"
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={
                selectedCategory === category.name ? "default" : "outline"
              }
              onClick={() => setSelectedCategory(category.name)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative aspect-video">
                    {course.imageUrl ? (
                      <Image
                      src={course.imageUrl}
                      alt={course.title}
                      width={400}  // Added explicit width
                      height={225} // Added explicit height (maintaining 16:9 aspect ratio)
                      className="object-cover w-full h-full rounded-t-lg"
                      priority={false}
                    />
                    ) : (
                      <div className="bg-gray-200 w-full h-full flex items-center justify-center rounded-t-lg">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  {course.category && (
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mb-3">
                      {course.category.name}
                    </span>
                  )}
                </CardContent>
                <CardFooter className="p-4 border-t">
                  <div className="w-full">
                    <div className="flex justify-between text-sm mb-2">
                      <span>
                        {course.chapters.length}{" "}
                        {course.chapters.length === 1 ? "Chapter" : "Chapters"}
                      </span>
                      <span>
                        {course.purchases.length > 0 ? "Purchased" : "Free"}
                      </span>
                      <span className="font-bold">
                        ${course.price}
                      </span>
                    </div>
                    {typeof course.progress === "number" && (
                      <div>
                        <Progress
                          value={course.progress}
                          className="h-2"
                          indicatorClassName="bg-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round(course.progress)}% Complete
                        </p>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            No courses found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}