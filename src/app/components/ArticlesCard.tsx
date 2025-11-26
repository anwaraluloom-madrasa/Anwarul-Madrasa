'use client';

import Image from "next/image";
import Link from "next/link";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ArticlesApi } from "@/lib/api";
import UnifiedLoader from "@/components/loading/UnifiedLoader";
import PaginationControls from "@/components/PaginationControls";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getImageUrl } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import ErrorDisplay from "@/components/ErrorDisplay";

// Image component with error handling
function ArticleImage({ src, alt, className }: { src: string | null | undefined; alt: string; className?: string }) {
  const [imgSrc, setImgSrc] = React.useState<string | null>(null);
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    if (!src) {
      setImgSrc("/placeholder-blog.jpg");
      setIsLoading(false);
      return;
    }
    
    const newUrl = getImageUrl(src, "/placeholder-blog.jpg");
    setImgSrc(newUrl);
    setHasError(false);
    setIsLoading(true);
    
    // Log image URL for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('🖼️ Article image:', {
        original: src,
        processed: newUrl,
        alt
      });
    }
  }, [src, alt]);
  
  const handleError = () => {
    console.warn('⚠️ Image failed to load:', imgSrc);
    setHasError(true);
    setImgSrc("/placeholder-blog.jpg");
    setIsLoading(false);
  };
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  if (hasError || !imgSrc) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    );
  }
  
  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={className}
        onError={handleError}
        onLoad={handleLoad}
      />
    </>
  );
}

type RawArticle = {
  id: number;
  title: string;
  description: string;
  category?: { id: number; name: string } | null;
  category_id?: number;
  image?: string | null;
  video_url?: string | null;
  slug: string;
  date: string;
  is_published: number;
  is_top: number;
  created_at: string;
  updated_at: string;
};

interface ArticlesCardProps {
  limit?: number;
  showAll?: boolean;
  homePage?: boolean;
}

interface ArticleCardData {
  id: number;
  title: string;
  description: string;
  category: string;
  category_id: number | null;
  published_at?: string | null;
  image?: string | null;
  video_url?: string | null;
  slug: string;
  is_published: boolean;
  is_top: boolean;
}

interface ArticleCategory {
  id: number;
  name: string;
}

