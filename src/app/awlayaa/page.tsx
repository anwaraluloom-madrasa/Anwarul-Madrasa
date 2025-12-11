"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Awlyaa } from "../../lib/types";
import { AwlyaaApi } from "../../lib/api";
import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/utils";
import IslamicHeader from "../components/IslamicHeader";
import Breadcrumb from "@/components/Breadcrumb";
import UnifiedLoader from "@/components/loading/UnifiedLoader";
import ErrorDisplay from "@/components/ErrorDisplay";
import { NoDataEmptyState } from "@/components/EmptyState";
import { useTranslation } from "@/hooks/useTranslation";
import { Search } from "lucide-react";
import AwlayaaCardSkeleton from "../components/awlayaa/AwlayaaCardSkeleton";

export default function AwlyaaListPage() {
  const { t: tRaw, i18n } = useTranslation('common', { useSuspense: false });
  
  // Create a wrapper that always returns a string
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === 'string' ? result : key;
  };

  const [awlyaa, setAwlyaa] = useState<Awlyaa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AwlyaaApi.getAll();
        setAwlyaa(res.data as Awlyaa[]);
      } catch (err: any) {
        setError(err.message || "Failed to fetch Awlyaa");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter awlyaa based on search term
  const filteredAwlyaa = awlyaa.filter(
    (item) =>
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants - optimized for instant rendering
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        // No staggerChildren delay - instant rendering
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.15, // Reduced from 0.5 for instant feel
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <IslamicHeader pageType="awlayaa" />
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-12 relative z-20" dir="rtl">
          <div className="mt-4 sm:mt-8 md:mt-12 mb-6 sm:mb-8">
            <Breadcrumb />
          </div>
          {/* Search bar skeleton */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
          
          {/* Awlyaa grid skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {Array.from({ length: 6 }).map((_, index) => (
              <AwlayaaCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <IslamicHeader pageType="awlayaa" />
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-16" dir="rtl">
          <div className="mt-4 sm:mt-8 md:mt-12 mb-6 sm:mb-8">
            <Breadcrumb />
          </div>
          <ErrorDisplay 
            error={error} 
            variant="full" 
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader pageType="awlayaa" />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-12 relative z-20" dir="rtl">
        <div className="mt-4 sm:mt-8 md:mt-12 mb-6 sm:mb-8">
          <Breadcrumb />
        </div>
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="mb-8"
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder={t('awlayaa.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors bg-white shadow-sm"
                dir="rtl"
              />
              {searchTerm && (
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-right"
              >
                <p className="text-gray-600 font-medium text-sm">
                  {filteredAwlyaa.length === 1 
                    ? t('awlayaa.scholarFound').replace('{count}', filteredAwlyaa.length.toString())
                    : t('awlayaa.scholarsFound').replace('{count}', filteredAwlyaa.length.toString())
                  }
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>


        {/* Awlyaa Grid */}
        {filteredAwlyaa.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7"
          >
            {filteredAwlyaa.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <Link href={`/awlayaa/${item.id}`}>
                  <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col" dir="rtl">
                    {/* Decorative right border accent */}
                    <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-200 group-hover:from-gray-500 group-hover:via-gray-400 group-hover:to-gray-300 transition-colors"></div>
                    
                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10zm-10 0c0-2.762 2.238-5 5-5s5 2.238 5 5-2.238 5-5 5-5-2.238-5-5z'/%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                    
                    {/* Decorative corner element */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Image Section */}
                    <div className="relative h-56 overflow-hidden">
                      {item.profile_image ? (
                        <img
                          src={
                            getImageUrl(item.profile_image, "/placeholder-awlyaa.jpg") ||
                            "/placeholder-awlyaa.jpg"
                          }
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6 sm:p-8 flex flex-col flex-grow relative z-10">
                      <div className="mb-4 flex-grow">
                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors" style={{ fontFamily: 'Amiri, serif' }}>
                          {item.name}
                        </h2>
                        {item.nickname && (
                          <p className="text-gray-600 font-medium text-sm mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                            "{item.nickname}"
                          </p>
                        )}
                        {item.title && (
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2" style={{ fontFamily: 'Amiri, serif' }}>
                            {item.title}
                          </p>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm font-medium">
                            د پروفایل کتل
                          </span>
                          <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <NoDataEmptyState
            title="No Awlyaa Found"
            description="We couldn't find any scholars matching your search criteria. Try adjusting your search terms or browse all our distinguished Awlyaa."
            action={{
              label: "View All Awlyaa",
              onClick: () => setSearchTerm("")
            }}
            className="max-w-2xl mx-auto"
          />
        )}
      </div>
    </div>
  );
}
