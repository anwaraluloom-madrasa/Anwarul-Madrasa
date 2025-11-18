// Skeleton loader for Awlayaa cards
export default function AwlayaaCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse h-full flex flex-col" dir="rtl">
      {/* Image skeleton */}
      <div className="relative h-56 bg-gray-200"></div>
      
      {/* Content skeleton */}
      <div className="p-6 sm:p-8 flex flex-col flex-grow">
        <div className="mb-4 flex-grow space-y-3">
          <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded-md w-1/2"></div>
          <div className="h-4 bg-gray-100 rounded-md w-full"></div>
        </div>
        
        {/* Action section skeleton */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="h-4 bg-gray-100 rounded-md w-32"></div>
        </div>
      </div>
    </div>
  );
}

