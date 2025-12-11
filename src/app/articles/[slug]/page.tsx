// app/articles/[slug]/page.tsx
import { ArticlesApi, extractArray } from "../../../lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getImageUrl } from "@/lib/utils";
import { cleanText } from "@/lib/textUtils";
import VideoPlayer from "@/app/components/VideoPlayer";
import Breadcrumb from "@/components/Breadcrumb";
import { Calendar, FileText } from "lucide-react";
import ArticleDetailImage from "./ArticleDetailImage";

interface Article {
  title: string;
  slug: string;
  content: string;
  description?: string;
  excerpt?: string;
  featuredImage?: string;
  video_url?: string;
  author?: string;
  category?: string;
  tags?: string[];
  publishedAt?: string;
  readTime?: number;
  viewCount?: number;
  is_published?: boolean;
  image?: string; // برای جلوگیری از خطا
}

// ✅ PageProps درست
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
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

export default async function ArticleDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  const articleResponse = await ArticlesApi.getBySlug(slug);
  if (!articleResponse.success) {
    notFound();
  }

  const articlePayload = articleResponse.data;
  const rawArticle = Array.isArray(articlePayload)
    ? (articlePayload[0] as any | undefined)
    : (articlePayload as any | undefined);

  if (!rawArticle) notFound();

  // Process the article to ensure category is properly handled
  const article: Article = {
    ...rawArticle,
    category: typeof rawArticle.category === 'string' 
      ? rawArticle.category 
      : rawArticle.category?.name || 'General'
  };

  let relatedArticles: Article[] = [];
  try {
    const relatedResponse = await ArticlesApi.getAll({ limit: 6 });
    if (relatedResponse.success) {
      const data = extractArray<any>(relatedResponse.data);
      relatedArticles = data
        .filter((a) => a.slug !== slug)
        .slice(0, 3)
        .map((item) => ({
          ...item,
          category: typeof item.category === 'string' 
            ? item.category 
            : item.category?.name || 'General'
        }));
    }
  } catch (relatedError) {
    console.warn("Failed to load related articles:", relatedError);
  }

  return (
    <main className="min-h-screen mt-20 sm:mt-24 md:mt-32 bg-gradient-to-b from-amber-50/30 to-white">
     
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Article Content */}
          <div className="flex-1">
            <article className="mb-16 relative overflow-hidden rounded-2xl bg-white border border-gray-200 ">
              <div className="p-6 md:p-8 lg:p-10 space-y-8">
                {/* Header Section */}
                <div className="space-y-6">
                  <div>
                    {/* Category Badge */}
                    {article.category && (
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#e0f2f2] text-[#4a8a8a] border border-[#d0e8e8]">
                          <FileText className="w-4 h-4" />
                          <span>{article.category}</span>
                        </span>
                      </div>
                    )}

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Amiri, serif' }}>
                      {stripHtml(article.title)}
                    </h1>

                    {/* Metadata */}
                    {article.publishedAt && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 w-fit">
                        <Calendar className="w-5 h-5 text-[#4a8a8a]" />
                        <span className="text-sm font-medium text-gray-700">
                          {new Date(article.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Media Section */}
                {article.video_url && (
                  <div className="mb-8">
                    <VideoPlayer
                      videoUrl={article.video_url}
                      posterUrl={article.featuredImage || article.image || ""}
                      title={article.title}
                    />
                  </div>
                )}

                {(article.featuredImage || article.image) && !article.video_url && (
                  <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
                    <ArticleDetailImage
                      src={article.featuredImage || article.image}
                      alt={article.title}
                      priority
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  {article.description && (
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6" style={{ fontFamily: 'Amiri, serif' }}>
                      {stripHtml(article.description)}
                    </p>
                  )}
                  
                  {article.content && (
                    <div 
                      className="text-gray-800 leading-relaxed"
                      style={{ fontFamily: 'Amiri, serif' }}
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* Related Articles Sidebar - Desktop Only */}
          {relatedArticles.length > 0 && (
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-8">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Sidebar Header */}
                  <div className="px-6 py-5 bg-gradient-to-r from-[#4a8a8a] to-[#5a9a9a]">
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Amiri, serif' }}>
                      Related Articles
                    </h3>
                  </div>

                  {/* Articles List - Simple Text Only */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {relatedArticles.map((item, index) => (
                        <Link
                          key={item.slug}
                          href={`/articles/${item.slug}`}
                          className="group block p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border-l-2 border-transparent hover:border-[#4a8a8a]"
                        >
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#4a8a8a] transition-colors mb-1.5 line-clamp-2 leading-snug" style={{ fontFamily: 'Amiri, serif' }}>
                            {stripHtml(item.title)}
                          </h4>
                          
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed" style={{ fontFamily: 'Amiri, serif' }}>
                            {stripHtml(item.description) || "Continue reading..."}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Articles - Mobile Bottom Section */}
        {relatedArticles.length > 0 && (
          <div className="lg:hidden mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center" style={{ fontFamily: 'Amiri, serif' }}>
              Related Articles
            </h2>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="space-y-3">
                  {relatedArticles.map((item, index) => (
                    <Link
                      key={item.slug}
                      href={`/articles/${item.slug}`}
                      className="group block p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border-l-2 border-transparent hover:border-[#4a8a8a]"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#4a8a8a] transition-colors mb-1.5 line-clamp-2 leading-snug" style={{ fontFamily: 'Amiri, serif' }}>
                        {stripHtml(item.title)}
                      </h3>
                      
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed" style={{ fontFamily: 'Amiri, serif' }}>
                        {stripHtml(item.description) || "Continue reading..."}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ✅ اگر متادیتا خواستی:
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Article: ${slug}`,
  };
}
