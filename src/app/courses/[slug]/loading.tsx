import Breadcrumb from "@/components/Breadcrumb";
import IslamicHeader from "@/app/components/IslamicHeader";
import CourseDetailSkeleton from "../../components/courses/CourseDetailSkeleton";

export default function LoadingCourseDetail() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
      <IslamicHeader pageType="courses" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        <CourseDetailSkeleton />
      </div>
    </main>
  );
}
