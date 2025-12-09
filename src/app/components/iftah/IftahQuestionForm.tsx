"use client";

import { useState } from "react";
import { IftahQuestionApi } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { FiX, FiUser, FiMail, FiPhone, FiMessageSquare, FiSend } from "react-icons/fi";

interface IftahQuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IftahQuestionForm({ isOpen, onClose }: IftahQuestionFormProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    question: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    question: "",
  });


  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // کله چې کارونکی لیکل پیل کړي، تېروتنه پاکه کړه
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
      question: "",
    };

    let isValid = true;

    // د نوم اعتبار څارنه
    if (!formData.name.trim()) {
      newErrors.name = "نوم اړین دی";
      isValid = false;
    }

    // د بریښنالیک اعتبار څارنه
    if (!formData.email.trim()) {
      newErrors.email = "بریښنالیک اړین دی";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "مهرباني وکړئ د معتبر بریښنالیک نوم ولیکئ";
      isValid = false;
    }

    // د پوښتنې اعتبار څارنه
    if (!formData.question.trim()) {
      newErrors.question = "پوښتنه اړینه ده";
      isValid = false;
    } else if (formData.question.trim().length < 10) {
      newErrors.question = "مهرباني وکړئ خپله پوښتنه بشپړه توضیح کړئ";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("مهرباني وکړئ ټول اړین ساحې ډک کړئ");
      return;
    }

    setLoading(true);

    try {
      const submissionPayload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        whatsapp: formData.whatsapp || undefined,
        question: formData.question,
      };
      
      console.log('📤 [IFTAH FORM] د سپارنې بارچی:', submissionPayload);
      
      const result = await IftahQuestionApi.submit(submissionPayload);

      if (result.success) {
        toast.success("ستاسو پوښتنه په بریالیتوب سره واستول شوه!");
        // فورمه بیا تنظیم کړه
        setFormData({
          name: "",
          email: "",
          phone: "",
          whatsapp: "",
          question: "",
        });
        setErrors({
          name: "",
          email: "",
          phone: "",
          whatsapp: "",
          question: "",
        });
        // د بریالیتوب وروسته مودال بند کړه
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        const errorMsg = (result as any)?.error || (result as any)?.message || "د پوښتنې د استولو کې تېروتنه";
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      console.error("❌ د پوښتنې د استولو کې تېروتنه:", error);
      console.error("❌ د تېروتنې تفصیلات:", error.details);
      console.error("❌ د تېروتنې حالت:", error.status);
      
      // د تېروتنې پیغام وښایه
      let errorMessage = error.message || "د پوښتنې د استولو کې تېروتنه. مهرباني وکړئ بیا هڅه وکړئ.";
      
      if (error.status === 500) {
        errorMessage = "د سرور تېروتنه (500). مهرباني وکړئ وروسته هڅه وکړئ یا د سیسټم مدیر سره اړیکه ونیسئ.";
      } else if (error.status === 422) {
        errorMessage = "د استول شویو معلوماتو تېروتنه. مهرباني وکړئ ټول ساحې وګورئ.";
      } else if (error.status === 401 || error.status === 403) {
        errorMessage = "د لاسرسي تېروتنه. مهرباني وکړئ پاڼه تازه کړئ او بیا هڅه وکړئ.";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-150" dir="rtl">
        {/* سرلیک */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white p-5 sm:p-6 z-10 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiMessageSquare className="w-5 h-5" />
              </div>
              
            </div>
            <div className="flex-1 flex justify-center items-center px-4">
              <div className="flex items-center gap-2" style={{ marginLeft: 'auto', marginRight: '0' }}>
             
                <p 
                  className="text-base sm:text-lg md:text-xl font-bold text-white/95 leading-tight" 
                  dir="rtl"
                  style={{
                    fontFamily: "'Amiri', 'Noto Sans Arabic', 'Cairo', 'Tajawal', 'Arial', sans-serif",
                    textShadow: '0 1px 4px rgba(0,0,0,0.2)',
                    letterSpacing: '0.05em',
                    textAlign: 'right'
                  }}
                >
                  <span className="font-black" style={{ fontWeight: 900 }}>
                  دَارُ الإِفْتَاء اَنْوَارُ العُلُومِ
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="بندول"
            >
              <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* د نوم ساحه */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700">
              <FiUser className="text-emerald-600 w-3.5 h-3.5" />
              <span>نوم <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${
                errors.name ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="خپل بشپړ نوم ولیکئ"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.name}
              </p>
            )}
          </div>

          {/* د بریښنالیک ساحه */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700">
              <FiMail className="text-emerald-600 w-3.5 h-3.5" />
              <span>بریښنالیک <span className="text-red-500">*</span></span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${
                errors.email ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="example@email.com"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* د تلیفون شمېره ساحه */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700">
              <FiPhone className="text-amber-600 w-3.5 h-3.5" />
              <span>د تلیفون شمېره <span className="text-gray-400 text-xs">(اختیاري)</span></span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
              placeholder="07X XXX XXXX"
            />
          </div>

          {/* د واتساپ ساحه */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700">
              <FiPhone className="text-green-600 w-3.5 h-3.5" />
              <span>واتساپ <span className="text-gray-400 text-xs">(اختیاري)</span></span>
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
              placeholder="07X XXX XXXX"
            />
          </div>

          {/* د پوښتنې ساحه */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700">
              <FiMessageSquare className="text-emerald-600 w-3.5 h-3.5" />
              <span>پوښتنه <span className="text-red-500">*</span></span>
            </label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200 resize-none bg-gray-50 focus:bg-white ${
                errors.question ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="مهرباني وکړئ خپله شرعي پوښتنه بشپړه او روښانه ولیکئ..."
              required
            />
            {errors.question && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.question}
              </p>
            )}
          </div>

          {/* د سپارنې تڼۍ */}
          <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 active:scale-95 transition-all duration-200"
            >
              لغوه
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white rounded-lg text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>استول کېږي...</span>
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  <span>د پوښتنې استول</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

