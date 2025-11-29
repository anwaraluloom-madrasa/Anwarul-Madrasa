// Skeleton loader for Donation page
export default function DonationSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-20" dir="rtl">
      {/* Header Skeleton */}
      <div className="text-center mb-12 sm:mb-16 md:mb-20">
        <div className="inline-block mb-4 sm:mb-6">
          <div className="h-8 bg-gray-200 rounded-full w-48 mx-auto animate-pulse"></div>
        </div>
        <div className="h-10 sm:h-12 bg-gray-200 rounded-lg w-3/4 max-w-md mx-auto mb-3 sm:mb-4 md:mb-6 animate-pulse"></div>
        <div className="h-6 sm:h-7 bg-gray-100 rounded-lg w-full max-w-2xl mx-auto animate-pulse"></div>
      </div>

      {/* Donation Cards Skeleton */}
      <div className="space-y-4 sm:space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 animate-pulse"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Header Section Skeleton */}
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-6 sm:p-8 md:p-10 lg:w-2/5 flex-shrink-0">
                <div className="space-y-4">
                  <div className="h-8 bg-gray-300 rounded-md w-3/4"></div>
                  <div className="h-6 bg-gray-300 rounded-full w-24"></div>
                  <div className="space-y-2 mt-4">
                    <div className="h-4 bg-gray-300 rounded-md w-full"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-4/5"></div>
                  </div>
                </div>
              </div>
            
              {/* Content Section Skeleton */}
              <div className="p-6 sm:p-8 md:p-10 lg:w-3/5 bg-white">
                <div className="space-y-4 mb-6 sm:mb-8">
                  {/* Contact items skeleton */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 sm:p-5 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded-md w-24"></div>
                        <div className="h-4 bg-gray-100 rounded-md w-3/4"></div>
                      </div>
                    </div>
                  ))}
            </div>
            
                {/* Buttons skeleton */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 h-12 sm:h-14 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 h-12 sm:h-14 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>

      {/* Instructions Section Skeleton */}
      <section className="py-12 sm:py-16 md:py-20 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="h-8 bg-gray-200 rounded-full w-48 mx-auto mb-4 sm:mb-6 animate-pulse"></div>
            <div className="h-10 sm:h-12 bg-gray-200 rounded-lg w-3/4 max-w-md mx-auto mb-3 sm:mb-4 md:mb-6 animate-pulse"></div>
            <div className="h-6 sm:h-7 bg-gray-100 rounded-lg w-full max-w-2xl mx-auto animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="text-center bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 border border-gray-200 animate-pulse"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-2xl mx-auto mb-8"></div>
                <div className="h-6 bg-gray-200 rounded-md w-3/4 mx-auto mb-4 sm:mb-5"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded-md w-full"></div>
                  <div className="h-4 bg-gray-100 rounded-md w-5/6 mx-auto"></div>
                </div>
              </div>
            ))}
      </div>
    </div>
      </section>
    </section>
  );
}
