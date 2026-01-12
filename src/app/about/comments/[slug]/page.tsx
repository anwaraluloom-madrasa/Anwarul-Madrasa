"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CommentAboutSheikApi } from "@/lib/api";
import IslamicHeader from "@/app/components/IslamicHeader";
import Breadcrumb from "@/components/Breadcrumb";
import { getTranslation } from "@/lib/translations";
import { Quote, X, Loader2 } from "lucide-react";
import { cleanTextWithLimit } from "@/lib/textUtils";

interface CommentAboutSheik {
  id: number;
  sheik_id: number;
  name: string;
  comment: string;
  slug?: string;
}

interface CommentDetail {
  id: number;
  sheik_id: number;
  name: string;
  comment: string;
  slug: string;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
  };
}

interface CategoryData {
  id: number;
  name: string;
  slug: string;
  comment_about_sheiks: CommentAboutSheik[];
}

export default function CommentCategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComment, setSelectedComment] = useState<CommentDetail | null>(
    null
  );
  const [loadingComment, setLoadingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const result = await CommentAboutSheikApi.getCategoryBySlug(slug);

        if (result.success && result.data) {
          setCategoryData(result.data);
        } else {
          setError(result.error || "دسته بندی پیدا نشد");
        }
      } catch (err) {
        setError("ستونزې رامنځته شوې");
        console.error("Error fetching category data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  const t = (key: string): string => {
    const translation = getTranslation(key, "ps");
    return typeof translation === "string" ? translation : key;
  };

  const handleCommentClick = async (commentSlug: string) => {
    try {
      setLoadingComment(true);
      setCommentError(null);
      const result = await CommentAboutSheikApi.getCommentBySlug(commentSlug);

      if (result.success && result.data) {
        setSelectedComment(result.data);
      } else {
        setCommentError(result.error || "د نظر بارول کې ستونزه رامنځته شوه");
      }
    } catch (err) {
      setCommentError("ستونزې رامنځته شوې");
      console.error("Error fetching comment detail:", err);
    } finally {
      setLoadingComment(false);
    }
  };

  const closeModal = () => {
    setSelectedComment(null);
    setCommentError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <IslamicHeader
          pageType="about"
          title="د نظریاتو پاڼه"
          subtitle={t("header.about.subtitle")}
        />
        <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-8 sm:py-12">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a8a8a] mx-auto mb-4"></div>
              <p
                className="text-gray-600"
                style={{ fontFamily: "Amiri, serif" }}
              >
                پورته کول...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <IslamicHeader
          pageType="about"
          title="د نظریاتو پاڼه"
          subtitle={t("header.about.subtitle")}
        />
        <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-8 sm:py-12">
          <div className="text-center py-20">
            <p
              className="text-red-600 text-lg"
              style={{ fontFamily: "Amiri, serif" }}
            >
              {error || "دسته بندی پیدا نشد"}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader
        pageType="about"
        title={categoryData.name}
        subtitle={t("header.about.subtitle")}
      />
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-8 sm:py-12">
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden mt-8">
          <div className="px-6 sm:px-8 py-8">
            {/* Category Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full flex items-center justify-center">
                  <Quote className="h-6 w-6 text-white" />
                </div>
                <h1
                  className="text-3xl md:text-4xl font-bold text-gray-900"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  {categoryData.name}
                </h1>
              </div>
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#4a8a8a]/30 to-transparent mx-auto"></div>
            </div>

            {/* Comments List */}
            {categoryData.comment_about_sheiks &&
            categoryData.comment_about_sheiks.length > 0 ? (
              <div className="space-y-8">
                {categoryData.comment_about_sheiks.map((comment) => (
                  <div
                    key={comment.id}
                    className="relative bg-gradient-to-br from-[#f0f9f9] to-white p-6 md:p-8 rounded-lg border-r-4 border-[#4a8a8a] hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full flex items-center justify-center">
                        <Quote className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <button
                          onClick={() =>
                            handleCommentClick(
                              comment.slug ||
                                comment.name.toLowerCase().replace(/\s+/g, "-")
                            )
                          }
                          className="text-xl md:text-2xl font-bold text-gray-900 mb-4 hover:text-[#4a8a8a] transition-colors duration-200 cursor-pointer text-right w-full"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          {comment.name}
                        </button>
                        <div className="mb-4">
                          <p
                            className="text-base md:text-lg text-gray-700 leading-relaxed mb-3"
                            style={{ fontFamily: "Amiri, serif" }}
                          >
                            {cleanTextWithLimit(comment.comment, 150)}
                          </p>
                          <button
                            onClick={() =>
                              handleCommentClick(
                                comment.slug ||
                                  comment.name
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")
                              )
                            }
                            className="text-[#4a8a8a] hover:text-[#3a7a7a] font-semibold text-sm md:text-base transition-colors duration-200 inline-flex items-center gap-1"
                            style={{ fontFamily: "Amiri, serif" }}
                          >
                            نور ولولئ
                            <span className="mr-1">←</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p
                  className="text-gray-600 text-lg"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  دغه دسته بندي کې هیڅ نظریه نشته
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Comment Detail Modal */}
      {selectedComment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          dir="rtl"
        >
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2
                className="text-2xl md:text-3xl font-bold text-gray-900"
                style={{ fontFamily: "Amiri, serif" }}
              >
                {selectedComment.name}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-8">
              {loadingComment ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#4a8a8a]" />
                </div>
              ) : commentError ? (
                <div className="text-center py-12">
                  <p
                    className="text-red-600 text-lg"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    {commentError}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4a8a8a]/10 rounded-lg">
                      <span
                        className="text-sm text-gray-600"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        دسته بندي:
                      </span>
                      <span
                        className="text-sm font-semibold text-[#4a8a8a]"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        {selectedComment.category.name}
                      </span>
                    </div>
                  </div>
                  <div
                    className="text-lg md:text-xl text-gray-700 leading-relaxed prose prose-lg max-w-none"
                    style={{ fontFamily: "Amiri, serif" }}
                    dangerouslySetInnerHTML={{
                      __html: selectedComment.comment,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
