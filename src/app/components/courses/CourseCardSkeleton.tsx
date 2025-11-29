// Skeleton loader for Course cards
export default function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse h-full" dir="rtl">
      {/* Image skeleton */}
      <div className="aspect-[4/3] relative bg-gray-200">
        <div className="absolute top-4 right-4">
          <div className="h-6 bg-gray-100 rounded-lg w-20"></div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="flex-1 flex flex-col p-6 sm:p-8">
        <div className="space-y-3 mb-4">
          <div className="h-6 bg-gray-200 rounded-md w-full"></div>
          <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-100 rounded-md w-full"></div>
          <div className="h-4 bg-gray-100 rounded-md w-full"></div>
          <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
        </div>
        
        {/* Meta items skeleton */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 border border-gray-100">
            <div className="h-6 w-6 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 border border-gray-100">
            <div className="h-6 w-6 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        
        {/* Footer skeleton */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

