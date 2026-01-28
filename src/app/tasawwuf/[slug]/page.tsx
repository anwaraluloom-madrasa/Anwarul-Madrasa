import { notFound } from "next/navigation";
import Image from "next/image";
import { TasawwufApi } from "@/lib/api";
import { cleanText } from "@/lib/textUtils";
import Breadcrumb from "@/components/Breadcrumb";
import IslamicHeader from "@/app/components/IslamicHeader";
import { Tag, Calendar, User } from "lucide-react";
import { getSimpleImageUrl } from "@/lib/utils";

interface Tasawwuf {
  id: number;
  title: string;
  slug: string;
  description: string;
  image?: string;
  shared_by?: string;
  created_at?: string;
  category?: { id: number; name: string };
}

async function getPost(slug: string): Promise<Tasawwuf | null> {
  try {
    const result = await TasawwufApi.getBySlug(slug);
    if (!result.success) {
      return null;
    }

    return (result.data as Tasawwuf | null) ?? null;
  } catch {
    return null;
  }
}

export default async function TasawwufSinglePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return notFound();

  return (
    <main className="w-full min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader
        pageType="tasawwuf"
        title={cleanText(post.title)}
        alignment="center"
      />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 py-12" dir="rtl">
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>

        {/* Meta info - Improved Design */}
        <div className="flex flex-wrap items-center gap-4 mb-8 mt-6">
          {post.category?.name && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200/50">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">
                {post.category.name}
              </span>
            </div>
          )}
          {post.created_at && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 border border-gray-200">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {new Date(post.created_at).toLocaleDateString("ps-AF", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
          {post.shared_by && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 border border-gray-200">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {cleanText(post.shared_by)}
              </span>
            </div>
          )}
        </div>

        {/* Image - Improved Design */}
        {post.image && (
          <div className="relative w-full h-96 sm:h-[28rem] mb-10 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl">
            <Image
              src={getSimpleImageUrl(post.image, "/placeholder-tasawwuf.jpg")}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-tasawwuf.jpg";
              }}
            />
          </div>
        )}

        {/* Content - Improved Design */}
        <article className="bg-white rounded-2xl border-2 border-gray-200/60 p-8 sm:p-10 shadow-lg">
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed [&_*]:text-gray-700 [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:mr-6 [&_ol]:list-decimal [&_ol]:mr-6 [&_li]:mb-2 [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_img]:rounded-lg [&_img]:my-4 [&_blockquote]:border-r-4 [&_blockquote]:border-gray-300 [&_blockquote]:pr-4 [&_blockquote]:italic"
            style={{ fontFamily: "Amiri, serif" }}
            dir="rtl"
            dangerouslySetInnerHTML={{ __html: post.description }}
          />
        </article>
      </div>
    </main>
  );
}
