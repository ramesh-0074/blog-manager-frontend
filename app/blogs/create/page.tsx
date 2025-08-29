"use client";

import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Loader2 } from "lucide-react";
import { blogAPI } from "@/actions/blogActions";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/layout/RichTextEditor";
import { CreateBlogData } from "@/types/Blog.types";

export default function CreateBlogPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<CreateBlogData>({
    defaultValues: {
      status: "draft",
      content: "",
    },
  });

  const selectedStatus = watch("status");

  const createBlogMutation = useMutation({
    mutationFn: (data: CreateBlogData) => blogAPI.createBlog(data),
    onSuccess: (res) => {
      toast.success(res.message || "Blog created!");
      queryClient.invalidateQueries({ queryKey: ['public-blogs'] });
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] });

      if (res.data.blog.status === "published") {
        router.push(`/blogs/${res.data.blog.slug}`);
      } else {
        router.push("/my-blogs");
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to create blog");
    },
  });

  const onSubmit = (data: CreateBlogData) => {
    // Process tags properly
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

    createBlogMutation.mutate({
      ...data,
      tags: processedTags,
    });
  };

  return (
    <div className="container mx-auto py-12 max-w-4xl px-4 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Create Blog</CardTitle>
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
                disabled={createBlogMutation.isPending}
                className="text-lg"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Rich Text Content Field */}
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
                    disabled={createBlogMutation.isPending}
                    error={errors.content?.message}
                  />
                )}
              />
            </div>

            {/* Category and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Enter blog category"
                  {...register("category")}
                  disabled={createBlogMutation.isPending}
                />
              </div>

              {/* Status Field */}
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value: "draft" | "published" | "archived") =>
                    setValue("status", value)
                  }
                  disabled={createBlogMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blog status" />
                  </SelectTrigger>
                  <SelectContent>
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
                <p className="text-xs text-muted-foreground">
                  {selectedStatus === "draft" && "Save as draft - only visible to you"}
                  {selectedStatus === "published" && "Make public - visible to all users"}
                  {selectedStatus === "archived" && "Archive - hidden from public but saved"}
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
                disabled={createBlogMutation.isPending}
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
                disabled={createBlogMutation.isPending}
                className="resize-none"
              />
              {errors.excerpt && (
                <p className="text-sm text-red-600">{errors.excerpt.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                If not provided, it will be auto-generated from content
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={createBlogMutation.isPending}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createBlogMutation.isPending}
                className="flex-1 sm:flex-none"
              >
                {createBlogMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    {selectedStatus === "draft"
                      ? "Save Draft"
                      : selectedStatus === "published"
                      ? "Publish Blog"
                      : "Archive Blog"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
