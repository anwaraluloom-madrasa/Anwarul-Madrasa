// Skeleton loader for Article cards
export default function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse" dir="rtl">
      {/* Image skeleton */}
      <div className="relative w-full h-48 bg-gray-200">
        <div className="absolute top-4 right-4">
          <div className="h-6 bg-gray-100 rounded-lg w-20"></div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-6 sm:p-8">
        <div className="space-y-3 mb-4">
          <div className="h-6 bg-gray-200 rounded-md w-full"></div>
          <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-100 rounded-md w-full"></div>
          <div className="h-4 bg-gray-100 rounded-md w-full"></div>
          <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
        </div>
        <div className="pt-3 border-t border-gray-100">
          <div className="h-4 bg-gray-100 rounded-md w-24"></div>
        </div>
      </div>
    </div>
  );
}

