// src/lib/blogActions.ts
import { apiClient } from "@/lib/api-interceptor";

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: string;
  category?: string;
  tags?: string[];
  author: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  publishedAt?: string;
  createdAt?: string;
  readTime?: number;
  views?: number;
  likes?: Array<{ user: string; createdAt: string }>;
  comments?: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
      avatar?: string;
    };
    content: string;
    createdAt: string;
  }>;
  likeCount?: number;
  commentCount?: number;
}
export interface BlogListResponse {
  success: boolean;
  data: {
    blogs: IBlog[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalBlogs: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface CreateBlogData {
  title: string;
  content: string;
  tags?: string | string[]
  excerpt?: string;
  category?:string
  status?: "draft" | "published" | "archived";
}

export interface CreateBlogResponse {
  success: boolean;
  message: string;
  data: { blog: IBlog };
}

export interface BlogDetailResponse {
  success: boolean;
  data: {
    blog: IBlog;
  };
}

export interface CommentData {
  content: string;
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: {
    comments: IBlog['comments'];
  };
}

export interface LikeResponse {
  success: boolean;
  message: string;
  data: {
    liked: boolean;
    likeCount: number;
  };
}

export interface UpdateBlogData {
  title: string;
  content: string;
  category?: string;
  tags?: string | string[];
  excerpt?: string;
  status?: "draft" | "published" | "archived";
}

export interface UpdateBlogResponse {
  success: boolean;
  message: string;
  data: { blog: IBlog };
}

export const blogAPI = {
  getBlogs: async (params?: Record<string, string>): Promise<BlogListResponse> => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return apiClient.get(`/blogs${queryString ? `?${queryString}` : ''}`);
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
  addComment: async (blogId: string, data: CommentData): Promise<CommentResponse> => {
    return apiClient.post(`/blogs/${blogId}/comments`, data);
  },
  toggleLike: async (blogId: string): Promise<LikeResponse> => {
    return apiClient.post(`/blogs/${blogId}/like`);
  },
  deleteBlog: async (blogId: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete(`/blogs/${blogId}`);
  },
  updateBlog: async (blogId: string, data: UpdateBlogData): Promise<UpdateBlogResponse> => {
    return apiClient.put(`/blogs/${blogId}`, data);
  },
  
  getBlogById: async (id: string): Promise<BlogDetailResponse> => {
    return apiClient.get(`/blogs/${id}`);
  },
};
