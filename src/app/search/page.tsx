'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch, FaBook, FaUser, FaCalendarAlt, FaFileAlt, FaGraduationCap, FaGavel, FaNewspaper, FaStar, FaHeart } from 'react-icons/fa';
import { getImageUrl } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import UnifiedLoader from '@/components/loading/UnifiedLoader';
import ErrorDisplay from '@/components/ErrorDisplay';
import Breadcrumb from '@/components/Breadcrumb';

interface SearchResult {
  type: 'blog' | 'course' | 'author' | 'book' | 'event' | 'fatwa' | 'article' | 'awlyaa' | 'tasawwuf';
  id: number | string;
  title: string;
  description?: string;
  slug?: string;
  url: string;
  image?: string;
  date?: string;
  author?: string;
  score?: number;
}

interface SearchResponse {
  success: boolean;
  query: string;
  results: SearchResult[];
  total: number;
  types: {
    article: number;
    blog: number;
    course: number;
    author: number;
    book: number;
    event: number;
    fatwa: number;
    awlyaa: number;
    tasawwuf: number;
  };
  error?: string;
}

const typeIcons = {
  article: FaNewspaper,
  blog: FaFileAlt,
  course: FaGraduationCap,
  author: FaUser,
  book: FaBook,
  event: FaCalendarAlt,
  fatwa: FaGavel,
  awlyaa: FaStar,
  tasawwuf: FaHeart,
};

