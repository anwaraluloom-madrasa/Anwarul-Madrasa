// Skeleton loader for Sanad cards
export default function SanadCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-gray-200 shadow-sm animate-pulse" dir="rtl">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded-md w-full"></div>
        </div>
        <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}

