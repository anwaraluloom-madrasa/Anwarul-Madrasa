"use client";
import Link from "next/link";

import Image from "next/image";
import { Calendar, MapPin, Clock, Users, ArrowLeft } from "lucide-react";
import { getSimpleImageUrl } from "../../../lib/utils";
import { motion } from "framer-motion";
import { Event } from "../../../lib/types";
import { useTranslation } from "@/hooks/useTranslation";
import { getLanguageDirection } from "@/lib/i18n";
import React from "react";

interface EventsSectionProps {
  events: Event[];
  showAll?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
}

const fallbackEventImage = "/placeholder-event.jpg";

// Memoized Image component with error handling
const EventImage = React.memo(function EventImage({ 
  src, 
  alt,
  className 
}: { 
  src: string | null | undefined; 
  alt: string;
  className?: string;
}) {
  const errorRef = React.useRef(false);
  
  const imageUrl = React.useMemo(() => {
    if (errorRef.current) return fallbackEventImage;
    return getSimpleImageUrl(src, fallbackEventImage);
  }, [src]);
  
  return (
    <Image
      key={imageUrl}
      src={imageUrl}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
      className={className}
      onError={(e) => {
        if (!errorRef.current) {
          errorRef.current = true;
          const target = e.currentTarget as HTMLImageElement;
          target.src = fallbackEventImage;
        }
      }}
    />
  );
});

