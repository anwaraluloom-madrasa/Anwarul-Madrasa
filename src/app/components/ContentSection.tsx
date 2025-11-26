"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useAnimation } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { getImageUrl } from "@/lib/utils";
import { cleanText } from "@/lib/textUtils";
import { ComingSoonEmptyState } from "@/components/EmptyState";

// Image component with error handling for ContentSection
function ContentImage({ src, alt, className }: { src: string | null | undefined; alt: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!src) {
      setImgSrc("/placeholder-article.jpg");
      setIsLoading(false);
      return;
    }
    
    const newUrl = getImageUrl(src, "/placeholder-article.jpg");
    setImgSrc(newUrl);
    setHasError(false);
    setIsLoading(true);
    
    // Log image URL for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('🖼️ Content image:', {
        original: src,
        processed: newUrl,
        alt
      });
    }
  }, [src, alt]);
  
  const handleError = () => {
    console.warn('⚠️ Content image failed to load:', imgSrc);
    setHasError(true);
    setImgSrc("/placeholder-article.jpg");
    setIsLoading(false);
  };
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  if (hasError || !imgSrc) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }
  
  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
          <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        className={className}
        onError={handleError}
        onLoad={handleLoad}
      />
    </>
  );
}

interface Author {
  name: string;
  bio?: string;
}

interface Article {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  question?: string;
  answer?: string;
  image?: string;
  category_id?: string;
  published_at?: string;
  date?: string;
  shared_by?: string;
  author?: Author;
  mufti?: Author;
  category?: string;
  tags?: string[];
  is_published?: boolean;
  viewCount?: number;
}

interface ContentSectionProps {
  articles?: Article[];
  fatwas?: Article[];
  showAll?: boolean;
  title?: string;
  subtitle?: string;
}

