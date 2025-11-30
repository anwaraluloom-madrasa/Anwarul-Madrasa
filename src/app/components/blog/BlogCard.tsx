"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";
import { Calendar, ChevronLeft, FileText } from "lucide-react";

import PaginationControls from "@/components/PaginationControls";
import { BlogsApi } from "@/lib/api";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getTranslation } from "@/lib/translations";
import { ComingSoonEmptyState } from "@/components/EmptyState";
import ErrorDisplay from "@/components/ErrorDisplay";
import BlogCardSkeleton from "./BlogCardSkeleton";
import React from "react";
import { getSimpleImageUrl } from "@/lib/utils";

interface BlogItem {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  image?: string | null;
  category?: { name?: string | null } | null;
  is_published?: boolean | number | null;
  is_top?: boolean | number | null;
  created_at?: string | null;
  published_at?: string | null;
}

interface BlogsPreviewProps {
  limit?: number;
  homePage?: boolean;
}

const fallbackImage = "/placeholder-blog.jpg";

// Simple Image component with memoization to prevent reloads
const BlogImage = React.memo(function BlogImage({ 
  src, 
  alt, 
  className,
  priority = false
}: { 
  src: string | null | undefined; 
  alt: string; 
  className?: string;
  priority?: boolean;
}) {
  const errorRef = React.useRef(false);
  
  // Memoize image URL to prevent unnecessary recalculations
  const imageUrl = React.useMemo(() => {
    if (errorRef.current) return fallbackImage;
    return getSimpleImageUrl(src, fallbackImage);
  }, [src]);
  
  return (
    <Image
      key={imageUrl}
      src={imageUrl}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className={className}
      priority={priority}
      unoptimized={imageUrl.startsWith('http') && !imageUrl.includes('website.anwarululoom.com')}
      onError={(e) => {
        if (!errorRef.current) {
          errorRef.current = true;
          const target = e.currentTarget as HTMLImageElement;
          target.src = fallbackImage;
}
      }}
    />
  );
});

