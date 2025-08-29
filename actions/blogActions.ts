// src/lib/blogActions.ts
import { apiClient } from "@/lib/api-interceptor";
import {
  BlogDetailResponse,
  BlogListResponse,
  CommentData,
  CommentResponse,
  CreateBlogData,
  CreateBlogResponse,
  LikeResponse,
  UpdateBlogData,
  UpdateBlogResponse,
} from "@/types/Blog.types";

export const blogAPI = {
  getBlogs: async (
    params?: Record<string, string>
  ): Promise<BlogListResponse> => {
    const queryString = params ? new URLSearchParams(params).toString() : "";
    return apiClient.get(`/blogs${queryString ? `?${queryString}` : ""}`);
  },
  getMyBlogs: async (): Promise<BlogListResponse> => {
    return apiClient.get("/blogs/my-blogs");
  },
  createBlog: async (data: CreateBlogData): Promise<CreateBlogResponse> => {
    return apiClient.post("/blogs", data);
  },
  getBlogBySlug: async (slug: string): Promise<BlogDetailResponse> => {
    return apiClient.get(`/blogs/public/${slug}`);
  },
  // For authenticated access (can see drafts if authorized)
  getBlogBySlugWithAuth: async (slug: string): Promise<BlogDetailResponse> => {
    return apiClient.get(`/blogs/${slug}`);
  },
  addComment: async (
    blogId: string,
    data: CommentData
  ): Promise<CommentResponse> => {
    return apiClient.post(`/blogs/${blogId}/comments`, data);
  },
  toggleLike: async (blogId: string): Promise<LikeResponse> => {
    return apiClient.post(`/blogs/${blogId}/like`);
  },
  deleteBlog: async (
    blogId: string
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete(`/blogs/${blogId}`);
  },
  updateBlog: async (
    blogId: string,
    data: UpdateBlogData
  ): Promise<UpdateBlogResponse> => {
    return apiClient.put(`/blogs/${blogId}`, data);
  },

  getBlogById: async (id: string): Promise<BlogDetailResponse> => {
    return apiClient.get(`/blogs/${id}`);
  },
};
