'use client';

import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>شاته</span>
    </button>
  );
}

