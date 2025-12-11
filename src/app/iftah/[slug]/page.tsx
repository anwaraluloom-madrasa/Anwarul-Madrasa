import { IftahApi } from "@/lib/api";
import { buildStorageUrl } from "@/lib/utils";
import { cleanText } from "@/lib/textUtils";
import { Download } from "lucide-react";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import IftahQuestionButton from "../../components/iftah/IftahQuestionButton";
import IslamicHeader from "../../components/IslamicHeader";
import { getTranslation } from "@/lib/translations";

interface Mufti {
  id: number;
  full_name: string;
  father_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  dob?: string | null;
  biography?: string | null;
}

interface Tag {
  id: number;
  name: string;
}

interface Iftah {
  id: number;
  title: string;
  slug: string;
  question: string;
  answer: string;
  date?: string;
  note?: string;
  is_published?: number | boolean;
  is_top?: number | boolean;
  attachment?: string | null;
  mufti?: Mufti;
  tag?: Tag;
  iftah_sub_category?: {
    id: number;
    name: string;
    tag_id?: number;
    tag?: {
      id: number;
      name: string;
    };
  };
}

const buildAssetUrl = (path?: string | null) => buildStorageUrl(path) ?? undefined;

// Enable caching for faster loads
export const revalidate = 60; // Revalidate every 60 seconds

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function IftahDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  const response = await IftahApi.getIftah(slug);
  
  if (!response.success || !response.data) {
    notFound();
  }

  const iftah = response.data as Iftah;

  if (!iftah) {
    notFound();
  }

  // Calculate fatwa number based on subcategory
  let fatwaNumber: number | null = null;
  if (iftah.iftah_sub_category?.id && iftah.answer) {
    try {
      const subCategoryResult = await IftahApi.getSubCategoryById(iftah.iftah_sub_category.id);
      if (subCategoryResult.success && subCategoryResult.data) {
        const responseData = subCategoryResult.data as { data?: Iftah[] | { data?: Iftah[] } } | Iftah[];
        let allIftahs: Iftah[] = [];
        
        // Extract iftahs array from response
        if (Array.isArray(responseData)) {
          allIftahs = responseData;
        } else if (Array.isArray(responseData.data)) {
          allIftahs = responseData.data;
        } else if (responseData.data && Array.isArray(responseData.data.data)) {
          allIftahs = responseData.data.data;
        }
        
        // Filter iftahs that have answers and sort by date/id
        const iftahsWithAnswers = allIftahs
          .filter((item: Iftah) => item.answer && item.answer.trim().length > 0)
          .sort((a: Iftah, b: Iftah) => {
            // Sort by date if available, otherwise by id
            const dateA = a.date || '';
            const dateB = b.date || '';
            if (dateA && dateB) {
              return new Date(dateA).getTime() - new Date(dateB).getTime();
            }
            return (a.id || 0) - (b.id || 0);
          });
        
        // Find the index of current iftah
        const currentIndex = iftahsWithAnswers.findIndex((item: Iftah) => item.id === iftah.id || item.slug === slug);
        if (currentIndex !== -1) {
          fatwaNumber = currentIndex + 1;
        }
      }
    } catch (error) {
      console.error('Error calculating fatwa number:', error);
    }
  }

  const t = (key: string): string => {
    const translation = getTranslation(key, 'ps');
    return typeof translation === 'string' ? translation : key;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader 
        pageType="iftah" 
        title={cleanText(iftah.iftah_sub_category?.name)} 
        subtitle={t('header.iftah.subtitle')}
      />
      <IftahQuestionButton variant="floating" />
      
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-8 sm:py-12" dir="rtl">
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>
        {/* Main Fatwa Document */}

         
            
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          {/* Content Section */}
          <div className="px-6 sm:px-8 py-8">
            {/* Question Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">سوال</h2>
              <div className="bg-gray-50 p-5 rounded-lg border-r-4 border-gray-300">
                <p className="text-gray-800 leading-relaxed text-base sm:text-lg" style={{ fontFamily: 'Amiri, serif' }}>
                  {cleanText(iftah.question)}
                </p>
              </div>
            </div>

            {/* Simple Divider */}
            <div className="border-t border-gray-200 my-8"></div>
   {/* Bismillah */}
   <div className="text-center mb-8">
              <p className="text-2xl sm:text-3xl text-gray-700 font-bold" style={{ fontFamily: 'serif' }}>
                بسم اللہ الرحمن الرحیم
              </p>
            </div>

            {/* Answer Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">جواب</h2>
                {fatwaNumber && (
                  <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    فتویٰ نمبر: {fatwaNumber}
                  </span>
                )}
              </div>
              <div className="bg-gray-50 p-5 rounded-lg border-r-4 border-gray-300">
                <p className="text-gray-800 leading-relaxed text-base sm:text-lg" style={{ fontFamily: 'Amiri, serif' }}>
                  {cleanText(iftah.answer)}
                </p>
              </div>
            </div>

            {/* Note Section - If Available */}
            {iftah.note && (
              <div className="mb-8 mt-6">
                <h2 className="text-sm font-bold text-gray-900 mb-3">نوټ</h2>
                  <p className="text-gray-800 leading-relaxed text-base sm:text-lg" style={{ fontFamily: 'Amiri, serif' }}>
                    {cleanText(iftah.note)}
                  </p>
              </div>
            )}

            {/* Closing */}
            <div className="mt-10 mb-8 text-center">
              <p className="text-xl sm:text-2xl text-gray-700 font-bold" style={{ fontFamily: 'serif' }}>
                واللہ تعالیٰ اعلم
              </p>
            </div>

            {/* Mufti Information */}
            {iftah.mufti && (
              <div className="mb-8 ml-auto max-w-md text-right" dir="rtl">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">د مفتی شهرت</h3>
                <div className="space-y-1.5">
                  <p className="text-gray-900 text-base">
                    <span className="text-gray-600 text-sm">بشپړ نوم: </span>
                    {cleanText(iftah.mufti.full_name)}
                  </p>
                  {iftah.mufti.father_name && (
                    <p className="text-gray-900 text-base">
                      <span className="text-gray-600 text-sm">د پلار نوم: </span>
                      {cleanText(iftah.mufti.father_name)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Institution Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-1">دار الافتاء</p>
              <p className="text-xs text-gray-600 leading-relaxed" style={{ fontFamily: 'Amiri, serif' }}>
                اَلْجَامِعْةُ اَنوَار الْعُلُوْم اَلْاِسْلاَمِیّة اَلْمَدْرَسَة خلیفه صاحب ارغندی (رح)
              </p>
            </div>

            {/* Attachment */}
            {iftah.attachment && (
              <div className="mt-6 pt-6 border-t border-gray-200 text-right" dir="rtl">
                <a
                  href={buildAssetUrl(iftah.attachment)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors duration-200"
                >
                  <Download className="w-5 h-5" />
                  <span>د فایل ډاونلوډ</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
