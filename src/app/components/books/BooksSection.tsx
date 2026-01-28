"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { getImageUrl } from "../../../lib/utils";
import { BooksApi } from "../../../lib/api";
import { Book } from "../../../lib/types";

interface BookCategory {
  id: number;
  name: string;
  slug?: string;
}
import PaginationControls from "@/components/PaginationControls";
import { BookOpen, Calendar, ChevronLeft, ChevronDown } from "lucide-react";
import { cleanText } from "../../../lib/textUtils";
import { ComingSoonEmptyState } from "@/components/EmptyState";
import BookCardSkeleton from "./BookCardSkeleton";
import { motion } from "framer-motion";

interface BooksSectionProps {
  showAll?: boolean; // Show all books or only limited
  showHero?: boolean; // Only display hero on specific page
  limit?: number; // Limit number of books to show when showAll is false
}

type BelongsToMadrasaFilter = "all" | 0 | 1;

export default function BooksSection({ showAll = false, limit = 6 }: BooksSectionProps) {
  const [books, setBooks] = useState<(Book & { belongs_to_madrasa?: number })[]>([]);
  const [allBooks, setAllBooks] = useState<(Book & { belongs_to_madrasa?: number })[]>([]);
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [belongsToMadrasaFilter, setBelongsToMadrasaFilter] = useState<BelongsToMadrasaFilter>("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const PAGE_SIZE = 8;

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await BooksApi.getCategories();
        if (result.success && Array.isArray(result.data)) {
          setCategories(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch book categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch books from API - always fetch all for accurate filtering and counts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Fetch all books (up to 1000) for accurate filtering and counts
        const response = await BooksApi.getAll({ limit: 1000 });
        const responseData = response as { data?: Book[] | { data?: Book[] } };
        const booksData = Array.isArray(responseData?.data) 
          ? responseData.data 
          : Array.isArray(responseData?.data?.data) 
            ? responseData.data.data 
            : [];
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

  // Filter books by belongs_to_madrasa, category, and update pagination
  useEffect(() => {
    const publishedBooks = allBooks.filter((book) => Number(book.is_published) === 1);
    
    let filtered: typeof allBooks;
    
    // First filter by belongs_to_madrasa
    if (belongsToMadrasaFilter === "all") {
      filtered = publishedBooks;
    } else {
      filtered = publishedBooks.filter((book) => {
        const bookWithMadrasa = book as Book & { belongs_to_madrasa?: number };
        const belongsToMadrasa = bookWithMadrasa.belongs_to_madrasa ?? 0;
        return Number(belongsToMadrasa) === belongsToMadrasaFilter;
      });
    }
    
    // Then filter by category if selected
    if (selectedCategoryId !== null) {
      filtered = filtered.filter((book) => {
        return book.book_category_id === selectedCategoryId;
      });
    }
    
    setBooks(filtered);
    
    // Update total pages based on filtered results
    if (showAll) {
      setTotalPages(null);
    } else {
      setTotalPages(Math.ceil(filtered.length / PAGE_SIZE) || 1);
    }
  }, [belongsToMadrasaFilter, selectedCategoryId, allBooks, showAll]);

  // Count books for each filter - calculate from allBooks
  const bookCounts = useMemo(() => {
    const publishedBooks = allBooks.filter((book) => Number(book.is_published) === 1);
    
    // Base counts by belongs_to_madrasa
    const baseCounts = {
      all: publishedBooks.length,
      madrasa: publishedBooks.filter((book) => Number((book as Book & { belongs_to_madrasa?: number }).belongs_to_madrasa ?? 0) === 1).length,
      other: publishedBooks.filter((book) => Number((book as Book & { belongs_to_madrasa?: number }).belongs_to_madrasa ?? 0) === 0).length,
    };
    
    // Category counts
    const categoryCounts: Record<number, number> = {};
    categories.forEach((category) => {
      categoryCounts[category.id] = publishedBooks.filter(
        (book) => book.book_category_id === category.id
      ).length;
    });
    
    return { ...baseCounts, categories: categoryCounts };
  }, [allBooks, categories]);

  // Books are already filtered by belongs_to_madrasa and published status
  // Slice for pagination (only if not showAll) or limit
  const displayBooks = showAll 
    ? books 
    : limit 
      ? books.slice(0, limit) // Use limit prop when provided
      : books.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE); // Otherwise use pagination
  
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
  }, [belongsToMadrasaFilter, selectedCategoryId, showAll]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isCategoryDropdownOpen && !target.closest('.category-dropdown-container')) {
        setIsCategoryDropdownOpen(false);
      }
    };

    if (isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isCategoryDropdownOpen]);

  // Get filter-specific empty state message
  const getEmptyStateMessage = () => {
    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
    
    if (selectedCategoryId !== null && selectedCategory) {
      return {
        title: `د ${selectedCategory.name} کټګورۍ کتابونه نشته`,
        description: `اوسمهال د ${selectedCategory.name} کټګورۍ کتابونه موجود نه دي. مهرباني وکړئ وروسته بیا وګورئ.`,
      };
    }
    
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
        {/* Belongs to Madrasa Filters and Category Dropdown */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
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

          {/* Category Dropdown */}
          {categories.length > 0 && (
            <div className="relative category-dropdown-container">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 flex items-center gap-2 ${
                  selectedCategoryId !== null
                    ? "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
                style={{ fontFamily: "Amiri, serif" }}
              >
                <span>
                  {selectedCategoryId !== null
                    ? categories.find((c) => c.id === selectedCategoryId)?.name || "کټګورۍ"
                    : "کټګورۍ"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isCategoryDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border-2 border-gray-200 z-50 max-h-80 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedCategoryId(null);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`w-full text-right px-4 py-3 font-semibold text-sm transition-colors duration-200 ${
                      selectedCategoryId === null
                        ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    ټولې کټګورۍ
                  </button>
                  {categories.map((category) => {
                    const count = bookCounts.categories?.[category.id] || 0;
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-right px-4 py-3 font-semibold text-sm transition-colors duration-200 border-t border-gray-100 ${
                          selectedCategoryId === category.id
                            ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          <span className="text-xs text-gray-500">({count})</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
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
          {/* Pagination - Only show if not using limit prop */}
          {!showAll &&
            !limit &&
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
