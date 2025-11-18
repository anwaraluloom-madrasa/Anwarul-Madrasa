// Skeleton loader for Donation page
export default function DonationSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12" dir="rtl">
        {/* Content Skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
          <div className="space-y-6">
            {/* Title */}
            <div className="h-8 bg-gray-200 rounded-md w-1/2"></div>
            
            {/* Description */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
            </div>
            
            {/* Form Fields */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="h-12 bg-gray-100 rounded-lg"></div>
              <div className="h-12 bg-gray-100 rounded-lg"></div>
              <div className="h-32 bg-gray-100 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

