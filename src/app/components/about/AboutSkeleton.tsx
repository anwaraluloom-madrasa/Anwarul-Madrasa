// Skeleton loader for About page
export default function AboutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12" dir="rtl">
        {/* Hero Section Skeleton */}
        <div className="mb-12 space-y-4">
          <div className="h-10 bg-gray-200 rounded-md w-3/4 mx-auto animate-pulse"></div>
          <div className="h-6 bg-gray-100 rounded-md w-2/3 mx-auto animate-pulse"></div>
        </div>
        
        {/* Content Sections Skeleton */}
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
              <div className="h-7 bg-gray-200 rounded-md w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


