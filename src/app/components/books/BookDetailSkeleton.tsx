// Skeleton loader for Book detail page
export default function BookDetailSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="flex flex-col md:flex-row">
        {/* Image Section Skeleton */}
        <div className="w-full md:w-1/3 h-64 md:h-auto bg-gray-200"></div>
        
        {/* Content Section Skeleton */}
        <div className="flex-1 p-6 md:p-8 space-y-6">
          {/* Title Skeleton */}
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-6 bg-gray-100 rounded-md w-1/2"></div>
          </div>
          
          {/* Meta Info Skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded-md w-32"></div>
            <div className="h-4 bg-gray-200 rounded-md w-40"></div>
            <div className="h-4 bg-gray-100 rounded-md w-36"></div>
          </div>
          
          {/* Description Skeleton */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

