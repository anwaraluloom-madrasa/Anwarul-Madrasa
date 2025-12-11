import ArticlesCard from "../components/ArticlesCard";
import IslamicHeader from "../components/IslamicHeader";
import Breadcrumb from "@/components/Breadcrumb";

export default function ArticlesPage() {
  return (
    <main className="w-full">
      <IslamicHeader pageType="articles" />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>
        <ArticlesCard />
      </div>
    </main>
  );
}
