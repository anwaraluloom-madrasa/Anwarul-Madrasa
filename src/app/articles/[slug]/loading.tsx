import Breadcrumb from "@/components/Breadcrumb";
import ArticleDetailSkeleton from "../../components/articles/ArticleDetailSkeleton";

export default function LoadingArticleDetail() {
  return (
    <main className="min-h-screen mt-20 sm:mt-24 md:mt-32 bg-gradient-to-b from-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Breadcrumb />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <ArticleDetailSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}
