"use client";

import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { blogAPI, UpdateBlogData } from "@/actions/blogActions";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { use, useEffect } from "react";
import RichTextEditor from "@/components/layout/RichTextEditor";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function EditBlogPage({ params }: Props) {
  const { slug } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  // Fetch the blog data
  const {
    data: blogData,
    isLoading: isFetchingBlog,
    error: fetchError,
  } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      if (isAuthenticated) {
        return await blogAPI.getBlogBySlugWithAuth(slug);
      } else {
        return await blogAPI.getBlogBySlug(slug);
      }
    },
    enabled: !!slug,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
    control
  } = useForm<UpdateBlogData>({
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: "",
      excerpt: "",
      status: "draft",
    },
  });

  const selectedStatus = watch("status");

  // Populate form when blog data is loaded
  useEffect(() => {
    if (blogData?.data.blog) {
      const blog = blogData.data.blog;
      console.log("Populating form with blog data:", blog);

      // Reset form with blog data
      reset({
        title: blog.title,
        content: blog.content,
        category: blog.category || "",
        tags: blog.tags?.join(", ") || "",
        excerpt: blog.excerpt || "",
        status: blog.status as "draft" | "published" | "archived",
      });

      // Also explicitly set the status to trigger re-render
      setValue("status", blog.status as "draft" | "published" | "archived");
    }
  }, [blogData, reset, setValue]);

  // Check authorization
  const blog = blogData?.data.blog;
  const canEdit =
    blog && (user?._id === blog.author._id || user?.role === "admin");

  // Update blog mutation
  const updateBlogMutation = useMutation({
    mutationFn: (data: UpdateBlogData) => {
      if (!blog?._id) {
        throw new Error("Blog ID not available");
      }
      return blogAPI.updateBlog(blog._id, data);
    },
    onSuccess: (res) => {
      toast.success(res.message || "Blog updated successfully!");
      if (blog?.status != "published") {
        router.push(`/`);
      } else {
        router.push(`/blogs/${slug}`);
      }
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      queryClient.invalidateQueries({ queryKey: ["public-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update blog");
    },
  });

  const onSubmit = (data: UpdateBlogData) => {
    // Process tags properly
    console.log("data", data);
    let processedTags: string[] = [];
    if (data.tags) {
      if (typeof data.tags === "string") {
        processedTags = data.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
      } else if (Array.isArray(data.tags)) {
        processedTags = data.tags;
      }
    }

    updateBlogMutation.mutate({
      ...data,
      tags: processedTags,
    });
  };

  // Loading state
  if (isFetchingBlog) {
    return (
      <div className="container mx-auto py-12 max-w-3xl">
        <Card>
          <CardContent className="pt-8">
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-32 bg-muted rounded animate-pulse" />
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-8 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error or blog not found
  if (fetchError || !blog) {
    return (
      <div className="container mx-auto py-12 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Blog Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              The blog youre trying to edit doesnt exist or has been removed.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authorization check
  if (!canEdit) {
    return (
      <div className="container mx-auto py-12 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              You dont have permission to edit this blog post.
            </p>
            <Link href={`/blogs/${slug}`}>
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/blogs/${slug}`}>
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Edit Blog</h1>
          <p className="text-muted-foreground">
            {`Make changes to ${blog.title}`}
          </p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Edit Blog Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter blog title"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 5,
                    message: "Title must be at least 5 characters",
                  },
                })}
                disabled={updateBlogMutation.isPending}
                className="text-lg"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Controller
                name="content"
                control={control}
                rules={{
                  required: "Content is required",
                  validate: (value) => {
                    // Remove HTML tags and check length
                    const textContent = value.replace(/<[^>]*>/g, '').trim();
                    if (textContent.length < 50) {
                      return "Content must be at least 50 characters";
                    }
                    return true;
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <RichTextEditor
                    value={value}
                    onChange={onChange}
                    disabled={updateBlogMutation.isPending}
                    error={errors.content?.message}
                  />
                )}
              />
            </div>

            {/* Row for Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Field */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Enter blog category"
                  {...register("category")}
                  disabled={updateBlogMutation.isPending}
                />
              </div>

              {/* Status Field */}
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value: "draft" | "published" | "archived") =>
                    setValue("status", value, { shouldDirty: true })
                  }
                  disabled={updateBlogMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blog status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select a status" disabled={true}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                        select a status
                      </div>
                    </SelectItem>
                    <SelectItem value="draft">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                        Draft
                      </div>
                    </SelectItem>
                    <SelectItem value="published">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        Published
                      </div>
                    </SelectItem>
                    <SelectItem value="archived">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                        Archived
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs ">
                  {selectedStatus === "draft" &&
                    "Save as draft - only visible to you"}
                  {selectedStatus === "published" &&
                    "Make public - visible to all users"}
                  {selectedStatus === "archived" &&
                    "Archive - hidden from public but saved"}
                </p>
              </div>
            </div>

            {/* Tags Field */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas (e.g. tech, coding, javascript)"
                {...register("tags")}
                disabled={updateBlogMutation.isPending}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Excerpt Field */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                placeholder="Brief description of your blog (optional)"
                rows={3}
                {...register("excerpt", {
                  maxLength: {
                    value: 300,
                    message: "Excerpt cannot exceed 300 characters",
                  },
                })}
                disabled={updateBlogMutation.isPending}
                className="resize-none"
              />
              {errors.excerpt && (
                <p className="text-sm text-red-600">{errors.excerpt.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                If not provided, it will be auto-generated from content
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/blogs/${slug}`)}
                disabled={updateBlogMutation.isPending}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateBlogMutation.isPending || !isDirty}
                className="flex-1 sm:flex-none"
              >
                {updateBlogMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Blog
                  </>
                )}
              </Button>
            </div>

            {/* Unsaved Changes Warning */}
            {isDirty && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ You have unsaved changes. Dont forget to save your work!
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
