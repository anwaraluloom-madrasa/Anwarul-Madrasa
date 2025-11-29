// Skeleton loader for Contact page
export default function ContactSkeleton() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-amber-50 to-white" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12" dir="rtl">
        {/* Form Skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
          <div className="space-y-6">
            {/* Title */}
            <div className="h-8 bg-gray-200 rounded-md w-1/3"></div>
            
            {/* Form Fields */}
            <div className="space-y-4">
              <div className="h-12 bg-gray-100 rounded-lg"></div>
              <div className="h-12 bg-gray-100 rounded-lg"></div>
              <div className="h-12 bg-gray-100 rounded-lg"></div>
              <div className="h-32 bg-gray-100 rounded-lg"></div>
            </div>
            
            {/* Submit Button */}
            <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
}



