import IftahQuestionButton from "../components/iftah/IftahQuestionButton";
import IslamicHeader from "../components/IslamicHeader";
import IftahCategorySkeleton from "../components/iftah/IftahCategorySkeleton";

export default function LoadingIftahPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader pageType="iftah" />
      <IftahQuestionButton variant="floating" />

      {/* Categories Grid Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12" dir="rtl">
        <div className="text-right mb-12 space-y-2">
          <div className="h-8 bg-gray-200 rounded-md w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded-md w-64 animate-pulse"></div>
        </div>
        
        {/* Categories grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {Array.from({ length: 6 }).map((_, index) => (
            <IftahCategorySkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

