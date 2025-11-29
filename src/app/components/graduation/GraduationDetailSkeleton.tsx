// Skeleton loader for Graduation detail page
import StudentCardSkeleton from "./StudentCardSkeleton";

export default function GraduationDetailSkeleton() {
  return (
    <div className="animate-pulse" dir="rtl">
      {/* Hero Section Skeleton */}
      <div className="mb-16 relative overflow-hidden rounded-3xl bg-white shadow-xl border-2 border-gray-200">
        <div className="flex flex-col lg:flex-row gap-8 p-6 md:p-8 lg:p-10">
          {/* Image Skeleton */}
          <div className="lg:w-1/2">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-200"></div>
          </div>
          {/* Info Skeleton */}
          <div className="lg:w-1/2 space-y-6">
            <div className="h-10 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-6 bg-gray-100 rounded-md w-full"></div>
            <div className="h-6 bg-gray-100 rounded-md w-5/6"></div>
            <div className="space-y-3 pt-4">
              <div className="h-16 bg-gray-100 rounded-xl"></div>
              <div className="h-16 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Students Grid Skeleton */}
      <div className="mb-20">
        <div className="h-10 bg-gray-200 rounded-md w-64 mx-auto mb-12"></div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <StudentCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}



