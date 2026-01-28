"use client";

import { useEffect, useState } from "react";
import { SanadApi } from "../../../lib/api";
import { Sanad } from "../../../lib/types";
import { motion } from "framer-motion";
import { ComingSoonEmptyState } from "@/components/EmptyState";
import { useTranslation } from "@/hooks/useTranslation";
import SanadCardSkeleton from "./SanadCardSkeleton";

interface SanadSectionProps {
  showAll?: boolean;
  showHero?: boolean;
}

export default function SanadSection({
  showAll = false,
  showHero = false,
}: SanadSectionProps) {
  const { t: tRaw } = useTranslation("common", { useSuspense: false });
  const [sanads, setSanads] = useState<Sanad[]>([]);
  const [loading, setLoading] = useState(true);

  // Create a string-safe wrapper function
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === "string" ? result : key;
  };

  useEffect(() => {
    async function fetchSanads() {
      try {
        const res = await SanadApi.getAll();
        let data: Sanad[] = Array.isArray(res?.data)
          ? (res.data as Sanad[])
          : [];
        if (!showAll) data = data.slice(0, 4);
        setSanads(data);
      } catch (err) {
        console.error(err);
        setSanads([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSanads();
  }, [showAll]);

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6" dir="rtl">
        <div className="space-y-4">
          {/* Featured header skeleton */}
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 md:p-8 border-2 border-gray-200 shadow-sm animate-pulse">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-8 bg-gray-300 rounded-md w-3/4 mx-auto mb-3"></div>
                <div className="h-6 bg-gray-200 rounded-md w-full mb-2"></div>
                <div className="h-6 bg-gray-200 rounded-md w-5/6 mx-auto"></div>
              </div>
            </div>
          </div>
          {/* Card skeletons */}
          {Array.from({ length: showAll ? 8 : 4 }).map((_, index) => (
            <SanadCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!sanads.length) {
    return (
      <ComingSoonEmptyState
        title={t("sanad.title")}
        description={t("sanad.description")}
        className="max-w-2xl mx-auto"
      />
    );
  }

  return (
    <div className="w-full">
      {showHero && (
        <div className="text-center mb-16">
          <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("sanad.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("sanad.description")}
          </p>
        </div>
      )}

      {/* Enhanced Sanad Display */}
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8" dir="rtl">
        <div className="space-y-3 sm:space-y-4">
          {sanads.map((sanad, idx) => (
            <motion.div
              key={sanad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.15,
                ease: "easeOut",
              }}
              className="group"
            >
              {idx === 0 ? (
                // First item - featured style with enhanced design
                <div className="mb-6 md:mb-8 max-w-4xl mx-auto">
                  <div className="relative bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-emerald-50 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 border-2 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-emerald-200/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="text-center relative z-10">
                      <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">
                        📜
                      </div>
                      <h2
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-3 sm:mb-4 px-2"
                        style={{ fontFamily: "Amiri, serif" }}
                        lang="ar"
                        data-no-translate="true"
                        translate="no"
                      >
                        شجرهٔ حضرات کابل
                      </h2>
                      <p
                        className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-emerald-800 leading-relaxed px-2"
                        style={{ fontFamily: "Amiri, serif" }}
                        lang="ar"
                        data-no-translate="true"
                        translate="no"
                      >
                        شجره عالیه حضرات عالي درجات نقشبندیه مجددیه عمریه (قدسنا
                        الله باسرارهم العاليه) خانقاه عالیه مجددیه عمریه ارغندی،
                        پغمان، کابل
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Other items - enhanced design with number on right
                <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 border-2 border-gray-200 hover:border-emerald-300 shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <div
                    className="flex items-center gap-2 sm:gap-3 md:gap-4"
                    dir="rtl"
                  >
                    {/* Number badge - always on right side, smaller */}
                    <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-xs md:text-sm shadow-md group-hover:scale-110 transition-transform duration-300">
                      {idx}
                    </div>

                    {/* Content - takes full width, text aligned right */}
                    <div className="flex-1 text-right min-w-0">
                      <div
                        className="text-gray-800 text-xs sm:text-sm md:text-base lg:text-xl leading-relaxed font-semibold break-words"
                        style={{ fontFamily: "Amiri, serif" }}
                        lang="ar"
                        dir="rtl"
                        data-no-translate="true"
                        translate="no"
                        dangerouslySetInnerHTML={{ __html: sanad.name }}
                      />
                    </div>

                    {/* Spacer for visual balance */}
                    <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"></div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