export default function ArticlesCard({ limit, showAll = true, homePage = false }: ArticlesCardProps) {
  const { t: tRaw } = useTranslation('common', { useSuspense: false });
  
  // Create a wrapper that always returns a string
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === 'string' ? result : key;
  };

  // Function to clean HTML entities and unwanted characters
  const cleanText = (text: string): string => {
    if (!text) return '';
    
    return text
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Replace common HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      // Remove multiple spaces and normalize whitespace
      .replace(/\s+/g, ' ')
      // Remove leading/trailing whitespace
      .trim();
  };

  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const enablePagination = !homePage && showAll;
  const normalizedSearch = searchTerm.trim();



  const fetchArticles = useCallback(
    (params: Record<string, unknown>) =>
      ArticlesApi.getAll({
        ...params,
        search: homePage ? undefined : (normalizedSearch || undefined),
        category: homePage ? undefined : (selectedCategory || undefined),
      }),
    [normalizedSearch, selectedCategory, homePage]
  );

  const {
    items,
    isLoadingInitial,
    isFetchingMore,
    error,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    reload,
    page,
    totalPages,
  } = usePaginatedResource<RawArticle>(fetchArticles, {
    pageSize: limit ?? 12,
  });

  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (!enablePagination) {
      void reload();
      return;
    }

    void goToPage(1);
  }, [normalizedSearch, selectedCategory, enablePagination, goToPage, reload]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("🔍 Fetching categories from ArticlesApi");
        const response = await ArticlesApi.getCategories();
        
        if (response.success) {
          const data = response.data;
          console.log("📋 Categories data:", data);
          setCategories(Array.isArray(data) ? data : []);
        } else {
          console.error("❌ Category API failed:", response.error);
          // Optionally set an empty array or fallback categories on error
          setCategories([]); 
        }
      } catch (err) {
        console.error("❌ Failed to fetch categories:", err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const mappedArticles = useMemo<ArticleCardData[]>(
    () => {
      console.log("📄 Processing articles:", items.length);
      const mapped = items.map((item) => {
        let categoryName = "General";
        let categoryId: number | null = null;

        if (item.category) {
          if (typeof item.category === "string") {
            categoryName = item.category;
          } else if (typeof item.category === "object" && item.category && item.category.name) {
            categoryName = String(item.category.name);
            if (typeof item.category.id === "number") {
              categoryId = item.category.id;
            }
          }
        } else if (item.category_id) {
          categoryId = item.category_id;
          categoryName = String(item.category_id);
        }

        return {
          id: item.id,
          title: cleanText(item.title || "Untitled Article"),
          description: cleanText(item.description || ""),
          category: categoryName,
          category_id: categoryId,
          published_at: item.created_at || item.date,
          image: item.image,
          video_url: item.video_url,
          slug: item.slug || `article-${item.id}`,
          is_published: item.is_published === 1,
          is_top: Boolean(item.is_top),
        };
      });
      
      return mapped;
    },
    [items]
  );

  // Auto-update categories from articles when they change
  useEffect(() => {
    if (mappedArticles.length > 0) {
      // Extract unique categories from articles
      const articleCategories = [...new Set(mappedArticles.map(article => article.category))];
      console.log("🏷️ Categories found in articles:", articleCategories);
      
      // Create categories from articles if API categories are empty or different
      if (categories.length === 0 || 
          (categories.length > 0 && !articleCategories.every(cat => 
            categories.some(apiCat => apiCat.name === cat)
          ))) {
        console.log("🔄 Updating categories from articles");
        const fallbackCategories = articleCategories.map((name, index) => ({
          id: index + 1,
          name: name
        }));
        setCategories(fallbackCategories);
      }
    }
  }, [mappedArticles, categories.length]);

  const filteredArticles = useMemo(() => {
    if (!mappedArticles.length) {
      return mappedArticles;
    }

    if (homePage) {
      return mappedArticles;
    }

    const loweredSearch = normalizedSearch.toLowerCase();

    return mappedArticles.filter((article) => {
      const matchesSearch =
        !loweredSearch ||
        article.title.toLowerCase().includes(loweredSearch) ||
        article.description.toLowerCase().includes(loweredSearch) ||
        String(article.category).toLowerCase().includes(loweredSearch);

      const matchesCategory =
        !selectedCategory ||
        String(article.category) === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [mappedArticles, normalizedSearch, selectedCategory, homePage]);

  const displayArticles = limit
    ? filteredArticles.slice(0, limit)
    : filteredArticles;

  if (isLoadingInitial) {
    return <UnifiedLoader variant="grid" count={6} showFilters={!homePage} />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorDisplay 
          error={error} 
          variant="full" 
          onRetry={() => void reload()}
        />
      </div>
    );
  }

  return (
    <div className={`${homePage ? '' : 'min-h-screen'} bg-gray-50`} dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" dir="rtl">
        {/* Modern Category Filter - Hidden on Homepage */}
        {!homePage && (
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 justify-center bg-white py-4 px-4 rounded-xl border border-gray-200 shadow-sm">
              {/* All Button */}
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300
                  ${
                    selectedCategory === ""
                      ? "bg-gray-800 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                  }
                `}
              >
                {t('home.allArticles')}
              </button>

              {/* Dynamic Category Buttons */}
              {categories.slice(0, showAllCategories ? categories.length : 4).map((cat) => {
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300
                      ${
                        selectedCategory === cat.name
                          ? "bg-gray-800 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                      }
                    `}
                  >
                    {cat.name}
                  </button>
                );
              })}

              {/* More/Less Button */}
              {categories.length > 4 && (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  {showAllCategories ? t('home.showLess') : `+${categories.length - 4} ${t('home.showMore')}`}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modern Article List Design */}
        {displayArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {displayArticles.map((article, index) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
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
                
                {/* Image Section */}
                <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                  <ArticleImage 
                    src={article.image} 
                    alt={article.title}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200">
                      {String(article.category)}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors line-clamp-2 leading-tight" style={{ fontFamily: 'Amiri, serif' }}>
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4" style={{ fontFamily: 'Amiri, serif' }}>
                    {article.description}
                  </p>
                  
                  {/* Arrow Icon */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-gray-600 text-sm font-medium">د لوستلو لپاره</span>
                    <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm" dir="rtl">
            <div className="text-gray-300 text-6xl mb-6">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Amiri, serif' }}>
              مقالې ونه موندل شوې
            </h3>
            <p className="text-gray-600 text-sm mb-6" style={{ fontFamily: 'Amiri, serif' }}>
              {searchTerm
                ? "د لټون اصطلاح بدل کړئ"
                : "په دې وخت کې مقالې نشته."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
              >
                لټون پاک کړئ
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {enablePagination && !limit && displayArticles.length > 0 && (
          <PaginationControls
            className="mt-12"
            page={page}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPreviousPage}
            onPageChange={(target) => void goToPage(target)}
            isBusy={isFetchingMore}
          />
        )}
      </div>
    </div>
  );
}