"use client";

import Image from "next/image";
import { Awlyaa } from "../../../lib/types";
import { getImageUrl } from "@/lib/utils";
import { cleanText } from "@/lib/textUtils";
import { useTranslation } from "@/hooks/useTranslation";
import Breadcrumb from "@/components/Breadcrumb";
import { User } from "lucide-react";

interface AwlyaaContentProps {
  awlyaa: Awlyaa;
}

export default function AwlyaaContent({ awlyaa }: AwlyaaContentProps) {
  const { t: tRaw } = useTranslation('common', { useSuspense: false });
  
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === 'string' ? result : key;
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return t('awlyaaDetail.notSpecified');
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-20" dir="rtl">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6" dir="rtl">
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>
        {/* Header Section */}
        <div className="relative bg-white rounded-xl overflow-hidden mb-8 border border-gray-200 shadow-sm">
          {/* Decorative right border accent */}
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-200"></div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10zm-10 0c0-2.762 2.238-5 5-5s5 2.238 5 5-2.238 5-5 5-5-2.238-5-5z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <div className="px-6 sm:px-8 py-10 relative z-10">
            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {awlyaa.profile_image ? (
                  <div className="relative">
                    <Image
                      src={
                        getImageUrl(awlyaa.profile_image, "/placeholder-author.jpg") ||
                        "/placeholder-author.jpg"
                      }
                      alt={awlyaa.name}
                      width={200}
                      height={200}
                      className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-gray-200 shadow-xl"
                    />
                    <div className="absolute inset-0 rounded-full border-4 border-gray-100 opacity-50"></div>
                  </div>
                ) : (
                  <div className="w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 border-4 border-gray-200 shadow-xl">
                    <User size={70} />
                  </div>
                )}
              </div>
            </div>

            {/* Name and Title */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight" style={{ fontFamily: 'Amiri, serif' }}>
                {cleanText(awlyaa.name)}
              </h1>
              <p className="text-xl sm:text-2xl text-gray-700 font-medium mb-3" style={{ fontFamily: 'Amiri, serif' }}>
                {cleanText(awlyaa.title || t('awlyaaDetail.distinguishedScholar'))}
              </p>
              {awlyaa.nickname && (
                <p className="text-gray-600 text-lg font-medium" style={{ fontFamily: 'Amiri, serif' }}>"{cleanText(awlyaa.nickname)}"</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Right Column - Personal Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Teachers */}
            <div className="relative bg-white rounded-xl p-6 border border-gray-200 shadow-sm overflow-hidden">
              {/* Decorative right border accent */}
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300 to-gray-200"></div>
              
              <h2 className="text-lg font-bold text-gray-900 mb-4 relative z-10" style={{ fontFamily: 'Amiri, serif' }}>
                {t('awlyaaDetail.teachers')}
              </h2>

              {awlyaa.teachers &&
              Array.isArray(awlyaa.teachers) &&
              awlyaa.teachers.length > 0 ? (
                <div className="space-y-3">
                  {awlyaa.teachers.map((t: any) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="text-gray-600" size={14} />
                      </div>
                      {t.teacher?.id ? (
                        <a
                          href={`/awlayaa/${t.teacher.id}`}
                          className="font-medium text-sm text-gray-900 hover:text-gray-700 transition-colors flex-1"
                          title={t('awlyaaDetail.viewTeacherDetails')}
                          style={{ fontFamily: 'Amiri, serif' }}
                        >
                          {cleanText(t.teacher?.name || t('awlyaaDetail.unknownTeacher'))}
                        </a>
                      ) : (
                        <span className="font-medium text-sm text-gray-900 flex-1" style={{ fontFamily: 'Amiri, serif' }}>
                          {cleanText(t.teacher?.name || t('awlyaaDetail.unknownTeacher'))}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm" style={{ fontFamily: 'Amiri, serif' }}>
                  {t('awlyaaDetail.noTeacherInfo')}
                </p>
              )}
            </div>

            {/* Students Section */}
            <div className="relative bg-white rounded-xl p-6 border border-gray-200 shadow-sm overflow-hidden">
              {/* Decorative right border accent */}
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300 to-gray-200"></div>
              
              <h2 className="text-lg font-bold text-gray-900 mb-4 relative z-10" style={{ fontFamily: 'Amiri, serif' }}>
                {t('awlyaaDetail.students')}
              </h2>

              {awlyaa.students &&
              Array.isArray(awlyaa.students) &&
              awlyaa.students.length > 0 ? (
                <div className="space-y-3">
                  {awlyaa.students.map((s: any) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="text-gray-600" size={14} />
                      </div>
                      {s.student?.id ? (
                        <a
                          href={`/awlayaa/${s.student.id}`}
                          className="font-medium text-sm text-gray-900 hover:text-gray-700 transition-colors flex-1"
                          title={t('awlyaaDetail.viewStudentDetails')}
                          style={{ fontFamily: 'Amiri, serif' }}
                        >
                          {cleanText(s.student?.name || t('awlyaaDetail.unknownStudent'))}
                        </a>
                      ) : (
                        <span className="font-medium text-sm text-gray-900 flex-1" style={{ fontFamily: 'Amiri, serif' }}>
                          {cleanText(s.student?.name || t('awlyaaDetail.unknownStudent'))}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm" style={{ fontFamily: 'Amiri, serif' }}>
                  {t('awlyaaDetail.noStudentInfo')}
                </p>
              )}
            </div>

            {/* Quick Facts Card */}
            <div className="relative bg-white rounded-xl p-6 border border-gray-200 shadow-sm overflow-hidden">
              {/* Decorative right border accent */}
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300 to-gray-200"></div>
              
              <h2 className="text-lg font-bold text-gray-900 mb-4 relative z-10" style={{ fontFamily: 'Amiri, serif' }}>
                {t('awlyaaDetail.personalInformation')}
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">{t('awlyaaDetail.fathersName')}</p>
                    <p className="font-medium text-gray-900" style={{ fontFamily: 'Amiri, serif' }}>
                      {cleanText(awlyaa.father_name || t('awlyaaDetail.notSpecified'))}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">{t('awlyaaDetail.children')}</p>
                    <p className="font-medium text-gray-900" style={{ fontFamily: 'Amiri, serif' }}>
                      {awlyaa.number_of_children || t('awlyaaDetail.notSpecified')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">{t('awlyaaDetail.booksWritten')}</p>
                    <p className="text-sm text-gray-900" style={{ fontFamily: 'Amiri, serif' }}>
                      {cleanText(awlyaa.books_written || t('awlyaaDetail.notSpecified'))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Birth Information */}
            <div className="relative bg-white rounded-xl p-6 border border-gray-200 shadow-sm overflow-hidden">
              {/* Decorative right border accent */}
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300 to-gray-200"></div>
              
              <h2 className="text-lg font-bold text-gray-900 mb-4 relative z-10" style={{ fontFamily: 'Amiri, serif' }}>
                {t('awlyaaDetail.birthDetails')}
              </h2>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('awlyaaDetail.birthDate')}</p>
                  <p className="text-sm text-gray-900" style={{ fontFamily: 'Amiri, serif' }}>
                    {formatDate(awlyaa.birth_date)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('awlyaaDetail.birthPlace')}</p>
                  <p className="text-sm text-gray-900" style={{ fontFamily: 'Amiri, serif' }}>
                    {cleanText([
                      awlyaa.birth_place,
                      awlyaa.birth_city,
                      awlyaa.birth_country,
                    ]
                      .filter(Boolean)
                      .join(", ") || t('awlyaaDetail.notSpecified'))}
                  </p>
                </div>
              </div>
            </div>

            {/* Death Information (if applicable) */}
            {awlyaa.death_date && (
              <div className="relative bg-white rounded-xl p-6 border border-gray-200 shadow-sm overflow-hidden">
                {/* Decorative right border accent */}
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                
                <h2 className="text-lg font-bold text-gray-900 mb-4 relative z-10" style={{ fontFamily: 'Amiri, serif' }}>
                  {t('awlyaaDetail.deathDetails')}
                </h2>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('awlyaaDetail.deathDate')}</p>
                    <p className="text-sm text-gray-900" style={{ fontFamily: 'Amiri, serif' }}>
                      {formatDate(awlyaa.death_date)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('awlyaaDetail.deathPlace')}</p>
                    <p className="text-sm text-gray-900" style={{ fontFamily: 'Amiri, serif' }}>
                      {cleanText([
                        awlyaa.death_place,
                        awlyaa.death_city,
                        awlyaa.death_country,
                      ]
                        .filter(Boolean)
                        .join(", ") || t('awlyaaDetail.notSpecified'))}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Left Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-sm overflow-hidden">
              {/* Decorative right border accent */}
              <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-200"></div>
              
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10zm-10 0c0-2.762 2.238-5 5-5s5 2.238 5 5-2.238 5-5 5-5-2.238-5-5z'/%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              
              <div className="mb-6 relative z-10">
                <h2 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Amiri, serif' }}>
                  {t('awlyaaDetail.education')}
                </h2>
                <p className="text-gray-700 leading-relaxed text-base" style={{ fontFamily: 'Amiri, serif' }}>
                  {cleanText(awlyaa.education || t('awlyaaDetail.notSpecified'))}
                </p>
              </div>

              {/* Famous Works Section */}
              <div className="border-t border-gray-200 pt-6 relative z-10">
                <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Amiri, serif' }}>
                  {t('awlyaaDetail.famousWorksContributions')}
                </h2>

                {awlyaa.famous_works &&
                Array.isArray(awlyaa.famous_works) &&
                awlyaa.famous_works.length > 0 ? (
                  <div className="space-y-3">
                    {awlyaa.famous_works.map((work: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <span className="font-medium text-gray-900 flex-1" style={{ fontFamily: 'Amiri, serif' }}>
                          {cleanText(work)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : awlyaa.famous_works ? (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="font-medium text-gray-900 text-sm" style={{ fontFamily: 'Amiri, serif' }}>
                      {cleanText(awlyaa.famous_works)}
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm" style={{ fontFamily: 'Amiri, serif' }}>
                    {t('awlyaaDetail.noFamousWorks')}
                  </p>
                )}
              </div>
            </div>

            {/* Extra Information */}
            {awlyaa.extra_information && (
              <div className="relative bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-sm overflow-hidden">
                {/* Decorative right border accent */}
                <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-200"></div>
                
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10zm-10 0c0-2.762 2.238-5 5-5s5 2.238 5 5-2.238 5-5 5-5-2.238-5-5z'/%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                
                <h2 className="text-lg font-bold text-gray-900 mb-4 relative z-10" style={{ fontFamily: 'Amiri, serif' }}>
                  {t('awlyaaDetail.additionalInformation')}
                </h2>

                <div className="relative z-10">
                  <div 
                    className="text-gray-700 leading-relaxed text-base [&_*]:text-gray-700 [&_*]:text-base [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:mr-6 [&_ol]:list-decimal [&_ol]:mr-6 [&_li]:mb-2 [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_img]:rounded-lg [&_img]:my-4 [&_blockquote]:border-r-4 [&_blockquote]:border-gray-300 [&_blockquote]:pr-4 [&_blockquote]:italic"
                    style={{ fontFamily: 'Amiri, serif' }}
                    dir="rtl"
                    dangerouslySetInnerHTML={{ __html: awlyaa.extra_information }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

