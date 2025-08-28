"use client";

import { blogAPI } from "@/actions/blogActions";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Plus,
  Search,
  Edit3,
  Eye,
  BookOpen,
  X,
} from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import { BlogCard } from "@/components/layout/BlogCard";

export default function MyBlogs() {
  const { isAuthenticated, user } = useAuthStore();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch user's blogs
  const {
    data: myBlogsData,
    isLoading: myBlogsLoading,
    isError: myBlogsError,
  } = useQuery({
    queryKey: ["my-blogs"],
    queryFn: () => blogAPI.getMyBlogs(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // // Delete blog mutation
  // const deleteBlogMutation = useMutation({
  //   mutationFn: (blogId: string) => blogAPI.deleteBlog(blogId),
  //   onSuccess: (response) => {
  //     toast.success(response.message || "Blog deleted successfully!");
  //     queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
  //     queryClient.invalidateQueries({ queryKey: ["public-blogs"] });
  //   },
  //   onError: (error: ApiError) => {
  //     toast.error(error.message || "Failed to delete blog");
  //   },
  // });

  // Filtered blogs based on search and status
  const filteredBlogs = React.useMemo(() => {
    if (!myBlogsData?.data?.blogs) return [];

    let filtered = myBlogsData.data.blogs;

    // Filter by search term
    if (debouncedSearch[0].trim()) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(debouncedSearch[0].toLowerCase()) ||
          blog.excerpt?.toLowerCase().includes(debouncedSearch[0].toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((blog) => blog.status === statusFilter);
    }

    return filtered;
  }, [myBlogsData?.data?.blogs, debouncedSearch, statusFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchTerm.trim() || statusFilter !== "all";

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-bold">Authentication Required</h2>
            <p className="text-muted-foreground">
              Please sign in to view your blogs
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/auth/login">
              <Button className="w-full">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (myBlogsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-8">
            <div className="h-8 bg-muted rounded w-48 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-5/6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (myBlogsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
            <p className="text-muted-foreground">
              Failed to load your blogs. Please try again.
            </p>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalBlogs = myBlogsData?.data?.blogs?.length || 0;
  const publishedCount =
    myBlogsData?.data?.blogs?.filter((blog) => blog.status === "published")
      .length || 0;
  const draftCount =
    myBlogsData?.data?.blogs?.filter((blog) => blog.status === "draft")
      .length || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">My Blogs</h1>
                <p className="text-muted-foreground">
                  Manage your blog posts and drafts
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-sm text-muted-foreground mt-4">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {totalBlogs} total
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {publishedCount} published
              </span>
              <span className="flex items-center gap-1">
                <Edit3 className="h-4 w-4" />
                {draftCount} drafts
              </span>
            </div>
          </div>

          <Link href="/blogs/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Blog
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>

                {hasActiveFilters && (
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchTerm.trim() && (
                  <Badge variant="secondary">Search: {searchTerm.trim()}</Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="secondary">Status: {statusFilter}</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredBlogs.length} of {totalBlogs} blog
            {totalBlogs === 1 ? "" : "s"}
            {hasActiveFilters && " matching your filters"}
          </p>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <React.Fragment key={blog?._id}>
                <BlogCard blog={blog} showAuthor={true} />
              </React.Fragment>
            ))}
          </div>
        ) : totalBlogs === 0 ? (
          // No blogs at all
          <Card className="p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No blogs yet</h3>
            <p className="text-muted-foreground mb-6">
              Start writing your first blog post to share your thoughts with the
              world.
            </p>
            <Link href="/blogs/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Blog
              </Button>
            </Link>
          </Card>
        ) : (
          // No blogs matching filters
          <Card className="p-12 text-center">
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No matching blogs</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search filters or create a new blog.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
              <Link href="/blogs/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Blog
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
