"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { blogAPI } from "@/actions/blogActions";
import { BlogCard } from "@/components/layout/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search, Filter, X } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";

export default function BlogsPage() {
  const [filterTitle, setFilterTitle] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");

  // Debounce filter values to avoid too many API calls
  const debouncedTitle = useDebounce(filterTitle, 500);
  const debouncedAuthor = useDebounce(filterAuthor, 500);

  const loaderRef = useRef<HTMLDivElement>(null);

  // useInfiniteQuery for infinite scrolling
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["blogs", debouncedTitle, debouncedAuthor],
    queryFn: async ({ pageParam = 1 }) => {
      const params: Record<string, string> = {
        page: pageParam.toString(),
        limit: "6",
      };

      if (debouncedTitle[0].trim()) {
        params.search = debouncedTitle[0].trim();
      }

      if (debouncedAuthor[0].trim()) {
        params.author = debouncedAuthor[0].trim();
      }

      const response = await blogAPI.getBlogs(params);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages into a single array of blogs
  const allBlogs = data?.pages.flatMap((page) => page.blogs) || [];

  const clearFilters = () => {
    setFilterTitle("");
    setFilterAuthor("");
  };

  const hasActiveFilters = filterTitle.trim() || filterAuthor.trim();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">All Blogs</h1>
            <p className="text-muted-foreground mt-2">
              Discover amazing content from our community
            </p>
          </div>
          <Link href="/blogs/create">
            <Button className="w-full sm:w-auto">Create New Blog</Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title..."
                  value={filterTitle}
                  onChange={(e) => setFilterTitle(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by author..."
                  value={filterAuthor}
                  onChange={(e) => setFilterAuthor(e.target.value)}
                  className="pl-10"
                />
              </div>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                {filterTitle.trim() && (
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {`Title: ${filterTitle.trim()}`}
                  </div>
                )}
                {filterAuthor.trim() && (
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {`Author: ${filterAuthor.trim()}`}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading blogs..."
              : allBlogs.length > 0
              ? `Showing ${allBlogs.length} blog${
                  allBlogs.length === 1 ? "" : "s"
                }`
              : "No blogs found"}
            {hasActiveFilters && " matching your filters"}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-muted-foreground">Loading blogs...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Error Loading Blogs
            </h3>
            <p className="text-muted-foreground mb-6">
              Something went wrong while loading the blogs. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </Card>
        )}

        {/* Blog Grid */}
        {!isLoading && !isError && (
          <>
            {allBlogs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {allBlogs.map((blog, index) => (
                  <div
                    key={`${blog._id}-${index}`}
                    className="transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    <BlogCard blog={blog} showAuthor={true} />
                  </div>
                ))}
              </div>
            ) : !hasActiveFilters ? (
              // No blogs at all
              <Card className="p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">No Blogs Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to share your thoughts with the community!
                </p>
                <Link href="/blogs/create">
                  <Button>Create First Blog</Button>
                </Link>
              </Card>
            ) : (
              // No blogs matching filters
              <Card className="p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">
                  No Matching Blogs
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search filters or create a new blog.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Link href="/blogs/create">
                    <Button>Create Blog</Button>
                  </Link>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Infinite Scroll Loader */}
        {hasNextPage && allBlogs.length > 0 && (
          <div ref={loaderRef} className="flex justify-center py-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-muted-foreground">
                {isFetchingNextPage
                  ? "Loading more blogs..."
                  : "Scroll to load more..."}
              </span>
            </div>
          </div>
        )}

        {/* End of Results */}
        {!hasNextPage && allBlogs.length > 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You have reached the end!</p>
          </div>
        )}
      </div>
    </div>
  );
}
