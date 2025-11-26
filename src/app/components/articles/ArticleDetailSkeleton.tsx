// Skeleton loader for Article detail page
export default function ArticleDetailSkeleton() {
  return (
    <article className="mb-16 relative overflow-hidden rounded-2xl bg-white border border-gray-200 animate-pulse">
      <div className="p-6 md:p-8 lg:p-10 space-y-8">
        {/* Header Section Skeleton */}
        <div className="space-y-6">
          <div>
            {/* Category Badge Skeleton */}
            <div className="mb-4">
              <div className="h-8 bg-gray-200 rounded-xl w-32"></div>
            </div>
            
            {/* Title Skeleton */}
            <div className="space-y-3 mb-6">
              <div className="h-8 bg-gray-200 rounded-md w-full"></div>
              <div className="h-8 bg-gray-200 rounded-md w-5/6"></div>
            </div>
            
            {/* Metadata Skeleton */}
            <div className="h-10 bg-gray-100 rounded-xl w-48"></div>
          </div>
        </div>
        
        {/* Image/Video Skeleton */}
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-200"></div>
        
        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="h-5 bg-gray-200 rounded-md w-full"></div>
          <div className="h-5 bg-gray-200 rounded-md w-full"></div>
          <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-5 bg-gray-100 rounded-md w-full"></div>
          <div className="h-5 bg-gray-100 rounded-md w-full"></div>
          <div className="h-5 bg-gray-100 rounded-md w-5/6"></div>
        </div>
      </div>
    </article>
  );
}

