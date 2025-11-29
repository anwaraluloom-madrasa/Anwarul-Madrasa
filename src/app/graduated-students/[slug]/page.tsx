"use client";

import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { GraduationsApi } from "@/lib/api";
import { getSimpleImageUrl } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import Breadcrumb from "@/components/Breadcrumb";
import IslamicHeader from "../../components/IslamicHeader";
import { Calendar, Clock, Star, ChevronLeft, ChevronRight, User, MapPin, Phone, X, GraduationCap } from "lucide-react";
import GraduationDetailSkeleton from "../../components/graduation/GraduationDetailSkeleton";
import StudentCardSkeleton from "../../components/graduation/StudentCardSkeleton";

async function getGraduation(slug: string): Promise<any> {
  const result = await GraduationsApi.getBySlug(slug);
  if (!result.success) {
    return null;
  }
  return result.data as any;
}

export default function GraduationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { t: tRaw, i18n } = useTranslation("common", { useSuspense: false });
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === "string" ? result : key;
  };
  const isRTL = i18n.language === "ps" || i18n.language === "prs";

  const [graduation, setGraduation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Modal state for student details
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = (student: any) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    async function fetchGraduation() {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const data = await getGraduation(resolvedParams.slug);
        if (data) {
          setGraduation(data);
          if (data.graduation_images?.length) setSelectedImageIndex(0);
          else if (data.main_image) setSelectedImageIndex(-1);
        } else {
          setError(t('graduationDetail.graduationNotFound'));
        }
      } catch (err) {
        setError(t('graduationDetail.fetchError'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchGraduation();
  }, [params]);

  const currentImageUrl = useMemo(() => {
    if (!graduation) return "";
    if (
      selectedImageIndex !== -1 &&
      graduation.graduation_images?.length > selectedImageIndex
    ) {
      return getSimpleImageUrl(
        graduation.graduation_images[selectedImageIndex].image,
        "/placeholder-graduation.jpg"
      );
    } else if (graduation.main_image && selectedImageIndex === -1) {
      return getSimpleImageUrl(graduation.main_image, "/placeholder-graduation.jpg");
    }
    return "/placeholder-graduation.jpg";
  }, [selectedImageIndex, graduation]);

  const goToNextImage = () => {
    if (graduation?.graduation_images?.length) {
      setSelectedImageIndex(
        (prev) => (prev + 1) % graduation.graduation_images.length
      );
    }
  };

  const goToPreviousImage = () => {
    if (graduation?.graduation_images?.length) {
      setSelectedImageIndex(
        (prev) =>
          (prev - 1 + graduation.graduation_images.length) %
          graduation.graduation_images.length
      );
    }
  };

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
      <main className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-gray-50" dir="rtl">
        <IslamicHeader 
          pageType="graduated-students" 
          alignment="center"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" dir="rtl">
          <Breadcrumb />
          <GraduationDetailSkeleton />
        </div>
      </main>
    );
  }
  
  if (error || !graduation) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border-2 border-red-200 max-w-md">
          <p className="text-red-700 font-bold text-lg" style={{ fontFamily: 'Amiri, serif' }}>
            {error || t('graduationDetail.graduationNotFound')}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-gray-50" dir="rtl">
      <IslamicHeader 
        pageType="graduated-students"
        title={stripHtml(graduation.title)}
        alignment="center"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" dir="rtl">
        <Breadcrumb />
      
      {/* Hero Section - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="mb-16 relative overflow-hidden rounded-3xl bg-white shadow-xl border-2 border-gray-200"
      >
        <div className="flex flex-col lg:flex-row gap-8 p-6 md:p-8 lg:p-10">
          {/* Left Column - Main Image + Thumbnails */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
              {currentImageUrl && (
                <Image
                  src={currentImageUrl}
                  alt="Main Graduation Image"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover rounded-xl"
                />
              )}

              {graduation.graduation_images?.length > 1 && (
                <>
                  <button
                    onClick={goToPreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm p-2 text-gray-700 hover:bg-white shadow-lg transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm p-2 text-gray-700 hover:bg-white shadow-lg transition-all hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {graduation.graduation_images?.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {graduation.graduation_images.map((img: any, index: number) => (
                  <div
                    key={img.id}
                    className={`relative h-20 w-full cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImageIndex === index 
                        ? "border-[#4a8a8a] ring-2 ring-[#4a8a8a]/20" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={getSimpleImageUrl(img.image, "/placeholder-graduation.jpg")}
                      alt="Thumbnail"
                      fill
                      sizes="(min-width: 1024px) 12.5vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="lg:w-1/2 flex flex-col justify-center space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight" style={{ fontFamily: 'Amiri, serif' }}>
                {stripHtml(graduation.title)}
              </h1>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed" style={{ fontFamily: 'Amiri, serif' }}>
                {stripHtml(graduation.description)}
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-3 pt-4">
              <InfoCard
                icon={<Calendar className="w-5 h-5" />}
                label={t('graduationDetail.date')}
                value={new Date(graduation.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
              <InfoCard
                icon={<Clock className="w-5 h-5" />}
                label={t('graduationDetail.time')}
                value={`${new Date(graduation.start_time).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })} – ${new Date(graduation.end_time).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}`}
              />
              {graduation.graduation_year && (
                <InfoCard
                  icon={<Star className="w-5 h-5" />}
                  label={t('graduationDetail.graduationYear')}
                  value={graduation.graduation_year}
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Graduates Section */}
      <section className="mb-20">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          style={{ fontFamily: 'Amiri, serif' }}
        >
          {t('graduationDetail.esteemedGraduates')}
        </motion.h2>

        {graduation.graduated_students?.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {graduation.graduated_students.map((s: any, index: number) => {
              return (
                <motion.div
                  key={s.id}
                  className="group relative flex h-full flex-col bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-emerald-200 hover:border-emerald-400 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => openModal(s)}
                  dir="rtl"
                >
                  {/* Top Section - Name Badge with Icon */}
                  <div className="relative h-32 sm:h-40 bg-gradient-to-br from-emerald-500 to-emerald-600 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {/* Decorative background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    {/* Icon and Name */}
                    <div className="relative z-10 text-center px-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/50 flex items-center justify-center mx-auto mb-3 shadow-xl">
                        <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white leading-tight line-clamp-2 drop-shadow-lg" style={{ fontFamily: 'Amiri, serif' }}>
                        {s.first_name} {s.last_name}
                      </h3>
                    </div>
                    
                    {/* Graduation Type Badge */}
                    {s.graduation_type?.name && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold bg-white/95 backdrop-blur-md text-emerald-700 border border-white/50 shadow-lg">
                          {s.graduation_type.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Section - White Background */}
                  <div className="relative flex-1 bg-white p-4 sm:p-6 flex flex-col justify-between">
                    {/* Content */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-emerald-700">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <p className="text-xs sm:text-sm text-gray-700 line-clamp-1" style={{ fontFamily: 'Amiri, serif' }}>
                          <span className="font-semibold">{t('graduationDetail.father')}:</span> <span className="truncate">{s.father_name || t('graduationDetail.notProvided')}</span>
                        </p>
                      </div>
                      {s.grandfather_name && (
                        <div className="flex items-center gap-2 text-sm text-emerald-700">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <p className="text-xs sm:text-sm text-gray-700 line-clamp-1" style={{ fontFamily: 'Amiri, serif' }}>
                            <span className="font-semibold">{t('graduationDetail.grandfather')}:</span> <span className="truncate">{s.grandfather_name}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Separator */}
                    <div className="my-3 border-t-2 border-emerald-100"></div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-emerald-700 font-bold" style={{ fontFamily: 'Amiri, serif' }}>
                        {t('graduationDetail.viewDetails')}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all shadow-md">
                        <ChevronLeft className="w-4 h-4 text-emerald-700" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border-2 border-gray-200 shadow-lg">
            <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-semibold" style={{ fontFamily: 'Amiri, serif' }}>
              {t('graduationDetail.noStudents')}
            </p>
          </div>
        )}
      </section>

      {/* Student Modal */}
      {isModalOpen && selectedStudent && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={closeModal}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Clean Design */}
            <div className="bg-gradient-to-r from-[#4a8a8a] to-[#5a9a9a] p-4 sm:p-6 text-white relative">
              <button
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-200 bg-white/20 rounded-full p-2 w-9 h-9 flex items-center justify-center transition-all hover:bg-white/30 hover:scale-110"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 sm:gap-6 pr-0 sm:pr-10">
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/40 bg-white/20 flex items-center justify-center overflow-hidden shadow-lg">
                    <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                    {selectedStudent.first_name} {selectedStudent.last_name}
                  </h2>
                  <p className="text-white/90 text-sm sm:text-base md:text-lg" style={{ fontFamily: 'Amiri, serif' }}>
                    {selectedStudent.father_name && `${t('graduationDetail.sonOf')} ${selectedStudent.father_name}`}
                    {selectedStudent.grandfather_name && selectedStudent.father_name && `, ${t('graduationDetail.grandsonOf')} ${selectedStudent.grandfather_name}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Content with scrollable area */}
            <div className="p-6 md:p-8 max-h-[calc(90vh-240px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Details */}
                <div className="space-y-5">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 border-b-2 border-[#4a8a8a] pb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-[#4a8a8a]" />
                    <span>{t('graduationDetail.personalDetails')}</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Calendar className="w-5 h-5 text-[#4a8a8a] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 font-medium block mb-1">
                          {t('graduationDetail.dateOfBirth')}
                        </span>
                        <span className="text-sm md:text-base text-gray-900 font-medium">
                          {new Date(selectedStudent.dob).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Phone className="w-5 h-5 text-[#4a8a8a] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 font-medium block mb-1">
                          {t('graduationDetail.contact')}
                        </span>
                        <span className="text-sm md:text-base text-gray-900 font-medium">
                          {selectedStudent.contact_no || t('graduationDetail.notProvided')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Star className="w-5 h-5 text-[#4a8a8a] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 font-medium block mb-1">
                          {t('graduationDetail.graduation')}
                        </span>
                        <span className="inline-block bg-[#e0f2f2] text-[#4a8a8a] text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg">
                          {selectedStudent.graduation_type?.name || t('graduationDetail.notSpecified')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-5">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 border-b-2 border-[#4a8a8a] pb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#4a8a8a]" />
                    <span>{t('graduationDetail.addressInformation')}</span>
                  </h3>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <MapPin className="w-5 h-5 text-[#4a8a8a] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-xs text-gray-500 font-medium block mb-1">
                        {t('graduationDetail.fullAddress')}
                      </span>
                      <span className="text-sm md:text-base text-gray-900 leading-relaxed">
                        {selectedStudent.full_address || t('graduationDetail.notProvided')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedStudent.description && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>{t('graduationDetail.description')}</span>
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Amiri, serif' }}>
                      {stripHtml(selectedStudent.description)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      </div>
    </main>
  );
}

function InfoCard({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#e0f2f2] flex items-center justify-center">
          <div className="text-[#4a8a8a]">
            {icon}
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <span className="text-xs text-gray-500 font-medium block mb-1">
          {label}
        </span>
        <span className="text-base text-gray-900 font-semibold block">
          {value}
        </span>
      </div>
    </div>
  );
}
