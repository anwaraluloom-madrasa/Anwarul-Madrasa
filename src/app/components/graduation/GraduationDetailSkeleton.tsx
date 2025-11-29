// Skeleton loader for Graduation detail page
export default function GraduationDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero Image Skeleton */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200 mb-6"></div>
      
      {/* Title and Meta Skeleton */}
      <div className="space-y-4 mb-8">
        <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
        <div className="flex gap-4">
          <div className="h-8 bg-gray-100 rounded-lg w-32"></div>
          <div className="h-8 bg-gray-100 rounded-lg w-32"></div>
        </div>
      </div>
      
      {/* Description Skeleton */}
      <div className="space-y-3 mb-8">
        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
        <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
      </div>
      
      {/* Students Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-3"></div>
            <div className="h-4 bg-gray-200 rounded-md w-3/4 mx-auto"></div>
            <div className="h-3 bg-gray-100 rounded-md w-1/2 mx-auto mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}



