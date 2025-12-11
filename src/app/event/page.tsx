'use client';

import { useMemo } from "react";

import EventsSection from "./../components/event/eventCard";
import IslamicHeader from "../components/IslamicHeader";
import EventCardSkeleton from "../components/event/EventCardSkeleton";
import Breadcrumb from "@/components/Breadcrumb";

import PaginationControls from "@/components/PaginationControls";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { EventsApi } from "@/lib/api";
import type { Event } from "@/lib/types";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function EventsPage() {
  const {
    items,
    isLoadingInitial,
    isFetchingMore,
    error,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    reload,
    page,
    totalPages,
  } = usePaginatedResource<Event>((params) => EventsApi.getAll(params), {
    pageSize: 12,
  });

  const events = useMemo(() => {
    const deduped = new Map<number, Event>();
    items.forEach((event) => {
      if (event && typeof event.id === "number") {
        deduped.set(event.id, event);
      }
    });
    return Array.from(deduped.values());
  }, [items]);

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white" dir="rtl">
      <IslamicHeader pageType="events" title="علمی مجالس " />
      <div className="pb-16" dir="rtl">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="mt-4 sm:mt-8 md:mt-12">
            <Breadcrumb />
          </div>
        </div>
        {isLoadingInitial ? (
          <section className="w-full px-2 sm:px-4 md:px-6 lg:px-8 md:pt-10 max-w-7xl mx-auto">
            <div className="space-y-12">
              {Array.from({ length: 6 }).map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </div>
          </section>
        ) : error ? (
          <ErrorDisplay 
            error={error} 
            variant="full" 
            onRetry={() => void reload()}
          />
        ) : (
          <EventsSection events={events} showAll={true} />
        )}

        {!isLoadingInitial && !error && events.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <PaginationControls
              className="mt-12"
              page={page}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPreviousPage}
              onPageChange={(target) => void goToPage(target)}
              isBusy={isFetchingMore}
            />
          </div>
        )}
      </div>
    </main>
  );
}
