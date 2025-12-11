"use client";

import SanadSection from "../components/sanad/SanadSection";
import IslamicHeader from "../components/IslamicHeader";
import Breadcrumb from "@/components/Breadcrumb";
import { useTranslation } from "@/hooks/useTranslation";

export default function SanadPage() {
  const { t: tRaw } = useTranslation("common", { useSuspense: false });

  // Create a string-safe wrapper function
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === "string" ? result : key;
  };

  return (
    <main
      className="w-full min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-gray-50"
      dir="rtl"
    >
      <IslamicHeader
        pageType="sanad"
        title={t("sanad.title")}
        subtitle={t("sanad.description")}
        alignment="center"
      />
      <div
        className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12"
        dir="rtl"
      >
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>
        <SanadSection showAll={true} showHero={false} />
      </div>
    </main>
  );
}
