import Breadcrumb from "@/components/Breadcrumb";
import AuthorDetailSkeleton from "../../components/authors/AuthorDetailSkeleton";

export default function LoadingAuthorDetail() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6 mt-6">
          <div className="[&>nav]:px-0 [&>nav]:py-0 [&>nav]:-mt-0 [&>nav>div]:shadow-none">
            <Breadcrumb />
          </div>
        </div>
        <AuthorDetailSkeleton />
      </div>
    </main>
  );
}