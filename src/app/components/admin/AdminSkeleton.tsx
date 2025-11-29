// Skeleton loader for Admin pages
export default function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" dir="rtl">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded-md w-1/3 animate-pulse"></div>
        </div>
        
        {/* Table/List Skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
          <div className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
                  <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                    <div className="h-3 bg-gray-100 rounded-md w-1/3"></div>
                  </div>
                  <div className="h-8 bg-gray-100 rounded-lg w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



