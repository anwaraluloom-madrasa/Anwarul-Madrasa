"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TasawwufApi, extractArray } from "@/lib/api";
import { cleanText } from "@/lib/textUtils";
import { getSimpleImageUrl } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import ErrorDisplay from "@/components/ErrorDisplay";
import { NoDataEmptyState } from "@/components/EmptyState";
import TasawwufCardSkeleton from "./TasawwufCardSkeleton";
import { ArrowLeft, Tag, BookOpen } from "lucide-react";

interface Tasawwuf {
  id: number;
  title: string;
  slug: string;
  description: string;
  image?: string;
  shared_by?: string;
  created_at?: string;
  category?: { id: number; name: string };
  is_top?: number;
}

interface Props {
  homePage?: boolean;
  limit?: number;
}

export default function TasawwufList({ homePage = false, limit }: Props) {
  const { t: tRaw, i18n } = useTranslation('common', { useSuspense: false });
  
  // Create a wrapper that always returns a string
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === 'string' ? result : key;
  };

  // Check if current language is RTL
  // Always RTL since website only has RTL languages
  const isRTL = true;

  const [posts, setPosts] = useState<Tasawwuf[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("ټول");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const response = await TasawwufApi.getAll();
        if (!response.success) {
          throw new Error(response.error || "د تصوف مینځپانګه پورته کول ناکام شول");
        }

        const data = extractArray<Tasawwuf>(response.data);
        const filtered = homePage ? data.filter((post) => post.is_top === 1) : data;
        setPosts(limit ? filtered.slice(0, limit) : filtered);

        // categories
        const cats = Array.from(
          new Set(data.map((post) => post.category?.name).filter(Boolean))
        ) as string[];
        setCategories(["ټول", ...cats]);
      } catch (err) {
        console.error("Error fetching tasawwuf posts:", err);
        setError(err instanceof Error ? err.message : "د تصوف مینځپانګه پورته کول ناکام شول");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [homePage, limit]);

  const filteredPosts =
    activeCategory === "ټول"
      ? posts
      : posts.filter((post) => post.category?.name === activeCategory);

  if (isLoading) {
    return (
      <section className="space-y-16">
        {/* Category filter skeleton */}
        {!homePage && (
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"></div>
            ))}
          </div>
        )}
        
        {/* Cards skeleton */}
        <div className="grid gap-8 max-w-5xl mx-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <TasawwufCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        variant="full" 
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!filteredPosts.length) {
    return (
      <NoDataEmptyState
        title={t('tasawwuf.noArticlesFound') || "هیڅ مینځپانګه ونه موندل شوه"}
        description={t('tasawwuf.tryDifferentCategory') || "مهرباني وکړئ بله کټګوري وټاکئ"}
        action={{
          label: t('tasawwuf.viewAllCategories') || "ټولې کټګورۍ وګورئ",
          onClick: () => setActiveCategory("ټول")
        }}
        className="max-w-2xl mx-auto"
      />
    );
  }

  return (
    <section className="space-y-12" dir="rtl">
      {/* Category Pills - Improved Design */}
      {!homePage && (
        <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat, index) => (
          <button
            key={`category-${cat}-${index}`}
            onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 outline-none focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
              activeCategory === cat
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg scale-105"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 shadow-sm"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      )}
    
      {/* Vertical List - Improved Design */}
      <div className="grid gap-6 max-w-6xl mx-auto">
  {filteredPosts.map((post, index) => (
          <Link
      key={post.id || `post-${index}`}
            href={`/tasawwuf/${post.slug}`}
            className="group flex flex-col md:flex-row gap-6 p-6 rounded-2xl border-2 border-gray-200/60 bg-white hover:border-emerald-300/60 hover:shadow-2xl hover:shadow-emerald-100/30 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      {post.image && (
              <div className="relative w-full md:w-2/5 lg:w-1/3 h-56 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                  <Image
                  src={getSimpleImageUrl(post.image, "/placeholder-tasawwuf.jpg")}
                    alt={post.title}
                    fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-tasawwuf.jpg";
                  }}
                />
                
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/95 backdrop-blur-md text-emerald-700 border border-emerald-200/50 shadow-lg">
                    <Tag className="w-3 h-3" />
                    {post.category?.name || "تصوف"}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
            <div className="flex-1 flex flex-col justify-between py-1 min-h-0">
        <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight" style={{ fontFamily: 'Amiri, serif' }}>
              {cleanText(post.title)}
            </h3>
                <p className="text-gray-600 line-clamp-3 leading-relaxed mb-5 text-base" style={{ fontFamily: 'Amiri, serif' }}>
            {cleanText(post.description)}
          </p>
        </div>
        
              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>د لوستلو لپاره</span>
          </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 group-hover:from-emerald-100 group-hover:to-emerald-200 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <ArrowLeft className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
        </div>
      </div>
    </div>
          </Link>
  ))}
</div>

      {/* Homepage "Explore All" button */}
      {homePage && posts.length > 0 && (
        <div className="text-center mt-12">
          <Link
            href="/tasawwuf"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span>ټول مینځپانګه وګورئ</span>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      )}
      </section>
  );
}
