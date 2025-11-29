"use client";

import { memo, useMemo } from "react";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface PaginationControlsProps {
  page: number;
  totalPages: number | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  isBusy?: boolean;
  className?: string;
}

function clampPage(value: number, total: number) {
  if (!Number.isFinite(value)) return 1;
  if (total <= 0) return Math.max(1, Math.floor(value));
  return Math.min(Math.max(1, Math.floor(value)), total);
}

const PaginationControls = memo(function PaginationControls({
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  isBusy = false,
  className = "",
}: PaginationControlsProps) {
  const { t: tRaw, i18n } = useTranslation("common", { useSuspense: false });
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === "string" ? result : key;
  };
  // Always RTL since website only has RTL languages
  const isRTL = true;
  const safeTotal = useMemo(() => {
    if (typeof totalPages === "number" && totalPages > 0) {
      return Math.floor(totalPages);
    }
    return hasNextPage ? page + 1 : page;
  }, [page, totalPages, hasNextPage]);

  const pages = useMemo(() => {
    const maxButtons = 5;
    const current = clampPage(page, safeTotal);
    const half = Math.floor(maxButtons / 2);

    let start = Math.max(1, current - half);
    const end = Math.min(safeTotal, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    const items: number[] = [];
    for (let i = start; i <= end; i += 1) {
      items.push(i);
    }
    return items;
  }, [page, safeTotal]);

  const handlePageChange = (target: number) => {
    if (isBusy) return;
    const next = clampPage(target, safeTotal);
    if (next === page) return;
    onPageChange(next);
  };

  return (
    <nav
      className={`flex flex-col items-center justify-center gap-6 ${className}`.trim()}
      aria-label="Pagination"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Main Pagination Controls */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* First Page Button */}
        {page > 2 && (
          <button
            type="button"
            onClick={() => handlePageChange(1)}
            disabled={isBusy}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border-2 border-emerald-200 bg-white text-emerald-700 transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 shadow-sm hover:shadow-md"
            aria-label="First page"
          >
            {isRTL ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        )}

        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageChange(page - 1)}
          disabled={!hasPrevPage || isBusy}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-200 bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 shadow-sm hover:shadow-md"
          aria-label={t('pagination.previous')}
        >
          {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          <span className="hidden sm:inline">{t('pagination.previous')}</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1.5">
        {pages[0] > 1 && (
            <>
          <button
            type="button"
            onClick={() => handlePageChange(1)}
            disabled={isBusy}
                className="w-10 h-10 rounded-xl border-2 border-emerald-200 bg-white text-sm font-bold text-emerald-700 transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md"
          >
            1
          </button>
              {pages[0] > 2 && (
                <span className="px-2 text-emerald-400 font-bold">…</span>
              )}
            </>
        )}
          
        {pages.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handlePageChange(item)}
            disabled={isBusy}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
              item === page
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg scale-105 border-2 border-emerald-500"
                  : "border-2 border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105 shadow-sm hover:shadow-md"
              }`}
          >
            {item}
          </button>
        ))}
          
          {pages[pages.length - 1] < safeTotal && (
            <>
        {pages[pages.length - 1] < safeTotal - 1 && (
                <span className="px-2 text-emerald-400 font-bold">…</span>
        )}
              <button
                type="button"
                onClick={() => handlePageChange(safeTotal)}
                disabled={isBusy}
                className="w-10 h-10 rounded-xl border-2 border-emerald-200 bg-white text-sm font-bold text-emerald-700 transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md"
              >
                {safeTotal}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNextPage || isBusy}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-200 bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 shadow-sm hover:shadow-md"
          aria-label={t('pagination.next')}
        >
          <span className="hidden sm:inline">{t('pagination.next')}</span>
          {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* Last Page Button */}
        {page < safeTotal - 1 && (
          <button
            type="button"
            onClick={() => handlePageChange(safeTotal)}
            disabled={isBusy}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border-2 border-emerald-200 bg-white text-emerald-700 transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 shadow-sm hover:shadow-md"
            aria-label="Last page"
          >
            {isRTL ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Page Info */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200/50">
        <span className="text-sm font-semibold text-emerald-700">
          {t('pagination.page')} <span className="font-bold">{Math.min(page, safeTotal)}</span>
          {typeof totalPages === "number" && totalPages > 0 && (
            <> {t('pagination.of')} <span className="font-bold">{safeTotal}</span></>
          )}
        </span>
      </div>
    </nav>
  );
});

export default PaginationControls;
