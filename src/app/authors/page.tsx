"use client";

import Image from "next/image";
import Link from "next/link";
import truncate from "html-truncate";
import IslamicHeader from "../components/IslamicHeader";
import UnifiedLoader from "@/components/loading/UnifiedLoader";
import ErrorDisplay from "@/components/ErrorDisplay";
import { ComingSoonEmptyState } from "@/components/EmptyState";
import AuthorCardSkeleton from "../components/authors/AuthorCardSkeleton";

import { AuthorsApi } from "../../lib/api";
import { Author } from "../../lib/types";
import { getImageUrl } from "@/lib/utils";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";

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
        <div className="max-w-7xl mx-auto px-6 space-y-12 pb-16">
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
        <div className="max-w-7xl mx-auto px-6 py-16">
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
    <main className="min-h-screen bg-background-primary">
      <IslamicHeader pageType="authors" />
      <div className="max-w-7xl mx-auto px-6 space-y-12 pb-16">
        {authors.filter(isPublishedAndAlive).length === 0 ? (
          <ComingSoonEmptyState
            title="No authors found"
            description="Please check back soon for new profiles."
            className="max-w-2xl mx-auto"
          />
        ) : (
          <div className="grid gap-20 mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {authors
              .filter(isPublishedAndAlive)
              .map((author) => (
                <article
                  key={author.id}
                  className="group relative rounded-3xl border border-primary-100/60 bg-white/90 p-8 shadow-soft transition-all duration-150 hover:-translate-y-1 hover:shadow-medium"
                >
                  <div className="flex justify-center -mt-16 mb-6">
                    <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg ring-4 ring-primary-200 transition group-hover:ring-primary-300">
                      <Image
                        src={getImageUrl(author.image, "/placeholder-author.jpg") || "/placeholder-author.jpg"}
                        alt={`${author.first_name || "Unknown"} ${author.last_name || ""}`}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      {/* Live indicator dot */}
                      <div
                        className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white 
                          ${author.is_alive ? "bg-green-500 animate-pulse" : "bg-red-500"}
                        `}
                      ></div>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    
                    <h2 className="text-xl font-semibold text-primary-900">
                      {author.first_name || "Unknown"} {author.last_name || ""}
                    </h2>
                    <div
                      className="text-primary-600 text-sm [&_*]:text-[14px]"
                      dangerouslySetInnerHTML={{ __html: truncate(author.bio, 80) }}
                    />
                  </div>

                  <div className="mt-6 flex justify-center gap-3">
                    <Link
                      href={`/authors/${author.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-5 py-2 text-sm font-semibold text-primary-700 transition-colors duration-200 hover:bg-primary-100"
                    >
                      پروفایل کتل
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
