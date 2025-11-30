import { IftahApi } from "@/lib/api";
import { cleanText } from "@/lib/textUtils";
import Link from "next/link";
import { getTranslation } from "@/lib/translations";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import IftahQuestionButton from "../../../components/iftah/IftahQuestionButton";
import IslamicHeader from "../../../components/IslamicHeader";


interface Author {
  name: string;
  bio?: string;
}

export interface Iftah {
  id: number;
  title: string;
  slug: string;
  question?: string;
  answer?: string;
  mufti?: Author | any;
  category?: string;
  tags?: string[];
  references?: string[];
  isPublished?: boolean;
  viewCount?: number;
  is_published?: boolean | number;
  tag?: {
    id: number;
    name: string;
  };
  tag_id?: number | null;
  iftah_sub_category?: {
    id: number;
    name: string;
    tag_id?: number;
    tag?: {
      id: number;
      name: string;
    };
  };
  date?: string;
  created_at?: string;
  updated_at?: string;
  note?: string;
  attachment?: string | null;
}

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

// Enable caching for faster loads
export const revalidate = 60; // Revalidate every 60 seconds

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

export default async function IftahCategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;
  
  // Decode the category name
  const categoryName = decodeURIComponent(categorySlug);
  
  // Step 1: Check if category slug is a numeric tag ID
  const numericId = parseInt(categoryName);
  let foundTagId: number | string | null = null;
  
  // Parallel API calls for better performance
  const [tagsResult] = await Promise.all([
    !isNaN(numericId) && numericId > 0 
      ? Promise.resolve({ success: false, data: [] }) // Skip tags fetch if numeric ID
      : IftahApi.getTags({ limit: 100 })
  ]);
  
  if (!isNaN(numericId) && numericId > 0) {
    // Category slug is a numeric ID - use it directly
    foundTagId = numericId;
  } else {
    // Find tag by name
    if (tagsResult.success && Array.isArray(tagsResult.data)) {
      const foundTag = tagsResult.data.find((tag: any) => 
        tag.name === categoryName || 
        decodeURIComponent(categoryName) === tag.name ||
        tag.name?.trim() === categoryName?.trim()
      );
      
      if (foundTag) {
        foundTagId = foundTag.id;
      }
    }
  }
  
  let categoryIftahs: Iftah[] = [];
  let subCategories: Array<{ id: number; name: string; tag_id?: number; tag?: { id: number; name: string } }> = [];
  let tagInfo: any = null;
  let tagId: number | string | null = foundTagId;
  
  // Fetch ALL subcategories from API - this gets ALL subcategories even if they have no questions
  const subCategoriesResult = await IftahApi.getSubCategories({ limit: 100 });
  const apiSubCategories = Array.isArray(subCategoriesResult.data) ? subCategoriesResult.data : [];
  
  // If tag ID found, fetch tag data using the tag API endpoint
  if (foundTagId) {
    const tagResult = await IftahApi.getTagById(foundTagId);
    
    if (tagResult.success && tagResult.data) {
      const responseData = tagResult.data as any;
      
      // Extract data array - this is the main iftah items array
      if (Array.isArray(responseData.data)) {
        categoryIftahs = responseData.data as Iftah[];
      }
      
      tagInfo = responseData.tag_id ? { tag_id: responseData.tag_id } : null;
      tagId = responseData.tag_id || foundTagId;
    } else {
      // Tag API failed, try fallback: fetch all iftahs and filter by tag name
      const res = await IftahApi.getAll({ limit: 100 });
      const allIftahs = Array.isArray(res.data) ? (res.data as Iftah[]) : [];
      
      // Filter by tag name - check both nested and direct tag
      const filtered = allIftahs.filter((item: Iftah) => 
        item.tag?.name === categoryName ||
        (item as any).iftah_sub_category?.tag?.name === categoryName
      );
      categoryIftahs = filtered;
    }
    
    // Extract subcategories from iftahs that belong to this category
    const subCategoriesFromIftahs = new Map<number, { id: number; name: string; tag_id?: number; tag?: { id: number; name: string } }>();
    categoryIftahs.forEach((item: any) => {
      if (item.iftah_sub_category && item.iftah_sub_category.id) {
        const subCat = item.iftah_sub_category;
        if (!subCategoriesFromIftahs.has(subCat.id)) {
          subCategoriesFromIftahs.set(subCat.id, {
            id: subCat.id,
            name: subCat.name,
            tag_id: subCat.tag_id,
            tag: subCat.tag
          });
        }
      }
    });
    
    // Merge API subcategories with subcategories from iftahs
    // PRIORITY: Always show ALL API subcategories that match this tag_id, even if they have 0 questions
    const allSubCategoriesMap = new Map<number, { id: number; name: string; tag_id?: number; tag?: { id: number; name: string } }>();
    
    // FIRST: Add all API subcategories that match this tag_id (this ensures we show all, even with 0 questions)
    apiSubCategories.forEach((subCat: any) => {
      if (subCat.tag_id === foundTagId || subCat.tag?.id === foundTagId) {
        allSubCategoriesMap.set(subCat.id, {
          id: subCat.id,
          name: subCat.name,
          tag_id: subCat.tag_id,
          tag: subCat.tag
        });
      }
    });
    
    // THEN: Add subcategories from iftahs (this will add any that exist in iftahs but not in API)
    // This ensures we don't miss any subcategories that might exist in iftahs but not in the API
    subCategoriesFromIftahs.forEach((subCat, subCatId) => {
      allSubCategoriesMap.set(subCatId, subCat);
    });
    
    subCategories = Array.from(allSubCategoriesMap.values());
    
    console.log('📊 Merged subcategories for tag', foundTagId, ':', subCategories.length, 'subcategories (', subCategoriesFromIftahs.size, 'from iftahs,', apiSubCategories.filter((sc: any) => sc.tag_id === foundTagId || sc.tag?.id === foundTagId).length, 'from API)');
  } else {
    // Fallback: Try to fetch all iftahs and filter by tag name
    console.log('🔄 Fallback: Fetching all iftahs and filtering by tag name');
    const res = await IftahApi.getAll({ limit: 100 });
    const allIftahs = Array.isArray(res.data) ? (res.data as Iftah[]) : [];
    
    // Filter by tag name - check both nested and direct tag
    const filtered = allIftahs.filter((item: Iftah) => 
      item.tag?.name === categoryName ||
      (item as any).iftah_sub_category?.tag?.name === categoryName
    );
    categoryIftahs = filtered;
    
    // If we couldn't find the tag ID, try to find it from the filtered items
    const foundTagFromItems = filtered.find((item: Iftah) => 
      item.tag?.name === categoryName || (item as any).iftah_sub_category?.tag?.name === categoryName
    );
    
    if (foundTagFromItems) {
      const categoryTagId = (foundTagFromItems as any).iftah_sub_category?.tag?.id || foundTagFromItems.tag?.id;
      if (categoryTagId) {
        // Extract subcategories from filtered iftahs
        const subCategoriesFromIftahs = new Map<number, { id: number; name: string; tag_id?: number; tag?: { id: number; name: string } }>();
        filtered.forEach((item: any) => {
          if (item.iftah_sub_category && item.iftah_sub_category.id) {
            const subCat = item.iftah_sub_category;
            if (!subCategoriesFromIftahs.has(subCat.id)) {
              subCategoriesFromIftahs.set(subCat.id, {
                id: subCat.id,
                name: subCat.name,
                tag_id: subCat.tag_id,
                tag: subCat.tag
              });
            }
          }
        });
        
        // Merge API subcategories with subcategories from iftahs
        // PRIORITY: Always show ALL API subcategories that match this tag_id, even if they have 0 questions
        const allSubCategoriesMap = new Map<number, { id: number; name: string; tag_id?: number; tag?: { id: number; name: string } }>();
        
        // FIRST: Add all API subcategories that match this tag_id (this ensures we show all, even with 0 questions)
        apiSubCategories.forEach((subCat: any) => {
          if (subCat.tag_id === categoryTagId || subCat.tag?.id === categoryTagId) {
            allSubCategoriesMap.set(subCat.id, {
              id: subCat.id,
              name: subCat.name,
              tag_id: subCat.tag_id,
              tag: subCat.tag
            });
          }
        });
        
        // THEN: Add subcategories from iftahs (this will add any that exist in iftahs but not in API)
        subCategoriesFromIftahs.forEach((subCat, subCatId) => {
          allSubCategoriesMap.set(subCatId, subCat);
        });
        
        subCategories = Array.from(allSubCategoriesMap.values());
        console.log('📊 Merged subcategories for tag', categoryTagId, ':', subCategories.length, 'subcategories');
      }
    }
    
    // If still no subcategories found, show all API subcategories (fallback)
    // Also, if we have a tag_id but no subcategories yet, try to get all API subcategories for that tag
    if (subCategories.length === 0 && foundTagId) {
      // Try to get all API subcategories that match this tag_id
      const matchingApiSubs = apiSubCategories.filter((subCat: any) => 
        subCat.tag_id === foundTagId || subCat.tag?.id === foundTagId
      );
      if (matchingApiSubs.length > 0) {
        subCategories = matchingApiSubs.map((subCat: any) => ({
          id: subCat.id,
          name: subCat.name,
          tag_id: subCat.tag_id,
          tag: subCat.tag
        }));
        console.log('📊 Found API subcategories for tag', foundTagId, ':', subCategories.length, 'subcategories');
      } else {
        // Last resort: show all API subcategories
        subCategories = apiSubCategories.map((subCat: any) => ({
          id: subCat.id,
          name: subCat.name,
          tag_id: subCat.tag_id,
          tag: subCat.tag
        }));
        console.log('📊 No matching subcategories found, showing all API subcategories:', subCategories.length, 'subcategories');
      }
    } else if (subCategories.length === 0) {
      subCategories = apiSubCategories.map((subCat: any) => ({
        id: subCat.id,
        name: subCat.name,
        tag_id: subCat.tag_id,
        tag: subCat.tag
      }));
      console.log('📊 No matching subcategories found, showing all API subcategories:', subCategories.length, 'subcategories');
    }
  }
  
  // Only show 404 if we have no data at all (no category found, no subcategories, and no questions)
  if (categoryIftahs.length === 0 && subCategories.length === 0 && !foundTagId) {
    notFound();
  }
  
  

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader 
        pageType="iftah" 
        title={decodeURIComponent(categorySlug)} 
        subtitle={t('header.iftah.subtitle')}
      />
      <Breadcrumb />
      <IftahQuestionButton variant="floating" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12" dir="rtl">
          {/* Subcategories Section */}
          {subCategories.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                  {subCategories.length} {subCategories.length === 1 ? t('iftah.categoryPage.subcategory') : t('iftah.categoryPage.subcategories')}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
                {subCategories.map((subCat) => (
                  <Link
                    key={subCat.id}
                    href={`/iftah/sub-category/${subCat.id}`}
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
                          {cleanText(subCat.name)}
                        </h3>
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

      </main>
    </div>
  );
}
