// Skeleton loader for Awlayaa detail page
export default function AwlayaaDetailSkeleton() {
  return (
    <>
      {/* Header Section Skeleton */}
      <div className="relative bg-white rounded-xl overflow-hidden mb-8 border border-gray-200 shadow-sm animate-pulse">
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gray-200"></div>
        <div className="px-6 sm:px-8 py-10 relative z-10">
          {/* Profile Image Skeleton */}
          <div className="flex justify-center mb-6">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gray-200 border-4 border-gray-200"></div>
          </div>
          
          {/* Name and Title Skeleton */}
          <div className="text-center space-y-3">
            <div className="h-8 bg-gray-200 rounded-md w-3/4 mx-auto"></div>
            <div className="h-6 bg-gray-100 rounded-md w-2/3 mx-auto"></div>
            <div className="h-5 bg-gray-100 rounded-md w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Right Column Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded-md w-32 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded-md w-full"></div>
                <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded-md w-40 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              <div className="h-4 bg-gray-100 rounded-md w-full"></div>
              <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
              <div className="h-4 bg-gray-100 rounded-md w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

