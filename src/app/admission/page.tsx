"use client";

import { useState, useEffect, useRef } from "react";
import { AdmissionsApi, DegreesApi } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { FiUser, FiPhone, FiMail, FiCalendar, FiMapPin, FiBook, FiHome, FiGlobe } from "react-icons/fi";
import IslamicHeader from "@/app/components/IslamicHeader";

export default function AdmissionPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingDegrees, setLoadingDegrees] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [degrees, setDegrees] = useState<Array<{id: number, name: string}>>([
    // Fallback degrees while loading
   
  ]);

  // Refs for form fields to enable scrolling to errors
  const fieldRefs = useRef<Record<string, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>>({});

  const [formData, setFormData] = useState({
    unique_id: "",
    first_name: "",
    last_name: "",
    father_name: "",
    grandfather_name: "",
    permanent_province: "",
    permanent_distract: "",
    permanent_vilage: "",
    current_province: "",
    current_distract: "",
    current_vilage: "",
    phone: "",
    whatsapp_no: "",
    dob: "",
    blood_type: "",
    degree_id: 1, // Default to degree 1 (required field)
    previous_degree: "",
    previous_madrasa: "",
    location_madrasa: "",
    location: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch degrees from API on component mount
  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        setLoadingDegrees(true);
        console.log('📚 [ADMISSION] Fetching degrees from API...');
        
        const result = await DegreesApi.getAll({ limit: 100 });
        
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          // Map API response to expected format
          const formattedDegrees = result.data.map((degree: any) => ({
            id: Number(degree.id) || degree.id,
            name: degree.name || degree.title || String(degree.id),
          }));
          
          console.log('✅ [ADMISSION] Degrees fetched successfully:', formattedDegrees);
          setDegrees(formattedDegrees);
          
          // Set default degree_id to first degree from API
          if (formattedDegrees.length > 0) {
            setFormData(prev => ({
              ...prev,
              degree_id: prev.degree_id || formattedDegrees[0].id,
            }));
          }
        } else {
          console.warn('⚠️ [ADMISSION] No degrees received from API, using fallback');
        }
      } catch (error) {
        console.error('❌ [ADMISSION] Error fetching degrees:', error);
        toast.error('Failed to load degrees. Using default values.');
      } finally {
        setLoadingDegrees(false);
      }
    };

    fetchDegrees();
  }, []); // Run once on mount

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Validate blood type length (max 5 characters)
    if (name === 'blood_type' && value.length > 5) {
      setErrors({ ...errors, blood_type: 'Blood type must not exceed 5 characters (e.g., O+ or A-)' });
      return;
    }
    
    // Handle degree_id conversion to number
    let processedValue: string | number = value;
    if (name === 'degree_id') {
      processedValue = Number(value) || 1; // Convert to number, default to 1 if invalid
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    
    setFormData({ ...formData, [name]: processedValue });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form before submitting - all fields are required
      const newErrors: Record<string, string> = {};
      
      // Personal Information
      if (!formData.first_name.trim()) {
        newErrors.first_name = 'مهرباني وکړئ دا ساحه ډکه کړئ - خپل نوم داخل کړئ';
      }
      if (!formData.last_name.trim()) {
        newErrors.last_name = 'مهرباني وکړئ دا ساحه ډکه کړئ - خپل تخلص داخل کړئ';
      }
      if (!formData.father_name.trim()) {
        newErrors.father_name = 'مهرباني وکړئ دا ساحه ډکه کړئ - د خپل پلار نوم داخل کړئ';
      }
      if (!formData.grandfather_name.trim()) {
        newErrors.grandfather_name = 'مهرباني وکړئ دا ساحه ډکه کړئ - د خپل نیکه نوم داخل کړئ';
      }
      if (!formData.dob.trim()) {
        newErrors.dob = 'مهرباني وکړئ دا ساحه ډکه کړئ - د زېږېدو نېټه وټاکئ';
      }
      
      // Validate blood type
      if (!formData.blood_type.trim()) {
        newErrors.blood_type = 'مهرباني وکړئ دا ساحه ډکه کړئ - خپله وینه ډوله داخل کړئ';
      } else if (formData.blood_type.length > 5) {
        newErrors.blood_type = 'د وینې ډوله باید 5 حروفو یا ډېر نه وي (مثال: O+ یا A-)';
      }
      
      // Contact Information
      if (!formData.phone.trim()) {
        newErrors.phone = 'مهرباني وکړئ دا ساحه ډکه کړئ - خپل ټيليفون شمېره داخل کړئ';
      }
      if (!formData.whatsapp_no.trim()) {
        newErrors.whatsapp_no = 'مهرباني وکړئ دا ساحه ډکه کړئ - خپله واتساپ شمېره داخل کړئ';
      }
      
      // Permanent Address
      if (!formData.permanent_province.trim()) {
        newErrors.permanent_province = 'مهرباني وکړئ دا ساحه ډکه کړئ - خپله دایمي ولایت داخل کړئ';
      }
      if (!formData.permanent_distract.trim()) {
        newErrors.permanent_distract = 'مهرباني وکړئ دا ساحه ډکه کړئ - خپله دایمي ولسوالۍ داخل کړئ';
      }
      if (!formData.permanent_vilage.trim()) {
        newErrors.permanent_vilage = 'مهرباني وکړئ دا ساحه ډکه کړئ - خپله دایمي کلي نوم داخل کړئ';
      }
      
      // Current Address
      if (!formData.current_province.trim()) {
        newErrors.current_province = 'مهرباني وکړئ دا ساحه ډکه کړئ - خپله اوسنۍ ولایت داخل کړئ';
      }
      if (!formData.current_distract.trim()) {
        newErrors.current_distract = 'مهرباني وکړئ دا ساحه ډکه کړئ - خپله اوسنۍ ولسوالۍ داخل کړئ';
      }
      if (!formData.current_vilage.trim()) {
        newErrors.current_vilage = 'مهرباني وکړئ دا ساحه ډکه کړئ - خپله اوسنۍ کلي نوم داخل کړئ';
      }
      
      // Educational Information
      if (!formData.degree_id || formData.degree_id === 0) {
        newErrors.degree_id = 'مهرباني وکړئ دا ساحه ډکه کړئ - خپله درجه وټاکئ';
      }
      if (!formData.previous_degree.trim()) {
        newErrors.previous_degree = 'مهرباني وکړئ دا ساحه ډکه کړئ - خپل مخکینی سند داخل کړئ';
      }
      if (!formData.previous_madrasa.trim()) {
        newErrors.previous_madrasa = 'مهرباني وکړئ دا ساحه ډکه کړئ - خپل مخکیني مدرسه نوم داخل کړئ';
      }
      if (!formData.location_madrasa.trim()) {
        newErrors.location_madrasa = 'مهرباني وکړئ دا ساحه ډکه کړئ - د مدرسې موقعیت داخل کړئ';
      }
      if (!formData.location.trim()) {
        newErrors.location = 'مهرباني وکړئ دا ساحه ډکه کړئ - خپل اوسنی موقعیت داخل کړئ';
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        const errorCount = Object.keys(newErrors).length;
        toast.error(`مهرباني وکړئ ${errorCount} خالي ساحې ډکه کړئ`);
        setLoading(false);
        
        // Scroll to the first error field
        const firstErrorField = Object.keys(newErrors)[0];
        const errorElement = fieldRefs.current[firstErrorField];
        
        if (errorElement) {
          // Scroll to the element with smooth behavior
          errorElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
          
          // Focus the field after a short delay to ensure scroll completes
          setTimeout(() => {
            errorElement.focus();
          }, 300);
        }
        
        return;
      }
      
      // Generate unique ID if not provided
      if (!formData.unique_id) {
        formData.unique_id = `ADM${Date.now()}`;
      }

      // Prepare data for API
      const submissionData: any = {
        unique_id: formData.unique_id || `ADM${Date.now()}`,
        first_name: formData.first_name,
        last_name: formData.last_name,
        father_name: formData.father_name,
        grandfather_name: formData.grandfather_name || "",
        permanent_province: formData.permanent_province || "",
        permanent_distract: formData.permanent_distract || "",
        permanent_vilage: formData.permanent_vilage || "",
        current_province: formData.current_province || "",
        current_distract: formData.current_distract || "",
        current_vilage: formData.current_vilage || "",
        phone: formData.phone || "",
        whatsapp_no: formData.whatsapp_no || "",
        dob: formData.dob || "",
        blood_type: formData.blood_type ? formData.blood_type.substring(0, 5) : "",
        degree_id: formData.degree_id ? Number(formData.degree_id) : 1, // Default to 1 if not set
        previous_degree: formData.previous_degree || "",
        previous_madrasa: formData.previous_madrasa || "",
        location_madrasa: formData.location_madrasa || "",
        location: formData.location || "",
      };

      console.log('📝 [FORM] Submitting admission data to API...');
      console.log('📝 [FORM] Submission data:', JSON.stringify(submissionData, null, 2));
      
      // Ensure we're calling the API
      console.log('🌐 [FORM] About to call AdmissionsApi.submit...');
      
      const result = await AdmissionsApi.submit(submissionData);
      
      console.log('📥 [FORM] API response received:', result);
      console.log('📥 [FORM] Response success status:', result?.success);
      
      if (result && result.success) {
        console.log('✅ [FORM] Form submitted successfully to Laravel dashboard!');
        setSubmitSuccess(true);
        toast.success("Admission form submitted successfully to the dashboard!");
        
        // Reset form
        setFormData({
          unique_id: "",
          first_name: "",
          last_name: "",
          father_name: "",
          grandfather_name: "",
          permanent_province: "",
          permanent_distract: "",
          permanent_vilage: "",
          current_province: "",
          current_distract: "",
          current_vilage: "",
          phone: "",
          whatsapp_no: "",
          dob: "",
          blood_type: "",
          degree_id: 1, // Reset to default value 1
          previous_degree: "",
          previous_madrasa: "",
          location_madrasa: "",
          location: "",
        });
        setErrors({});
      } else {
        console.warn('⚠️ [FORM] API returned but success is false:', result);
        const errorMsg = (result as any)?.error || result?.message || 'Submission failed - unknown error';
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      console.error('❌ [FORM] Form submission error:', error);
      console.error('❌ [FORM] Error message:', error.message);
      
      // Show user-friendly error message
      const errorMessage = error.message || 'Failed to submit admission form. Please check your connection and try again.';
      toast.error(`Submission failed: ${errorMessage}`);
      
      // Set a general error
      setErrors({ 
        submit: errorMessage 
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto mt-10">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 sm:p-12 text-center">
            <div className="w-24 h-24 bg-[#e0f2f2] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-[#4a8a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Amiri, serif' }}>
              نوم لیکنه بریالۍ شوه
            </h2>
            <p className="text-gray-600 mb-8 text-base sm:text-lg leading-relaxed" style={{ fontFamily: 'Amiri, serif' }}>
              ستاسو د نوم لیکنې لپاره مننه. موږ به ژر سره تاسو سره اړیکه ونیسو.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="px-8 py-3 bg-[#4a8a8a] text-white rounded-xl hover:bg-[#5a9a9a] transition-all duration-200 font-semibold text-base shadow-md hover:shadow-lg"
            >
              بل فورم واستوئ
            </button> 
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Islamic Hero Header */}
      <IslamicHeader
        title="د محصلینو د نوم لیکنې فورم"
        subtitle="مهرباني وکړئ خپل معلومات په دقت سره داخل کړئ"
        theme="amber"
        alignment="center"
        pageType="registration"
      />

      {/* Form Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8 lg:p-10 space-y-10">
          {/* Personal Information */}
          <section className="border-b border-gray-200 pb-8">
            <div className="bg-[#e0f2f2] rounded-xl p-5 mb-6 border border-[#d0e8e8]">
              <h2 className="text-xl md:text-2xl font-bold text-[#4a8a8a] flex items-center gap-3" style={{ fontFamily: 'Amiri, serif' }}>
                <div className="bg-[#4a8a8a] rounded-lg p-2.5 text-white">
                  <FiUser className="w-5 h-5" />
                </div>
                شخصي معلومات
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>ستاسو نوم *</label>
                <input
                  ref={(el) => { fieldRefs.current.first_name = el; }}
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.first_name ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  placeholder="ستاسو نوم *"
                  style={{ fontFamily: 'Amiri, serif' }}
                />
                {errors.first_name && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>ستاسو تخلص *</label>
                <input
                  ref={(el) => { fieldRefs.current.last_name = el; }}
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.last_name ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  placeholder="ستاسو تخلص *"
                  style={{ fontFamily: 'Amiri, serif' }}
                />
                {errors.last_name && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.last_name}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>د پلار نوم *</label>
                <input
                  ref={(el) => { fieldRefs.current.father_name = el; }}
                  type="text"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.father_name ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  placeholder="د پلار نوم *"
                  style={{ fontFamily: 'Amiri, serif' }}
                />
                {errors.father_name && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.father_name}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>د نیکه نوم *</label>
                <input
                  ref={(el) => { fieldRefs.current.grandfather_name = el; }}
                  type="text"
                  name="grandfather_name"
                  value={formData.grandfather_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.grandfather_name ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  placeholder="د نیکه نوم *"
                  style={{ fontFamily: 'Amiri, serif' }}
                />
                {errors.grandfather_name && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.grandfather_name}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>د زېږېدو نېټه *</label>
                <input
                  ref={(el) => { fieldRefs.current.dob = el; }}
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.dob ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  style={{ fontFamily: 'Amiri, serif' }}
                />
                {errors.dob && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.dob}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>د وینې ډوله (حداکثر ۵ حرف) *</label>
                <input
                  ref={(el) => { fieldRefs.current.blood_type = el; }}
                  type="text"
                  name="blood_type"
                  value={formData.blood_type}
                  onChange={handleChange}
                  maxLength={5}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.blood_type ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  placeholder="د وینې ډوله * (مثال: O+ یا A-)"
                  style={{ fontFamily: 'Amiri, serif' }}
                />
                {errors.blood_type && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.blood_type}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="border-b border-gray-200 pb-8">
            <div className="bg-[#e0f2f2] rounded-xl p-5 mb-6 border border-[#d0e8e8]">
              <h2 className="text-xl md:text-2xl font-bold text-[#4a8a8a] flex items-center gap-3" style={{ fontFamily: 'Amiri, serif' }}>
                <div className="bg-[#4a8a8a] rounded-lg p-2.5 text-white">
                  <FiPhone className="w-5 h-5" />
                </div>
                د اړیکو معلومات
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>ټیلیفون شمېره *</label>
                <input
                  ref={(el) => { fieldRefs.current.phone = el; }}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.phone ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  style={{ fontFamily: 'Amiri, serif' }}
                  placeholder="ستاسو ټيليفون شمېره * (07X XXX XXXX)"
                />
                {errors.phone && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>واتساپ شمېره *</label>
                <input
                  ref={(el) => { fieldRefs.current.whatsapp_no = el; }}
                  type="tel"
                  name="whatsapp_no"
                  value={formData.whatsapp_no}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.whatsapp_no ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  style={{ fontFamily: 'Amiri, serif' }}
                  placeholder="ستاسو واتساپ شمېره * (07X XXX XXXX)"
                />
                {errors.whatsapp_no && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.whatsapp_no}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Permanent Address */}
          <section className="border-b border-gray-200 pb-8">
            <div className="bg-[#e0f2f2] rounded-xl p-5 mb-6 border border-[#d0e8e8]">
              <h2 className="text-xl md:text-2xl font-bold text-[#4a8a8a] flex items-center gap-3" style={{ fontFamily: 'Amiri, serif' }}>
                <div className="bg-[#4a8a8a] rounded-lg p-2.5 text-white">
                  <FiHome className="w-5 h-5" />
                </div>
                دایمي پته
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>ولایت *</label>
                <input
                  ref={(el) => { fieldRefs.current.permanent_province = el; }}
                  type="text"
                  name="permanent_province"
                  value={formData.permanent_province}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.permanent_province ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  style={{ fontFamily: 'Amiri, serif' }}
                  placeholder="دایمي ولایت *"
                />
                {errors.permanent_province && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.permanent_province}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>ولسوالۍ *</label>
                <input
                  ref={(el) => { fieldRefs.current.permanent_distract = el; }}
                  type="text"
                  name="permanent_distract"
                  value={formData.permanent_distract}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.permanent_distract ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  style={{ fontFamily: 'Amiri, serif' }}
                  placeholder="دایمي ولسوالۍ *"
                />
                {errors.permanent_distract && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.permanent_distract}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>کلي نوم *</label>
                <input
                  ref={(el) => { fieldRefs.current.permanent_vilage = el; }}
                  type="text"
                  name="permanent_vilage"
                  value={formData.permanent_vilage}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.permanent_vilage ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  style={{ fontFamily: 'Amiri, serif' }}
                  placeholder="دایمي کلي نوم *"
                />
                {errors.permanent_vilage && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.permanent_vilage}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Current Address */}
          <section className="border-b border-gray-200 pb-8">
            <div className="bg-[#e0f2f2] rounded-xl p-5 mb-6 border border-[#d0e8e8]">
              <h2 className="text-xl md:text-2xl font-bold text-[#4a8a8a] flex items-center gap-3" style={{ fontFamily: 'Amiri, serif' }}>
                <div className="bg-[#4a8a8a] rounded-lg p-2.5 text-white">
                  <FiGlobe className="w-5 h-5" />
                </div>
                اوسنۍ پته
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>ولایت *</label>
                <input
                  ref={(el) => { fieldRefs.current.current_province = el; }}
                  type="text"
                  name="current_province"
                  value={formData.current_province}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.current_province ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  style={{ fontFamily: 'Amiri, serif' }}
                  placeholder="اوسنۍ ولایت *"
                />
                {errors.current_province && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.current_province}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>ولسوالۍ *</label>
                <input
                  ref={(el) => { fieldRefs.current.current_distract = el; }}
                  type="text"
                  name="current_distract"
                  value={formData.current_distract}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.current_distract ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  style={{ fontFamily: 'Amiri, serif' }}
                  placeholder="اوسنۍ ولسوالۍ *"
                />
                {errors.current_distract && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.current_distract}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>کلي نوم *</label>
                <input
                  ref={(el) => { fieldRefs.current.current_vilage = el; }}
                  type="text"
                  name="current_vilage"
                  value={formData.current_vilage}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.current_vilage ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  style={{ fontFamily: 'Amiri, serif' }}
                  placeholder="اوسنۍ کلي نوم *"
                />
                {errors.current_vilage && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.current_vilage}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Educational Information */}
          <section className="border-b border-gray-200 pb-8">
            <div className="bg-[#e0f2f2] rounded-xl p-5 mb-6 border border-[#d0e8e8]">
              <h2 className="text-xl md:text-2xl font-bold text-[#4a8a8a] flex items-center gap-3" style={{ fontFamily: 'Amiri, serif' }}>
                <div className="bg-[#4a8a8a] rounded-lg p-2.5 text-white">
                  <FiBook className="w-5 h-5" />
                </div>
                د زده کړو معلومات
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>
                  درجه *
                  {loadingDegrees && (
                    <span className="text-xs text-gray-500 mr-2">(د پورته کولو په حال کې...)</span>
                  )}
                </label>
                <select
                  ref={(el) => { fieldRefs.current.degree_id = el; }}
                  name="degree_id"
                  value={formData.degree_id || (degrees.length > 0 ? degrees[0].id : 1)}
                  onChange={handleChange}
                  disabled={loadingDegrees}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.degree_id ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  } ${loadingDegrees ? "opacity-50 cursor-not-allowed" : ""}`}
                  style={{ fontFamily: 'Amiri, serif' }}
                  required
                >
                  {degrees.map((degree) => (
                    <option key={degree.id} value={degree.id}>
                      {degree.name}
                    </option>
                  ))}
                </select>
                {errors.degree_id && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.degree_id}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>مخکینی سند *</label>
                <input
                  ref={(el) => { fieldRefs.current.previous_degree = el; }}
                  type="text"
                  name="previous_degree"
                  value={formData.previous_degree}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.previous_degree ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  style={{ fontFamily: 'Amiri, serif' }}
                  placeholder="مخکینی سند * (مثال: فارغ‌التحصیلی)"
                />
                {errors.previous_degree && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.previous_degree}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>مخکیني مدرسه نوم *</label>
                <input
                  ref={(el) => { fieldRefs.current.previous_madrasa = el; }}
                  type="text"
                  name="previous_madrasa"
                  value={formData.previous_madrasa}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.previous_madrasa ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  style={{ fontFamily: 'Amiri, serif' }}
                  placeholder="مخکیني مدرسه نوم *"
                />
                {errors.previous_madrasa && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.previous_madrasa}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>د مدرسې موقعیت *</label>
                <input
                  ref={(el) => { fieldRefs.current.location_madrasa = el; }}
                  type="text"
                  name="location_madrasa"
                  value={formData.location_madrasa}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.location_madrasa ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  style={{ fontFamily: 'Amiri, serif' }}
                  placeholder="د مدرسې موقعیت *"
                />
                {errors.location_madrasa && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.location_madrasa}
                  </p>
                )}
              </div>

              <div className="w-full md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 w-full" style={{ fontFamily: 'Amiri, serif' }}>موقعیت *</label>
                <input
                  ref={(el) => { fieldRefs.current.location = el; }}
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4a8a8a] focus:border-[#4a8a8a] transition-all duration-200 text-sm ${
                    errors.location ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-[#4a8a8a]"
                  }`}
                  style={{ fontFamily: 'Amiri, serif' }}
                  placeholder="اوسنی موقعیت *"
                />
                {errors.location && (
                  <p className="bg-red-50 text-red-700 text-sm mt-2 p-2.5 rounded-lg flex items-center gap-2 border border-red-200" style={{ fontFamily: 'Amiri, serif' }}>
                    <span>⚠️</span>
                    {errors.location}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4a8a8a] hover:bg-[#5a9a9a] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.01] disabled:opacity-70 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
              style={{ fontFamily: 'Amiri, serif' }}
            >
              <span className="absolute inset-0 bg-[#5a9a9a] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="relative z-10 flex items-center gap-3">
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  د لېږلو په حال کې...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                    فورم واستوئ
                </>
              )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

