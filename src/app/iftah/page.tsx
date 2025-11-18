// app/iftah/page.tsx
import { IftahApi } from "../../lib/api";
import Link from "next/link";
import IftahQuestionButton from "../components/iftah/IftahQuestionButton";
import IslamicHeader from "../components/IslamicHeader";

interface IftahCategory {
  id: number;
  name: string;
  name_en?: string;
  icon?: string;
  description?: string;
  count?: number;
}

interface Tag {
  id: number;
  name: string;
}

interface IftahSubCategory {
  id: number;
  name: string;
  tag_id?: number;
  tag?: Tag;
}

interface Iftah {
  id: number;
  title?: string;
  tag?: Tag;
  tag_id?: number | null;
  iftah_sub_category?: IftahSubCategory | null;
}

// Enable caching for faster loads
export const revalidate = 60; // Revalidate every 60 seconds

export default async function IftahPage() {
  let allIftahs: Iftah[] = [];
  let displayCategories: IftahCategory[] = [];

  try {
    // Fetch all tags (categories) from API - this gets ALL categories even if they have no questions
    const tagsResult = await IftahApi.getTags({ limit: 100 });
    const apiTags = Array.isArray(tagsResult.data) ? tagsResult.data : [];
    
    console.log('📊 Fetched tags from API:', apiTags.length);
    
    // Get all iftahs to extract tags and count questions per category
    const res = await IftahApi.getAll({ limit: 100 });
    allIftahs = Array.isArray(res.data) ? res.data : [];
    
    console.log('📊 Fetched iftahs:', allIftahs.length);
    
    // Extract unique tags from iftahs - this gets categories that have questions
    const tagsFromIftahs = new Map<number, { id: number; name: string }>();
    const tagCountMap = new Map<number, number>();
    
    allIftahs.forEach((iftah: Iftah) => {
      // Check iftah_sub_category.tag first (this is the nested structure from API)
      if (iftah.iftah_sub_category?.tag) {
        const tagId = iftah.iftah_sub_category.tag.id;
        const tagName = iftah.iftah_sub_category.tag.name;
        tagsFromIftahs.set(tagId, { id: tagId, name: tagName });
        tagCountMap.set(tagId, (tagCountMap.get(tagId) || 0) + 1);
      } 
      // Fallback to direct tag if available
      else if (iftah.tag) {
        const tagId = iftah.tag.id;
        const tagName = iftah.tag.name;
        tagsFromIftahs.set(tagId, { id: tagId, name: tagName });
        tagCountMap.set(tagId, (tagCountMap.get(tagId) || 0) + 1);
      }
    });

    // Merge API tags with tags from iftahs - combine both sources
    const allTagsMap = new Map<number, { id: number; name: string }>();
    
    // Add all API tags
    apiTags.forEach((tag: any) => {
      allTagsMap.set(tag.id, { id: tag.id, name: tag.name });
    });
    
    // Add tags from iftahs (this will add any tags that exist in iftahs but not in API)
    tagsFromIftahs.forEach((tag, tagId) => {
      allTagsMap.set(tagId, tag);
    });

    // Convert merged tags to display categories, including those with 0 questions
    displayCategories = Array.from(allTagsMap.values()).map(tag => ({
      id: tag.id,
      name: tag.name,
      name_en: tag.name,
      icon: '📚',
      description: '',
      count: tagCountMap.get(tag.id) || 0
    }));
    
    console.log('📊 Display categories:', displayCategories.length, 'categories (', displayCategories.filter(c => (c.count || 0) > 0).length, 'with questions,', displayCategories.filter(c => (c.count || 0) === 0).length, 'with 0 questions)');
  } catch (error) {
    console.error('Error fetching iftah data:', error);
    // Use default categories when API fails
    displayCategories = [
      { id: 1, name: 'تازه ترین فتاوی', name_en: 'Latest Fatwas', icon: '📌', description: '', count: 0 },
      { id: 2, name: 'نماز', name_en: 'Prayer', icon: '🤲', description: '', count: 0 },
      { id: 3, name: 'روزہ', name_en: 'Fasting', icon: '🌙', description: '', count: 0 },
      { id: 4, name: 'زکوٰۃ', name_en: 'Zakat', icon: '💰', description: '', count: 0 },
      { id: 5, name: 'حج', name_en: 'Hajj', icon: '🕋', description: '', count: 0 },
      { id: 6, name: 'معاملات', name_en: 'Transactions', icon: '📋', description: '', count: 0 },
    ];
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader pageType="iftah" />
      <IftahQuestionButton variant="floating" />

      {/* Categories Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12" dir="rtl">
        <div className="text-right mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Amiri, serif' }}>
            فتاویٰ ډولونه
          </h2>
          <p className="text-gray-600 text-sm">د فتاویٰ مختلف ډولونه وپېژنئ</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {displayCategories.map((category: IftahCategory, index: number) => {
            const categorySlug = category.name;

            return (
              <Link
                key={category.id || index}
                href={`/iftah/category/${encodeURIComponent(categorySlug)}`}
                prefetch={true}
                className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                dir="rtl"
              >
                {/* Decorative right border accent */}
                <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-200 group-hover:from-gray-500 group-hover:via-gray-400 group-hover:to-gray-300 transition-colors"></div>
                
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10zm-10 0c0-2.762 2.238-5 5-5s5 2.238 5 5-2.238 5-5 5-5-2.238-5-5z'/%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                
             
                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="p-8 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex-1 leading-tight" style={{ fontFamily: 'Amiri, serif' }}>
                      {category.name}
                    </h3>
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {(category.count || 0) > 0 && (
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        {category.count} پوښتنې
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
