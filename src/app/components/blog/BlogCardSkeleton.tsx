// Skeleton loader for Blog cards
export default function BlogCardSkeleton() {
  return (
    <div className="group relative flex h-full flex-col bg-[#e0f2f2] rounded-2xl shadow-sm overflow-hidden border border-[#d0e8e8] animate-pulse" dir="rtl">
      {/* Top Section - Image Skeleton */}
      <div className="relative h-48 bg-gray-200 flex-shrink-0 overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <div className="h-6 bg-gray-100 rounded-xl w-20"></div>
        </div>
      </div>

      {/* Bottom Section - Content Skeleton */}
      <div className="relative flex-1 bg-white p-6 flex flex-col justify-between">
        {/* Content */}
        <div className="relative z-10 space-y-4 flex-1">
          {/* Title Skeleton */}
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded-md w-full"></div>
            <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded-md w-full"></div>
            <div className="h-4 bg-gray-100 rounded-md w-full"></div>
            <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
          </div>

          {/* Date Skeleton */}
          <div className="flex items-center gap-2 pt-2">
            <div className="h-3.5 w-3.5 bg-gray-200 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded-md w-24"></div>
          </div>
        </div>

        {/* Separator */}
        <div className="relative z-10 my-4 border-t border-gray-200"></div>

        {/* Footer Skeleton */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="h-3 bg-gray-200 rounded-md w-20"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}

