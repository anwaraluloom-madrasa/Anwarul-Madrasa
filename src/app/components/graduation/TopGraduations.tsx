"use client";

import Image from "next/image";
import Link from "next/link";
import { GraduationsApi } from "../../../lib/api";
import { Calendar, Star, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getSimpleImageUrl } from "@/lib/utils";
import PaginationControls from "@/components/PaginationControls";
import { useTranslation } from "@/hooks/useTranslation";
import ErrorDisplay from "@/components/ErrorDisplay";
import { ComingSoonEmptyState } from "@/components/EmptyState";
import GraduationCardSkeleton from "./GraduationCardSkeleton";
import React from "react";

interface Graduation {
  id: number;
  title: string;
  slug: string;
  description: string;
  main_image?: string | null;
  graduation_year?: string | number;
  is_top?: boolean;
}

interface GraduationsSectionProps {
  showAll?: boolean;
}

export default function GraduationsSection({ showAll = false }: GraduationsSectionProps) {
  const { t: tRaw, i18n } = useTranslation("common", { useSuspense: false });
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === "string" ? result : key;
  };
  const isRTL = i18n.language === "ps" || i18n.language === "prs";

  const [graduations, setGraduations] = useState<Graduation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const PAGE_SIZE = showAll ? 8 : 3; // Show only 3 cards on home page, 8 on dedicated page

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await GraduationsApi.getAll(showAll ? {} : { page, limit: PAGE_SIZE });
        const data: Graduation[] = Array.isArray(res?.data) ? res.data : [];
        
        if (!showAll) {
          // Limit to 3 cards on home page
          const limitedData = data.slice(0, PAGE_SIZE);
          setGraduations(limitedData);
          const pagination = res?.pagination;
          if (pagination && typeof pagination.totalPages === 'number') {
            setTotalPages(pagination.totalPages);
          } else {
            setTotalPages(limitedData.length < PAGE_SIZE && page === 1 ? 1 : (limitedData.length === PAGE_SIZE ? page + 1 : page));
          }
        } else {
          setGraduations(data);
          setTotalPages(null);
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load graduations");
        setGraduations([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [showAll, page]);

  const stripHtml = (value?: string | null) => {
    if (!value) return "";
    let cleaned = value;
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
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: showAll ? 8 : 3 }).map((_, index) => (
          <GraduationCardSkeleton key={index} />
        ))}
      </div>
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

  if (!graduations.length) {
    return (
      <ComingSoonEmptyState
        title={t('graduationDetail.noGraduations')}
        description={t('graduationDetail.checkBackLater')}
        className="max-w-2xl mx-auto"
      />
    );
  }

  return (
    <div className="w-full">
      {/* Graduations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {graduations.slice(0, PAGE_SIZE).map((grad, idx) => {
          const coverImage = getSimpleImageUrl(grad.main_image, "/placeholder-graduation.jpg");
          
          return (
            <Link
              key={grad.id}
              href={`/graduated-students/${grad.slug}`}
              className="group relative flex h-full flex-col bg-[#e0f2f2] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-[#d0e8e8]"
              dir="rtl"
            >
              {/* Top Section - Full Size Image */}
              <div className="relative h-52 bg-gradient-to-br from-emerald-100 to-emerald-200 flex-shrink-0 overflow-hidden group-hover:opacity-95 transition-opacity duration-300">
                <GraduationImage src={coverImage} alt={grad.title} />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Top Graduate Badge */}
                {grad.is_top && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white shadow-lg">
                      <Star className="w-4 h-4 fill-white" />
                      <span>{t('graduationDetail.top')}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Section - White Background with Crescent Pattern */}
              <div className="relative h-44 flex-1 bg-white p-6 flex flex-col justify-between">
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
                <div className="relative z-10 space-y-3">
                  {/* Title - Large and Bold */}
                  <h3 className="text-xl md:text-2xl font-bold text-[#4a8a8a] leading-tight line-clamp-2" style={{ fontFamily: 'Amiri, serif' }}>
                    {stripHtml(grad.title)}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#4a8a8a] leading-relaxed line-clamp-3" style={{ fontFamily: 'Amiri, serif' }}>
                    {stripHtml(grad.description) || t('graduationDetail.noDescriptionAvailable')}
                  </p>

                  {/* Metadata - Small Text */}
                  <div className="flex items-center gap-4 text-xs text-[#4a8a8a] pt-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{grad.graduation_year || 'N/A'}</span>
                    </div>
                    {grad.is_top && (
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5" />
                        <span>{t('graduationDetail.top')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Separator */}
                <div className="relative z-10 my-4 border-t border-gray-200"></div>

                {/* Footer with Navigation */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs text-[#4a8a8a] font-medium" style={{ fontFamily: 'Amiri, serif' }}>
                    {t('graduationDetail.viewDetails')}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#e0f2f2] flex items-center justify-center group-hover:bg-[#d0e8e8] transition-colors">
                    <ChevronLeft className="w-4 h-4 text-[#4a8a8a]" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

        {/* Pagination - Only show on dedicated graduations page */}
        {showAll && graduations.length > 0 && (
          <PaginationControls
            className="mt-10"
            page={page}
            totalPages={typeof totalPages === 'number' ? totalPages : null}
            hasNextPage={typeof totalPages === 'number' ? (page < totalPages) : (graduations.length === PAGE_SIZE)}
            hasPrevPage={page > 1}
            onPageChange={(p) => setPage(p)}
            isBusy={loading}
          />
        )}
    </div>
  );
}

// Memoized Image component with error handling
const GraduationImage = React.memo(function GraduationImage({ 
  src, 
  alt 
}: { 
  src: string; 
  alt: string;
}) {
  const errorRef = React.useRef(false);
  
  const imageUrl = React.useMemo(() => {
    if (errorRef.current) return "/placeholder-graduation.jpg";
    return src;
  }, [src]);
  
  return (
    <Image
      key={imageUrl}
      src={imageUrl}
      alt={alt}
      fill
      sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
      onError={(e) => {
        if (!errorRef.current) {
          errorRef.current = true;
          const target = e.currentTarget as HTMLImageElement;
          target.src = "/placeholder-graduation.jpg";
        }
      }}
    />
  );
});
