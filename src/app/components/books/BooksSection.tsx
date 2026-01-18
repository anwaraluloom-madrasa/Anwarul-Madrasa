"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { getImageUrl } from "../../../lib/utils";
import { BooksApi } from "../../../lib/api";
import { Book } from "../../../lib/types";
import PaginationControls from "@/components/PaginationControls";
import { BookOpen, Calendar, ChevronLeft } from "lucide-react";
import { cleanText } from "../../../lib/textUtils";
import { ComingSoonEmptyState } from "@/components/EmptyState";
import BookCardSkeleton from "./BookCardSkeleton";
import { motion } from "framer-motion";

interface BooksSectionProps {
  showAll?: boolean; // Show all books or only limited
  showHero?: boolean; // Only display hero on specific page
}

type BelongsToMadrasaFilter = "all" | 0 | 1;

export default function BooksSection({ showAll = false }: BooksSectionProps) {
  const [books, setBooks] = useState<(Book & { belongs_to_madrasa?: number })[]>([]);
  const [allBooks, setAllBooks] = useState<(Book & { belongs_to_madrasa?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [belongsToMadrasaFilter, setBelongsToMadrasaFilter] = useState<BelongsToMadrasaFilter>("all");
  const PAGE_SIZE = 8;

  // Fetch books from API - always fetch all for accurate filtering and counts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Fetch all books (up to 1000) for accurate filtering and counts
        const response = await BooksApi.getAll({ limit: 1000 });
        const booksData =
          (response as any)?.data?.data || (response as any)?.data || [];
        const fetchedBooks = Array.isArray(booksData) ? booksData : [];
        
        setAllBooks(fetchedBooks);
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setBooks([]);
        setAllBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [showAll]);

  // Filter books by belongs_to_madrasa and update pagination
  useEffect(() => {
    const publishedBooks = allBooks.filter((book) => Number(book.is_published) === 1);
    
    let filtered: typeof allBooks;
    if (belongsToMadrasaFilter === "all") {
      filtered = publishedBooks;
    } else {
      filtered = publishedBooks.filter((book) => {
        const belongsToMadrasa = (book as any).belongs_to_madrasa ?? 0;
        return Number(belongsToMadrasa) === belongsToMadrasaFilter;
      });
    }
    
    setBooks(filtered);
    
    // Update total pages based on filtered results
    if (showAll) {
      setTotalPages(null);
    } else {
      setTotalPages(Math.ceil(filtered.length / PAGE_SIZE) || 1);
    }
  }, [belongsToMadrasaFilter, allBooks, showAll]);

  // Count books for each filter - calculate from allBooks
  const bookCounts = useMemo(() => {
    const publishedBooks = allBooks.filter((book) => Number(book.is_published) === 1);
    return {
      all: publishedBooks.length,
      madrasa: publishedBooks.filter((book) => Number((book as Book & { belongs_to_madrasa?: number }).belongs_to_madrasa ?? 0) === 1).length,
      other: publishedBooks.filter((book) => Number((book as Book & { belongs_to_madrasa?: number }).belongs_to_madrasa ?? 0) === 0).length,
    };
  }, [allBooks]);

  // Books are already filtered by belongs_to_madrasa and published status
  // Slice for pagination (only if not showAll)
  const displayBooks = showAll 
    ? books 
    : books.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  
  const hasNextPage =
    !showAll &&
    (typeof totalPages === "number"
      ? page < totalPages
      : books.length > page * PAGE_SIZE);
  const hasPrevPage = !showAll && page > 1;

  // Reset to page 1 when filter changes
  useEffect(() => {
    if (!showAll) {
      setPage(1);
    }
  }, [belongsToMadrasaFilter, showAll]);

  // Get filter-specific empty state message
  const getEmptyStateMessage = () => {
    if (belongsToMadrasaFilter === 1) {
      return {
        title: "د مدرسې کتابونه نشته",
        description: "اوسمهال د مدرسې کتابونه موجود نه دي. مهرباني وکړئ وروسته بیا وګورئ.",
      };
    } else if (belongsToMadrasaFilter === 0) {
      return {
        title: "نور کتابونه نشته",
        description: "اوسمهال نور کتابونه موجود نه دي. مهرباني وکړئ وروسته بیا وګورئ.",
      };
    }
    return {
      title: "کتابونه نشته",
      description: "اوسمهال کتابونه موجود نه دي. مهرباني وکړئ وروسته بیا وګورئ.",
    };
  };

  if (loading) {
    return (
      <div className="w-full">
        {/* Filter Buttons Skeleton */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <div className="px-6 py-3 rounded-xl bg-gray-200 animate-pulse h-12 w-32"></div>
            <div className="px-6 py-3 rounded-xl bg-gray-200 animate-pulse h-12 w-40"></div>
            <div className="px-6 py-3 rounded-xl bg-gray-200 animate-pulse h-12 w-36"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Filter Buttons - Always visible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          <button
            onClick={() => setBelongsToMadrasaFilter("all")}
            className={`px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 ${
              belongsToMadrasaFilter === "all"
                ? "bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50"
            }`}
            style={{ fontFamily: "Amiri, serif" }}
          >
            ټول کتابونه ({bookCounts.all})
          </button>
          <button
            onClick={() => setBelongsToMadrasaFilter(1)}
            className={`px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 ${
              belongsToMadrasaFilter === 1
                ? "bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50"
            }`}
            style={{ fontFamily: "Amiri, serif" }}
          >
            د مدرسې کتابونه ({bookCounts.madrasa})
          </button>
          <button
            onClick={() => setBelongsToMadrasaFilter(0)}
            className={`px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 ${
              belongsToMadrasaFilter === 0
                ? "bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50"
            }`}
            style={{ fontFamily: "Amiri, serif" }}
          >
            نور کتابونه ({bookCounts.other})
          </button>
        </div>
      </motion.div>

      {/* Empty State or Books Grid */}
      {displayBooks.length === 0 ? (
        <ComingSoonEmptyState
          title={getEmptyStateMessage().title}
          description={getEmptyStateMessage().description}
          className="max-w-2xl mx-auto"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {displayBooks.map((book) => {
          const coverImage = getImageUrl(book.image) || "";

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
                    backgroundSize: "50px 50px",
                    backgroundPosition: "0 0",
                  }}
                ></div>

                {/* Content */}
                <div className="relative z-10 space-y-3">
                  {/* Title - Large and Bold */}
                  <h3
                    className="text-xl md:text-2xl font-bold text-[#4a8a8a] leading-tight line-clamp-2"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
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
                    <p
                      className="text-sm text-[#4a8a8a] leading-relaxed line-clamp-2"
                      style={{ fontFamily: "Amiri, serif" }}
                    >
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
                  <span
                    className="text-xs text-[#4a8a8a] font-medium"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
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
          {!showAll &&
            displayBooks.length > 0 &&
            (hasNextPage ||
              hasPrevPage ||
              (typeof totalPages === "number" && totalPages > 1)) && (
              <PaginationControls
                className="mt-10"
                page={page}
                totalPages={typeof totalPages === "number" ? totalPages : null}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                onPageChange={(p) => setPage(p)}
                isBusy={loading}
              />
            )}
        </>
      )}
    </div>
  );
}
