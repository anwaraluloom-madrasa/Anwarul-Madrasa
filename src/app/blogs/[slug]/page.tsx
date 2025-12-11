// app/blogs/[slug]/page.tsx
import { BlogsApi, extractArray } from "../../../lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
import { getTranslation } from "@/lib/translations";
import Breadcrumb from "@/components/Breadcrumb";
import { Calendar, Star, ChevronLeft, Hash } from "lucide-react";

interface Blog {
  name: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  featuredImage?: string;
  date: string;
  is_published: boolean;
  is_top: boolean;
  category_id: number;
  excerpt?: string;
  author?: string;
  tags?: string[];
  publishedAt?: string;
  readTime?: number;
}

interface Params {
  params: Promise<{ slug: string }>;
}

function stripHtml(value?: string | null) {
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
}

export default async function BlogDetailsPage({ params }: Params) {
  const { slug } = await params;
  const t = (key: string): string => {
    const translation = getTranslation(key, "ps");
    return typeof translation === "string" ? translation : key;
  };

  const blogResponse = await BlogsApi.getBySlug(slug);
  if (
    !blogResponse.success ||
    ("error" in blogResponse && blogResponse.error === "not_found")
  ) {
    notFound();
  }

  const blogPayload = blogResponse.data;
  const blog = Array.isArray(blogPayload)
    ? (blogPayload[0] as Blog | undefined)
    : (blogPayload as Blog | undefined);

  if (!blog) notFound();

  let relatedBlogs: Blog[] = [];
  try {
    const relatedResponse = await BlogsApi.getAll({ limit: 6 });
    if (relatedResponse.success) {
      const data = extractArray<Blog>(relatedResponse.data);
      relatedBlogs = data.filter((b) => b.slug !== slug).slice(0, 3);
    }
  } catch (relatedError) {
    console.warn("Failed to load related blogs:", relatedError);
  }

  return (
    <main
      className="min-h-screen mt-16 sm:mt-12 md:mt-24 bg-gradient-to-b from-amber-50 to-white font-sans"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>
        {/* Hero Section - Clean and Modern */}
        <article className="mb-8 sm:mb-12 md:mb-16 relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-gray-200">
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8">
            {/* Header Section */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight break-words"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  {stripHtml(blog.title)}
                </h1>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
                  <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a8a8a] flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                      {new Date(
                        blog.publishedAt || blog.date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {blog.is_top && (
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300">
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-800 fill-amber-800 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-semibold text-amber-800">
                        {t("blog.featuredPost")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {(blog.featuredImage || blog.image) && (
              <div className="relative w-full aspect-[16/9] rounded-lg sm:rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={
                    getImageUrl(
                      blog.featuredImage || blog.image,
                      "/placeholder-blog.jpg"
                    ) || "/placeholder-blog.jpg"
                  }
                  alt={blog.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Description/Excerpt */}
            {(blog.excerpt || blog.description) && (
              <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
                <div
                  className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed break-words overflow-wrap-anywhere"
                  style={{ fontFamily: "Amiri, serif" }}
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                />
              </div>
            )}
          </div>
        </article>

        {/* Tags Section */}
        {blog.tags && blog.tags.length > 0 && (
          <section className="mb-8 sm:mb-12 md:mb-16">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8">
              <h3
                className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2"
                style={{ fontFamily: "Amiri, serif" }}
              >
                <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a8a8a] flex-shrink-0" />
                <span>{t("blog.articleTags")}</span>
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blogs/tag/${tag}`}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#e0f2f2] hover:bg-[#d0e8e8] text-[#4a8a8a] rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border border-[#d0e8e8] hover:border-[#4a8a8a]"
                  >
                    <Hash className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                    <span className="break-words">{tag}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <section className="mb-8 sm:mb-12 md:mb-16">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-12 text-center px-2"
              style={{ fontFamily: "Amiri, serif" }}
            >
              {t("blog.moreArticlesYouMightLike")}
            </h2>
            <div className="grid gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((rb) => (
                <Link
                  key={rb.slug}
                  href={`/blogs/${rb.slug}`}
                  className="group relative flex h-full flex-col bg-[#e0f2f2] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-[#d0e8e8]"
                  dir="rtl"
                >
                  {/* Top Section - Full Size Image */}
                  <div className="relative h-48 bg-[#e0f2f2] flex-shrink-0 overflow-hidden">
                    <Image
                      src={
                        getImageUrl(
                          rb.featuredImage || rb.image,
                          "/placeholder-blog.jpg"
                        ) || "/placeholder-blog.jpg"
                      }
                      alt={rb.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Featured Badge */}
                    {rb.is_top && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white shadow-lg">
                          <Star className="w-3.5 h-3.5 fill-white" />
                          <span>{t("blog.featured")}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Section - White Background with Crescent Pattern */}
                  <div className="relative flex-1 bg-white p-4 sm:p-5 md:p-6 flex flex-col justify-between">
                    {/* Crescent Moon Pattern Background */}
                    <div
                      className="absolute inset-0 opacity-[0.03]"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 5c-8 0-15 3-20 8-5 5-8 12-8 20 0 8 3 15 8 20 5 5 12 8 20 8s15-3 20-8c5-5 8-12 8-20 0-8-3-15-8-20-5-5-12-8-20-8zm0 5c6 0 11 2 15 6 4 4 6 9 6 15 0 6-2 11-6 15-4 4-9 6-15 6s-11-2-15-6c-4-4-6-9-6-15 0-6 2-11 6-15 4-4 9-6 15-6z' fill='%234a8a8a'/%3E%3C/svg%3E")`,
                        backgroundSize: "50px 50px",
                        backgroundPosition: "0 0",
                      }}
                    ></div>

                    {/* Content */}
                    <div className="relative z-10 space-y-3 sm:space-y-4 flex-1">
                      {/* Title - Large and Bold */}
                      <h3
                        className="text-lg sm:text-xl md:text-2xl font-bold text-[#4a8a8a] leading-tight line-clamp-2 break-words"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        {stripHtml(rb.title)}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-xs sm:text-sm text-[#4a8a8a] leading-relaxed line-clamp-2 sm:line-clamp-3 break-words"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        {stripHtml(rb.description)}
                      </p>

                      {/* Date - Small Text */}
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-[#4a8a8a] pt-1 sm:pt-2">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="whitespace-nowrap">
                          {new Date(
                            rb.publishedAt || rb.date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="relative z-10 my-3 sm:my-4 border-t border-gray-200"></div>

                    {/* Footer with Navigation */}
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <span
                        className="text-[10px] sm:text-xs text-[#4a8a8a] font-medium"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        {t("blog.readMore")}
                      </span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#e0f2f2] flex items-center justify-center group-hover:bg-[#d0e8e8] transition-colors flex-shrink-0">
                        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4a8a8a]" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
