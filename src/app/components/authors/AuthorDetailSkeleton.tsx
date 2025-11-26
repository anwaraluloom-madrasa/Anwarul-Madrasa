// Skeleton loader for Author detail page
export default function AuthorDetailSkeleton() {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/50 rounded-3xl border border-amber-100/50 overflow-hidden mb-8 animate-pulse">
      <div className="p-6 md:p-12">
        {/* Profile Header Skeleton */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* Profile Image Skeleton */}
          <div className="relative mb-6">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gray-200 border-4 border-amber-400 shadow-2xl ring-4 ring-amber-100/50"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="h-6 bg-gray-200 rounded-full w-24"></div>
            </div>
          </div>
          
          {/* Name Skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-8 bg-gray-200 rounded-md w-48"></div>
            <div className="h-6 bg-gray-100 rounded-md w-64"></div>
          </div>
        </div>
        
        {/* Bio Section Skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
        </div>
      </div>
    </div>
  );
}