const typeLabels: Record<string, string> = {
  article: 'مقالې',
  blog: 'د علم څرک',
  course: 'کورسونه',
  author: 'لیکوالان',
  book: 'کتابونه',
  event: 'علمی مجالس',
  fatwa: 'افتاء',
  awlyaa: 'اولیا',
  tasawwuf: 'تصوف',
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams?.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchStats, setSearchStats] = useState<SearchResponse['types'] | null>(null);
  const [resultsQuery, setResultsQuery] = useState<string>(''); // Track which query the results belong to
  const currentSearchRef = useRef<string>(''); // Ref to track current search to prevent race conditions
  const { t, i18n } = useTranslation('common', { useSuspense: false });
  const isRTL = true; // Always RTL since website only has RTL languages

  const performSearch = useCallback(async (searchTerm: string) => {
    const trimmedTerm = searchTerm.trim();
    
    if (!trimmedTerm) {
      setResults([]);
      setSearchStats(null);
      setError(null);
      setResultsQuery('');
      currentSearchRef.current = '';
      return;
    }

    // Clear old results immediately when starting a new search
    setResults([]);
    setSearchStats(null);
    setError(null);
    setResultsQuery(''); // Clear the query tracker
    currentSearchRef.current = trimmedTerm; // Set current search in ref
    setLoading(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedTerm)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: SearchResponse = await response.json();

      // Only update results if this response is for the current search (prevent race conditions)
      if (currentSearchRef.current !== trimmedTerm) {
        console.log('Ignoring stale search results for:', trimmedTerm, 'Current search:', currentSearchRef.current);
        return;
      }

      // Verify the API response query matches our search term (normalize both for comparison)
      const responseQuery = data.query?.trim().toLowerCase() || '';
      const searchQueryNormalized = trimmedTerm.toLowerCase();
      
      if (responseQuery && responseQuery !== searchQueryNormalized) {
        console.warn('API response query mismatch. Expected:', searchQueryNormalized, 'Got:', responseQuery);
        // Still proceed if ref matches, but log the warning
      }

      if (data.success) {
        // Only update if this is still the current search (ref check prevents race conditions)
        if (currentSearchRef.current === trimmedTerm) {
          setResultsQuery(trimmedTerm);
          setResults(data.results || []);
          setSearchStats(data.types || null);
        } else {
          console.log('Ignoring stale results. Current search:', currentSearchRef.current, 'Response for:', trimmedTerm);
        }
      } else {
        // Only set error if this is still the current search
        if (currentSearchRef.current === trimmedTerm) {
          setError(data.error || 'د پلټنې پرمهال ستونزې رامنځته شوې');
          setResults([]);
          setSearchStats(null);
          setResultsQuery('');
        }
      }
    } catch (err) {
      // Only set error if this is still the current search
      if (currentSearchRef.current === trimmedTerm) {
        const errorMessage = err instanceof Error ? err.message : 'د پلټنې پرمهال ستونزې رامنځته شوې';
        setError(errorMessage);
        setResults([]);
        setSearchStats(null);
        setResultsQuery('');
        console.error('Search error:', err);
      }
    } finally {
      // Only update loading if this is still the current search
      if (currentSearchRef.current === trimmedTerm) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // Normalize query for comparison
    const normalizedQuery = query?.trim() || '';
    
    // Clear old results immediately when query changes - do this FIRST
    setResults([]);
    setSearchStats(null);
    setError(null);
    setResultsQuery('');
    setLoading(true); // Set loading immediately to hide old results
    
    // Cancel any pending searches by clearing the ref
    currentSearchRef.current = '';
    
    if (normalizedQuery) {
      setSearchQuery(normalizedQuery);
      // Small delay to ensure state is cleared before new search
      const timeoutId = setTimeout(() => {
        performSearch(normalizedQuery);
      }, 0);
      
      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      // If no query, ensure everything is cleared
      setResults([]);
      setSearchStats(null);
      setError(null);
      setResultsQuery('');
      currentSearchRef.current = '';
      setLoading(false);
    }
  }, [query, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ps-AF', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    const Icon = typeIcons[type] || FaFileAlt;
    return <Icon className="h-4 w-4" />;
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    return typeLabels[type] || type;
  };

  // Helper function to remove HTML tags and entities
  const cleanHtml = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&[a-z]+;/gi, ' ') // Remove other HTML entities
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 pt-20 sm:pt-24 md:pt-32 pb-8 sm:pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="mt-4 sm:mt-8 md:mt-12 mb-6 sm:mb-8">
          <Breadcrumb />
        </div>
        {/* Search Header - Mobile Optimized */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-primary-100/60 p-4 sm:p-5 md:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-900 mb-4 sm:mb-5 md:mb-6 text-center">
              پلټنه
            </h1>
            
            {/* Search Form - Mobile First Design */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative flex items-stretch gap-2 sm:gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="پلټنه..."
                  className="flex-1 h-11 sm:h-12 md:h-14 px-3 sm:px-4 md:px-6 pr-10 sm:pr-12 md:pr-14 rounded-lg sm:rounded-xl border-2 border-primary-200 bg-primary-50/80 text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-sm sm:text-base md:text-lg text-right"
                  dir="rtl"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 sm:h-12 md:h-14 px-3 sm:px-4 md:px-6 flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold hover:from-primary-700 hover:to-primary-800 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  aria-label="پلټنه"
                >
                  <FaSearch className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline text-xs sm:text-sm md:text-base">پلټنه</span>
                </button>
              </div>
            </form>

            {/* Search Stats - Mobile Optimized */}
            {searchStats && query && resultsQuery === query && (
              <div className="mt-4 sm:mt-5 md:mt-6">
                <div className="bg-primary-50/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4">
                    <span className="text-sm sm:text-base font-bold text-primary-700">
                      {results.length} پایلې موندل شوې
                    </span>
                    <div className="hidden sm:block w-px h-4 bg-primary-300"></div>
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-primary-600">
                      {Object.entries(searchStats).map(([type, count]) => {
                        if (count > 0) {
                          return (
                            <span key={type} className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md shadow-sm">
                              {getTypeIcon(type as SearchResult['type'])}
                              <span className="font-medium">{getTypeLabel(type as SearchResult['type'])}: {count}</span>
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <UnifiedLoader />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mb-4 sm:mb-6 md:mb-8">
            <ErrorDisplay error={error} />
          </div>
        )}

        {/* No Results */}
        {!loading && !error && query && results.length === 0 && resultsQuery === query && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-primary-100/60 p-8 sm:p-10 md:p-12 text-center">
            <FaSearch className="h-12 w-12 sm:h-16 sm:w-16 text-primary-300 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-primary-900 mb-2">
              پایلې ونه موندل شوې
            </h2>
            <p className="text-sm sm:text-base text-primary-600 px-2">
              د "{query}" لپاره هیڅ پایلې ونه موندل شوې. مهرباني وکړئ بله پلټنه وکړئ.
            </p>
          </div>
        )}

        {/* Search Results - Mobile Optimized */}
        {!loading && !error && results.length > 0 && resultsQuery === query && (
          <div key={`results-${query}-${resultsQuery}`} className="space-y-4 sm:space-y-6 md:space-y-8">
            {Object.entries(groupedResults).map(([type, typeResults]) => (
              <div key={type} className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-primary-100/60 overflow-hidden">
                {/* Section Header - Mobile Optimized */}
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-primary-200">
                  <div className="flex items-center gap-2 sm:gap-3 flex-row-reverse">
                    <div className="text-primary-600">
                      {getTypeIcon(type as SearchResult['type'])}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-primary-900">
                      {getTypeLabel(type as SearchResult['type'])}
                      <span className="mr-1.5 sm:mr-2 text-xs sm:text-sm font-normal text-primary-600">
                        ({typeResults.length})
                      </span>
                    </h2>
                  </div>
                </div>

                {/* Results List - Mobile Optimized */}
                <div className="divide-y divide-primary-100">
                  {typeResults.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      href={result.url}
                      className="block p-3 sm:p-4 md:p-6 hover:bg-primary-50/50 active:bg-primary-100 transition-colors duration-200 text-right"
                    >
                      <div className={`flex gap-3 sm:gap-4 ${result.image ? 'flex-row-reverse' : ''}`}>
                        {/* Image - Only show if image exists */}
                        {result.image && (
                          <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-lg overflow-hidden shadow-sm">
                            <Image
                              src={getImageUrl(result.image)}
                              alt={result.title}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Content - Mobile Optimized */}
                        <div className={`flex-1 min-w-0 ${result.image ? '' : 'text-right'}`}>
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary-900 mb-1.5 sm:mb-2 line-clamp-2 leading-tight">
                            {cleanHtml(result.title)}
                          </h3>
                          
                          {result.description && (
                            <p className="text-primary-600 text-xs sm:text-sm md:text-base mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
                              {cleanHtml(result.description).substring(0, 120)}
                              {cleanHtml(result.description).length > 120 ? '...' : ''}
                            </p>
                          )}

                          {/* Metadata - Mobile Optimized */}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs text-primary-500 flex-row-reverse">
                            {result.author && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-primary-50 rounded-md">
                                <FaUser className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate max-w-[100px] sm:max-w-none">{cleanHtml(result.author)}</span>
                              </span>
                            )}
                            {result.date && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-primary-50 rounded-md">
                                <FaCalendarAlt className="h-3 w-3 flex-shrink-0" />
                                <span className="whitespace-nowrap">{formatDate(result.date)}</span>
                              </span>
                            )}
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-primary-50 rounded-md">
                              {getTypeIcon(result.type)}
                              <span className="whitespace-nowrap">{getTypeLabel(result.type)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State (No Query) - Mobile Optimized */}
        {!query && !loading && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-primary-100/60 p-8 sm:p-10 md:p-12 text-center">
            <FaSearch className="h-12 w-12 sm:h-16 sm:w-16 text-primary-300 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-primary-900 mb-2">
              پلټنه پیل کړئ
            </h2>
            <p className="text-sm sm:text-base text-primary-600 px-2">
              د پلټنې لپاره د پورته فورم ډک کړئ
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

