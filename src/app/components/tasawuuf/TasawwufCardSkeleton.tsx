// Skeleton loader for Tasawwuf cards
export default function TasawwufCardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border-2 border-gray-200/60 bg-white animate-pulse">
      {/* Image skeleton */}
      <div className="relative w-full md:w-2/5 lg:w-1/3 h-52 rounded-xl bg-gray-200 overflow-hidden">
        <div className="absolute top-3 right-3">
          <div className="h-6 bg-gray-100 rounded-full w-20"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="h-7 bg-gray-200 rounded-md w-full mb-3"></div>
          <div className="h-7 bg-gray-200 rounded-md w-3/4 mb-4"></div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-100 rounded-md w-full"></div>
            <div className="h-4 bg-gray-100 rounded-md w-full"></div>
            <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
          </div>
        </div>
        
        {/* Footer skeleton */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-2">
          <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
        </div>
      </div>
    </div>
  );
}

