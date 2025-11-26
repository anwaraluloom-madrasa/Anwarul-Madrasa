import IslamicHeader from "../components/IslamicHeader";
import ArticleCardSkeleton from "../components/articles/ArticleCardSkeleton";

export default function LoadingArticlesPage() {
  return (
    <main className="w-full">
      <IslamicHeader pageType="articles" />
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" dir="rtl">
          {/* Category filter skeleton */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 justify-center bg-white py-4 px-4 rounded-xl border border-gray-200 shadow-sm">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-9 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Articles grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {Array.from({ length: 6 }).map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

