// app/loading.tsx (Next.js 13+ App Router)

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Spinner */}
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-black border-t-transparent"></div>

      {/* Loading text */}
      <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">
        Loading Blogs, please wait...
      </p>
    </div>
  );
}
