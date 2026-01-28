"use client";

import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, UserRound } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import type { Course as CourseType } from "@/lib/types";
import { useTranslation } from "@/hooks/useTranslation";
import { ComingSoonEmptyState } from "@/components/EmptyState";

interface CoursesSectionProps {
  courses: CourseType[];
  showAll?: boolean;
  heading?: {
    title?: string;
    subtitle?: string;
    eyebrow?: string;
  };
}

const fallbackCourseImage = "/placeholder-course.jpg";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stripHtml = (value?: string | null) =>
  (value || "")
    .replace(/<[^>]*>/g, " ")  // Remove HTML tags
    .replace(/&nbsp;/g, " ")   // Remove &nbsp; entities
    .replace(/&amp;/g, "&")    // Replace &amp; with &
    .replace(/&lt;/g, "<")      // Replace &lt; with <
    .replace(/&gt;/g, ">")      // Replace &gt; with >
    .replace(/&quot;/g, '"')    // Replace &quot; with "
    .replace(/&#39;/g, "'")     // Replace &#39; with '
    .replace(/\s+/g, " ")       // Replace multiple spaces with single space
    .trim();

const formatDate = (t: (key: string) => string, value?: string | null) => {
  if (!value) return t('courses.recentlyUpdated');
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return t('courses.recentlyUpdated');
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const instructorName = (course: CourseType, t: (key: string) => string) => {
  const { recorded_by: instructor } = course;
  if (!instructor) return t('courses.instructorFallback');
  const parts = [instructor.first_name, instructor.last_name].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : t('courses.instructorFallback');
};

export default function CoursesSection({
  courses,
  showAll = false,
  heading,
}: CoursesSectionProps) {
  const { t: tRaw } = useTranslation('common', { useSuspense: false });
  
  // Create a wrapper that always returns a string
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === 'string' ? result : key;
  };

  // Debug logging
  console.log('CoursesSection - courses:', courses);
  console.log('CoursesSection - courses length:', courses?.length);
  const publishedCourses = (courses || [])
    .filter((course) => {
      try {
        return Number(course.is_published) === 1;
      } catch (error) {
        console.error('Error filtering course:', course, error);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        const aDate = new Date(
          a.publish_date || a.created_date || a.created_at || "",
        ).getTime();
        const bDate = new Date(
          b.publish_date || b.created_date || b.created_at || "",
        ).getTime();
        if (Number.isNaN(aDate) || Number.isNaN(bDate)) return 0;
        return bDate - aDate;
      } catch (error) {
        console.error('Error sorting courses:', error);
        return 0;
      }
    });

  const displayCourses = showAll
    ? publishedCourses
    : publishedCourses.slice(0, 3);

  if (displayCourses.length === 0) {
    return (
      <section className="px-4 pb-16 pt-2 sm:px-6 lg:px-8">
        <ComingSoonEmptyState
          title={t('courses.freshCourses')}
          description={t('courses.curatingMessage')}
          className="max-w-4xl mx-auto"
        />
      </section>
    );
  }

  return (
    <section className="px-2 sm:px-4 md:px-6 lg:px-8 pb-16 pt-2" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-10">
        {heading ? (
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="mx-auto max-w-3xl space-y-4 text-center"
          >
            {heading.eyebrow ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-gray-600">
                {heading.eyebrow}
              </span>
            ) : null}
            {heading.title ? (
              <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl" style={{ fontFamily: 'Amiri, serif' }}>
                {heading.title}
              </h2>
            ) : null}
            {heading.subtitle ? (
              <p className="text-sm text-gray-600 sm:text-base" style={{ fontFamily: 'Amiri, serif' }}>
                {heading.subtitle}
              </p>
            ) : null}
          </motion.header>
        ) : null}

        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.15 }}
          className="grid gap-5 md:gap-7 sm:px-0 sm:grid-cols-2 lg:grid-cols-3"
        >
          {displayCourses.map((course) => {
            try {
              const coverImage =
                getImageUrl(course.image, fallbackCourseImage) ??
                fallbackCourseImage;
              const publishedOn = formatDate(
                t,
                course.publish_date || course.created_date || course.created_at
              );

            return (
              <motion.article
                key={course.id}
                variants={cardVariants}
                className="h-full"
              >
                <Link
                  href={`/courses/${course.slug}`}
                  className="group relative flex h-full flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  dir="rtl"
                >
                  {/* Decorative right border accent */}
                  <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-200 group-hover:from-gray-500 group-hover:via-gray-400 group-hover:to-gray-300 transition-colors"></div>
                  
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <Image
                      src={coverImage}
                      alt={course.title}
                      fill
                      sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 90vw"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        console.error('Image load error:', coverImage, e);
                        e.currentTarget.src = fallbackCourseImage;
                      }}
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200">
                        {publishedOn}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col p-6 sm:p-8 relative z-10">
                    <div className="space-y-3 mb-4">
                      <h3 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2" style={{ fontFamily: 'Amiri, serif' }}>
                        {course.title}
                      </h3>

                      <div 
                        className="text-gray-600 leading-relaxed text-sm [&_*]:text-sm [&_*]:text-gray-600 [&_p]:mb-1 [&_*]:line-clamp-2"
                        style={{ fontFamily: 'Amiri, serif' }}
                        dir="rtl"
                        dangerouslySetInnerHTML={{ __html: course.description || t('courses.immersiveLearning') }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <CourseMetaItem
                        icon={<Clock className="h-4 w-4" />}
                        label={course.duration || t('courses.selfPaced')}
                      />
                      <CourseMetaItem
                        icon={<BookOpen className="h-4 w-4" />}
                        label={
                          course.video_quantity
                            ? `${course.video_quantity} ${t('courses.lessons')}`
                            : t('courses.flexibleLearning')
                        }
                      />
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                            <UserRound className="h-4 w-4 text-gray-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 truncate" style={{ fontFamily: 'Amiri, serif' }}>
                            {instructorName(course, t)}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                          <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
            } catch (error) {
              console.error('Error rendering course card:', course, error);
              return null;
            }
          })}
        </motion.div>
      </div>
    </section>
  );
}

const CourseMetaItem = ({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) => (
  <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 border border-gray-100">
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-600 flex-shrink-0">
      {icon}
    </span>
    <span className="text-xs font-medium text-gray-700 truncate" style={{ fontFamily: 'Amiri, serif' }}>{label}</span>
  </div>
);
