// Skeleton loader for Event cards
export default function EventCardSkeleton() {
  return (
    <div className="group relative mb-12 pl-0 md:pl-24 animate-pulse" dir="rtl">
      {/* Timeline dot */}
      <div className="pointer-events-none absolute left-0 md:left-6 top-5 h-5 w-5 rounded-full border-4 border-white bg-gray-300 hidden md:block"></div>
      
      <div className="relative flex w-full max-w-full flex-col overflow-hidden bg-white rounded-2xl border border-gray-200 md:flex-row">
        {/* Image Section Skeleton */}
        <div className="aspect-[4/3] w-full md:w-1/2 relative overflow-hidden bg-gray-200">
          <div className="absolute top-4 right-4 z-10">
            <div className="h-6 bg-gray-100 rounded-full w-24"></div>
          </div>
          <div className="absolute bottom-4 left-4 z-10">
            <div className="h-6 bg-gray-100 rounded-full w-20"></div>
          </div>
        </div>

        {/* Content Section Skeleton */}
        <div className="w-full min-w-0 flex flex-col gap-6 p-6 md:w-1/2 md:p-8">
          {/* Header Section */}
          <div className="space-y-4 flex-1 min-w-0">
            {/* Date Badge Skeleton */}
            <div className="h-7 bg-gray-200 rounded-full w-32"></div>
            
            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-7 bg-gray-200 rounded-md w-full"></div>
              <div className="h-7 bg-gray-200 rounded-md w-3/4"></div>
            </div>
            
            {/* Description Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded-md w-full"></div>
              <div className="h-4 bg-gray-100 rounded-md w-full"></div>
              <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
              <div className="h-4 bg-gray-100 rounded-md w-4/5"></div>
            </div>
          </div>

          {/* Event Details Grid Skeleton */}
          <div className="grid gap-3 text-sm md:grid-cols-2 border-t border-gray-200 pt-5 min-w-0">
            <div className="h-14 bg-gray-100 rounded-xl"></div>
            <div className="h-14 bg-gray-100 rounded-xl"></div>
            <div className="h-14 bg-gray-100 rounded-xl md:col-span-2"></div>
          </div>

          {/* Footer Section Skeleton */}
          <div className="mt-auto pt-6 border-t border-gray-200 min-w-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto min-w-0">
                <div className="h-10 bg-gray-200 rounded-xl flex-1 sm:flex-initial sm:w-32"></div>
                <div className="h-10 bg-gray-200 rounded-xl flex-1 sm:flex-initial sm:w-36"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





