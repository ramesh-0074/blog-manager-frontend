"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useBlogStore } from "@/store/blogStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowRight, Plus } from "lucide-react";
import { blogAPI, IBlog } from "@/actions/blogActions";
import { BlogCard } from "@/components/layout/BlogCard";

export default function Home() {
  const { blogs, setBlogs } = useBlogStore();
  const { isAuthenticated } = useAuthStore();
  const [myBlogs, setMyBlogs] = useState<IBlog[]>([]);

  // Fetch public blogs
  const { data: publicBlogsData, isLoading: publicLoading } = useQuery({
    queryKey: ["public-blogs"],
    queryFn: () => blogAPI.getBlogs(),
  });

  // Fetch user's blogs (only if authenticated)
  const { data: myBlogsData, isLoading: myBlogsLoading } = useQuery({
    queryKey: ["my-blogs"],
    queryFn: () => blogAPI.getMyBlogs(),
    enabled: isAuthenticated,
  });
  useEffect(() => {
    if (publicBlogsData && publicBlogsData?.data.blogs) {
      setBlogs(publicBlogsData.data.blogs);
    }
  }, [publicBlogsData, setBlogs]);

  useEffect(() => {
    if (myBlogsData?.data.blogs) {
      setMyBlogs(myBlogsData.data.blogs);
    }
  }, [myBlogsData]);

  // Loading state
  if (publicLoading) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // No blogs at all state
  if ((!blogs || blogs.length === 0) && (!myBlogs || myBlogs.length === 0)) {
    return (
      <div className="container mx-auto min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">No Blogs Found</CardTitle>
            <CardDescription className="text-center">
              {isAuthenticated
                ? "It looks like there are no blogs yet. Create one to get started!"
                : "No public blogs are available. Sign in to create your own blog!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isAuthenticated ? (
              <Link href="/blogs/create">
                <Button className="w-full flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Blog
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <Link href="/auth/login" className="flex-1">
                  <Button  className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" className="flex-1">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main content with tabs
  return (
    <div className="container mx-auto min-h-screen py-4 sm:py-8 px-4">
      {isAuthenticated ? (
        // Authenticated user - show tabs
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <Link href="/blogs/create">
              <Button className="flex items-center gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                New Blog
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="public" className="space-y-6">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
              <TabsTrigger value="public" className="text-sm">
                Public Blogs ({blogs?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="my-blogs" className="text-sm">
                My Blogs ({myBlogs?.length || 0})
              </TabsTrigger>
            </TabsList>

            {/* Public Blogs Tab */}
            <TabsContent value="public" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-semibold">Latest Public Blogs</h2>
                <Link href="/blogs">
                  <Button  className="w-full sm:w-auto">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              {blogs && blogs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {blogs.slice(0,3).map((blog) => (
                    <BlogCard 
                      key={blog._id} 
                      blog={blog} 
                      showAuthor={true} 
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-6 sm:p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No public blogs available yet.
                  </p>
                  <Link href="/blogs/create">
                    <Button className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Public Blog
                    </Button>
                  </Link>
                </Card>
              )}
            </TabsContent>

            {/* My Blogs Tab */}
            <TabsContent value="my-blogs" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-semibold">My Blogs</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link href="/blogs/my-blogs">
                    <Button  className="w-full sm:w-auto">
                      Manage All
                    </Button>
                  </Link>
                  <Link href="/blogs/create">
                    <Button className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-1" />
                      New Blog
                    </Button>
                  </Link>
                </div>
              </div>

              {myBlogsLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : myBlogs && myBlogs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {myBlogs.slice(0,3).map((blog) => (
                    <BlogCard 
                      key={blog._id} 
                      blog={blog} 
                      showAuthor={false} 
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-6 sm:p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    You havent created any blogs yet.
                  </p>
                  <Link href="/blogs/create">
                    <Button className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Blog
                    </Button>
                  </Link>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        // Non-authenticated user - show only public blogs
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold">Latest Blogs</h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Discover amazing content from our community of writers. Join us to
              start sharing your own stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
              <Link href="/auth/register">
                <Button className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button  className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {blogs && blogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {blogs.map((blog) => (
                <BlogCard 
                  key={blog._id} 
                  blog={blog} 
                  showAuthor={true} 
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 sm:p-12 text-center mx-4">
              <h3 className="text-lg font-semibold mb-2">No Blogs Yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to share your thoughts with the community!
              </p>
              <Link href="/auth/register">
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Account & Start Writing
                </Button>
              </Link>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
