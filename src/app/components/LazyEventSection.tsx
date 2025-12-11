"use client";
import { useEffect, useState } from "react";
import Event from "./event/eventCard";
import { Event as EventType } from "../../lib/types";
import { EventsApi } from "../../lib/api";
import { ComingSoonEmptyState } from "@/components/EmptyState";
import EventCardSkeleton from "./event/EventCardSkeleton";

export default function LazyEventSection() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await EventsApi.getAll();
        if (res.success) {
          setEvents(Array.isArray(res.data) ? res.data : []);
        } else {
          console.warn("API unavailable, using fallback data:", res.message);
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section
        className="w-full px-2 sm:px-4 md:px-6 lg:px-8 md:pt-10 max-w-7xl mx-auto"
        dir="rtl"
      >
        <div className="space-y-12">
          {Array.from({ length: 3 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <ComingSoonEmptyState
        title="No Events Available"
        description="We're working on bringing you exciting events. Check back soon!"
        className="max-w-2xl mx-auto"
      />
    );
  }

  return <Event events={events} showAll={false} />;
}
