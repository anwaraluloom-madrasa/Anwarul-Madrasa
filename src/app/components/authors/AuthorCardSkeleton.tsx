// Skeleton loader for Author cards
export default function AuthorCardSkeleton() {
  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border-2 border-gray-200 shadow-lg animate-pulse overflow-hidden" dir="rtl">
      {/* Top Section with Image skeleton */}
      <div className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 pt-8 pb-4 px-6">
        <div className="flex justify-center">
          <div className="relative h-40 w-40">
            <div className="h-full w-full rounded-full bg-gray-200 border-4 border-white shadow-2xl ring-4 ring-emerald-100"></div>
          </div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="text-center space-y-4 px-6 pt-2 pb-6 flex-1">
        <div className="h-7 bg-gray-200 rounded-md w-3/4 mx-auto"></div>
        <div className="space-y-2 min-h-[4.5rem]">
          <div className="h-4 bg-gray-100 rounded-md w-full"></div>
          <div className="h-4 bg-gray-100 rounded-md w-5/6 mx-auto"></div>
          <div className="h-4 bg-gray-100 rounded-md w-4/5 mx-auto"></div>
        </div>
      </div>
      
      {/* Button skeleton */}
      <div className="px-6 pb-6 pt-2">
        <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
}