function cleanHtmlEntities(html?: string | null) {
  if (!html) return '';
  let cleaned = html;
  cleaned = cleaned.replace(/<[^>]*>/g, " ");
  cleaned = cleaned.replace(/&nbsp;/g, " ");
  cleaned = cleaned.replace(/&amp;/g, "&");
  cleaned = cleaned.replace(/&lt;/g, "<");
  cleaned = cleaned.replace(/&gt;/g, ">");
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&#39;/g, "'");
  cleaned = cleaned.replace(/&apos;/g, "'");
  cleaned = cleaned.replace(/&mdash;/g, "—");
  cleaned = cleaned.replace(/&ndash;/g, "–");
  cleaned = cleaned.replace(/&hellip;/g, "...");
  cleaned = cleaned.replace(/&[#\w]+;/g, " ");
  cleaned = cleaned.replace(/\s+/g, " ");
  cleaned = cleaned.trim();
  return cleaned;
}

function formatDate(value?: string | null, t?: (key: string) => string) {
  if (!value) return t ? t('blog.recentlyUpdated') : "Recently updated";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return t ? t('blog.recentlyUpdated') : "Recently updated";
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogsPreview({ limit, homePage }: BlogsPreviewProps) {
  const t = (key: string): string => {
    const translation = getTranslation(key, 'ps');
    return typeof translation === 'string' ? translation : key;
  };

  const [selectedCategory, setSelectedCategory] = useState<string>(t('blog.all'));
  const [mounted, setMounted] = useState(false);
  const enablePagination = !homePage;

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchBlogs = useCallback(
    (params: Record<string, unknown>) =>
      BlogsApi.getAll({
        ...params,
        category:
          !homePage && selectedCategory !== t('blog.all')
            ? selectedCategory
            : undefined,
        // Remove is_top filter from API call - we'll filter on frontend
      }),
    [homePage, selectedCategory]
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
  } = usePaginatedResource<BlogItem>(fetchBlogs, {
    pageSize: limit ?? 12,
  });

  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    void goToPage(1);
  }, [selectedCategory, goToPage]);

  const publishedBlogs = useMemo(
    () => items.filter((item) => Boolean(item.is_published)),
    [items]
  );

  const curatedBlogs = useMemo(() => {
    if (homePage) {
      // Filter for blogs where is_top is truthy (1, true, "1", etc.)
      const topBlogs = publishedBlogs.filter((item) => {
        return item.is_top === 1 || item.is_top === true || String(item.is_top) === "1";
      }).slice(0, 3);
      
      // If no top blogs found, show first 3 published blogs as fallback
      if (topBlogs.length === 0) {
        return publishedBlogs.slice(0, 3);
      }
      
      return topBlogs;
    }
    return publishedBlogs;
  }, [homePage, publishedBlogs]);

  const categories = useMemo(
    () =>
      [
        t('blog.all'),
        ...new Set(
          publishedBlogs.map((item) => item.category?.name || t('blog.general'))
        ),
      ],
    [publishedBlogs, t]
  );

  const filteredBlogs = useMemo(() => {
    let next = [...curatedBlogs];
    if (!homePage && selectedCategory !== t('blog.all')) {
      next = next.filter((item) => item.category?.name === selectedCategory);
    }
    if (limit) {
      next = next.slice(0, limit);
    }
    return next;
  }, [curatedBlogs, homePage, limit, selectedCategory, t]);

  if (isLoadingInitial && filteredBlogs.length === 0) {
    return (
      <section id="blogs" className="bg-background-primary py-16" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          {/* Category filter skeleton */}
          {!homePage && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"></div>
              ))}
            </div>
          )}
          
          {/* Cards skeleton */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: limit ?? 6 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background-primary py-16">
        <div className="max-w-7xl mx-auto px-6">
          <ErrorDisplay 
            error={error} 
            variant="inline" 
            onRetry={() => void reload()}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="blogs" className="bg-background-primary py-16" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          {!homePage && categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 border-2 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-600 shadow-lg hover:from-emerald-700 hover:to-emerald-800 scale-105"
                      : "bg-white text-emerald-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 shadow-sm"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {filteredBlogs.length === 0 ? (
            <ComingSoonEmptyState
              title={t('blog.noBlogsAvailable')}
              description={t('blog.checkBackSoon')}
              className="max-w-2xl mx-auto"
            />
          ) : (
            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { duration: 0.15 },
                },
              }}
            >
              {filteredBlogs.map((item, index) => {
                if (!item) return null;
                return (
                  <Link
                    key={item.slug}
                    href={`/blogs/${item.slug}`}
                    className="group relative flex h-full flex-col bg-[#e0f2f2] rounded-2xl shadow-md hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300 overflow-hidden border-2 border-[#d0e8e8] hover:border-emerald-400 hover:-translate-y-1"
                    dir="rtl"
                  >
                    {/* Top Section - Full Size Image */}
                    <div className="relative h-48 bg-[#e0f2f2] flex-shrink-0 overflow-hidden">
                      <BlogImage
                        src={item.image}
                        alt={item.title || 'Blog post'}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={homePage && index < 3}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/95 backdrop-blur-md text-emerald-700 border-2 border-emerald-200/50 shadow-lg">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{item.category?.name || t('blog.general')}</span>
                        </span>
                      </div>
                    </div>

                    {/* Bottom Section - White Background with Crescent Pattern */}
                    <div className="relative flex-1 bg-white p-6 flex flex-col justify-between">
                      {/* Crescent Moon Pattern Background */}
                      <div 
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 5c-8 0-15 3-20 8-5 5-8 12-8 20 0 8 3 15 8 20 5 5 12 8 20 8s15-3 20-8c5-5 8-12 8-20 0-8-3-15-8-20-5-5-12-8-20-8zm0 5c6 0 11 2 15 6 4 4 6 9 6 15 0 6-2 11-6 15-4 4-9 6-15 6s-11-2-15-6c-4-4-6-9-6-15 0-6 2-11 6-15 4-4 9-6 15-6z' fill='%234a8a8a'/%3E%3C/svg%3E")`,
                          backgroundSize: '50px 50px',
                          backgroundPosition: '0 0'
                        }}
                      ></div>

                      {/* Content */}
                      <div className="relative z-10 space-y-4 flex-1">
                        {/* Title - Large and Bold */}
                        <h2 className="text-xl md:text-2xl font-bold text-emerald-700 group-hover:text-emerald-800 leading-tight line-clamp-2 transition-colors" style={{ fontFamily: 'Amiri, serif' }}>
                          {cleanHtmlEntities(item.title)}
                        </h2>

                        {/* Description */}
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3" style={{ fontFamily: 'Amiri, serif' }}>
                          {cleanHtmlEntities(item.description) || t('blog.noSummaryAvailable')}
                        </p>

                        {/* Date - Small Text */}
                        <div className="flex items-center gap-2 text-xs text-emerald-600 pt-2">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(item.published_at || item.created_at, t)}</span>
                        </div>
                      </div>

                      {/* Separator */}
                      <div className="relative z-10 my-4 border-t border-gray-200"></div>

                      {/* Footer with Navigation */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-xs text-emerald-700 font-semibold" style={{ fontFamily: 'Amiri, serif' }}>
                          {t('blog.readMore')}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 group-hover:from-emerald-100 group-hover:to-emerald-200 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                          <ChevronLeft className="w-4 h-4 text-emerald-700" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          )}

          {enablePagination && filteredBlogs.length > 0 && (
            <PaginationControls
              className="mt-12 w-full"
              page={page}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPreviousPage}
              onPageChange={(target) => void goToPage(target)}
              isBusy={isFetchingMore}
            />
          )}
        </div>
      </section>
  );
}
