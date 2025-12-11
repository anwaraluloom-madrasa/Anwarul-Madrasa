"use client";

import Image from "next/image";
import Link from "next/link";
import truncate from "html-truncate";
import IslamicHeader from "../components/IslamicHeader";
import Breadcrumb from "@/components/Breadcrumb";
import ErrorDisplay from "@/components/ErrorDisplay";
import { ComingSoonEmptyState } from "@/components/EmptyState";
import AuthorCardSkeleton from "../components/authors/AuthorCardSkeleton";
import { ArrowLeft } from "lucide-react";

import { AuthorsApi } from "../../lib/api";
import { Author } from "../../lib/types";
import { getSimpleImageUrl } from "@/lib/utils";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import React from "react";

const isPublishedAndAlive = (author: Author): boolean => {
  return Boolean(author.is_published && author.is_alive);
};

export default function AuthorsPage() {
  const {
    items: authors,
    isLoadingInitial,
    error,
    reload,
  } = usePaginatedResource<Author>((params) => AuthorsApi.getAll(params), {
    pageSize: 12,
  });

  if (isLoadingInitial) {
    return (
      <main className="min-h-screen bg-background-primary">
        <IslamicHeader pageType="authors" />
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 space-y-12 pb-16">
          <div className="mt-4 sm:mt-8 md:mt-12">
            <Breadcrumb />
          </div>
          <div className="grid gap-20 mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <AuthorCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background-primary">
        <IslamicHeader pageType="authors" />
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-16">
          <div className="mt-4 sm:mt-8 md:mt-12 mb-6 sm:mb-8">
            <Breadcrumb />
          </div>
          <ErrorDisplay
            error={error}
            variant="full"
            onRetry={() => void reload()}
          />
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      dir="rtl"
    >
      <IslamicHeader pageType="authors" />
      <div
        className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-12 space-y-12"
        dir="rtl"
      >
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>
        {authors.filter(isPublishedAndAlive).length === 0 ? (
          <ComingSoonEmptyState
            title="هیڅ لیکوال ونه موندل شو"
            description="مهرباني وکړئ وروسته بیا راځئ د نوي پروفایلونو لپاره."
            className="max-w-2xl mx-auto"
          />
        ) : (
          <div className="grid gap-8 mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {authors.filter(isPublishedAndAlive).map((author) => (
              <article
                key={author.id}
                className="group relative flex flex-col bg-white rounded-3xl border-2 border-gray-200 hover:border-emerald-400 shadow-lg hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                {/* Top Section with Image */}
                <div className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 pt-8 pb-4 px-6">
                  <div className="flex justify-center">
                    <div className="relative h-40 w-40 overflow-visible">
                      {/* Outer glow effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-200 to-emerald-300 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300 -z-10"></div>

                      {/* Image container with padding for full image display */}
                      <div className="relative h-full w-full rounded-full border-4 border-white shadow-2xl ring-4 ring-emerald-100 transition-all duration-300 group-hover:ring-emerald-300 group-hover:scale-105 bg-white p-1">
                        <div className="relative h-full w-full rounded-full overflow-hidden">
                          <AuthorImage
                            src={author.image}
                            alt={`${author.first_name || "Unknown"} ${
                              author.last_name || ""
                            }`}
                          />
                        </div>
                      </div>

                      {/* Live indicator dot */}
                      <div
                        className={`absolute bottom-2 right-2 h-6 w-6 rounded-full border-3 border-white shadow-xl z-20 flex items-center justify-center
                            ${
                              author.is_alive
                                ? "bg-green-500 animate-pulse"
                                : "bg-red-500"
                            }
                          `}
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${
                            author.is_alive ? "bg-white" : "bg-white"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="text-center space-y-4 px-6 pt-2 pb-6 flex-1">
                  <h2
                    className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-tight"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    {author.first_name || "Unknown"} {author.last_name || ""}
                  </h2>
                  <div
                    className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem] [&_*]:text-[14px]"
                    style={{ fontFamily: "Amiri, serif" }}
                    dangerouslySetInnerHTML={{
                      __html: truncate(author.bio, 100),
                    }}
                  />
                </div>

                {/* Button Section */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    href={`/authors/${author.id}`}
                    className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3.5 text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] group/btn"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    <span>پروفایل کتل</span>
                    <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// Memoized Image component with error handling - shows full image
const AuthorImage = React.memo(function AuthorImage({
  src,
  alt,
}: {
  src: string | null | undefined;
  alt: string;
}) {
  const errorRef = React.useRef(false);

  const imageUrl = React.useMemo(() => {
    if (errorRef.current) return "/placeholder-author.jpg";
    return getSimpleImageUrl(src, "/placeholder-author.jpg");
  }, [src]);

  return (
    <Image
      key={imageUrl}
      src={imageUrl}
      alt={alt}
      fill
      sizes="160px"
      className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
      onError={(e) => {
        if (!errorRef.current) {
          errorRef.current = true;
          const target = e.currentTarget as HTMLImageElement;
          target.src = "/placeholder-author.jpg";
        }
      }}
    />
  );
});
