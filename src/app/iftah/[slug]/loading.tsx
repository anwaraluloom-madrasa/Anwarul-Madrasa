import Breadcrumb from "@/components/Breadcrumb";
import IftahQuestionButton from "../../components/iftah/IftahQuestionButton";
import IslamicHeader from "../../components/IslamicHeader";
import IftahDetailSkeleton from "../../components/iftah/IftahDetailSkeleton";
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

export default function LoadingIftahDetail() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader 
        pageType="iftah" 
        subtitle={t('header.iftah.subtitle')}
      />
      <Breadcrumb />
      <IftahQuestionButton variant="floating" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12" dir="rtl">
        <IftahDetailSkeleton />
      </main>
    </div>
  );
}