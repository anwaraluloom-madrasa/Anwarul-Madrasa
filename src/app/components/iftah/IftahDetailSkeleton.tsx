// Skeleton loader for Iftah question detail page
export default function IftahDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden animate-pulse">
        <div className="px-6 sm:px-8 py-8">
          {/* Question Section Skeleton */}
          <div className="mb-8">
            <div className="h-6 bg-gray-200 rounded-md w-20 mb-3"></div>
            <div className="bg-gray-50 p-5 rounded-lg border-r-4 border-gray-200">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Bismillah Skeleton */}
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded-md w-64 mx-auto"></div>
          </div>

          {/* Answer Section Skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="h-6 bg-gray-200 rounded-md w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-32"></div>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border-r-4 border-gray-200">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded-md w-4/5"></div>
              </div>
            </div>
          </div>

          {/* Closing Text Skeleton */}
          <div className="mt-10 mb-8 text-center">
            <div className="h-7 bg-gray-200 rounded-md w-48 mx-auto"></div>
          </div>

          {/* Mufti Information Skeleton */}
          <div className="mb-8 ml-auto max-w-md text-right" dir="rtl">
            <div className="h-5 bg-gray-200 rounded-md w-24 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
            </div>
          </div>

          {/* Institution Footer Skeleton */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="h-4 bg-gray-200 rounded-md w-24 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded-md w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

