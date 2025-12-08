// Skeleton loader for Graduation cards
export default function GraduationCardSkeleton() {
  return (
    <div className="group relative flex h-full flex-col bg-[#e0f2f2] rounded-2xl shadow-sm border border-[#d0e8e8] overflow-hidden animate-pulse" dir="rtl">
      {/* Top Section - Image Skeleton */}
      <div className="relative h-52 bg-gray-200 flex-shrink-0"></div>

      {/* Bottom Section - Content Skeleton */}
      <div className="relative h-44 flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="relative z-10 space-y-3">
          {/* Title Skeleton */}
          <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded-md w-1/2"></div>

          {/* Description Skeleton */}
          <div className="h-4 bg-gray-100 rounded-md w-full"></div>
          <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>

          {/* Metadata Skeleton */}
          <div className="flex items-center gap-4 pt-2">
            <div className="h-4 bg-gray-100 rounded w-16"></div>
            <div className="h-4 bg-gray-100 rounded w-12"></div>
          </div>
        </div>

        {/* Separator Skeleton */}
        <div className="relative z-10 my-4 border-t border-gray-200"></div>

        {/* Footer Skeleton */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}





