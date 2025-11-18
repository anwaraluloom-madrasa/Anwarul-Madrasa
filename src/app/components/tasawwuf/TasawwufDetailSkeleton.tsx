// Skeleton loader for Tasawwuf detail page
export default function TasawwufDetailSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="p-6 md:p-8 space-y-6">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-6 bg-gray-100 rounded-md w-1/2"></div>
        </div>
        
        {/* Image Skeleton */}
        <div className="w-full aspect-video rounded-lg bg-gray-200"></div>
        
        {/* Content Skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
          <div className="h-4 bg-gray-100 rounded-md w-4/5"></div>
        </div>
      </div>
    </div>
  );
}

