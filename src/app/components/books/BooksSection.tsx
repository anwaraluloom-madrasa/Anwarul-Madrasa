"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getImageUrl } from "../../../lib/utils";
import { BooksApi } from "../../../lib/api";
import { Book } from "../../../lib/types";
import PaginationControls from "@/components/PaginationControls";
import { BookOpen, Calendar, UserRound, ChevronLeft } from "lucide-react";
import { cleanText } from "../../../lib/textUtils";
import ErrorDisplay from "@/components/ErrorDisplay";
import { ComingSoonEmptyState } from "@/components/EmptyState";
import BookCardSkeleton from "./BookCardSkeleton";

interface BooksSectionProps {
  showAll?: boolean; // Show all books or only limited
  showHero?: boolean; // Only display hero on specific page
}

export default function BooksSection({ showAll = false, showHero = false }: BooksSectionProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const PAGE_SIZE = 8;

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await BooksApi.getAll(showAll ? {} : { page, limit: PAGE_SIZE });
        const booksData = (response as any)?.data?.data || (response as any)?.data || [];
        setBooks(Array.isArray(booksData) ? booksData : []);

        const pagination = (response as any)?.pagination;
        if (pagination && typeof pagination.totalPages === 'number') {
          setTotalPages(pagination.totalPages);
        } else if (!showAll) {
          // Fallback: infer if we likely have more pages
          setTotalPages(booksData.length < PAGE_SIZE && page === 1 ? 1 : (booksData.length === PAGE_SIZE ? page + 1 : page));
        } else {
          setTotalPages(null);
        }
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [page, showAll]);

  const sortedBooks = books.filter((book) => book.is_published === 1);
  const displayBooks = sortedBooks; // Books are already paginated from API
  const hasNextPage = !showAll && (typeof totalPages === 'number' ? (page < totalPages) : (displayBooks.length === PAGE_SIZE));
  const hasPrevPage = !showAll && page > 1;

  const getAuthorName = (book: Book) => {
    if (!book.author) return "Unknown Author";
    const parts = [book.author.first_name, book.author.last_name].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : "Unknown Author";
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <BookCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (displayBooks.length === 0) {
    return (
      <ComingSoonEmptyState
        title="No Books Available"
        description="We're working on adding more books to our collection."
        className="max-w-2xl mx-auto"
      />
    );
  }

  return (
    <div className="w-full">
      {/* Books Grid with proper margins */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayBooks.map((book) => {
          const coverImage = getImageUrl(book.image) || "";
          const authorName = getAuthorName(book);

          return (
            <Link
              key={book.id}
              href={`/book/${book.id}`}
              className="group relative flex h-full flex-col bg-[#e0f2f2] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-[#d0e8e8]"
              dir="rtl"
            >
              {/* Top Section - Full Size Book Image */}
              <div className="relative h-48 bg-[#e0f2f2] flex-shrink-0 overflow-hidden">
                {coverImage ? (
                  <Image
                    src={coverImage}
                    alt={book.title}
                    fill
                    sizes="(min-width: 1280px) 300px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-[#b8d8d8] flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-[#4a8a8a]" />
                  </div>
                )}
              </div>

              {/* Bottom Section - White Background with Crescent Pattern */}
              <div className="relative h-44 flex-1 bg-white p-6 flex flex-col justify-between">
                {/* Crescent Moon Pattern Background */}
                <div 
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 5c-8 0-15 3-20 8-5 5-8 12-8 20 0 8 3 15 8 20 5 5 12 8 20 8s15-3 20-8c5-5 8-12 8-20 0-8-3-15-8-20-5-5-12-8-20-8zm0 5c6 0 11 2 15 6 4 4 6 9 6 15 0 6-2 11-6 15-4 4-9 6-15 6s-11-2-15-6c-4-4-6-9-6-15 0-6 2-11 6-15 4-4 9-6 15-6z' fill='%234a8a8a'/%3E%3C/svg%3E")`,
                    backgroundSize: '50px 50px',
                    backgroundPosition: '0 0'
                  }}
                ></div>

                {/* Content */}
                <div className="relative z-10 space-y-3">
                  {/* Title - Large and Bold */}
                  <h3 className="text-xl md:text-2xl font-bold text-[#4a8a8a] leading-tight line-clamp-2" style={{ fontFamily: 'Amiri, serif' }}>
                    {cleanText(book.title)}
                  </h3>

                  {/* Author/Subtitle */}
                  {/* {authorName && (
                    <p className="text-sm text-[#4a8a8a] font-medium" style={{ fontFamily: 'Amiri, serif' }}>
                      {authorName}
                    </p>
                  )} */}

                  {/* Description */}
                  {book.description && (
                    <p className="text-sm text-[#4a8a8a] leading-relaxed line-clamp-2" style={{ fontFamily: 'Amiri, serif' }}>
                      {cleanText(book.description)}
                    </p>
                  )}

                  {/* Book Metadata - Small Text */}
                  <div className="flex items-center gap-4 text-xs text-[#4a8a8a] pt-2">
                    {book.pages && (
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{book.pages} پاڼې</span>
                      </div>
                    )}
                    {book.written_year && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{book.written_year}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Separator */}
                <div className="relative z-10 my-4 border-t border-gray-200"></div>

                {/* Footer with Navigation */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs text-[#4a8a8a] font-medium" style={{ fontFamily: 'Amiri, serif' }}>
                    د کتاب کتل
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#e0f2f2] flex items-center justify-center group-hover:bg-[#d0e8e8] transition-colors">
                    <ChevronLeft className="w-4 h-4 text-[#4a8a8a]" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {/* Pagination */}
      {!showAll && displayBooks.length > 0 && (hasNextPage || hasPrevPage || (typeof totalPages === 'number' && totalPages > 1)) && (
        <PaginationControls
          className="mt-10"
          page={page}
          totalPages={typeof totalPages === 'number' ? totalPages : null}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onPageChange={(p) => setPage(p)}
          isBusy={loading}
        />
      )}
    </div>
  );
}
