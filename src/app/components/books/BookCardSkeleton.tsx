// Skeleton loader for Book cards
export default function BookCardSkeleton() {
  return (
    <div className="group relative flex h-full flex-col bg-[#e0f2f2] rounded-2xl shadow-sm overflow-hidden border border-[#d0e8e8] animate-pulse" dir="rtl">
      {/* Top Section - Image skeleton */}
      <div className="relative h-48 bg-[#b8d8d8] flex-shrink-0"></div>

      {/* Bottom Section - White Background */}
      <div className="relative h-44 flex-1 bg-white p-6 flex flex-col justify-between">
        {/* Content skeleton */}
        <div className="relative z-10 space-y-3">
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded-md w-full"></div>
            <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded-md w-full"></div>
            <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
          </div>

          {/* Metadata skeleton */}
          <div className="flex items-center gap-4 pt-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>

        {/* Separator */}
        <div className="relative z-10 my-4 border-t border-gray-200"></div>

        {/* Footer skeleton */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}

