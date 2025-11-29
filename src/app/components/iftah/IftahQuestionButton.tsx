"use client";

import { useState } from "react";
import IftahQuestionForm from "./IftahQuestionForm";
import { FaQuestionCircle } from "react-icons/fa";

interface IftahQuestionButtonProps {
  variant?: "header" | "prominent" | "floating";
}

export default function IftahQuestionButton({ variant = "header" }: IftahQuestionButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const buttonClasses = 
    variant === "floating"
      ? `fixed bottom-6 left-6 z-50 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-700 text-white px-4 py-3 rounded-full transition-all duration-300 group shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-110 font-bold text-sm backdrop-blur-sm border-2 border-white/20 animate-bounce-subtle`
      : variant === "prominent"
      ? "inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl transition-all duration-150 group shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg"
      : "inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 px-5 py-3 rounded-lg transition-all duration-150 group border border-white/20 backdrop-blur-sm";

  const buttonContent = 
    variant === "floating" ? (
      <>
        <div className="relative">
          <FaQuestionCircle className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 text-white" />
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
        </div>
        <span className="text-white font-bold text-sm">پوښتنه وکړئ</span>
      </>
    ) : (
      <>
        <FaQuestionCircle className={`${variant === "prominent" ? "w-6 h-6" : "w-5 h-5"} group-hover:scale-110 transition-transform ${variant === "prominent" ? "text-white" : "text-white"}`} />
        <span className={`${variant === "prominent" ? "text-white font-bold" : "font-medium text-white"}`}>
          {variant === "prominent" ? " خپلی شرعی پوښتنې مو دلته وکړئ" : "سوال بپرسید"}
        </span>
      </>
    );

  return (
    <>
      <button
        onClick={() => setIsFormOpen(true)}
        className={buttonClasses}
        aria-label="Ask a question"
      >
        {buttonContent}
      </button>

      <IftahQuestionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}

