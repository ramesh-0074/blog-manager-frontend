import React from "react";
import Link from "next/link";
import { Calendar, Eye, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { decodeHtmlEntities } from "@/lib/htmlHelper";
import { IBlog } from "@/types/Blog.types";

interface BlogCardProps {
  blog: IBlog;
  showAuthor?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  showAuthor = true,
}) => {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="transition block hover:scale-[1.02] group w-full"
    >
      <Card className="w-full hover:border-primary transition h-[400px] relative">
        <CardHeader className="pb-3">
          <CardTitle className="line-clamp-2 text-base sm:text-lg leading-tight">
            {blog.title.length > 100
              ? `${blog.title.slice(0, 50)}...`
              : blog.title}
            <div className="">Edit</div>
          </CardTitle>
          <CardDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              {blog.category && (
                <Badge variant="secondary" className="text-xs">
                  {blog.category.length > 25
                    ? `${blog.category.slice(0, 25)}...`
                    : blog?.category}
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
                className="text-xs"
              >
                {blog.status}
              </Badge>
            </div>
            {showAuthor && blog.author && (
              <span className="text-muted-foreground text-xs flex items-center">
                <User className="h-3 w-3 mr-1" />
                <span className="truncate max-w-[120px]">
                  {blog.author.name}
                </span>
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {blog.content && (
             <div
             className="prose prose-lg dark:prose-invert max-w-none"
             dangerouslySetInnerHTML={{
               __html: decodeHtmlEntities(blog.content).slice(0,100),
             }}
           />
          )}
          {/* Excerpt */}
          {blog.excerpt && (
            <div className="bg-green-50 p-2 sm:p-3 rounded-md">
              <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                {blog.excerpt.length > 90
                  ? `${blog.excerpt.slice(0, 90)}...`
                  : blog.excerpt}
              </p>
            </div>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              {blog.tags.slice(0, 3).map((tag: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs shadow-md bg-gray-800 text-white px-2 py-1 rounded-md"
                >
                  {tag}
                </Badge>
              ))}
              {blog.tags.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-600 text-white px-2 py-1 rounded-md"
                >
                  +{blog.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground pt-2">
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {blog.publishedAt
                ? new Date(blog.publishedAt).toLocaleDateString()
                : new Date(blog.createdAt || "").toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {blog.readTime || 0} min read · {blog.views ?? 0} views
            </span>
          </div>
        </CardContent>
        {/* {user?._id === blog?.author?._id && (
          <div
            onClick={() => router.push(`/blogs/${blog?.slug}/edit`)}
            className="bg-black absolute right-5 top-5 text-white p-2 rounded-md"
          >
            <FaEdit />
          </div>
        )} */}
      </Card>
    </Link>
  );
};
