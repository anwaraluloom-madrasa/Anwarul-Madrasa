import BlogsSection from "../components/blog/BlogCard";
import IslamicHeader from "../components/IslamicHeader";
import Breadcrumb from "@/components/Breadcrumb";

export default function BlogsPage() {
  return (
    <main className="w-full min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader pageType="blogs" />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 pb-16">
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>
        <BlogsSection homePage={false} />
      </div>
    </main>
  );
}
