import BlogsSection from "../components/blog/BlogCard";
import IslamicHeader from "../components/IslamicHeader";

export default function BlogsPage() {
  return (
    <main className="w-full min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader pageType="blogs" />
      <div className="pb-16">
        <BlogsSection homePage={false} />
      </div>
    </main>
  );
}
