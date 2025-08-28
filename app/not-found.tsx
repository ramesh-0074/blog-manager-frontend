// app/not-found.tsx (Next.js 13+ App Router)

import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-xl text-gray-600">Oops! Page not found.</p>
      <p className="mt-2 text-gray-500">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-3 text-white shadow-md transition hover:bg-gray-900"
      >
        <Home className="h-5 w-5" />
        Go Back Home
      </Link>
    </div>
  );
}