export default function ContentSection({
  articles = [],
  fatwas = [],
  showAll = false,
  title = "Knowledge Hub",
  subtitle = "Discover articles and Islamic guidance",
}: ContentSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  // Combine and sort content
  const allContent = [
    ...articles.map((item) => ({ ...item, type: "article" })),
    ...fatwas.map((item) => ({ ...item, type: "fatwa" })),
  ].sort(
    (a, b) =>
      new Date(b.published_at || b.date || "").getTime() -
      new Date(a.published_at || a.date || "").getTime()
  );

  const displayContent = showAll ? allContent : allContent.slice(0, 6);

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
        duration: 0.15,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 py-20 px-6 rounded-3xl mb-16 shadow-2xl border border-amber-100">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNlYjY0MTEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2Utb3BhY2l0eT0iMC4zIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxNSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjI1Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNSIvPjxsaW5lIHgxPSIzMCIgeTE9IjAiIHgyPSIzMCIgeTI9IjYwIi8+PGxpbmUgeDE9IjAiIHkxPSIzMCIgeDI9IjYwIiB5Mj0iMzAiLz48L2c+PC9zdmc+')]"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-12 left-12 w-28 h-28 bg-gradient-to-br from-amber-300/30 to-orange-300/20 rounded-full animate-float-slow"></div>
        <div
          className="absolute bottom-12 right-16 w-20 h-20 bg-gradient-to-br from-orange-300/30 to-amber-300/20 rounded-full animate-float-medium"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-amber-300/20 to-orange-200/10 rounded-full animate-float-slow"
          style={{ animationDelay: "2.5s" }}
        ></div>

        {/* Content Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="text-center relative z-10 max-w-4xl mx-auto bg-white/40 rounded-2xl py-12 px-8 border border-white/50 shadow-sm"
        >
          {/* Icon Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              // No delay - instant rendering
              type: "spring",
              stiffness: 120,
              damping: 10,
            }}
            className="inline-flex items-center justify-center mb-8 w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 shadow-lg shadow-amber-200/60 ring-2 ring-white ring-opacity-50"
          >
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight"
          >
            <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent drop-shadow-sm">
              {title}
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="text-lg md:text-xl text-amber-900/90 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            {subtitle}
          </motion.p>

          {/* Decorative separator */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ duration: 0.15 }}
            className="h-1 bg-gradient-to-r from-amber-300 to-orange-400 mx-auto mb-10 rounded-full"
          ></motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              { icon: "📚", text: "Educational Articles" },
              { icon: "❓", text: "Q&A with Scholars" },
              { icon: "🔍", text: "Easy to Search" },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/70 p-4 rounded-xl border border-white/50 shadow-sm"
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <div className="text-amber-800 font-medium">{feature.text}</div>
              </div>
            ))}
          </motion.div>

          {/* Pulsing Dots */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="flex justify-center space-x-3"
          >
            <div className="w-3 h-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full animate-ping-slow"></div>
            <div
              className="w-3 h-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full animate-ping-medium"
              style={{ animationDelay: "0.3s" }}
            ></div>
            <div
              className="w-3 h-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full animate-ping-slow"
              style={{ animationDelay: "0.6s" }}
            ></div>
          </motion.div>
        </motion.div>
      </div>

      {/* Content Grid */}
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={mainControls}
        className="space-y-8 px-6"
      >
        {displayContent.map((item, index) => (
          <motion.div
            key={`${item.type}-${item.id}`}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-150 border border-amber-100 group relative overflow-hidden"
          >
            {/* Animated background element */}
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-3xl -z-10"></div>

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 -z-20 overflow-hidden">
              <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-amber-100/30 to-transparent transform -skew-x-12 group-hover:animate-shimmer"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 relative z-10">
              {/* Image Section */}
              {item.image && (
                <div className="lg:w-80 flex-shrink-0">
                  <div className="relative h-48 lg:h-full rounded-xl overflow-hidden bg-gray-100">
                    <ContentImage
                      src={item.image}
                      alt={item.title}
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* Type Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.type === "article"
                            ? "bg-blue-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {item.type === "article" ? "📚 Article" : "❓ Q&A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Section */}
              <div className="flex-1">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <motion.h3
                      whileHover={{ color: "var(--color-secondary-600)" }}
                      className="text-xl font-semibold text-gray-900 leading-tight mb-2"
                    >
                      <Link
                        href={
                          item.type === "article"
                            ? `/articles/${item.id}`
                            : `/iftah/${item.slug}`
                        }
                        className="hover:underline block"
                      >
                        {item.title}
                      </Link>
                    </motion.h3>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                      {(item.author || item.mufti) && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center bg-amber-50 px-3 py-1 rounded-full"
                        >
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-200 to-orange-200 flex items-center justify-center mr-2">
                            <svg
                              className="w-3 h-3 text-amber-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-amber-700">
                            {item.author?.name ||
                              item.mufti?.name ||
                              item.shared_by ||
                              "Anonymous"}
                          </span>
                        </motion.div>
                      )}

                      {(item.category || item.category_id) && (
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {item.category || item.category_id}
                        </motion.span>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center text-gray-500"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          {item.published_at?.split("T")[0] ||
                            item.date ||
                            "Unknown date"}
                        </span>
                      </motion.div>

                      {item.viewCount && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center text-gray-500"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span>{item.viewCount} views</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {index < 3 && !showAll && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="flex-shrink-0"
                    >
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Popular
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Content Preview */}
                <div className="space-y-4 mb-5">
                  {item.type === "fatwa" && item.question && (
                    <div className="flex items-start">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center mr-3 flex-shrink-0 shadow-sm"
                      >
                        <span className="text-amber-700 font-semibold text-sm">
                          Q
                        </span>
                      </motion.div>
                      <p className="text-gray-800 font-medium leading-relaxed">
                        {cleanText(item.question)}
                      </p>
                    </div>
                  )}

                  {(item.description || item.answer) && (
                    <div className="flex items-start">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center mr-3 flex-shrink-0 shadow-sm"
                      >
                        <span className="text-amber-700 font-semibold text-sm">
                          {item.type === "fatwa" ? "A" : "📖"}
                        </span>
                      </motion.div>
                      <p className="text-gray-600 leading-relaxed line-clamp-3">
                        {cleanText(item.description || item.answer)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-amber-100">
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.slice(0, 3).map((tag, i) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.15 }}
                          whileHover={{ scale: 1.1 }}
                          className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium cursor-pointer hover:bg-amber-100 transition-colors"
                        >
                          #{tag}
                        </motion.span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-xs">
                          +{item.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <motion.div whileHover={{ x: 5 }}>
                    <Link
                      href={
                        item.type === "article"
                          ? `/articles/${item.id}`
                          : `/iftah/${item.slug}`
                      }
                      className="inline-flex items-center text-amber-600 font-medium hover:text-orange-700 transition-colors group-hover:underline flex-shrink-0"
                    >
                      {item.type === "article"
                        ? "Read Article"
                        : "Read Full Answer"}
                      <svg
                        className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {!showAll && displayContent.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="mt-16 flex justify-center"
        >
          <Link
            href="/articles"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-full hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity -skew-x-12 group-hover:animate-shimmer"></span>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Explore All Content
          </Link>
        </motion.div>
      )}

      {displayContent.length === 0 && (
        <ComingSoonEmptyState
          title="No content available yet"
          description="We're preparing valuable content. Check back soon for new articles and Q&A."
          className="max-w-2xl mx-auto"
        />
      )}

      {/* Add CSS for custom animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
