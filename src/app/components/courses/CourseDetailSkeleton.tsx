// Skeleton loader for Course detail page
export default function CourseDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200 mb-6"></div>
      
      {/* Title and Meta Skeleton */}
      <div className="space-y-4 mb-8">
        <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
        <div className="h-6 bg-gray-100 rounded-md w-1/2"></div>
        <div className="flex gap-4">
          <div className="h-8 bg-gray-100 rounded-lg w-24"></div>
          <div className="h-8 bg-gray-100 rounded-lg w-24"></div>
        </div>
      </div>
      
      {/* About Section Skeleton */}
      <div className="rounded-xl overflow-hidden pt-6 px-6 mb-8">
        <div className="h-7 bg-gray-200 rounded-md w-48 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
        </div>
      </div>
      
      {/* Book Card Skeleton */}
      <div className="flex flex-col md:flex-row gap-6 p-6 rounded-xl bg-gray-50 border border-gray-200 mb-8">
        <div className="w-32 h-32 rounded-lg bg-gray-200"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded-md w-full"></div>
          <div className="h-4 bg-gray-100 rounded-md w-2/3"></div>
        </div>
      </div>
    </div>
  );
}

