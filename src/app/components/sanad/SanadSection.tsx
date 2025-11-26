"use client";

import { useEffect, useState } from "react";
import { SanadApi } from "../../../lib/api";
import { Sanad } from "../../../lib/types";
import { motion } from "framer-motion";
import { ComingSoonEmptyState } from "@/components/EmptyState";
import { useTranslation } from "@/hooks/useTranslation";
import UnifiedLoader from "@/components/loading/UnifiedLoader";

interface SanadSectionProps {
  showAll?: boolean;
  showHero?: boolean;
}

export default function SanadSection({ showAll = false, showHero = false }: SanadSectionProps) {
  const { t: tRaw } = useTranslation('common', { useSuspense: false });
  const [sanads, setSanads] = useState<Sanad[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create a string-safe wrapper function
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === 'string' ? result : key;
  };

  useEffect(() => {
    async function fetchSanads() {
      try {
        const res = await SanadApi.getAll();
        let data: Sanad[] = Array.isArray(res?.data) ? res.data as Sanad[] : [];
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
    return <UnifiedLoader variant="list" count={4} className="pt-0" />;
  }

  if (!sanads.length) {
    return (
      <ComingSoonEmptyState
        title={t('sanad.title')}
        description={t('sanad.description')}
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
            {t('sanad.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('sanad.description')}
          </p>
        </div>
      )}

      {/* Clean Sanad Display */}
      <div className="w-full px-4 sm:px-6">
        <div className="space-y-4">
          {sanads.map((sanad, idx) => (
            <motion.div
              key={sanad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.15,
                ease: "easeOut"
              }}
              className="group"
            >
              {idx === 0 ? (
                // First item - featured style
                <div>
                  <div className="text-center notranslate">
                   
                  <div className="mb-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 md:p-8 border border-green-200/50 shadow-sm">
                <div className="text-center">
                  <div className="text-4xl mb-4">📜</div>
                  <h2 className="text-2xl md:text-3xl font-bold text-black mb-3 rtl" style={{ fontFamily: 'Amiri, serif' }}>
                    شجرهٔ حضرات کابل
                  </h2>
                  <p className="font-bold md:text-lg text-black  leading-relaxed rtl" style={{ fontFamily: 'Amiri, serif' }}>
                    شجره عالیه حضرات عالي درجات نقشبندیه مجددیه عمریه (قدسنا الله باسرارهم العاليه) خانقاه عالیه مجددیه عمریه ارغندی، پغمان، کابل
                  </p>
                </div>
              </div>
            </div>
                  </div>
                </div>
              ) : (
                // Other items - clean with responsive number
                <div className="bg-white rounded-lg p-5 sm:p-6 border border-gray-200 shadow-sm">
                  {/* Mobile: Number on top right, Desktop: Number on right side */}
                  <div className="relative notranslate">
                    {/* Mobile: Number badge on top right */}
                    <div className="absolute top-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:hidden">
                      {idx}
                    </div>
                    {/* Desktop: Number on right side */}
                    <div className="hidden sm:flex sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex-shrink-0 w-8 h-8"></div>
                      <p className="text-gray-800 text-lg leading-relaxed font-medium rtl flex-1 w-full text-center">
                        {sanad.name}
                      </p>
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {idx}
                      </div>
                    </div>
                    {/* Mobile: Text below number, full width */}
                    <div className="sm:hidden pt-10">
                      <p className="text-gray-800 text-base leading-relaxed font-medium rtl w-full text-right">
                        {sanad.name}
                      </p>
                    </div>
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
