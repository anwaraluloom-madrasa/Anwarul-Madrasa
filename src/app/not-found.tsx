import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import IslamicHeader from "./components/IslamicHeader";
import BackButton from "./components/BackButton";

export default function NotFound() {
  return (
    <main className="w-full min-h-screen bg-white" dir="rtl">
      <IslamicHeader 
        pageType="default"
        title="404"
        subtitle="صفحه ونه موندل شوه"
      />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center">
          {/* 404 Display */}
          <h1 className="text-8xl sm:text-9xl font-bold text-emerald-600 mb-6 leading-none">
            404
          </h1>

          {/* Message */}
          <div className="space-y-3 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Amiri, serif' }}>
              صفحه ونه موندل شوه
            </h2>
            <p className="text-base text-gray-600 max-w-md mx-auto" style={{ fontFamily: 'Amiri, serif' }}>
              بښنه غواړم، هغه صفحه چې تاسو یې لټون کوئ موجوده نه ده.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>کور ته</span>
            </Link>
            
            <BackButton />
          </div>
        </div>
      </div>
    </main>
  );
}

