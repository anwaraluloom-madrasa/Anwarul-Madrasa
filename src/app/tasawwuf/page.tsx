"use client";

import TasawwufList from "../components/tasawuuf/TasawwufList";
import IslamicHeader from "../components/IslamicHeader";

export default function TasawwufPage() {
  return (
    <main className="w-full min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader pageType="tasawwuf" />
      <div className="w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <TasawwufList homePage={false} />
      </div>
    </main>
  );
}
