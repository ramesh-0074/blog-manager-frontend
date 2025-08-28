import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Server,
  Database,
  Shield,
  Users,
  BookOpen,
  MessageCircle,
  Heart,
  Settings,
  Crown,
  Code,
  Globe,
  Lock,
} from "lucide-react";

export default function UserManual() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Blog Manager User Manual
          </h1>
          <p className="text-xl text-muted-foreground">
            Complete guide to understanding and using our blogging platform
          </p>
        </div>

        {/* Architecture Overview */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Server className="h-6 w-6" />
              System Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Frontend */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Frontend</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Next.js 15 (React 19)</li>
                  <li>TypeScript</li>
                  <li>TailwindCSS</li>
                  <li>Shadcn/ui Components</li>
                  <li>TanStack Query</li>
                </ul>
              </div>

              {/* Backend */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Server className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Backend API</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Node.js + Express</li>
                  <li>JWT Authentication</li>
                  <li>RESTful API Design</li>
                  <li>Middleware Protection</li>
                  <li>Input Validation</li>
                </ul>
              </div>

              {/* Database */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Database</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>MongoDB</li>
                  <li>Mongoose ODM</li>
                  <li>Schema Validation</li>
                  <li>Indexing & Performance</li>
                  <li>Data Relationships</li>
                </ul>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Data Flow */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Code className="h-5 w-5" />
                Data Flow Architecture
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">1</Badge>
                    <span className="text-sm">
                      User interacts with React components
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">2</Badge>
                    <span className="text-sm">
                      TanStack Query manages API calls
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">3</Badge>
                    <span className="text-sm">
                      API requests hit Express routes
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">4</Badge>
                    <span className="text-sm">
                      Authentication middleware validates JWT
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">5</Badge>
                    <span className="text-sm">
                      Controllers process business logic
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">6</Badge>
                    <span className="text-sm">
                      Mongoose interacts with MongoDB
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">7</Badge>
                    <span className="text-sm">
                      Response sent back to frontend
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">8</Badge>
                    <span className="text-sm">UI updates with new data</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* First Admin Creation */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Crown className="h-6 w-6 text-yellow-600" />
              Creating the First Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                    Important Security Note
                  </span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  This endpoint should only be used once during initial system
                  setup. After creating the first admin, this endpoint should be
                  disabled or removed for security.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">
                  Step 1: Setup Requirements
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Ensure your backend server is running
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    MongoDB database is connected
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    No existing admin accounts in the system
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Step 2: API Endpoint</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="font-mono text-sm mb-2">
                    <Badge variant="secondary">POST</Badge>{" "}
                    <span className="ml-2">/api/auth/create-first-admin</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Step 3: Request Payload</h3>
                <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    {`{
  "adminKey": "firstAdmin",
  "name": "Admin",
  "email": "youremail@gmail.com",
  "password": "password@1234"
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Step 4: Using cURL</h3>
                <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    {`curl -X POST http://localhost:5000/api/auth/create-first-admin \\
  -H "Content-Type: application/json" \\
  -d '{
    "adminKey": "firstAdmin",
    "name": "Admin",
    "email": "youremail@gmail.com",
    "password": "password@1234"
  }'`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">
                  Step 5: Expected Response
                </h3>
                <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    {`{
  "success": true,
  "message": "First admin created successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "Admin",
      "email": "youremail@gmail.com",
      "role": "admin"
    },
    "token": "jwt-token-here"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Modules */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Settings className="h-6 w-6" />
              Core Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Authentication Module */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Authentication</h3>
                </div>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• JWT-based authentication</li>
                  <li>• Role-based access control</li>
                  <li>• Password hashing (bcrypt)</li>
                  <li>• Session management</li>
                  <li>• Protected routes</li>
                </ul>
              </div>

              {/* User Management */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">User Management</h3>
                </div>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• User registration & login</li>
                  <li>• Profile management</li>
                  <li>• Admin user controls</li>
                  <li>• User role assignment</li>
                  <li>• Account deletion</li>
                </ul>
              </div>

              {/* Blog Management */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold">Blog Management</h3>
                </div>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Rich text editor</li>
                  <li>• Draft/Published states</li>
                  <li>• Categories & tags</li>
                  <li>• SEO optimization</li>
                  <li>• Content sanitization</li>
                </ul>
              </div>

              {/* Interaction System */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold">Interaction System</h3>
                </div>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Like/Unlike functionality</li>
                  <li>• Comment system</li>
                  <li>• Real-time updates</li>
                  <li>• Engagement metrics</li>
                  <li>• Social sharing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Roles & Permissions */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="h-6 w-6" />
              User Roles & Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Regular User */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Regular User</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-400 mb-1">
                      Can Do:
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Create and publish blog posts</li>
                      <li>• Edit own blog posts</li>
                      <li>• Delete own blog posts</li>
                      <li>• Comment on any blog</li>
                      <li>• Like/unlike blog posts</li>
                      <li>• Update own profile</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700 dark:text-red-400 mb-1">
                      Cannot Do:
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Access admin panel</li>
                      <li>• Manage other users</li>
                      <li>• Delete others content</li>
                      <li>• Change user roles</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Admin User */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <Crown className="h-4 w-4 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold">Admin User</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-400 mb-1">
                      Full Access:
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• All regular user permissions</li>
                      <li>• Access admin dashboard</li>
                      <li>• Manage all users</li>
                      <li>• Promote users to admin</li>
                      <li>• Delete any user account</li>
                      <li>• Delete any blog post</li>
                      <li>• Moderate all content</li>
                      <li>• View system analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Code className="h-6 w-6" />
              Key API Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Authentication */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Authentication
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/auth/register</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/auth/login</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">GET</Badge>
                    <code>/api/auth/user-details</code>
                  </div>
                </div>
              </div>

              {/* Blog Management */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Blog Management
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">GET</Badge>
                    <code>/api/blogs</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/blogs</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">PUT</Badge>
                    <code>/api/blogs/:id</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">DELETE</Badge>
                    <code>/api/blogs/:id</code>
                  </div>
                </div>
              </div>

              {/* Admin Functions */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Admin Functions
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">GET</Badge>
                    <code>/api/admin/users</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">PUT</Badge>
                    <code>/api/admin/users/:id/role</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">DELETE</Badge>
                    <code>/api/admin/users/:id</code>
                  </div>
                </div>
              </div>

              {/* Interactions */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Interactions
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/blogs/:id/comments</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/blogs/:id/like</code>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
