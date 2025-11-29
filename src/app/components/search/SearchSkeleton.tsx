// Skeleton loader for Search page
export default function SearchSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" dir="rtl">
        {/* Search Bar Skeleton */}
        <div className="mb-8">
          <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse"></div>
        </div>
        
        {/* Filters Skeleton */}
        <div className="flex flex-wrap gap-3 mb-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-8 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
          ))}
        </div>
        
        {/* Results Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded-md w-full"></div>
              <div className="h-4 bg-gray-100 rounded-md w-5/6 mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



