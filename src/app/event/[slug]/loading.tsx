import Breadcrumb from "@/components/Breadcrumb";
import EventDetailSkeleton from "../../components/events/EventDetailSkeleton";

export default function LoadingEventDetail() {
  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12" dir="rtl">
        <Breadcrumb />
        <EventDetailSkeleton />
      </div>
    </main>
  );
}