"use client";

import React, { useState, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { blogAPI } from "@/actions/blogActions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Calendar,
  Eye,
  Clock,
  Send,
  Loader2,
  ArrowLeft,
  Share2,
  Bookmark,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { decodeHtmlEntities } from "@/lib/htmlHelper";

type Props = {
  params: Promise<{ slug: string }>; // params is now a Promise
};

interface APIError {
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}



export default function BlogDetailPage({ params }: Props) {
  // Unwrap params using React.use()
  const { slug } = use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);



  // Fetch blog details
  const {
    data: blogData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog", slug, isAuthenticated],
    queryFn: async () => {
      try {
        // If authenticated, try the protected endpoint first
        if (isAuthenticated) {
          return await blogAPI.getBlogBySlugWithAuth(slug);
        } else {
          // If not authenticated, use public endpoint
          return await blogAPI.getBlogBySlug(slug);
        }
      } catch (error: unknown) {
        const apiError = error as APIError;
        if (apiError.response?.status === 403 || apiError.response?.status === 404) {
          if (!isAuthenticated) {
            return await blogAPI.getBlogBySlug(slug);
          }
        }
        throw error;
      }
    },
    enabled: !!slug,
    retry: (failureCount, error: APIError) => {
      // Don't retry on 403/404 errors
      if (error?.response?.status === 403 || error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: () => {
      if (!blogData?.data.blog._id) {
        return Promise.reject(new Error("Blog ID not available"));
      }
      return blogAPI.deleteBlog(blogData.data.blog._id);
    },
    onSuccess: (response) => {
      toast.success(response.message || "Blog deleted successfully!");
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["public-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      // Redirect to home page
      router.push("/");
    },
    onError: () => {
      toast.error("Failed to delete blog");
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (content: string) => {
      const blogId = blogData?.data.blog._id;
      if (!blogId) {
        return Promise.reject(new Error("Blog ID not available"));
      }
      return blogAPI.addComment(blogId, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      setComment("");
      toast.success("Comment added successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add comment");
    },
  });

  // Toggle like mutation
  const toggleLikeMutation = useMutation({
    mutationFn: () => {
      if (!blogData?.data.blog._id) {
        return Promise.reject(new Error("Blog ID not available"));
      }
      return blogAPI.toggleLike(blogData.data.blog._id);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      toast.success(response.message);
    },
    onError: () => {
      toast.error("Failed to update like");
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!isAuthenticated) {
      toast.error("Please login to comment");
      return;
    }
    addCommentMutation.mutate(comment);
  };

  const handleDeleteBlog = () => {
    if (!isAuthenticated) {
      toast.error("Please login to delete this blog");
      return;
    }
    deleteBlogMutation.mutate();
  };

  const handleToggleLike = () => {
    if (!isAuthenticated) {
      toast.error("Please login to like this post");
      return;
    }
    toggleLikeMutation.mutate();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
    );
  };

  const canDeleteBlog =
    user?.role === "admin" || blogData?.data?.blog?.author?._id === user?._id;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Loading skeleton */}
          <div className="mx-auto space-y-8">
            <div className="h-4 bg-muted rounded w-24 animate-pulse" />
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded-full w-20 animate-pulse" />
                <div className="h-6 bg-muted rounded-full w-16 animate-pulse" />
              </div>
              <div className="h-12 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-muted rounded w-full animate-pulse" />
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-24 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full animate-pulse" />
              <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-muted rounded w-4/5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogData?.data.blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center px-4">
        <Card className="max-w-md w-full shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Blog Not Found</h2>
              <p className="text-muted-foreground">
                The blog post youre looking for doesnt exist or has been
                removed.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const blog = blogData.data.blog;
  const isLiked = blog.likes?.some((like) => like.user === user?._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mx-auto">
          {/* Back Button with improved styling */}
          <div className="flex justify-between flex-col md:flex-row w-full items-center">
            <Link href="/">
              <Button className="mb-8 -ml-2 bg-black text-white hover:text-black hover:bg-white border border-black transition-colors group">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Blogs
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              {canDeleteBlog && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="mb-8"
                      disabled={deleteBlogMutation.isPending}
                    >
                      {deleteBlogMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Delete Blog
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the blog post and all associated comments.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteBlog}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {blog?.author?._id === user?._id && (
                <Link href={`/blogs/${blog?.slug}/edit`}>
                  <Button className="mb-8 -ml-2 bg-black text-white hover:text-black hover:bg-white border border-black transition-colors group">
                    <FaEdit className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Edit Blog
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Main Content */}
          <article className="space-y-12">
            {/* Enhanced Header */}
            <header className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                {blog.category && (
                  <Badge
                    variant="secondary"
                    className="px-3 py-1.5 text-sm font-medium"
                  >
                    {blog.category}
                  </Badge>
                )}
                <Badge
                  variant={
                    blog.status === "published"
                      ? "default"
                      : blog.status === "draft"
                      ? "secondary"
                      : "outline"
                  }
                  className="px-3 py-1.5 text-sm font-medium"
                >
                  {blog.status}
                </Badge>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {blog.title}
                </h1>

                {blog.excerpt && (
                  <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-4xl">
                    {blog.excerpt}
                  </p>
                )}
              </div>

              {/* Enhanced Author and Meta Info */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pt-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 ring-2 ring-muted">
                    <AvatarImage
                      src={blog.author.avatar}
                      alt={blog.author.name}
                    />
                    <AvatarFallback className="text-lg font-semibold">
                      {blog.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{blog.author.name}</p>
                    {blog.author.bio && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {blog.author.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {blog.publishedAt
                      ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : new Date(blog.createdAt!).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {blog.readTime || 5} min read
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {blog.views?.toLocaleString() || 0} views
                  </span>
                </div>
              </div>
            </header>

            {/* Action Bar */}
            <div className="flex items-center justify-between py-4 px-6 bg-card/50 backdrop-blur-sm rounded-xl border">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleToggleLike}
                  disabled={toggleLikeMutation.isPending}
                  className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
                >
                  <Heart
                    className={`h-4 w-4 transition-all ${
                      isLiked ? "fill-current scale-110" : ""
                    }`}
                  />
                  {blog.likeCount || blog.likes?.length || 0}
                </Button>

                <div className="flex items-center gap-2 text-muted-foreground px-3 py-2 rounded-lg bg-muted/50">
                  <MessageCircle className="h-4 w-4" />
                  <span>{blog.commentCount || blog.comments?.length || 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleBookmark}
                  className="hover:scale-105 transition-transform"
                >
                  <Bookmark
                    className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                  />
                </Button>

                <Button
                  onClick={handleShare}
                  className="hover:scale-105 transition-transform"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs px-3 py-1 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Enhanced Content */}
            <Card className="border-0 shadow-sm bg-card/30 backdrop-blur-sm">
              <CardContent className="p-8 sm:p-12">
                <div
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: decodeHtmlEntities(blog.content),
                  }}
                />
              </CardContent>
            </Card>
            {/* Enhanced Comments Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Comments ({blog.comments?.length || 0})
                </h2>
              </div>

              {/* Enhanced Add Comment Form */}
              {isAuthenticated ? (
                <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback>
                          {user?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <form
                        onSubmit={handleSubmitComment}
                        className="flex-1 space-y-4"
                      >
                        <Textarea
                          placeholder="Share your thoughts..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={3}
                          disabled={addCommentMutation.isPending}
                          className="resize-none border-0 bg-muted/50 focus:bg-background transition-colors"
                        />
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={
                              !comment.trim() || addCommentMutation.isPending
                            }
                            className="flex items-center gap-2"
                          >
                            {addCommentMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                            Post Comment
                          </Button>
                        </div>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-8 text-center">
                    <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                      <MessageCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">
                      Join the conversation
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Sign in to share your thoughts and engage with the
                      community
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Link href="/auth/login">
                        <Button>Sign In</Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button>Create Account</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Comments List */}
              <div className="space-y-4">
                {blog.comments && blog.comments.length > 0 ? (
                  blog.comments.map((comment) => (
                    <Card
                      key={comment._id}
                      className="border-0 shadow-sm bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors"
                    >
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage
                              src={comment.user.avatar}
                              alt={comment.user.name}
                            />
                            <AvatarFallback>
                              {comment.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-3 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <p className="font-semibold">
                                  {comment.user.name}
                                </p>
                                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                                  {formatDistanceToNow(
                                    new Date(comment.createdAt),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </span>
                              </div>
                              <Button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm leading-relaxed break-words text-foreground/90">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-0 shadow-sm bg-card/30 backdrop-blur-sm">
                    <CardContent className="pt-8 text-center py-12">
                      <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                        <MessageCircle className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">
                        Start the conversation
                      </h3>
                      <p className="text-muted-foreground">
                        No comments yet. Be the first to share your thoughts!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          </article>
        </div>
      </div>
    </div>
  );
}
