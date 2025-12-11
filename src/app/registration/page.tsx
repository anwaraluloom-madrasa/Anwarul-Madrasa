"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
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
    degree_id: "",
    previous_degree: "",
    previous_madrasa: "",
    location_madrasa: "",
    location: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    try {
      const response = await fetch("/api/admission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit registration");
      }

      const result = await response.json();
      console.log("Registration successful:", result);
      
      setSubmitStatus("success");
      
      // Reset form after successful submission
      setFormData({
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
        degree_id: "",
        previous_degree: "",
        previous_madrasa: "",
        location_madrasa: "",
        location: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const provinces = ["Kabul", "Herat", "Balkh", "Kandahar", "Nangarhar", "Kunduz", "Baghlan", "Ghazni", "Khost", "Paktia", "Other"];
  const degrees = [
    { id: "1", name: "Primary (1-6)" },
    { id: "2", name: "Secondary (7-9)" },
    { id: "3", name: "High School (10-12)" },
    { id: "4", name: "Bachelor's Degree" },
    { id: "5", name: "Master's Degree" },
    { id: "6", name: "PhD" },
    { id: "7", name: "Other" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 pt-32 pb-8">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="mt-4 sm:mt-8 md:mt-12 mb-6 sm:mb-8">
          <Breadcrumb />
        </div>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-3 py-1 bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-medium rounded-full mb-3 shadow-sm border border-amber-200/60">
            <span className="text-sm mr-1">📚</span>
            Registration
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Join Islamic Classes
          </h1>
          <p className="text-gray-600 text-sm">
            Complete the form below to register
          </p>
        </div>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-lg mr-2">✅</span>
              <span className="text-sm font-medium text-green-800">Registration successful! We'll contact you soon.</span>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-lg mr-2">❌</span>
              <span className="text-sm font-medium text-red-800">Registration failed. Please try again.</span>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Personal Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Father's Name *
                  </label>
                  <input
                    type="text"
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your father's name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Grandfather's Name *
                  </label>
                  <input
                    type="text"
                    name="grandfather_name"
                    value={formData.grandfather_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your grandfather's name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Blood Type *
                  </label>
                  <select
                    name="blood_type"
                    value={formData.blood_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="">Select blood type</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    name="whatsapp_no"
                    value={formData.whatsapp_no}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your WhatsApp number"
                  />
                </div>
              </div>
            </div>

            {/* Permanent Address */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Permanent Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Province *
                  </label>
                  <select
                    name="permanent_province"
                    value={formData.permanent_province}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="">Select province</option>
                    {provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    District *
                  </label>
                  <input
                    type="text"
                    name="permanent_distract"
                    value={formData.permanent_distract}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter district"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Village *
                  </label>
                  <input
                    type="text"
                    name="permanent_vilage"
                    value={formData.permanent_vilage}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter village"
                  />
                </div>
              </div>
            </div>

            {/* Current Address */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Current Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Province *
                  </label>
                  <select
                    name="current_province"
                    value={formData.current_province}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="">Select province</option>
                    {provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    District *
                  </label>
                  <input
                    type="text"
                    name="current_distract"
                    value={formData.current_distract}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter district"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Village *
                  </label>
                  <input
                    type="text"
                    name="current_vilage"
                    value={formData.current_vilage}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter village"
                  />
                </div>
              </div>
            </div>

            {/* Educational Background */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Educational Background</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Desired Degree Level *
                  </label>
                  <select
                    name="degree_id"
                    value={formData.degree_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="">Select degree level</option>
                    {degrees.map(degree => (
                      <option key={degree.id} value={degree.id}>{degree.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Previous Degree *
                  </label>
                  <input
                    type="text"
                    name="previous_degree"
                    value={formData.previous_degree}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your previous degree"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Previous Madrasa/School *
                  </label>
                  <input
                    type="text"
                    name="previous_madrasa"
                    value={formData.previous_madrasa}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter previous madrasa/school name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location of Previous Madrasa *
                  </label>
                  <input
                    type="text"
                    name="location_madrasa"
                    value={formData.location_madrasa}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter location of previous madrasa"
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Location Information *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Any additional location or address information"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold text-base rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-150 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </span>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-4">
          <p className="text-gray-500 text-xs">
            By submitting this form, you agree to our terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