const stripHtml = (value?: string | null) => {
  if (!value) return "";
  
  let cleaned = value;
  
  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, " ");
  
  // Remove HTML entities including &nbsp;
  cleaned = cleaned.replace(/&nbsp;/g, " ");
  cleaned = cleaned.replace(/&amp;/g, "&");
  cleaned = cleaned.replace(/&lt;/g, "<");
  cleaned = cleaned.replace(/&gt;/g, ">");
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&#39;/g, "'");
  cleaned = cleaned.replace(/&apos;/g, "'");
  cleaned = cleaned.replace(/&mdash;/g, "—");
  cleaned = cleaned.replace(/&ndash;/g, "–");
  cleaned = cleaned.replace(/&hellip;/g, "...");
  cleaned = cleaned.replace(/&[#\w]+;/g, " "); // Remove any remaining entities
  
  // Clean up whitespace
  cleaned = cleaned.replace(/\s+/g, " ");
  cleaned = cleaned.trim();
  
  return cleaned;
};

const formatEventDate = (value?: string | null) => {
  if (!value) return "Recently updated";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently updated";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function EventsSection({
  events,
  showAll = false,
  heroTitle = "Our Events",
  heroSubtitle = "Join our community gatherings and experiences",
}: EventsSectionProps) {
  const { t: tRaw, i18n } = useTranslation('common', { useSuspense: false });
  const isRTL = getLanguageDirection(i18n?.language || 'ps') === 'rtl';
  
  // Create a string-safe wrapper function
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === 'string' ? result : key;
  };
  
  const sortedEvents =
    events
      ?.filter((event) => event.created_at)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ) || [];

  // Show only 3 events on homepage
  const displayEvents = showAll ? sortedEvents : sortedEvents.slice(0, 3);

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Events Section */}
      <section className="w-full px-4 md:px-8 md:pt-10 max-w-7xl mx-auto overflow-x-hidden" dir="rtl">
        {!showAll && (
          <div className="relative text-center mb-12">
            <motion.div
              className="inline-block relative mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: 'Amiri, serif' }}>
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 bg-clip-text text-transparent text-4xl md:text-6xl font-black">
                  {t('events.events')}
                </span>
              </h2>
              <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium" style={{ fontFamily: 'Amiri, serif' }}>
                {t('events.description')}
              </p>
            </motion.div>
          </div>
        )}

        <div className="relative overflow-x-hidden">
          <div className="absolute right-0 md:right-6 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 via-emerald-200 to-emerald-100 rounded-full hidden md:block" />

          {displayEvents.map((event, idx) => {
            const eventDate = formatEventDate(event.created_at);
            const location = stripHtml(
              event.address || event.branch_name || event.country || t('events.locationComingSoon')
            );

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.15 }}
                className="group relative mb-12 pr-0 md:pr-24"
              >
                <div className="pointer-events-none absolute right-0 md:right-6 top-5 h-5 w-5 rounded-full border-4 border-white bg-emerald-500 hidden md:block shadow-lg" />
                {idx < displayEvents.length - 1 ? (
                  <span className="pointer-events-none absolute right-0 md:right-6 top-12 bottom-[-4rem] w-1 bg-gradient-to-b from-emerald-500 via-emerald-300 to-emerald-100 hidden md:block" />
                ) : null}
                <div className="relative flex w-full max-w-full flex-col overflow-hidden bg-white rounded-3xl border-2 border-gray-200 hover:border-emerald-400 shadow-lg hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300 md:flex-row group/card hover:-translate-y-1">

                    {/* Image Section */}
                    <div className="aspect-[4/3] w-full md:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <EventImage
                        src={event.image}
                        alt={event.title || 'Event image'}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>

                      {/* Badges */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur-md px-4 py-2 text-xs font-bold text-emerald-700 shadow-xl border-2 border-emerald-200/50">
                          {t('events.communityEvent')}
                        </span>
                      </div>
                      {event.branch_name ? (
                        <div className="absolute bottom-4 left-4 z-10">
                          <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xl">
                            {stripHtml(event.branch_name)}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* Content Section */}
                    <div className="w-full min-w-0 flex flex-col gap-6 p-6 md:w-1/2 md:p-8">
                      {/* Header Section */}
                      <div className="space-y-5 flex-1 min-w-0">
                        {/* Date Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 text-xs font-bold uppercase tracking-wider text-emerald-700 w-fit shadow-md">
                          <Calendar className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          <span className="whitespace-nowrap">{eventDate}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900 tracking-tight group-hover/card:text-emerald-700 transition-colors break-words" style={{ fontFamily: 'Amiri, serif' }}>
                          {stripHtml(event.title)}
                        </h3>

                        {/* Description */}
                        <p className="text-base md:text-lg leading-relaxed text-gray-600 line-clamp-4 break-words" style={{ fontFamily: 'Amiri, serif' }}>
                          {stripHtml(event.description)}
                        </p>
                      </div>

                      {/* Event Details Grid */}
                      <div className="grid gap-3 text-sm md:grid-cols-2 border-t-2 border-gray-200 pt-6 min-w-0">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 hover:from-emerald-100 hover:to-emerald-200 border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-200 min-w-0 group/item">
                          <div className="flex-shrink-0 p-2.5 rounded-xl bg-emerald-100 shadow-md group-hover/item:scale-110 transition-transform">
                            <MapPin className="h-5 w-5 text-emerald-700" />
                          </div>
                          <span className="font-semibold text-gray-800 line-clamp-1 min-w-0 break-words" style={{ fontFamily: 'Amiri, serif' }}>{location}</span>
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 hover:from-emerald-100 hover:to-emerald-200 border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-200 min-w-0 group/item">
                          <div className="flex-shrink-0 p-2.5 rounded-xl bg-emerald-100 shadow-md group-hover/item:scale-110 transition-transform">
                            <Clock className="h-5 w-5 text-emerald-700" />
                          </div>
                          <span className="font-semibold text-gray-800 min-w-0 break-words" style={{ fontFamily: 'Amiri, serif' }}>{stripHtml(event.duration) || t('events.flexible')}</span>
                        </div>

                        {event.contact ? (
                          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 hover:from-emerald-100 hover:to-emerald-200 border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-200 md:col-span-2 min-w-0 group/item">
                            <div className="flex-shrink-0 p-2.5 rounded-xl bg-emerald-100 shadow-md group-hover/item:scale-110 transition-transform">
                              <Users className="h-5 w-5 text-emerald-700" />
                            </div>
                            <span className="font-semibold text-gray-800 line-clamp-1 min-w-0 break-words" style={{ fontFamily: 'Amiri, serif' }}>{stripHtml(event.contact)}</span>
                          </div>
                        ) : null}

                        {/* {event.live_link ? (
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 hover:bg-primary-100 border border-primary-200 transition-all duration-200 md:col-span-2">
                            <div className="flex-shrink-0 p-2 rounded-lg bg-white shadow-sm">
                              <RTLArrowIcon className="h-4 w-4 text-primary-600" />
                            </div>
                            <span className="font-medium text-primary-700">{liveLabel}</span>
                          </div>
                        ) : null} */}
                      </div>

                      {/* Footer Section */}
                      <div className="mt-auto pt-6 border-t-2 border-gray-200 min-w-0">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full min-w-0">
                          {event.live_link ? (
                            <a
                              href={event.live_link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 px-4 py-3 text-sm font-bold text-blue-700 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex-1 sm:flex-initial sm:w-auto min-w-0 group/btn"
                              style={{ fontFamily: 'Amiri, serif' }}
                            >
                              <span className="truncate">{t('events.joinLive')}</span>
                            </a>
                          ) : null}

                          <Link
                            href={`/event/${event.slug}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 px-4 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex-1 sm:flex-initial sm:w-auto min-w-0 group/btn"
                            style={{ fontFamily: 'Amiri, serif' }}
                          >
                            <span className="truncate">{t('events.eventDetails')}</span>
                            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
              </motion.div>
            );
          })}

        </div>
        {!showAll && sortedEvents.length > 3 && (
          <div className="mt-12 text-center">
            <Link
              href="/event"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl border-2 border-emerald-500 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              style={{ fontFamily: 'Amiri, serif' }}
            >
              <span>{t('events.viewAllEvents')}</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
