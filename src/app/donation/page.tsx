"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import IslamicHeader from "../components/IslamicHeader";
import Breadcrumb from "@/components/Breadcrumb";
import { getTranslation } from "@/lib/translations";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaWhatsapp,
  FaDonate,
  FaHeart,
  FaInfoCircle,
  FaGlobe,
  FaRibbon,
  FaComments,
  FaPhone,
  FaHandsHelping,
  FaUsers,
  FaStar,
  FaCheckCircle,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { DonationApi } from "../../lib/api";
import DonationSkeleton from "../components/donation/DonationSkeleton";

interface DonationInfo {
  id: number;
  branch_name: string;
  address: string;
  description: string;
  contact: string;
  email: string;
  whatsapp: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export default function DonationPage() {
  const t = (key: string): string => {
    const translation = getTranslation(key, "ps");
    return typeof translation === "string" ? translation : key;
  };

  const [donations, setDonations] = useState<DonationInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from DonationApi
        const response = await DonationApi.getAll(); // Make sure endpoint matches your backend
        const donationsData =
          (response as any)?.data?.data || (response as any)?.data || [];

        setDonations(Array.isArray(donationsData) ? donationsData : []);
      } catch (err) {
        console.error("Error fetching donation data:", err);
        setError(
          "Failed to load donation information. Please try again later."
        );
        setDonations([]); // No static fallback
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.15 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        // No staggerChildren delay - instant rendering
      },
    },
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#e0f2f2] via-white to-[#f0f9f9]">
        <IslamicHeader pageType="donation" />
        <DonationSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaInfoCircle className="text-red-600 text-2xl" />
            </div>
            <h2
              className="text-lg sm:text-xl font-bold text-red-800 mb-2"
              style={{ fontFamily: "Amiri, serif" }}
            >
              Error Loading Donation Information
            </h2>
            <p
              className="text-sm sm:text-base text-red-600"
              style={{ fontFamily: "Amiri, serif" }}
            >
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-[#e0f2f2] via-white to-[#f0f9f9]"
      dir="rtl"
    >
      <IslamicHeader pageType="donation" />

      {/* Donation Methods Grid */}
      <section
        className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-20"
        dir="rtl"
      >
        <div className="mt-4 sm:mt-8 md:mt-12 mb-6 sm:mb-8">
          <Breadcrumb />
        </div>
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            viewport={{ once: true }}
            className="inline-block mb-4 sm:mb-6"
          >
            <span className="bg-[#e0f2f2] text-[#4a8a8a] px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-[#d0e8e8]">
              {t("donation.chooseMethod")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 px-2"
            style={{ fontFamily: "Amiri, serif" }}
          >
            {t("donation.chooseMethod")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2"
            style={{ fontFamily: "Amiri, serif" }}
          >
            {t("donation.chooseMethodDesc")}
          </motion.p>
        </div>

        <motion.div
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-4 sm:space-y-6"
        >
          {donations.map((donation, index) => {
            return (
              <motion.div
                key={donation.id}
                variants={fadeIn}
                className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#d0e8e8] hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300 group shadow-md hover:-translate-y-1"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Header Section - Enhanced */}
                  <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white p-4 sm:p-6 md:p-8 lg:p-10 lg:w-2/5 flex-shrink-0 relative overflow-hidden">
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div>
                        <div className="mb-4 sm:mb-6">
                          <h3
                            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 leading-tight"
                            style={{ fontFamily: "Amiri, serif" }}
                          >
                            {donation.branch_name}
                          </h3>
                          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full mb-3 sm:mb-0">
                            <FaGlobe className="text-white text-xs" />
                            <p className="text-white text-xs sm:text-sm font-medium">
                              {donation.country}
                            </p>
                          </div>
                        </div>
                        <div
                          className="text-white text-xs sm:text-sm md:text-base leading-relaxed line-clamp-3 sm:line-clamp-4 [&_*]:text-white [&_p]:text-white [&_span]:text-white [&_div]:text-white [&_strong]:text-white [&_em]:text-white [&_b]:text-white [&_i]:text-white"
                          style={{ fontFamily: "Amiri, serif", color: "white" }}
                          dangerouslySetInnerHTML={{
                            __html: donation.description,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Section - Enhanced */}
                  <div className="p-4 sm:p-6 md:p-8 lg:p-10 lg:w-3/5 bg-white">
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 md:mb-8">
                      {donation.whatsapp && (
                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all duration-200 group/item">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-200">
                            <FaWhatsapp className="text-white text-base sm:text-lg md:text-xl" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-bold text-emerald-700 text-xs sm:text-sm md:text-base mb-1 sm:mb-1.5"
                              style={{ fontFamily: "Amiri, serif" }}
                            >
                              {t("donation.whatsapp")}
                            </p>
                            <p className="text-xs sm:text-sm md:text-base text-gray-800 font-medium break-all sm:truncate">
                              {donation.whatsapp}
                            </p>
                          </div>
                        </div>
                      )}

                      {donation.email && (
                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all duration-200 group/item">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-200">
                            <FaEnvelope className="text-white text-base sm:text-lg md:text-xl" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-bold text-emerald-700 text-xs sm:text-sm md:text-base mb-1 sm:mb-1.5"
                              style={{ fontFamily: "Amiri, serif" }}
                            >
                              {t("donation.email")}
                            </p>
                            <p className="text-xs sm:text-sm md:text-base text-gray-800 font-medium break-all sm:truncate">
                              {donation.email}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all duration-200 group/item">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-200 mt-0.5">
                          <FaMapMarkerAlt className="text-white text-base sm:text-lg md:text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-bold text-emerald-700 text-xs sm:text-sm md:text-base mb-1 sm:mb-1.5"
                            style={{ fontFamily: "Amiri, serif" }}
                          >
                            {t("donation.location")}
                          </p>
                          <div
                            className="text-xs sm:text-sm md:text-base text-gray-800 font-medium leading-relaxed break-words"
                            dangerouslySetInnerHTML={{
                              __html: donation.address,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                      <motion.a
                        href={`https://wa.me/+93772046406?text=${encodeURIComponent(
                          `Hi!اسلام علیکم ورحمته الله وبرکاته `
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8 rounded-xl font-bold text-center transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        <FaWhatsapp className="text-lg sm:text-xl md:text-2xl" />
                        <span>{t("donation.contactWhatsapp")}</span>
                      </motion.a>

                      {donation.email && (
                        <motion.a
                          href={`mailto:${donation.email}`}
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8 rounded-xl font-bold text-center transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          <FaEnvelope className="text-lg sm:text-xl md:text-2xl" />
                          <span>{t("donation.sendEmail")}</span>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Donation Instructions */}
      <section className="py-12 sm:py-16 md:py-20 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 border-2 border-emerald-200">
              <span>📋</span>
              <span>{t("donation.instructionTitle")}</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 px-2"
              style={{ fontFamily: "Amiri, serif" }}
            >
              {t("donation.howToDonateTitle")}
            </h2>
            <p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2"
              style={{ fontFamily: "Amiri, serif" }}
            >
              {t("donation.howToDonateDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              className="group text-center bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 border-2 border-gray-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl shadow-lg">
                  <span className="text-3xl sm:text-4xl font-bold">1</span>
                </div>
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-7 h-7 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-xs sm:text-sm font-bold text-yellow-900">
                    ✓
                  </span>
                </div>
              </div>
              <h3
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 group-hover:text-emerald-700 transition-colors duration-300"
                style={{ fontFamily: "Amiri, serif" }}
              >
                {t("donation.contactStep")}
              </h3>
              <p
                className="text-base sm:text-lg text-gray-600 leading-relaxed"
                style={{ fontFamily: "Amiri, serif" }}
              >
                {t("donation.contactStepDesc")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              viewport={{ once: true }}
              className="group text-center bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 border-2 border-gray-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl shadow-lg">
                  <span className="text-3xl sm:text-4xl font-bold">2</span>
                </div>
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-7 h-7 sm:w-8 sm:h-8 bg-blue-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-xs sm:text-sm font-bold text-blue-900">
                    ✓
                  </span>
                </div>
              </div>
              <h3
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 group-hover:text-emerald-700 transition-colors duration-300"
                style={{ fontFamily: "Amiri, serif" }}
              >
                {t("donation.donateStep")}
              </h3>
              <p
                className="text-base sm:text-lg text-gray-600 leading-relaxed"
                style={{ fontFamily: "Amiri, serif" }}
              >
                {t("donation.donateStepDesc")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              viewport={{ once: true }}
              className="group text-center bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 border-2 border-gray-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl shadow-lg">
                  <span className="text-3xl sm:text-4xl font-bold">3</span>
                </div>
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-7 h-7 sm:w-8 sm:h-8 bg-green-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-xs sm:text-sm font-bold text-green-900">
                    ✓
                  </span>
                </div>
              </div>
              <h3
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 group-hover:text-emerald-700 transition-colors duration-300"
                style={{ fontFamily: "Amiri, serif" }}
              >
                د مرستې تصدیق
              </h3>
              <p
                className="text-base sm:text-lg text-gray-600 leading-relaxed"
                style={{ fontFamily: "Amiri, serif" }}
              >
                د خپلو مرستو د رسیدلو تصدیق تر لاسه کړئ
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      {/* <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
              <span>🛡️</span>
              <span>{t('donation.trustTitle')}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {t('donation.trustTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('donation.trustDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group text-center bg-gray-50 rounded-3xl p-8 hover:bg-white hover:shadow-xl transition-all duration-150 border border-gray-100 hover:border-green-200">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-150 group-hover:scale-105">
                <FaShieldAlt className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-150">100% امن دی</h3>
              <p className="text-gray-600 leading-relaxed text-lg">ستاسو مرستې د لوړو امنیت معیارونو او تایید شوي حفاظت سره پروسس کیږي</p>
            </div>

            <div className="group text-center bg-gray-50 rounded-3xl p-8 hover:bg-white hover:shadow-xl transition-all duration-150 border border-gray-100 hover:border-blue-200">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-150 group-hover:scale-105">
                <FaCheckCircle className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-150">{t('donation.verifiedTitle')}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{t('donation.verifiedDescription')}</p>
            </div>

            <div className="group text-center bg-gray-50 rounded-3xl p-8 hover:bg-white hover:shadow-xl transition-all duration-150 border border-gray-100 hover:border-purple-200">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-150 group-hover:scale-105">
                <FaClock className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-150">24/7 ملاتړ</h3>
              <p className="text-gray-600 leading-relaxed text-lg">موږ د ټولو پوښتنو او د مرستې اړتیاوو لپاره د ورځې او شپې ملاتړ وړاندې کوو</p>
            </div>
          </div>
        </div>
      </section> */}
    </main>
  );
}
