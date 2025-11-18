// Skeleton loader for Iftah category cards
export default function IftahCategorySkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 animate-pulse" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded-md w-1/2"></div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-100"></div>
      </div>
      <div className="pt-4 border-t border-gray-100">
        <div className="h-4 bg-gray-100 rounded-md w-24"></div>
      </div>
    </div>
  );
}

