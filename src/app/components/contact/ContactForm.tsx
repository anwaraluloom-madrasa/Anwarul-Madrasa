"use client";

import { useState } from "react";
import { FaFacebook, FaWhatsapp, FaMapMarkerAlt, FaClock, FaPhone, FaEnvelope, FaGlobe } from "react-icons/fa";
import { FiUser, FiMail, FiPhone, FiMessageSquare, FiSend, FiMapPin, FiClock } from "react-icons/fi";
import { FaYoutube, FaInstagram, FaTwitter } from "react-icons/fa6";
import { ContactApi } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";
import { useApiMutation } from "@/hooks/useApi";
import { useToast } from "@/components/Toast";

// Mock FAQ data (replace with your actual FAQDate import)


function Contact() {
  const { t: tRaw } = useTranslation('common', { useSuspense: false });
  
  // Create a wrapper that always returns a string
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === 'string' ? result : key;
  };

  const toast = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Use the new API mutation hook
  const { mutate: submitContact, isLoading: loading } = useApiMutation(
    (data: typeof formData) => ContactApi.submit(data),
    {
      onSuccess: () => {
        setStatus("✅ " + t('contact.messageSentSuccess'));
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        toast.success(t('contact.messageSentSuccess'));
      },
      onError: (error) => {
        setStatus("❌ " + t('contact.failedToSend'));
        toast.error(error.message || t('contact.failedToSend'));
      },
      showSuccessToast: false, // We're handling toasts manually
      showErrorToast: false,
    }
  );




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      message: "",
    };

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = t('contact.validation.pleaseEnterName');
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = t('contact.validation.pleaseEnterEmail');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.validation.validEmailAddress');
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = t('contact.validation.pleaseEnterMessage');
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      setStatus("❌ " + t('contact.fillRequiredFields'));
      toast.error(t('contact.fillRequiredFields'));
      return;
    }

    setStatus("");

    try {
      await submitContact(formData);
    } catch (err) {
      // Error already handled by mutation hook
    }
  };



  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 py-10 sm:py-16">
      {/* Contact Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Info */}
        <div className="lg:w-1/2 space-y-6 sm:space-y-8">
          <div className="space-y-5">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{t('contact.getInTouch')}</h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {t('contact.loveToHear')}
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
              <a 
                href="https://www.facebook.com/profile.php?id=100085056932016&mibextid=ZbWKwL"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 sm:w-14 sm:h-14 bg-amber-600 text-white rounded-xl flex items-center justify-center hover:bg-amber-700 transition-all duration-150 transform hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-lg"
                aria-label="Facebook"
              >
                <FaFacebook className="text-lg sm:text-xl transition-transform group-hover:scale-110" />
              </a>
        
              <a
                href={`https://wa.me/+93796148087?text=${encodeURIComponent(
                  `Hi!اسلام علیکم ورحمته الله وبرکاته `
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 sm:w-14 sm:h-14 bg-green-500 text-white rounded-xl flex items-center justify-center hover:bg-green-600 transition-all duration-150 transform hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-lg"
              >
               <FaWhatsapp className="text-lg sm:text-xl transition-transform group-hover:scale-110" />
              </a>
              <a 
                href="https://youtube.com/@Anwar231?si=xp-rKjC7ACzAsyB6"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 sm:w-14 sm:h-14 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-red-700 transition-all duration-150 transform hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-lg"
                aria-label="YouTube"
              >
                <FaYoutube className="text-lg sm:text-xl transition-transform group-hover:scale-110" />
              </a>
              <a 
                href="https://twitter.com/khaksarpaktiawa/status/1760494499027931617?t=ep_4SWVp_FHLDvsS2w-cQA&s=19"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 sm:w-14 sm:h-14 bg-sky-500 text-white rounded-xl flex items-center justify-center hover:bg-sky-600 transition-all duration-150 transform hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-lg"
                aria-label="Twitter"
              >
                <FaTwitter className="text-lg sm:text-xl transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Contact Information Cards */}
          <div className="space-y-4 sm:space-y-5 pt-2">
            {/* Address Card */}
            <div className="group flex items-start gap-4 p-5 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-lg border border-amber-100 hover:border-amber-200 transition-all duration-150">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg flex items-center justify-center group-hover:from-amber-200 group-hover:to-amber-100 transition-all duration-150 shadow-sm">
                <FaMapMarkerAlt className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">{t('contact.address')}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">ارغندی، پغمان، کابل افغانیستان</p>
              </div>
            </div>

            {/* Contact Card */}
            <div className="group flex items-start gap-4 p-5 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-lg border border-amber-100 hover:border-amber-200 transition-all duration-150">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg flex items-center justify-center group-hover:from-amber-200 group-hover:to-amber-100 transition-all duration-150 shadow-sm">
                <FaPhone className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">{t('contact.contact')}</h3>
                <div className="space-y-1">
                  <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                    <span className="inline-block w-1 h-1 bg-amber-500 rounded-full"></span>
                     796148087 93+
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                    <span className="inline-block w-1 h-1 bg-amber-500 rounded-full"></span>
                    info@anwarululoom.com
                  </p>
                </div>
              </div>
            </div>

            {/* Opening Hours Card */}
            <div className="group flex items-start gap-4 p-5 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-lg border border-amber-100 hover:border-amber-200 transition-all duration-150">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg flex items-center justify-center group-hover:from-amber-200 group-hover:to-amber-100 transition-all duration-150 shadow-sm">
                <FaClock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">{t('contact.openingHours')}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed"> 6:30am - 11:00pm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:w-1/2">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-amber-100" id="contact-form">
            <div className="space-y-3 mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{t('contact.sendMessage')}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{t('contact.respondSoon')}</p>
            </div>
          
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Name Field */}
              <div className="relative">
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <FiUser className="w-5 h-5 text-amber-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder={t('contact.yourName') + '*'}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full pr-11 pl-4 py-3.5 border-2 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-150 bg-gray-50 focus:bg-white text-sm sm:text-base placeholder-gray-400 ${
                    errors.name ? "border-red-400 focus:ring-red-500 focus:border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-center gap-2 mr-1">
                    <span>⚠️</span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="relative">
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <FiMail className="w-5 h-5 text-amber-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder={t('contact.yourEmail') + '*'}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full pr-11 pl-4 py-3.5 border-2 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-150 bg-gray-50 focus:bg-white text-sm sm:text-base placeholder-gray-400 ${
                    errors.email ? "border-red-400 focus:ring-red-500 focus:border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-center gap-2 mr-1">
                    <span>⚠️</span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="relative">
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <FiPhone className="w-5 h-5 text-amber-500" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder={t('contact.yourPhone')}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pr-11 pl-4 py-3.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-150 bg-gray-50 focus:bg-white text-sm sm:text-base placeholder-gray-400"
                />
              </div>

              {/* Message Field */}
              <div className="relative">
                <div className="absolute right-3.5 top-4 z-10 pointer-events-none">
                  <FiMessageSquare className="w-5 h-5 text-amber-500" />
                </div>
                <textarea
                  name="message"
                  placeholder={t('contact.yourMessage') + '*'}
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={`w-full pr-11 pl-4 py-3.5 border-2 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-150 bg-gray-50 focus:bg-white text-sm sm:text-base resize-none placeholder-gray-400 ${
                    errors.message ? "border-red-400 focus:ring-red-500 focus:border-red-500" : "border-gray-200"
                  }`}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-center gap-2 mr-1">
                    <span>⚠️</span>
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white py-3.5 sm:py-4 rounded-lg font-semibold text-sm sm:text-base hover:from-amber-600 hover:via-amber-700 hover:to-orange-600 transition-all duration-150 transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-md"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{t('contact.sending')}</span>
                  </>
                ) : (
                  <>
                    <FiSend className="text-lg sm:text-xl" />
                    <span>{t('contact.sendMessageButton')}</span>
                  </>
                )}
              </button>

              {/* Status Message */}
              {status && (
                <div className={`rounded-lg p-4 text-center text-sm sm:text-base font-medium ${status.startsWith("✅") ? "bg-green-50 text-green-800 border-2 border-green-200" : "bg-red-50 text-red-800 border-2 border-red-200"}`}>
                  {status}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
