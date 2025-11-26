// Skeleton loader for Author cards
export default function AuthorCardSkeleton() {
  return (
    <div className="group relative rounded-3xl border border-primary-100/60 bg-white/90 p-8 shadow-soft animate-pulse" dir="rtl">
      {/* Image skeleton */}
      <div className="flex justify-center -mt-16 mb-6">
        <div className="h-32 w-32 rounded-full bg-gray-200 border-4 border-white shadow-lg ring-4 ring-primary-200"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="text-center space-y-4">
        <div className="h-6 bg-gray-200 rounded-md w-3/4 mx-auto"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded-md w-full"></div>
          <div className="h-4 bg-gray-100 rounded-md w-5/6 mx-auto"></div>
        </div>
      </div>
      
      {/* Button skeleton */}
      <div className="mt-6 flex justify-center">
        <div className="h-9 bg-gray-100 rounded-full w-32"></div>
      </div>
    </div>
  );
}

