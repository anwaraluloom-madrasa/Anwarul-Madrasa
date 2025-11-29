// Skeleton loader for Student cards
export default function StudentCardSkeleton() {
  return (
    <div className="group relative flex h-full flex-col bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 rounded-2xl shadow-lg border-2 border-emerald-200 overflow-hidden animate-pulse" dir="rtl">
      {/* Top Section - Name Badge Skeleton */}
      <div className="relative h-32 sm:h-40 bg-gradient-to-br from-gray-300 to-gray-400 flex-shrink-0 overflow-hidden flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/30 border-4 border-white/50 mx-auto mb-3"></div>
          <div className="h-5 sm:h-6 bg-white/30 rounded-md w-24 mx-auto"></div>
        </div>
      </div>

      {/* Bottom Section - Content Skeleton */}
      <div className="relative flex-1 bg-white p-4 sm:p-6 flex flex-col justify-between">
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-100 rounded-md w-3/4"></div>
        </div>

        {/* Separator Skeleton */}
        <div className="my-3 border-t-2 border-gray-200"></div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}

