// app/books/page.tsx
import BooksSection from "../components/books/BooksSection";
import IslamicHeader from "../components/IslamicHeader";
import Breadcrumb from "@/components/Breadcrumb";

export default function BooksPage() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <IslamicHeader 
        pageType="books" 
        alignment="center"
        // cta={{
        //   label: "Browse All Books",
        //   href: "/book"
        // }}
      />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-12">
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>
        <BooksSection showAll={true} />
      </div>
    </main>
  );
}
