# 📝 Blogging Platform - Frontend

A modern, full-featured blogging platform built with Next.js 15, React 19, TypeScript, and TailwindCSS. This application provides a seamless user experience for creating, sharing, and managing blog content with advanced features like rich text editing, real-time interactions, and comprehensive admin controls.

## ✨ Features

### 🎯 Core Functionality
- **Rich Text Editing** - Advanced WYSIWYG editor with HTML sanitization
- **Blog Management** - Create, edit, delete, and publish blogs with draft system
- **User Authentication** - JWT-based auth with role-based access control
- **Interactive Features** - Likes, comments, bookmarks, and social sharing
- **Search & Filter** - Advanced filtering by title, author, and categories
- **Infinite Scrolling** - Seamless content loading for better UX

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach with beautiful layouts
- **Loading States** - Skeleton loaders and smooth transitions
- **Component Library** - Built with shadcn/ui components

### ⚡ Performance & Tech Stack
- **Next.js 15** - App directory with server components
- **React 19** - Latest React features with Suspense
- **TypeScript** - Full type safety and developer experience
- **TanStack Query** - Efficient data fetching and caching
- **Zustand** - Lightweight state management
- **TailwindCSS** - Utility-first CSS framework

## 🏗️ Project Structure

├── app/ # Next.js App Router pages
│ ├── auth/ # Authentication routes
│ ├── blogs/ # Blog-related pages
│ ├── admin/ # Admin panel
│ └── globals.css # Global styles
├── components/ # Reusable UI components
│ ├── ui/ # shadcn/ui components
│ ├── layout/ # Layout components
│ └── forms/ # Form components
├── lib/ # Utility functions and configurations
├── hooks/ # Custom React hooks
├── store/ # Zustand state stores
├── actions/ # API action functions
└── types/ # TypeScript type definitions


## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API server running

### Installation

1. **Clone the repository**

2. **Install dependencies**

3. **Environment Setup**

Create a `.env.local` file in the root directory:

NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

4. **Run the development server**


5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment


## 📱 Key Routes & Navigation

### Public Routes
- **`/`** - Homepage with latest blogs and authentication options
- **`/blogs`** - Complete blog listing with search and infinite scroll
- **`/blogs/[slug]`** - Individual blog post view with comments
- **`/auth/login`** - User login page
- **`/auth/register`** - User registration page

### Protected Routes (Authenticated Users)
- **`/blogs/create`** - Create new blog post with rich text editor
- **`/blogs/[slug]/edit`** - Edit existing blog (author/admin only)
- **`/my-blogs`** - Personal blog dashboard and management
- **`/profile`** - User profile settings

### Admin Routes
- **`/admin/users`** - User management and role assignment

### Documentation
- **`/user-manual`** - **📚 Comprehensive User Manual**

## 📚 User Manual Route (`/manual`)

The **User Manual** is a crucial feature accessible at `/user-manual` that provides:

### 🏛️ **System Architecture Overview**
- **Frontend Architecture** - Next.js, React, TypeScript stack explanation
- **Backend Integration** - API communication and data flow
- **Database Design** - MongoDB collections and relationships
- **Authentication Flow** - JWT token handling and security

### 👑 **First Admin Setup Guide**
- **Initial Admin Creation** - Step-by-step bootstrap process
- **API Endpoint Details** - Exact curl commands and payloads
- **Security Considerations** - Best practices and warnings
- **Troubleshooting** - Common setup issues and solutions

### 🔧 **Core Platform Modules**
- **Authentication System** - JWT, middleware, and session management
- **Blog Management** - Content creation, editing, and publishing workflow
- **User Interactions** - Comments, likes, and social features
- **Admin Controls** - User management and platform administration

### 🛡️ **Role-Based Access Control**
- **User Permissions** - What regular users can and cannot do
- **Admin Capabilities** - Full administrative access and controls
- **Security Boundaries** - Access restrictions and data protection

### 🔌 **API Documentation**
- **Authentication Endpoints** - Login, register, user management
- **Blog Endpoints** - CRUD operations and interactions
- **Admin Endpoints** - User management and system controls
- **Error Handling** - Common error codes and responses

### 💼 **Technical Implementation**
The User Manual uses the same design system and components as the rest of the application, ensuring consistency and familiarity. It's built with:
- **Interactive Design** - Cards, badges, and visual hierarchy
- **Code Examples** - Syntax-highlighted code blocks
- **Responsive Layout** - Works perfectly on all devices
- **Search Functionality** - Easy navigation through content

### Typography
- **Headings** - Inter font family with gradient text effects
- **Body Text** - Optimized for readability across devices
- **Code** - Monospace font for technical content

### Components
- **Cards** - Subtle shadows and backdrop blur effects
- **Buttons** - Hover animations and loading states
- **Forms** - Consistent validation and error handling
- **Navigation** - Smooth transitions and active states

## 🔧 Available Scripts

Development
npm run dev # Start development server
npm run dev:turbo # Start with Turbopack (faster)

Production
npm run build # Build for production
npm run start # Start production server


## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Ensure responsive design
- Follow the existing code style

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
Clear Next.js cache
rm -rf .next
npm run build

text

**TypeScript Errors**
Run type checking
npm run type-check

text

**Styling Issues**
Rebuild Tailwind
npm run build:css


## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **TanStack Query** - Powerful data synchronization
- **Lucide Icons** - Comprehensive icon library
- **Next.js Team** - Amazing React framework

---

**Happy Blogging!** ✨
