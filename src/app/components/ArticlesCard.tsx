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
import { ArrowLeft, BookOpen, Tag, Search, X } from "lucide-react";

import { ArticlesApi } from "@/lib/api";
import PaginationControls from "@/components/PaginationControls";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { useTranslation } from "@/hooks/useTranslation";
import ErrorDisplay from "@/components/ErrorDisplay";
import ArticleCardSkeleton from "./articles/ArticleCardSkeleton";

import { getSimpleImageUrl } from "@/lib/utils";

// Simple Image component with memoization to prevent reloads
const ArticleImage = React.memo(function ArticleImage({ src, alt, className }: { src: string | null | undefined; alt: string; className?: string }) {
  const errorRef = React.useRef(false);
  
  // Memoize image URL to prevent unnecessary recalculations
  const imageUrl = React.useMemo(() => {
    if (errorRef.current) return "/placeholder-blog.jpg";
    return getSimpleImageUrl(src, "/placeholder-blog.jpg");
  }, [src]);
  
  return (
      <Image
      key={imageUrl}
      src={imageUrl}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={className}
      onError={(e) => {
        if (!errorRef.current) {
          errorRef.current = true;
          e.currentTarget.src = "/placeholder-blog.jpg";
        }
      }}
      />
  );
});

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
    return (
      <div className={`${homePage ? '' : 'min-h-screen'} bg-gray-50`} dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" dir="rtl">
          {/* Category filter skeleton */}
          {!homePage && (
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 justify-center bg-white py-4 px-4 rounded-xl border border-gray-200 shadow-sm">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-9 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                ))}
              </div>
            </div>
          )}
          
          {/* Articles grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {Array.from({ length: 6 }).map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
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
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-3 justify-center bg-white py-5 px-6 rounded-2xl border-2 border-gray-200/60 shadow-lg">
              {/* All Button */}
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300
                  ${
                    selectedCategory === ""
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300"
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
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300
                      ${
                        selectedCategory === cat.name
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg scale-105"
                          : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300"
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
                  className="px-5 py-2.5 rounded-xl text-sm font-bold border-2 border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  {showAllCategories ? t('home.showLess') : `+${categories.length - 4} ${t('home.showMore')}`}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modern Article List Design */}
        {displayArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {displayArticles.map((article, index) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group relative bg-white rounded-2xl border-2 border-gray-200/60 overflow-hidden hover:border-emerald-300/60 hover:shadow-2xl hover:shadow-emerald-100/30 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
                dir="rtl"
              >
                {/* Decorative right border accent */}
                <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 via-emerald-300 to-emerald-200 group-hover:from-emerald-500 group-hover:via-emerald-400 group-hover:to-emerald-300 transition-colors"></div>
                
                {/* Image Section */}
                <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <ArticleImage 
                    src={article.image} 
                    alt={article.title}
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/95 backdrop-blur-md text-emerald-700 border border-emerald-200/50 shadow-lg group-hover:shadow-xl transition-shadow">
                      <Tag className="w-3 h-3" />
                      {String(article.category)}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-7 relative z-10 flex flex-col flex-1 min-h-0">
                  <div className="flex-1 min-h-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight" style={{ fontFamily: 'Amiri, serif' }}>
                    {article.title}
                  </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-5" style={{ fontFamily: 'Amiri, serif' }}>
                    {article.description}
                  </p>
                  </div>
                  
                  {/* Footer with arrow - Fixed height */}
                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 h-[3.5rem] flex-shrink-0">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>د لوستلو لپاره</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 group-hover:from-emerald-100 group-hover:to-emerald-200 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg flex-shrink-0">
                      <ArrowLeft className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-200/60 shadow-lg" dir="rtl">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
            </div>
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
              >
                <X className="w-4 h-4" />
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