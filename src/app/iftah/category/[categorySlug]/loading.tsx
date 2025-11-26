import Breadcrumb from "@/components/Breadcrumb";
import IftahQuestionButton from "../../../components/iftah/IftahQuestionButton";
import IslamicHeader from "../../../components/IslamicHeader";
import IftahSubCategorySkeleton from "../../../components/iftah/IftahSubCategorySkeleton";
import { getTranslation } from "@/lib/translations";

// Helper function to get translation as string
const t = (key: string): string => {
  try {
    const result = getTranslation(key);
    if (typeof result === 'string') {
      if (result === key) {
        return key;
      }
      return result;
    }
    return String(result || key);
  } catch (error) {
    return key;
  }
};

export default function LoadingIftahCategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader 
        pageType="iftah" 
        subtitle={t('header.iftah.subtitle')}
      />
      <Breadcrumb />
      <IftahQuestionButton variant="floating" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12" dir="rtl">
        {/* Subcategories Section Skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded-full w-32 animate-pulse"></div>
          </div>
          
          {/* Subcategories grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {Array.from({ length: 6 }).map((_, index) => (
              <IftahSubCategorySkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
