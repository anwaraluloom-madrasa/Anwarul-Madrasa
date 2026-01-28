import { BooksApi } from "../../../lib/api";
import Image from "next/image";
import { Book } from "../../../lib/types";
import Link from "next/link";
import { FaBook, FaCalendar, FaUser, FaArrowLeft, FaEye, FaHeart } from 'react-icons/fa';
import { FaDownload, FaDownLong } from "react-icons/fa6";
import { buildStorageUrl, getImageUrl } from "@/lib/utils";
import { cleanText } from "@/lib/textUtils";
import Breadcrumb from "@/components/Breadcrumb";

interface Params {
  params: Promise<{ id: string }>;
}

export default async function BookDetailsPage({ params }: Params) {
  const { id } = await params;

  try {
    const res = await BooksApi.getById(id);
    const book = res.data as Book;

    if (!book) {
      return (
        <div className="min-h-screen  flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-4 border border-amber-100">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-2xl font-bold text-black mb-4">کتاب پیدا نشوو</h1>
            <p className="text-gray-600 mb-6">بښنه غواړم کوم کتاب چی ته غواړی هغه اوس موجود نه دي</p>
            <Link
              href="/book"
              className="inline-block px-6 py-3  bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md"
            >
              Back to Books
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen mt-36 md:mt-[100px] bg-gradient-to-br from-slate-50 via-amber-50/20 to-white" dir="rtl">
        {/* Compact Header Section */}
        <div className="relative bg-white border-b border-gray-200/60">
          <div className="relative max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
            <div className="mt-4 sm:mt-8 md:mt-12">
              <Breadcrumb />
            </div>
            {/* Navigation */}
           
            
            {/* Title Section */}
            <div className="text-center space-y-3">
           
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-gray-900 tracking-tight">
                {cleanText(book.title)}
              </h1>
              <div className="flex items-center justify-center gap-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-amber-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent via-orange-400 to-orange-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Description */}
            <div className="lg:col-span-2 space-y-5">
              {/* Description Card */}
              {book.description && (
                <div className="group bg-white rounded-xl border border-gray-200/60 p-5 sm:p-6 transition-all duration-150">
                  <div className="flex items-center gap-3.5 mb-4 pb-3 border-b border-amber-100">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <FaBook className="w-4 h-4 text-amber-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">تفصیلات</h2>
                  </div>
                  <div
                    className="text-gray-700 text-sm sm:text-base leading-relaxed [&_*]:text-gray-700 [&_*]:text-sm sm:[&_*]:text-base [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:mr-6 [&_ol]:list-decimal [&_ol]:mr-6 [&_li]:mb-2 [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_img]:rounded-lg [&_img]:my-4 [&_blockquote]:border-r-4 [&_blockquote]:border-gray-300 [&_blockquote]:pr-4 [&_blockquote]:italic"
                    dir="rtl"
                    dangerouslySetInnerHTML={{ __html: book.description || '' }}
                  />
                </div>
              )}

              {/* Author Section */}
              {book.author && book.author.first_name && (
                <div className="group bg-white rounded-xl border border-gray-200/60 p-5 sm:p-6 transition-all duration-150">
                  <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-amber-100">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-amber-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">لیکوال</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-5">
                    {book.author.image && (
                      <div className="flex-shrink-0">
                        <Link href={`/authors/${book.author.id}`} className="block group">
                          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-4 border-amber-200 transition-all duration-150 group-hover:scale-105">
                            <Image
                              src={getImageUrl(book.author.image) || ""}
                              alt={`${book.author.first_name} ${book.author.last_name || ''}`}
                              width={112}
                              height={112}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>
                      </div>
                    )}
                    <div className="flex-1 space-y-3">
                      <Link href={`/authors/${book.author.id}`}>
                        <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 hover:text-amber-700 transition-colors duration-150">
                          {cleanText(book.author.first_name)} {cleanText(book.author.last_name || '')}
                        </h3>
                      </Link>
                      {book.author.bio && (
                        <div
                          className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100 [&_*]:text-gray-700 [&_*]:text-sm [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:mr-6 [&_ol]:list-decimal [&_ol]:mr-6 [&_li]:mb-2 [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_img]:rounded-lg [&_img]:my-4 [&_blockquote]:border-r-4 [&_blockquote]:border-gray-300 [&_blockquote]:pr-4 [&_blockquote]:italic"
                          dir="rtl"
                          dangerouslySetInnerHTML={{ __html: book.author.bio || '' }}
                        />
                      )}
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {book.author.contact_no && (
                          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 rounded-lg border border-amber-200/50 text-xs font-medium text-gray-700">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            {book.author.contact_no}
                          </span>
                        )}
                        {book.author.full_address && (
                          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 rounded-lg border border-amber-200/50 text-xs font-medium text-gray-700">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            {book.author.full_address}
                          </span>
                        )}
                        {book.author.dob && (
                          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 rounded-lg border border-amber-200/50 text-xs font-medium text-gray-700">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            {book.author.dob}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Book Image & Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-3 sticky top-24 space-y-3 max-w-xs mx-auto lg:mx-0">
              {/* Book Image */}
                <div className="relative">
                  {book.image ? (
                    <div className="relative rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={getImageUrl(book.image, "/placeholder-book.jpg") || "/placeholder-book.jpg"}
                      alt={book.title}
                      width={250}
                      height={320}
                      className="w-full h-auto object-cover"
                    />
                    </div>
                  ) : (
                    <div className="w-full aspect-[3/4] bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
                      <div className="text-center text-gray-400">
                        <div className="text-4xl mb-1">📚</div>
                        <div className="text-xs">انځور نشته</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Book Data Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {book.written_year && (
                    <div className="bg-green-50 p-2.5 rounded-md border border-green-200">
                      <div className="flex flex-col items-center text-center space-y-1.5">
                        <FaCalendar className="w-4 h-4 text-green-600" />
                        <div className="space-y-0.5">
                          <div className="text-xs text-green-700">کال</div>
                          <div className="text-sm font-bold text-green-900">{book.written_year}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {book.pages && (
                    <div className="bg-green-50 p-2.5 rounded-md border border-green-200">
                      <div className="flex flex-col items-center text-center space-y-1.5">
                        <FaBook className="w-4 h-4 text-green-600" />
                        <div className="space-y-0.5">
                          <div className="text-xs text-green-700">پاڼې</div>
                          <div className="text-sm font-bold text-green-900">{book.pages}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {typeof book.downloadable !== "undefined" && (
                    <div className={`p-2.5 rounded-md border ${
                      book.downloadable 
                        ? "bg-green-50 border-green-200" 
                        : "bg-gray-50 border-gray-200"
                    }`}>
                      <div className="flex flex-col items-center text-center space-y-1.5">
                        <FaDownload className={`w-4 h-4 ${book.downloadable ? "text-green-600" : "text-gray-400"}`} />
                        <div className="space-y-0.5">
                          <div className={`text-xs ${book.downloadable ? "text-green-700" : "text-gray-500"}`}>
                            ډاونلوډ
                          </div>
                          <div className={`text-xs font-bold flex items-center justify-center gap-1 ${
                            book.downloadable ? "text-green-900" : "text-gray-500"
                          }`}>
                            {book.downloadable ? (
                              <>
                                <span>✓</span>
                                <span>هو</span>
                              </>
                            ) : (
                              <>
                                <span>✗</span>
                                <span>نه</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {typeof book.is_in_library !== "undefined" && (
                    <div className={`p-2.5 rounded-md border ${
                      book.is_in_library 
                        ? "bg-green-50 border-green-200" 
                        : "bg-gray-50 border-gray-200"
                    }`}>
                      <div className="flex flex-col items-center text-center space-y-1.5">
                        <FaBook className={`w-4 h-4 ${book.is_in_library ? "text-green-600" : "text-gray-400"}`} />
                        <div className="space-y-0.5">
                          <div className={`text-xs ${book.is_in_library ? "text-green-700" : "text-gray-500"}`}>
                            په کتابتون کې
                          </div>
                          <div className={`text-xs font-bold ${
                            book.is_in_library ? "text-green-900" : "text-gray-500"
                          }`}>
                            {book.is_in_library ? "هو" : "نه"}
                          </div>
                        </div>
                      </div>
                    </div>
                    )}
                  </div>

                {/* Download Button */}
                <div>
                      {book.downloadable && book.pdf_file ? (
                        <a
                          href={buildStorageUrl(book.pdf_file) || "#"}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-md font-semibold transition-colors text-sm"
                        >
                      <FaDownload className="w-4 h-4" />
                      <span>ډاونلوډ کړئ</span>
                        </a>
                      ) : (
                        <button
                          disabled
                      className="w-full flex items-center justify-center gap-2.5 border border-gray-300 text-gray-400 px-4 py-2.5 rounded-md cursor-not-allowed bg-gray-100 font-semibold text-sm"
                    >
                      <span>🚫</span>
                      <span>شتون نلري</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching book:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-4 border border-amber-100">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-black mb-4">Error Loading Book</h1>
          <p className="text-gray-600 mb-6">Sorry, there was an error loading the book details.</p>
          <Link
            href="/book"
            className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md"
          >
            Back to Books
          </Link>
        </div>
      </div>
    );
  }
}
