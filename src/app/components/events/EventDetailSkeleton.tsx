// Skeleton loader for Event detail page
export default function EventDetailSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      {/* Image Section Skeleton */}
      <div className="relative w-full aspect-video bg-gray-200">
        <div className="absolute top-4 right-4">
          <div className="h-6 bg-gray-100 rounded-full w-24"></div>
        </div>
      </div>
      
      {/* Content Section Skeleton */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Title Skeleton */}
        <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
        
        {/* Details Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-y border-gray-100">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded-md w-24"></div>
            <div className="h-5 bg-gray-100 rounded-md w-32"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded-md w-24"></div>
            <div className="h-5 bg-gray-100 rounded-md w-32"></div>
          </div>
        </div>
        
        {/* Description Skeleton */}
        <div className="space-y-3">
          <div className="h-5 bg-gray-200 rounded-md w-full"></div>
          <div className="h-5 bg-gray-200 rounded-md w-full"></div>
          <div className="h-5 bg-gray-100 rounded-md w-5/6"></div>
        </div>
      </div>
    </div>
  );
}

