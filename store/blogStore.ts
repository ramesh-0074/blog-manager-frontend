// src/store/blogStore.ts
import { IBlog } from '@/types/Blog.types'
import { create } from 'zustand'

interface BlogState {
  blogs: IBlog[] // Public blogs
  myBlogs: IBlog[] // User's blogs
  setBlogs: (blogs: IBlog[]) => void
  setMyBlogs: (blogs: IBlog[]) => void
  addBlog: (blog: IBlog) => void
  updateBlog: (id: string, blog: Partial<IBlog>) => void
  deleteBlog: (id: string) => void
}

export const useBlogStore = create<BlogState>((set, get) => ({
  blogs: [],
  myBlogs: [],
  
  setBlogs: (blogs) => set({ blogs }),
  setMyBlogs: (blogs) => set({ myBlogs: blogs }),
  
  addBlog: (blog) => set(state => ({ 
    myBlogs: [blog, ...state.myBlogs],
    blogs: blog.status === 'published' ? [blog, ...state.blogs] : state.blogs
  })),
  
  updateBlog: (id, updatedBlog) => set(state => ({
    blogs: state.blogs.map(blog => 
      blog._id === id ? { ...blog, ...updatedBlog } : blog
    ),
    myBlogs: state.myBlogs.map(blog => 
      blog._id === id ? { ...blog, ...updatedBlog } : blog
    )
  })),
  
  deleteBlog: (id) => set(state => ({
    blogs: state.blogs.filter(blog => blog._id !== id),
    myBlogs: state.myBlogs.filter(blog => blog._id !== id)
  }))
}))
