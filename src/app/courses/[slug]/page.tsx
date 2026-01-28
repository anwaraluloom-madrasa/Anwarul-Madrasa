// app/courses/[slug]/page.tsx
import { CoursesApi, extractArray } from "../../../lib/api";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import type { Course } from "@/lib/types";
import VideoPlayer from "../../components/VideoPlayer";
import { getTranslation } from "@/lib/translations";
import Breadcrumb from "@/components/Breadcrumb";
import IslamicHeader from "@/app/components/IslamicHeader";


interface Book {
  id: number;
  title: string;
  edition?: string;
  pages?: number;
  description?: string;
  written_year?: string;
  pdf_file?: string;
  image?: string;
}

interface Recorder {
  id: number;
  first_name: string;
  last_name: string;
  description?: string;
  full_address?: string;
  dob?: string;
  image?: string;
  contact_no?: string;
}
import {
  FaClock,
  FaUsers,
  FaBook,
  FaVideo,
  FaPlay,
  FaGraduationCap,
} from "react-icons/fa";

export default async function CourseDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // For server-side rendering, default to Pashto
  // Client-side language switching will handle the rest
  const currentLang = 'ps';
  
  const t = (key: string): string => {
    const translation = getTranslation(key, currentLang);
    return typeof translation === 'string' ? translation : key;
  };
  
  // Helper function to translate course data values
  const translateCourseValue = (value: string, type: 'duration' | 'quality' | 'size') => {
    if (!value) return value;
    
    switch (type) {
      case 'duration':
        return value.replace(/hours?/gi, t('courses.hours'));
      case 'quality':
        return value.replace(/hd/gi, t('courses.hd'))
                   .replace(/sd/gi, t('courses.sd'))
                   .replace(/fullhd/gi, t('courses.fullHd'))
                   .replace(/4k/gi, t('courses.ultraHd'));
      case 'size':
        return value.replace(/gb/gi, t('courses.gb'));
      default:
        return value;
    }
  };

  // Helper function to clean HTML from descriptions - improved version
  const cleanHtml = (html: string | null | undefined) => {
    if (!html) return '';
    
    let cleaned = html;
    
    // First, handle common HTML entity encoding
    cleaned = cleaned.replace(/&nbsp;/g, ' ');
    cleaned = cleaned.replace(/&amp;/g, '&');
    cleaned = cleaned.replace(/&lt;/g, '<');
    cleaned = cleaned.replace(/&gt;/g, '>');
    cleaned = cleaned.replace(/&quot;/g, '"');
    cleaned = cleaned.replace(/&#39;/g, "'");
    cleaned = cleaned.replace(/&apos;/g, "'");
    cleaned = cleaned.replace(/&mdash;/g, '—');
    cleaned = cleaned.replace(/&ndash;/g, '–');
    
    // Remove ALL HTML/XML tags including malformed ones
    cleaned = cleaned.replace(/<[^>]*>/g, '');           // Standard tags
    cleaned = cleaned.replace(/<[^>]*$/g, '');           // Unclosed opening tags
    cleaned = cleaned.replace(/<\/[^>]*/g, '');         // Closing tags without >
    cleaned = cleaned.replace(/<[^<]*>/g, '');          // Any remaining tags
    cleaned = cleaned.replace(/\[(\w+)\s[^\]]*\]/g, ''); // Markdown-style tags
    
    // Clean up any remaining HTML entities
    cleaned = cleaned.replace(/&[#\w]+;/g, ' ');
    
    // Clean up whitespace
    cleaned = cleaned.replace(/  +/g, ' ');              // Multiple spaces
    cleaned = cleaned.replace(/\n\s*\n+/g, '\n');        // Multiple line breaks
    cleaned = cleaned.replace(/\s+/g, ' ');              // Any whitespace sequence
    cleaned = cleaned.trim();
    
    return cleaned;
  };


  // ✅ Fetch course by slug
  const courseResponse = await CoursesApi.getBySlug(slug);
  const coursePayload = courseResponse.data;
  const course = Array.isArray(coursePayload)
    ? (coursePayload[0] as Course | undefined)
    : (coursePayload as Course | undefined);


  // Extract recorded_by if present
  const recordedBy: Recorder | undefined = course?.recorded_by;

  // Fetch book details if not present but book_id exists
  let book: Book | undefined = (course as any)?.book;
  if (!book && (course as any)?.book_id) {
    try {
      const bookRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://website.anwarululoom.com/api'}/book/${(course as any).book_id}`);
      if (bookRes.ok) {
        const bookData = await bookRes.json();
        book = Array.isArray(bookData) ? bookData[0] : bookData;
      }
    } catch (err) {
      // ignore error, book will be undefined
    }
  }


  if (!course) {
    return (
      <div className="min-h-screen mt-24 flex items-center justify-center bg-gradient-to-b from-amber-50 to-white px-2">
        <div className="text-center p-4 sm:p-6 md:p-8 bg-white rounded-xl max-w-md w-full border-2 border-amber-200">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">{t('courses.courseNotFound')}</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            {t('courses.courseNotFoundMessage')}
          </p>
          <Link
            href="/courses"
            className="inline-block bg-amber-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base"
          >
            {t('courses.browseAllCourses')}
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Fetch related courses
  let relatedCourses: Course[] = [];
  try {
    const relatedResponse = await CoursesApi.getAll({ limit: 6 });
    if (relatedResponse.success) {
      const data = extractArray<Course>(relatedResponse.data);
      relatedCourses = data.filter((item) => item.slug !== slug).slice(0, 3);
    }
  } catch (relatedError) {
    console.warn("Failed to load related courses:", relatedError);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section - Using IslamicHeader Component */}
      <IslamicHeader
        pageType="courses"
        title={course.title}
       
        theme="amber"
        alignment="center"
      />

      <div className="max-w-7xl z-50 mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>
      {/* Video Section - Enhanced Design */}
    
      {course.short_video && (
        <section className="relative w-full py-8 sm:py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-0 sm:px-2 md:px-4 lg:px-6 xl:px-8">
            {/* Section Header */}
            <div className="text-center mb-6 sm:mb-8 md:mb-10 px-4 sm:px-0">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#e0f2f2] text-[#4a8a8a] px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 border border-[#d0e8e8]">
                <FaVideo className="w-3 h-3 sm:w-4 sm:h-4" />
                {t('courses.coursePreview')}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4 sm:px-2" style={{ fontFamily: 'Amiri, serif' }}>
                {t('courses.watchAndLearn')}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-2" style={{ fontFamily: 'Amiri, serif' }}>
                {t('courses.previewDescription')}
              </p>
            </div>
          
            {/* Video Player Container */}
            <div className="w-full max-w-[280px] sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-0 sm:px-2">
              <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 p-0 sm:p-1 md:p-2">
                <VideoPlayer
                  videoUrl={course.short_video}
                  posterUrl={course.image ? getImageUrl(course.image, "/placeholder-course.jpg") : "/placeholder-course.jpg"}
                  title={course.title}
                />
              </div>
            </div>
          </div>
        </section>
      )}
      </div>

      <div className="max-w-7xl mx-auto px-1 sm:px-2 md:px-4 py-8 lg:py-0 lg:mt-8 relative flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 items-start">

        {/* Main Info Section */}
        <div className="flex-1 rounded-3xl bg-white/95 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 space-y-8 sm:space-y-10 border border-amber-50">

          {/* About this Course */}
          <section className="rounded-xl sm:rounded-2xl overflow-hidden pt-2 sm:pt-4 md:pt-6 px-0 sm:px-2 md:px-4 lg:px-6 xl:px-8 mb-4 sm:mb-6 md:mb-8">
            <header className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex-shrink-0">
                <FaGraduationCap className="text-xl sm:text-2xl text-amber-600" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary-900 tracking-tight">
                {t('courses.aboutThisCourse')}
              </h2>
            </header>
            <div>
              {course.description ? (
                <div 
                  className="prose prose-sm sm:prose-base md:prose-lg prose-amber max-w-none text-gray-800 leading-relaxed animate-fade-in [&_*]:text-gray-800 [&_*]:text-sm sm:[&_*]:text-base md:[&_*]:text-lg [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:mr-6 [&_ol]:list-decimal [&_ol]:mr-6 [&_li]:mb-2 [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_img]:rounded-lg [&_img]:my-4 [&_blockquote]:border-r-4 [&_blockquote]:border-gray-300 [&_blockquote]:pr-4 [&_blockquote]:italic"
                  dir="rtl"
                  dangerouslySetInnerHTML={{ __html: course.description || '' }}
                />
              ) : (
                <div className="bg-amber-50 border-l-4 border-amber-500 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-md animate-fade-in shadow-inner">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg break-words">
                    {t('courses.defaultDescription')}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Book Card */}
          {book && (
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-sm bg-gradient-to-br from-white via-amber-50 to-amber-100/60 border border-amber-200">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 relative rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 border-2 border-amber-300 bg-white/50 shadow mx-auto md:mx-0">
                <Image
                  src={getImageUrl(book?.image, "/placeholder-book.jpg")}
                  alt={book?.title || 'Book'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <FaBook className="text-amber-600 text-xl sm:text-2xl" />
                  <span className="font-extrabold text-lg sm:text-xl text-primary-900">{book.title}</span>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 md:gap-4 text-amber-700/90 text-xs sm:text-sm font-medium mb-2">
                  <span>{t('courses.edition')}: <span className="font-semibold">{book.edition || "N/A"}</span></span>
                  <span className="hidden sm:inline">|</span>
                  <span>{t('courses.pages')}: <span className="font-semibold">{book.pages || "N/A"}</span></span>
                  <span className="hidden sm:inline">|</span>
                  <span>{t('courses.year')}: <span className="font-semibold">{book.written_year || "N/A"}</span></span>
                </div>
                {book.description && (
                  <div 
                    className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3 break-words [&_*]:text-gray-700 [&_*]:text-sm sm:[&_*]:text-base [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:mr-6 [&_ol]:list-decimal [&_ol]:mr-6 [&_li]:mb-2 [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_img]:rounded-lg [&_img]:my-4 [&_blockquote]:border-r-4 [&_blockquote]:border-gray-300 [&_blockquote]:pr-4 [&_blockquote]:italic"
                    dir="rtl"
                    dangerouslySetInnerHTML={{ __html: book.description || '' }}
                  />
                )}
                {book.pdf_file && (
                  <a
                    href={getImageUrl(book.pdf_file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-600 hover:bg-amber-700 transition text-white rounded-lg font-semibold shadow text-sm sm:text-base"
                  >
                    <FaBook className="text-white opacity-80" />
                    {t('courses.downloadPdf')}
                  </a>
                )}
              </div>
            </div>
          )}
          {/* Recorder Card */}
          {recordedBy && (
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-sm bg-gradient-to-br from-white via-emerald-50 to-emerald-100/70 border border-emerald-100">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 relative rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 border-2 border-emerald-300 bg-white/50 shadow mx-auto md:mx-0">
                <Image
                  src={getImageUrl(recordedBy?.image, "/placeholder-author.jpg")}
                  alt={`${recordedBy?.first_name || ''} ${recordedBy?.last_name || ''}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <FaUsers className="text-emerald-600 text-xl sm:text-2xl" />
                  <span className="font-extrabold text-lg sm:text-xl text-emerald-900">{recordedBy.first_name} {recordedBy.last_name}</span>
                </div>
                <div className="flex flex-col gap-1 mb-2">
                  {recordedBy.full_address && (
                    <span className="text-gray-600 text-xs sm:text-sm flex items-center justify-center md:justify-start pl-1">
                      <FaClock className="inline mr-1 text-emerald-400" /> {recordedBy.full_address}
                    </span>
                  )}
                  {recordedBy.description && (
                    <div 
                      className="text-gray-700 text-sm sm:text-base break-words [&_*]:text-gray-700 [&_*]:text-sm sm:[&_*]:text-base [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:mr-6 [&_ol]:list-decimal [&_ol]:mr-6 [&_li]:mb-2 [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_img]:rounded-lg [&_img]:my-4 [&_blockquote]:border-r-4 [&_blockquote]:border-gray-300 [&_blockquote]:pr-4 [&_blockquote]:italic"
                      dir="rtl"
                      dangerouslySetInnerHTML={{ __html: recordedBy.description || '' }}
                    />
                  )}
                </div>
                {recordedBy.contact_no && (
                  <div className="mt-1 text-xs sm:text-sm font-semibold text-emerald-700/80 text-center md:text-left">
                    Contact: <a href={`tel:${recordedBy.contact_no}`} className="hover:underline">{recordedBy.contact_no}</a>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar with get course info and details, FLEXED beside main */}
        <aside className="lg:w-96 w-full bg-gradient-to-br from-amber-100 to-white/90 p-3 sm:p-4 md:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-amber-100 lg:sticky lg:top-24 shadow space-y-4 sm:space-y-6 md:space-y-8 z-20 flex flex-col items-stretch">

          {/* Desktop Get Course Info (hidden on mobile, visible on lg+) */}
          <div className="">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-5 sm:py-6 md:py-7 px-4 sm:px-5 rounded-xl sm:rounded-2xl text-center shadow-lg border-amber-200 border">
              <div className="text-lg sm:text-xl md:text-2xl font-extrabold mb-2 sm:mb-3 tracking-tight">Get Course Info</div>
              <p className="mb-4 sm:mb-6 text-white/90 text-sm sm:text-base">
                Contact us for enrollment details
              </p>
              <a
                href={`https://wa.me/+93796148087?text=${encodeURIComponent(
                  `Hi! I'm interested in this course: ${course.title}. سلام! زه د «کمپیوټر» کورس کې علاقه لرم. کولای شئ ماته د نوم لیکنې، بيې، او د کورس جزییاتو په اړه نور معلومات راکړئ؟?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white/95 hover:bg-amber-50 transition text-amber-700 font-bold py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 sm:gap-3 shadow text-sm sm:text-base"
              >
                <FaPlay className="text-amber-600 text-base sm:text-lg" />
                {t('courses.enrollNow')}
              </a>
            </div>
          </div>

          {/* Course Details from API */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5 bg-white/90 p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-amber-100 shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-amber-800 mb-3 sm:mb-4 tracking-tight flex items-center gap-2">
              <FaGraduationCap className="text-lg sm:text-xl text-amber-500" />
              {t('courses.courseDetails')}
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {course.duration && (
                <li className="flex justify-between items-center border-b border-dashed border-amber-50 pb-2 text-sm sm:text-base">
                  <span className="text-gray-600">{t('courses.duration')}</span>
                  <span className="font-semibold text-amber-900 text-right">{translateCourseValue(course.duration, 'duration')}</span>
                </li>
              )}
              {course.video_quantity && (
                <li className="flex justify-between items-center border-b border-dashed border-amber-50 pb-2 text-sm sm:text-base">
                  <span className="text-gray-600">{t('courses.videos')}</span>
                  <span className="font-semibold text-amber-900">{course.video_quantity}</span>
                </li>
              )}
              {course.publish_date && (
                <li className="flex justify-between items-center border-b border-dashed border-amber-50 pb-2 text-sm sm:text-base">
                  <span className="text-gray-600">{t('courses.published')}</span>
                  <span className="font-semibold text-amber-900 text-right">
                    {new Date(course.publish_date).toLocaleDateString()}
                  </span>
                </li>
              )}
              {course.resolution && (
                <li className="flex justify-between items-center border-b border-dashed border-amber-50 pb-2 text-sm sm:text-base">
                  <span className="text-gray-600">{t('courses.quality')}</span>
                  <span className="font-semibold text-amber-900 text-right">{translateCourseValue(course.resolution, 'quality')}</span>
                </li>
              )}
              {course.space && (
                <li className="flex justify-between items-center border-b border-dashed border-amber-50 pb-2 text-sm sm:text-base">
                  <span className="text-gray-600">{t('courses.size')}</span>
                  <span className="font-semibold text-amber-900 text-right">{translateCourseValue(course.space, 'size')}</span>
                </li>
              )}
            
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
