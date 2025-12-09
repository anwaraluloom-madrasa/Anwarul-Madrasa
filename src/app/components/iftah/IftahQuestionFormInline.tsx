"use client";
import { useState } from "react";
import { IftahQuestionApi } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  FaQuestionCircle, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaWhatsapp, 
  FaTimes, 
  FaCheckCircle, 
  FaStar,
  FaClock,
  FaArrowLeft,
  FaGlobe
} from "react-icons/fa";

export default function IftahQuestionFormInline() {
  const { t: tRaw, i18n } = useTranslation('common', { useSuspense: false });
  
  // Create a wrapper that always returns a string
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === 'string' ? result : key;
  };

  // Always RTL since website only has RTL languages
  const isRTL = true;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    question: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showQuestionFormModal, setShowQuestionFormModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    question: "",
  });

  // Helper function to check if form is valid
  const isFormValid = () => {
    return form.name.trim().length >= 2 && 
           /^[a-zA-Z\s\u0600-\u06FF]+$/.test(form.name.trim()) &&
           form.email.trim() && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
           form.question.trim().length >= 15 &&
           form.question.trim().length <= 1000 &&
           (!form.phone.trim() || /^[\+]?[0-9\s\-\(\)]{10,15}$/.test(form.phone.trim())) &&
           (!form.whatsapp.trim() || /^[\+]?[0-9\s\-\(\)]{10,15}$/.test(form.whatsapp.trim()));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleSubmit(e as any);
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

    // Validate name
    if (!form.name.trim()) {
      newErrors.name = t('iftah.form.validation.pleaseEnterFullName');
      isValid = false;
    } else if (form.name.trim().length < 2) {
      newErrors.name = t('iftah.form.validation.nameMinLength');
      isValid = false;
    } else if (!/^[a-zA-Z\s\u0600-\u06FF]+$/.test(form.name.trim())) {
      newErrors.name = t('iftah.form.validation.nameLettersOnly');
      isValid = false;
    }

    // Validate email
    if (!form.email.trim()) {
      newErrors.email = t('iftah.form.validation.pleaseEnterEmail');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t('iftah.form.validation.validEmailAddress');
      isValid = false;
    }

    // Validate phone (optional but if provided, must be valid)
    if (form.phone.trim() && !/^[\+]?[0-9\s\-\(\)]{10,15}$/.test(form.phone.trim())) {
      newErrors.phone = t('iftah.form.validation.validPhoneNumber');
      isValid = false;
    }

    // Validate WhatsApp (optional but if provided, must be valid)
    if (form.whatsapp.trim() && !/^[\+]?[0-9\s\-\(\)]{10,15}$/.test(form.whatsapp.trim())) {
      newErrors.whatsapp = t('iftah.form.validation.validWhatsappNumber');
      isValid = false;
    }

    // Validate question
    if (!form.question.trim()) {
      newErrors.question = t('iftah.form.validation.writeIslamicQuestion');
      isValid = false;
    } else if (form.question.trim().length < 15) {
      newErrors.question = t('iftah.form.validation.moreDetailedQuestion');
      isValid = false;
    } else if (form.question.trim().length > 1000) {
      newErrors.question = t('iftah.form.validation.questionTooLong');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate form before submitting
    if (!validateForm()) {
      setError(t('iftah.form.validation.completeRequiredFields'));
      return;
    }
    
    console.log('🚀 Form submission started');
    console.log('📝 Form data being submitted:', form);
    
    setLoading(true);
    setSuccess("");
    setError("");
    
    try {
      const res = await IftahQuestionApi.submit(form);
      console.log('📤 API response:', res);
      
      if (!res.success) {
        throw new Error(res.message || "Failed to submit question");
      }
      
      console.log('✅ Form submitted successfully');
      setSuccess(t('iftah.form.questionSubmittedSuccess'));
      setForm({ name: "", email: "", phone: "", whatsapp: "", question: "" });
      
      
      // Show success modal
      setShowSuccessModal(true);
      setShowQuestionFormModal(false);
      
      // Auto-hide success modal after 5 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        setSuccess("");
      }, 5000);
      
    } catch (err: any) {
      console.error('❌ Form submission error:', err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 ">
      {/* Hero Section - Compact Design */}
      <div className="relative mb-6 sm:mb-8 overflow-hidden">
        {/* Background with enhanced gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100"></div>
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.06'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative bg-white rounded-2xl shadow-lg border border-amber-100/50 overflow-hidden backdrop-blur-sm">
          {/* Header Section with compact design */}
          <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 px-4 sm:px-6 py-6 sm:py-8 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
            
            <div className="relative flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
              {/* Left Content */}
              <div className={`flex-1 text-white ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`inline-flex gap-2 items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold mb-4 border border-white/30 shadow-sm ${isRTL ? 'ml-auto' : 'mr-auto'}`}>
                  <FaQuestionCircle className={`${isRTL ? 'ml-1.5' : 'mr-1.5'} text-sm`} />
                  <span>{t('iftah.form.islamicQA')}</span>
                  <div className={`${isRTL ? 'mr-1.5' : 'ml-1.5'} w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse`}></div>
                </div>
                
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('iftah.form.seekDivineGuidance')}
                </h1>
                
                <p className={`text-sm sm:text-base mb-6 opacity-95 leading-relaxed max-w-lg ${isRTL ? 'mr-auto ml-0' : 'ml-auto mr-0'}`}>
                  {t('iftah.form.getAuthenticAnswers')}
                </p>
                
                {/* Features */}
                <div className={`flex flex-wrap gap-3 text-xs sm:text-sm ${isRTL ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <FaCheckCircle className={`text-green-300 text-sm ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                    <span className="opacity-95 font-medium">{t('iftah.form.expertScholars')}</span>
                  </div>
                  <div className={`flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <FaCheckCircle className={`text-green-300 text-sm ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                    <span className="opacity-95 font-medium">{t('iftah.form.quickResponse')}</span>
                  </div>
                  <div className={`flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <FaCheckCircle className={`text-green-300 text-sm ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                    <span className="opacity-95 font-medium">{t('iftah.form.freeService')}</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Compact CTA */}
              <div className={`flex flex-col items-center lg:items-center shrink-0 w-full lg:w-auto ${isRTL ? 'lg:mr-auto' : 'lg:ml-auto'}`}>
                <div className={`text-center mb-6`}>
                  <div className="text-5xl sm:text-6xl mb-3">📿</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{t('iftah.form.askYourQuestion')}</h3>
                  <p className="text-amber-100 text-sm max-w-xs mx-auto">{t('iftah.form.getPersonalizedGuidance')}</p>
                </div>
                
                <button
                  onClick={() => setShowQuestionFormModal(true)}
                  className={`group flex gap-2 items-center justify-center px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:via-orange-500 hover:to-amber-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-150 transform hover:-translate-y-0.5 border border-amber-200/50 backdrop-blur-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <FaQuestionCircle className={`${isRTL ? 'ml-1.5' : 'mr-1.5'} text-sm group-hover:rotate-12 transition-transform duration-150`} />
                  <span>{t('iftah.form.askAQuestion')}</span>
                
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Question Form Modal - Compact Design */}
      {showQuestionFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg relative overflow-hidden border border-amber-100/50 animate-fadeInUp">
            {/* Close Button */}
            <button
              onClick={() => setShowQuestionFormModal(false)}
              className="absolute top-3 right-3 z-10 w-7 h-7 bg-white/90 hover:bg-white text-gray-500 hover:text-gray-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg backdrop-blur-sm"
            >
              <FaTimes className="text-xs" />
            </button>

            {/* Form Header - Compact */}
            <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 px-4 py-6 sm:px-6 sm:py-8 text-white overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full translate-y-6 -translate-x-6"></div>
              
              <div className={`relative ${isRTL ? 'text-center md:text-right' : 'text-center'}`}>
                <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold mb-3 border border-white/30 shadow-sm">
                  <FaQuestionCircle className="mr-1.5 text-sm" />
                  <span>{t('iftah.form.askYourQuestion')}</span>
                  <div className="ml-1.5 w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></div>
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold mb-2">{t('iftah.form.seekIslamicGuidance')}</h2>
                <p className="text-amber-100 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                  {t('iftah.form.getAuthenticAnswers')}
                </p>
              </div>
            </div>

            {/* Form Content - Compact */}
            <div className="px-4 py-4 sm:px-6 sm:py-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm flex items-center gap-2 shadow-sm">
                  <span className="text-red-600 text-sm">⚠️</span>
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Form Validation Summary */}
              {Object.values(errors).some(error => error !== "") && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm shadow-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 text-sm">⚠️</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-2 text-sm">{t('iftah.form.validation.completeFollowingFields')}</p>
                      <div className="flex flex-wrap gap-1">
                        {errors.name && <span className="bg-red-100 px-2 py-1 rounded text-xs font-medium">{errors.name}</span>}
                        {errors.email && <span className="bg-red-100 px-2 py-1 rounded text-xs font-medium">{errors.email}</span>}
                        {errors.phone && <span className="bg-red-100 px-2 py-1 rounded text-xs font-medium">{errors.phone}</span>}
                        {errors.whatsapp && <span className="bg-red-100 px-2 py-1 rounded text-xs font-medium">{errors.whatsapp}</span>}
                        {errors.question && <span className="bg-red-100 px-2 py-1 rounded text-xs font-medium">{errors.question}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Personal Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-800 mb-1.5 flex items-center gap-2 text-xs sm:text-sm">
                      <div className="w-5 h-5 bg-amber-100 rounded-md flex items-center justify-center shadow-sm">
                        <FaUser className="text-amber-600 text-xs" />
                      </div>
                      {t('iftah.form.fullName')} *
                    </label>
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      required 
                      className={`w-full border-2 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 shadow-sm hover:border-amber-300 text-xs sm:text-sm bg-gray-50 focus:bg-white ${
                        errors.name ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200"
                      }`}
                      placeholder={t('iftah.form.enterFullName')}
                      dir="rtl"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <span>⚠️</span>
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-800 mb-1.5 flex items-center gap-2 text-xs sm:text-sm">
                      <div className="w-5 h-5 bg-amber-100 rounded-md flex items-center justify-center shadow-sm">
                        <FaEnvelope className="text-amber-600 text-xs" />
                      </div>
                      {t('iftah.form.emailAddress')} *
                    </label>
                    <input 
                      name="email" 
                      type="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      required 
                      className={`w-full border-2 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 shadow-sm hover:border-amber-300 text-xs sm:text-sm bg-gray-50 focus:bg-white ${
                        errors.email ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200"
                      }`}
                      placeholder={t('iftah.form.enterEmail')}
                      dir="rtl"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <span>⚠️</span>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-800 mb-1.5 flex items-center gap-2 text-xs sm:text-sm">
                      <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center shadow-sm">
                        <FaPhone className="text-blue-600 text-xs" />
                      </div>
                      {t('iftah.form.phoneNumber')}
                    </label>
                    <input 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleChange} 
                      className={`w-full border-2 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 shadow-sm hover:border-amber-300 text-xs sm:text-sm bg-gray-50 focus:bg-white ${
                        errors.phone ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200"
                      }`}
                      placeholder={t('iftah.form.enterPhoneOptional')}
                      dir="rtl"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <span>⚠️</span>
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-800 mb-1.5 flex items-center gap-2 text-xs sm:text-sm">
                      <div className="w-5 h-5 bg-green-100 rounded-md flex items-center justify-center shadow-sm">
                        <FaWhatsapp className="text-green-600 text-xs" />
                      </div>
                      {t('iftah.form.whatsapp')}
                    </label>
                    <input 
                      name="whatsapp" 
                      type="number"
                      value={form.whatsapp} 
                      onChange={handleChange} 
                      className={`w-full border-2 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 shadow-sm hover:border-amber-300 text-xs sm:text-sm bg-gray-50 focus:bg-white ${
                        errors.whatsapp ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200"
                      }`}
                      placeholder={t('iftah.form.enterWhatsappOptional')}
                      dir="rtl"
                    />
                    {errors.whatsapp && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <span>⚠️</span>
                        {errors.whatsapp}
                      </p>
                    )}
                  </div>
                </div>

                {/* Question Section */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-800 mb-1.5 flex items-center gap-2 text-xs sm:text-sm">
                    <div className="w-5 h-5 bg-purple-100 rounded-md flex items-center justify-center shadow-sm">
                      <FaQuestionCircle className="text-purple-600 text-xs" />
                    </div>
                    {t('iftah.form.yourIslamicQuestion')} *
                  </label>
                  <div className="relative">
                    <textarea 
                      name="question" 
                      value={form.question} 
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      required 
                      maxLength={1000}
                      className={`w-full border-2 rounded-lg px-3 py-2 min-h-[80px] sm:min-h-[100px] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 shadow-sm hover:border-amber-300 resize-none text-xs sm:text-sm bg-gray-50 focus:bg-white pr-12 ${
                        errors.question ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200"
                      }`}
                      placeholder={t('iftah.form.writeQuestionHere')}
                      dir="rtl"
                    />
                    {/* Character Counter */}
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white/80 px-1.5 py-0.5 rounded">
                      <span className={form.question.length > 900 ? "text-red-500 font-semibold" : form.question.length > 800 ? "text-yellow-500 font-semibold" : ""}>
                        {form.question.length}/1000
                      </span>
                    </div>
                  </div>
                  {errors.question && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <span>⚠️</span>
                      {errors.question}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl text-sm transition-all duration-150 transform hover:-translate-y-0.5 disabled:opacity-60 disabled:transform-none flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-150 origin-left"></div>
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="relative z-10">{t('iftah.form.submitting')}</span>
                    </>
                  ) : (
                    <>
                      <FaQuestionCircle className="text-sm relative z-10 group-hover:rotate-12 transition-transform duration-150" />
                      <span className="relative z-10">{t('iftah.form.submitQuestion')}</span>
                      <FaArrowLeft className="text-xs relative z-10 group-hover:-translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal - Compact */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full relative overflow-hidden border border-green-100/50 animate-fadeInUp">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50"></div>
            
            <div className={`relative px-6 py-8 ${isRTL ? 'text-center md:text-right' : 'text-center'}`}>
              {/* Success Icon */}
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <FaCheckCircle className="text-white text-2xl" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
              </div>
              
              {/* Success Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('iftah.form.questionSubmitted')}</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {t('iftah.form.questionSubmittedSuccess')}
              </p>
              
              {/* Features */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 mb-6 border border-amber-100 shadow-sm">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <FaClock className="text-amber-500 text-sm" />
                    <span className="font-medium">{t('iftah.form.hoursResponse')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaStar className="text-amber-500 text-sm" />
                    <span className="font-medium">{t('iftah.form.expertReview')}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-150 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
              >
                <span>{t('iftah.form.continue')}</span>
                <FaArrowLeft className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}