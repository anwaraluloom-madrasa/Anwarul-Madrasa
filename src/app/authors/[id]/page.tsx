// app/authors/[id]/page.tsx
import Image from "next/image";
import { AuthorsApi } from "../../../lib/api";
import { Author } from "../../../lib/types";
import {
  Calendar,
  BookOpen,
  Award,
  MapPin,
  BookText,
  User,
  Phone,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { getTranslation } from "@/lib/translations";
import Breadcrumb from "@/components/Breadcrumb";
import IslamicHeader from "../../components/IslamicHeader";
import AuthorDetailImage from "../../components/authors/AuthorDetailImage";

interface AuthorPageProps {
  params: Promise<{ id: string }>;
}

async function fetchAuthor(id: string): Promise<Author> {
  try {
    const response = await AuthorsApi.getById(id);
    if (!response.success) {
      throw new Error(response.error || "Author not found");
    }

    return response.data as Author;
  } catch {
    throw new Error("Author not found");
  }
}

export default async function AuthorDetailPage({ params }: AuthorPageProps) {
  const { id } = await params;
  const author = await fetchAuthor(id);

  const t = (key: string): string => {
    const translation = getTranslation(key, "ps");
    return typeof translation === "string" ? translation : key;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return t("authorDetail.notAvailable");
    const cleaned = dateString.replace(/<[^>]*>/g, "").trim();
    if (!cleaned) return t("authorDetail.notAvailable");
    try {
      const date = new Date(cleaned);
      if (isNaN(date.getTime())) return cleaned;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return cleaned;
    }
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 font-sans" dir="rtl">
      <IslamicHeader 
        pageType="authors"
        title={`${author.first_name} ${author.last_name}`}
        alignment="center"
      />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12" dir="rtl">
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>
       
        {/* Hero Section - Redesigned */}
        <div className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 rounded-3xl border-2 border-emerald-200/60 shadow-2xl overflow-hidden mb-10">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-200/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative p-8 md:p-12 lg:p-16">
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center mb-10">
              {/* Profile Image with Enhanced Styling */}
              <div className="relative mb-8">
                {/* Outer glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 opacity-20 blur-2xl scale-110"></div>
                
                <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-emerald-100/50 bg-white">
                  <AuthorDetailImage
                    src={author.image}
                    alt={`${author.first_name} ${author.last_name}`}
                  />
                </div>
                
                {/* Status Badge */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full shadow-xl border-4 border-white transition-transform hover:scale-110 ${
                      author.is_alive
                        ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                        : "bg-gradient-to-br from-red-500 to-red-600 text-white"
                    }`}
                  >
                    {author.is_alive ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : (
                      <XCircle className="w-7 h-7" />
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight text-center"
                style={{ fontFamily: "Amiri, serif" }}
              >
                {author.first_name} {author.last_name}
              </h1>

              {/* Book Count Badge */}
              {author.book_count > 0 && (
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-2 border-emerald-500 shadow-lg mb-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-base font-bold" style={{ fontFamily: "Amiri, serif" }}>
                    {author.book_count} {author.book_count === 1 ? t("authorDetail.book") : t("authorDetail.books")}
                  </span>
                </div>
              )}
            </div>

            {/* Biography Section */}
            {author.bio && (
              <div className="mt-10 pt-10 border-t-2 border-emerald-200/60">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-md">
                    <BookText className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Amiri, serif' }}>
                    {t("authorDetail.biography")}
                  </h2>
                </div>
                <div
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed bg-white/60 rounded-2xl p-6 md:p-8 border border-emerald-100/50 [&_p]:mb-4 [&_p]:text-lg [&_strong]:font-semibold [&_strong]:text-gray-900 [&_em]:italic [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-2"
                  style={{ fontFamily: 'Amiri, serif' }}
                  dangerouslySetInnerHTML={{ __html: author.bio }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Information Cards Section - Redesigned */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10">
          {/* Personal Information Card */}
          <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-emerald-400 transition-all duration-300 overflow-hidden group">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Amiri, serif' }}>
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                {t("authorDetail.personalInformation")}
              </h3>
            </div>
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all duration-200 group/item">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                  <User className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">
                    {t("authorDetail.fathersName")}
                  </p>
                  <p className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Amiri, serif' }}>
                    {author.father_name || t("authorDetail.notAvailable")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all duration-200 group/item">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                  <User className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">
                    {t("authorDetail.grandfathersName")}
                  </p>
                  <p className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Amiri, serif' }}>
                    {author.grandfather_name || t("authorDetail.notAvailable")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all duration-200 group/item">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">
                    {t("authorDetail.dateOfBirth")}
                  </p>
                  <p className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Amiri, serif' }}>
                    {formatDate(author.dob)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-emerald-400 transition-all duration-300 overflow-hidden group">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Amiri, serif' }}>
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                {t("authorDetail.contactInformation")}
              </h3>
            </div>
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all duration-200 group/item">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">
                    {t("authorDetail.address")}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 break-words leading-relaxed" style={{ fontFamily: 'Amiri, serif' }}>
                    {author.full_address || t("authorDetail.notAvailable")}
                  </p>
                </div>
              </div>

              {author.contact_no && (
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all duration-200 group/item">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">
                      {t("authorDetail.contactNumber")}
                    </p>
                    <a
                      href={`tel:${author.contact_no}`}
                      className="text-lg font-semibold text-emerald-700 hover:text-emerald-800 transition-colors inline-block" style={{ fontFamily: 'Amiri, serif' }}
                    >
                      {author.contact_no}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Stats Section - Redesigned */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {/* Books Card */}
          <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-3xl shadow-xl border-2 border-emerald-200 px-8 py-10 flex flex-col items-center justify-center relative overflow-hidden hover:shadow-2xl hover:border-emerald-400 hover:-translate-y-1 transition-all duration-300 group">
            {/* Decorative background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-200/40 w-32 h-32 rounded-full z-0 blur-2xl group-hover:bg-emerald-300/50 transition-colors"></div>
            <div className="z-10 flex flex-col items-center">
              <div className="mb-4">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 border-2 border-emerald-300 shadow-lg group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-emerald-700" />
                </span>
              </div>
              <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wide mb-3" style={{ fontFamily: 'Amiri, serif' }}>
                {t("authorDetail.books")}
              </h4>
              <p className="text-5xl font-bold text-gray-900" style={{ fontFamily: 'Amiri, serif' }}>{author.book_count || 0}</p>
            </div>
          </div>

          {/* Status Card */}
          <div className={`rounded-3xl shadow-xl border-2 px-8 py-10 flex flex-col items-center justify-center relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group ${
            author.is_alive 
              ? "bg-gradient-to-br from-white to-green-50/30 border-green-300 hover:border-green-400" 
              : "bg-gradient-to-br from-white to-red-50/30 border-red-300 hover:border-red-400"
          }`}>
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full z-0 blur-2xl transition-colors ${
              author.is_alive ? "bg-green-200/40 group-hover:bg-green-300/50" : "bg-red-200/40 group-hover:bg-red-300/50"
            }`}></div>
            <div className="z-10 flex flex-col items-center">
              <div className="mb-4">
                <span className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl border-2 shadow-lg group-hover:scale-110 transition-transform ${
                  author.is_alive 
                    ? "bg-gradient-to-br from-green-100 to-green-200 border-green-300" 
                    : "bg-gradient-to-br from-red-100 to-red-200 border-red-300"
                }`}>
                  {author.is_alive ? (
                    <CheckCircle2 className="w-8 h-8 text-green-700" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-700" />
                  )}
                </span>
              </div>
              <h4 className={`text-sm font-bold uppercase tracking-wide mb-3 ${author.is_alive ? 'text-green-700' : 'text-red-700'}`} style={{ fontFamily: 'Amiri, serif' }}>
                {t("authorDetail.status")}
              </h4>
              <p className={`text-lg font-bold ${author.is_alive ? 'text-green-700' : 'text-red-700'}`} style={{ fontFamily: 'Amiri, serif' }}>
                {author.is_alive ? t("authorDetail.alive") : t("authorDetail.deceased")}
              </p>
            </div>
          </div>

          {/* Published Status Card */}
          <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-3xl shadow-xl border-2 border-emerald-200 px-8 py-10 flex flex-col items-center justify-center relative overflow-hidden hover:shadow-2xl hover:border-emerald-400 hover:-translate-y-1 transition-all duration-300 group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-200/40 w-32 h-32 rounded-full z-0 blur-2xl group-hover:bg-emerald-300/50 transition-colors"></div>
            <div className="z-10 flex flex-col items-center">
              <div className="mb-4">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 border-2 border-emerald-300 shadow-lg group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-emerald-700" />
                </span>
              </div>
              <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wide mb-3" style={{ fontFamily: 'Amiri, serif' }}>
                {t("authorDetail.published")}
              </h4>
              <p className={`text-2xl font-bold ${author.is_published ? 'text-emerald-700' : 'text-gray-500'}`} style={{ fontFamily: 'Amiri, serif' }}>
                {author.is_published ? t("authorDetail.yes") : t("authorDetail.no")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
