// app/events/[slug]/page.tsx
import { EventsApi, extractArray } from "../../../lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cleanText } from "@/lib/textUtils";
import { cookies } from "next/headers";
import { getTranslation } from "@/lib/translations";
import Breadcrumb from "@/components/Breadcrumb";
import IslamicHeader from "../../components/IslamicHeader";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import EventDetailImage from "../../components/event/EventDetailImage";

interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  date: string;
  duration: string;
  live_link?: string | null;
  live_link_type?: string | null;
  status?: string | null; // "past", "upcoming", etc.
  is_published: number; // 0 or 1
  created_at: string;
  updated_at: string;
}

interface Params {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailsPage({ params }: Params) {
  const { slug } = await params;

  // Determine language from cookie (fallback to ps)
  const cookieStore = await cookies();
  const currentLanguage = cookieStore.get("language")?.value || "ps";
  const t = (key: string): string => {
    const translation = getTranslation(key, currentLanguage);
    return typeof translation === "string" ? translation : key;
  };

  const eventResponse = await EventsApi.getBySlug(slug);
  if (!eventResponse.success) {
    notFound();
  }

  const eventPayload = eventResponse.data;
  const event = Array.isArray(eventPayload)
    ? (eventPayload[0] as Event | undefined)
    : (eventPayload as Event | undefined);

  if (!event) notFound();

  let relatedEvents: Event[] = [];
  try {
    const relatedResponse = await EventsApi.getAll({ limit: 6 });
    if (relatedResponse.success) {
      const data = extractArray<Event>(relatedResponse.data);
      relatedEvents = data.filter((e) => e.slug !== slug).slice(0, 3);
    }
  } catch (relatedError) {
    console.warn("Failed to load related events:", relatedError);
  }

  // Format date for better display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Get status badge color
  const getStatusColor = (status?: string | null) => {
    const normalized = (status || "unknown").toLowerCase();
    switch (normalized) {
      case "upcoming":
        return "bg-green-100 text-green-800";
      case "past":
        return "bg-gray-100 text-gray-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-gray-50"
      dir="rtl"
    >
      <IslamicHeader pageType="events" title={event.title} alignment="center" />
      <div
        className="max-w-7xl mx-auto px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8 py-8 sm:py-12"
        dir="rtl"
      >
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>

        {/* Hero Section with Enhanced Image */}
        <div className="relative mb-10">
          {event.image ? (
            <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <EventDetailImage src={event.image} alt={event.title} priority />
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              {/* Status Badge */}
              <div className="absolute top-6 right-6 z-10">
                <span
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-2xl border-2 border-white/80 backdrop-blur-md ${getStatusColor(
                    event.status
                  )}`}
                >
                  {event.status
                    ? event.status.charAt(0).toUpperCase() +
                      event.status.slice(1)
                    : "Unknown"}
                </span>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-2xl"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  {event.title}
                </h1>
              </div>
            </div>
          ) : (
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-12 md:p-16 lg:p-20">
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                <div className="absolute top-6 right-6 z-10">
                  <span
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-2xl border-2 border-white/80 backdrop-blur-md ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {event.status
                      ? event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)
                      : "Unknown"}
                  </span>
                </div>
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-2xl"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  {event.title}
                </h1>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Details Card */}
            <article className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 overflow-hidden mb-8">
              <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
                {/* Event Details Grid - Enhanced */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
                  <div className="group relative flex gap-4 sm:gap-5 items-start p-4 sm:p-5 md:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-emerald-50 border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                    </div>
                    <div className="relative flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1 sm:mb-2">
                        {t("eventsPage.date")}
                      </p>
                      <p
                        className="text-base sm:text-lg font-bold text-gray-900 break-words"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>

                  <div className="group relative flex gap-4 sm:gap-5 items-start p-4 sm:p-5 md:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-emerald-50 border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Clock className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                    </div>
                    <div className="relative flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1 sm:mb-2">
                        {t("eventsPage.duration")}
                      </p>
                      <p
                        className="text-base sm:text-lg font-bold text-gray-900 break-words"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        {event.duration || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {event.live_link && (
                    <div className="group relative flex gap-5 items-start p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-50 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 md:col-span-2 overflow-hidden">
                      {/* Decorative background */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                      <div className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <ExternalLink className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                      </div>
                      <div className="relative flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs font-bold text-blue-700 uppercase tracking-wider mb-1 sm:mb-2">
                          {t("eventsPage.liveStream")}
                        </p>
                        <a
                          href={event.live_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-base sm:text-lg text-blue-700 hover:text-blue-800 inline-flex items-center gap-2 transition-colors group/link break-words"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          {event.live_link_type || t("eventsPage.watchLive")}
                          <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 group-hover/link:translate-x-1 transition-transform flex-shrink-0" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description - Enhanced */}
                {event.description && (
                  <div className="relative pt-8 border-t-2 border-gray-200">
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative">
                      <h2
                        className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-4"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-xl">
                          <MapPin className="w-7 h-7 text-white" />
                        </div>
                        {t("eventsPage.aboutThisEvent")}
                      </h2>
                      <div
                        className="prose prose-lg max-w-none text-gray-700 leading-relaxed bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30 rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 border-2 border-emerald-100/50 shadow-lg [&_*]:text-gray-700 [&_p]:mb-6 [&_p]:text-base sm:[&_p]:text-lg [&_p]:font-medium [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:mr-6 [&_ol]:list-decimal [&_ol]:mr-6 [&_li]:mb-2 [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_img]:rounded-lg [&_img]:my-4 [&_blockquote]:border-r-4 [&_blockquote]:border-gray-300 [&_blockquote]:pr-4 [&_blockquote]:italic break-words"
                        style={{ fontFamily: "Amiri, serif" }}
                        dir="rtl"
                        dangerouslySetInnerHTML={{ __html: event.description || '' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Related Events - Enhanced */}
            {relatedEvents.length > 0 && (
              <div
                className="relative bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-6 mb-0 flex flex-col gap-6 sticky top-8 transition-all duration-300 hover:border-emerald-400 hover:shadow-2xl overflow-hidden"
                style={{
                  zIndex: 10,
                }}
              >
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative">
                  <h3
                    className="text-xl md:text-2xl font-bold text-emerald-700 mb-6 flex items-center gap-3"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    {t("eventsPage.relatedEvents")}
                  </h3>
                  <div className="flex flex-col gap-4">
                    {relatedEvents.map((relatedEvent) => (
                      <Link
                        key={relatedEvent.slug}
                        href={`/event/${relatedEvent.slug}`}
                        className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="relative flex items-center gap-4 p-5 bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-emerald-50 rounded-2xl border-2 border-emerald-200 group-hover:border-emerald-400 group-hover:shadow-lg transition-all overflow-hidden">
                          {/* Hover effect background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          <div className="relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-300 bg-gray-100 shadow-lg group-hover:shadow-xl transition-shadow">
                            <EventDetailImage
                              src={relatedEvent.image}
                              alt={relatedEvent.title}
                            />
                          </div>
                          <div className="relative flex-1 min-w-0">
                            <p
                              className="text-base font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors mb-1"
                              style={{ fontFamily: "Amiri, serif" }}
                            >
                              {relatedEvent.title}
                            </p>
                            <p className="text-xs text-emerald-600 font-semibold">
                              {formatDate(relatedEvent.date)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Event Actions */}
          </div>
        </div>
      </div>
    </main>
  );
}
