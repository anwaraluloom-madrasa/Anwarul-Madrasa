'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  FaFacebook, 
  FaYoutube, 
  FaTelegram, 
  FaWhatsapp, 
  FaTwitter 
} from 'react-icons/fa';
import { 
  Clock, 
  UserRound, 
  ExternalLink,
  Users,
  Video,
  Heart,
  Share2,
  MapPin,
  Phone,
  Mail,
  Building
} from 'lucide-react';
import IslamicHeader from '../components/IslamicHeader';
import Breadcrumb from '@/components/Breadcrumb';
import { useDirection } from '@/hooks/useDirection';
import { CoursesApi } from '@/lib/api';
import type { Course } from '@/lib/types';
import ErrorDisplay from '@/components/ErrorDisplay';
import { getImageUrl } from '@/lib/utils';

// Social Media Links - د انوارالمشائخ رحمه الله خپرندویه ادارې
const socialMediaLinks = {
  facebook: 'https://www.facebook.com/profile.php?id=100085056932016&mibextid=ZbWKwL',
  youtube: 'https://youtube.com/@Anwar231?si=xp-rKjC7ACzAsyB6',
  telegram: 'https://t.me/+QGCz7NG_fnRlYjVl',
  telegramTranslation: 'https://t.me/+XEVmyCRSSI5iOWI1',
  whatsapp: [
    { name: 'واټساپ لومړی', url: 'https://chat.whatsapp.com/LQYeyCabB1ILZWKLB2h2O2' },
    { name: 'واټساپ دوهم', url: 'https://chat.whatsapp.com/EKk7oSrgNpP2etSthPInpb' },
    { name: 'واټساپ دریم', url: 'https://chat.whatsapp.com/GRGFDzxottaA6GPdwvER6x?mode=ems_copy_t' },
    { name: 'واټساپ څلورم', url: 'https://chat.whatsapp.com/LhpoN8kvoyE9G5vVJKcPcE?mode=ems_copy_t' },
    { name: 'واټساپ پینځم', url: 'https://chat.whatsapp.com/Ci3W7KyPsmIAhcuRGveO7Q?mode=ems_copy_t' },
  ],
  whatsappChannel: 'https://whatsapp.com/channel/0029Va8GAlwIXnlq4oHC6J3q',
  twitter: 'https://twitter.com/khaksarpaktiawa/status/1760494499027931617?t=ep_4SWVp_FHLDvsS2w-cQA&s=19',
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function OnlineCoursesPage() {
  const direction = useDirection();
  const [liked, setLiked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const result = await CoursesApi.getAll({ limit: 100 });
        if (result.success && Array.isArray(result.data)) {
          setCourses(result.data.filter(c => Number(c.is_published) === 1));
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'آنلاین کورسونه - د انوار العلوم',
          text: 'زموږ آنلاین کورسونو ته وګورئ',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('لینک کاپي شو!');
    }
  };

  return (

    <main className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white" dir={direction}>
      <IslamicHeader
        pageType="courses"
        alignment="center"
      />

      {/* Courses Section */}
      <section className="w-full mx-auto py-6 sm:py-12 px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mt-4 sm:mt-8 md:mt-12 mb-6 sm:mb-8">
            <Breadcrumb />
          </div>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 mb-6">
              <span className="text-sm font-semibold text-amber-700">آنلاین زده کړه</span>
            </div>
         
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              د علم او معرفت سفر پیل کړئ زموږ د آنلاین کورسونو سره
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="group h-full flex flex-col rounded-2xl border-2 border-gray-200/60 bg-white shadow-sm animate-pulse overflow-hidden"
                >
                  {/* Image skeleton */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 relative">
                    <div className="absolute top-4 right-4">
                      <div className="h-6 bg-white/80 rounded-lg w-16"></div>
                    </div>
                  </div>
                  
                  {/* Content skeleton */}
                  <div className="flex-1 flex flex-col gap-4 px-6 py-6">
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 rounded-md w-full"></div>
                      <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
                      <div className="h-4 bg-gray-100 rounded-md w-full"></div>
                      <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
                    </div>
                    
                    {/* Meta skeleton */}
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2">
                        <div className="h-7 w-7 rounded-lg bg-gray-200"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2">
                        <div className="h-7 w-7 rounded-lg bg-gray-200"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    
                    {/* Instructor skeleton */}
                    <div className="flex items-center gap-3 mt-2 p-3 bg-gray-50 rounded-xl">
                      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    
                    {/* Button skeleton */}
                    <div className="mt-auto pt-2">
                      <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="py-12">
              <ErrorDisplay 
                error={error} 
                variant="inline" 
                onRetry={() => window.location.reload()}
              />
            </div>
          )}

          {/* Courses Grid */}
          {!loading && !error && (
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.15 }}
              className="grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3"
            >
              {courses.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">هیڅ کورس نشته</p>
                </div>
              ) : (
                courses.map((course) => {
                  const courseImage = getImageUrl(course.image, "/placeholder-course.jpg") || "/placeholder-course.jpg";
                  const instructorName = course.recorded_by 
                    ? `${course.recorded_by.first_name || ''} ${course.recorded_by.last_name || ''}`.trim() || 'محترم استاذ'
                    : 'محترم استاذ';
                  
                  return (
              <motion.article
                key={course.id}
                variants={cardVariants}
                className="group h-full flex flex-col rounded-2xl border-2 border-gray-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-100/30 hover:border-amber-300/60 overflow-hidden"
              >
                {/* Course Image */}
                <div className="aspect-[4/3] overflow-hidden relative bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={courseImage}
                    alt={course.title}
                    fill
                    sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 90vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Badge overlay */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/95 backdrop-blur-md rounded-lg px-3 py-1.5 shadow-lg border border-white/20">
                      <span className="text-xs font-semibold text-gray-700">آنلاین</span>
                    </div>
                  </div>
                  
                  {/* Hover icon */}
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white/95 backdrop-blur-md rounded-full p-2.5 shadow-xl border border-white/20">
                      <ExternalLink className="h-4 w-4 text-amber-600" />
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="flex-1 flex flex-col gap-4 px-6 py-6">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm line-clamp-2 min-h-[2.5rem]">
                      {course.description ? course.description.replace(/<[^>]*>/g, ' ').trim() : 'د علم او معرفت سفر'}
                    </p>
                  </div>

                  {/* Course Meta */}
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div className="flex items-center gap-2.5 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 px-3 py-2 border border-amber-100/50">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm">
                        <Clock className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs font-semibold text-gray-700 truncate">{course.duration || 'د پرمختګ سره'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 px-3 py-2 border border-amber-100/50">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm">
                        <Video className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs font-semibold text-gray-700 truncate">
                        {course.video_quantity ? `${course.video_quantity} درسي` : 'انلاین'}
                      </span>
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-3 mt-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md ring-2 ring-amber-100">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">استاذ</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{instructorName}</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto pt-2">
                    <a
                      href={`https://wa.me/+93796148087?text=${encodeURIComponent(
                        `Hi! I'm interested in this course:  سلام! زه د «انلاین کورسونو» کې علاقه لرم. کولای شئ ماته د نوم لیکنې، بيې، او د کورس جزییاتو په اړه نور معلومات راکړئ؟?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white font-bold py-3 px-4 rounded-xl hover:from-amber-700 hover:via-amber-600 hover:to-orange-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-200/50 focus:outline-none focus:ring-4 focus:ring-amber-500/30 focus:ring-offset-2 group/btn"
                    >
                      <span className="text-sm">همدا اوس داخله وکړئ</span>
                      <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.article>
                  );
                })
              )}
            </motion.div>
          )}

          {/* Like and Share Buttons */}
          {!loading && !error && courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center gap-4 mt-16 mb-8"
            >
              <button
                onClick={handleLike}
                className={`group flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 ${
                  liked
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-xl shadow-red-500/40 hover:shadow-2xl hover:shadow-red-500/50 hover:scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-red-300 hover:shadow-lg'
                }`}
              >
                <Heart className={`h-5 w-5 transition-all ${liked ? 'fill-current animate-pulse' : ''}`} />
                <span>{liked ? 'ستاسو خوښ شو' : 'خوښ کړئ'}</span>
                {likesCount > 0 && (
                  <span className={`px-2.5 py-1 rounded-full text-sm font-bold ${
                    liked ? 'bg-white/30 text-white' : 'bg-red-100 text-red-600'
                  }`}>
                    {likesCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleShare}
                className="group flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white hover:from-amber-700 hover:via-amber-600 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <Share2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                <span>شیر کړئ</span>
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Social Media Section */}
      <section className="w-full bg-[#1A3635] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir={direction}>
        {/* Background Logo */}
        <div className="absolute inset-0 opacity-[0.2] pointer-events-none">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/logo2.png)',
              backgroundPosition: 'center',
              backgroundSize: 'contain',
            }}
          />
        </div>
        
        <div className="mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              د انوارالمشائخ رحمه الله خپرندویه ادارې ادرسونه
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-2">
              تاسو کولای شئ چې له لاندې ادرسونو څخه زموږ نشرات وڅارئ
            </p>
          </motion.div>

          {/* Social Media Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {/* Facebook */}
            <motion.a
              href={socialMediaLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group flex flex-col items-center justify-center gap-4 p-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-150 shadow-lg hover:shadow-2xl border border-blue-500/30"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-150">
                <FaFacebook className="text-3xl text-white" />
              </div>
              <span className="text-white font-semibold text-lg">فیسبوک</span>
            </motion.a>

            {/* YouTube */}
            <motion.a
              href={socialMediaLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group flex flex-col items-center justify-center gap-4 p-8 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-150 shadow-lg hover:shadow-2xl border border-red-500/30"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-150">
                <FaYoutube className="text-3xl text-white" />
              </div>
              <span className="text-white font-semibold text-lg">یوټیوب</span>
            </motion.a>

            {/* Twitter */}
            <motion.a
              href={socialMediaLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group flex flex-col items-center justify-center gap-4 p-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl hover:from-sky-600 hover:to-sky-700 transition-all duration-150 shadow-lg hover:shadow-2xl border border-sky-400/30"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-150">
                <FaTwitter className="text-3xl text-white" />
              </div>
              <span className="text-white font-semibold text-lg">ټویټر</span>
            </motion.a>

            {/* Telegram Main */}
            <motion.a
              href={socialMediaLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group flex flex-col items-center justify-center gap-4 p-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl hover:from-blue-500 hover:to-blue-600 transition-all duration-150 shadow-lg hover:shadow-2xl border border-blue-400/30"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-150">
                <FaTelegram className="text-3xl text-white" />
              </div>
              <span className="text-white font-semibold text-lg">ټیلیګرام</span>
            </motion.a>

            {/* Telegram Translation Channel */}
            <motion.a
              href={socialMediaLinks.telegramTranslation}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group flex flex-col items-center justify-center gap-4 p-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-150 shadow-lg hover:shadow-2xl border border-cyan-400/30"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-150">
                <FaTelegram className="text-3xl text-white" />
              </div>
              <span className="text-white font-semibold text-lg text-center">ټیلیګرام د ترجمې چینل</span>
            </motion.a>

            {/* WhatsApp Channel */}
            <motion.a
              href={socialMediaLinks.whatsappChannel}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group flex flex-col items-center justify-center gap-4 p-8 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-150 shadow-lg hover:shadow-2xl border border-green-400/30"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-150">
                <FaWhatsapp className="text-3xl text-white" />
              </div>
              <span className="text-white font-semibold text-lg text-center">واټساپ چینل</span>
            </motion.a>
          </div>

          {/* WhatsApp Groups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              د WhatsApp ګروپونه
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {socialMediaLinks.whatsapp.map((group, index) => (
                <motion.a
                  key={index}
                  href={group.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center justify-center gap-3 p-5 bg-gradient-to-br from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-150 shadow-lg hover:shadow-xl border border-green-500/30"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-150">
                    <FaWhatsapp className="text-xl text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-semibold text-sm block truncate">{group.name}</span>
                    <span className="text-green-100 text-xs">ګروپ</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Office Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: 0.2 }}
            className="mt-16 pt-12 border-t border-white/10"
          >
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              د دفتر معلومات
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Address */}
              <motion.div
                whileHover={{ scale: 1.02, y: -3 }}
                className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-150"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-2">پته</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    کابل، پغمان ولسوالی، ارغندی علیا، د انوار العلوم اسلامي مدرسه
                  </p>
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                whileHover={{ scale: 1.02, y: -3 }}
                className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-150"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-2">تلیفون</h4>
                  <a 
                    href="tel:+93796148087" 
                    className="text-white/80 text-sm hover:text-white transition-colors block"
                  >
                      796148087 93+
                  
                  </a>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                whileHover={{ scale: 1.02, y: -3 }}
                className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-150"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-2">بریښنالیک</h4>
                  <a 
                    href="mailto:info@anwarululoom.com" 
                    className="text-white/80 text-sm hover:text-white transition-colors block break-all"
                  >
                    info@anwarululoom.com
                  </a>
                </div>
              </motion.div>

              {/* Office Hours */}
              <motion.div
                whileHover={{ scale: 1.02, y: -3 }}
                className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-150 sm:col-span-2 lg:col-span-1"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-2">د کار وخت</h4>
                  <p className="text-white/80 text-sm">
                    شنبه - جمعې: 6:۰۰ بجو - 10:۰۰ بجو
                  </p>
                </div>
              </motion.div>

              {/* Building/Office Name */}
              <motion.div
                whileHover={{ scale: 1.02, y: -3 }}
                className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-150 sm:col-span-2 lg:col-span-2"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-2">د انوارالمشائخ رحمه الله خپرندویه اداره</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    د انوار العلوم اسلامي مدرسه د علم، دعوت او خیر خپرولو په برخه کې دنده ترسره کوي
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
