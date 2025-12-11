"use client";

import TasawwufList from "../components/tasawuuf/TasawwufList";
import IslamicHeader from "../components/IslamicHeader";
import Breadcrumb from "@/components/Breadcrumb";

export default function TasawwufPage() {
  return (
    <main className="w-full min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader pageType="tasawwuf" />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8">
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>
        <TasawwufList homePage={false} />
      </div>
    </main>
  );
}
