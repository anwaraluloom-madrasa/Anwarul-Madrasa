"use client";

import { useState, useEffect } from "react";
import Hero from "../app/herosection/page";
import About from "./components/about/page";
import Blogs from "../app/components/blog/BlogCard";
import Course from "../app/components/courses/courseCard";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { CoursesApi } from "@/lib/api";
import type { Course as CourseType } from "@/lib/types";
import { HeartHandshake, Sprout, Coins } from "lucide-react";
import UnifiedLoader from "@/components/loading/UnifiedLoader";

// Import components directly - no lazy loading for instant rendering
import LazyEventSection from "./components/LazyEventSection";
import GraduationsSection from "./components/graduation/TopGraduations";
import LazyGallerySection from "./components/LazyGallerySection";
import BooksSection from "./components/books/BooksSection";
import ShajaraSection from "./components/sanad/SanadSection";

export default function HomePage() {
  const { t: tRaw } = useTranslation("common", { useSuspense: false });
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create a string-safe wrapper function
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === "string" ? result : key;
  };

  // Fetch courses from API
  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const result = await CoursesApi.getAll({ limit: 3 });
        if (result.success && Array.isArray(result.data)) {
          setCourses(result.data);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <About />

      {/* Courses Section */}
      <section className="py-6 bg-primary-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Simple Hero Text */}
          <div className="mb-8">
            <p className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-amber-700 text-sm font-semibold mb-4">
              {t("home.exploreKnowledge")}
            </p>

            <h2 className="text-3xl md:text-5xl font-bold text-primary-700 mb-4">
              {t("home.popularCourses")}
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto sm:text-sm">
              {t("home.coursesDescription")}
            </p>
          </div>

          {/* Simple Courses Section */}
          <div className="mt-8">
            {loading ? (
              <UnifiedLoader variant="grid" count={3} className="pt-0" />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <div className="relative">
                <Course courses={courses} showAll={false} />

                {/* Simple Call to Action */}
                <div className="mt-8 text-center">
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-150 transform hover:-translate-y-0.5"
                  >
                    <span>{t("home.viewAllCourses")}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* gragurtion */}

      {/* Events Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <LazyEventSection />
        </div>
      </section>

      {/* Books */}
      <section className="relative py-12 bg-primary-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Simple Hero Text */}
          <div className="mb-8">
            <p className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-amber-700 text-sm font-semibold mb-4">
              {t("home.exploreKnowledge")}
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-primary-700 mb-4">
              {t("home.ourBooks")}
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("home.booksDescription")} {t("home.booksDescriptionEnd")}
            </p>
          </div>

          {/* Simple Books Section */}
          <div className="mt-8">
            <div className="relative">
              <BooksSection showAll={false} />

              {/* Simple Call to Action */}
              <div className="mt-8 text-center">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-150 transform hover:-translate-y-0.5"
                >
                  <span>{t("home.viewAllBooks")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sanad Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary-50 via-teal-50/50 to-primary-100">
        <div className="relative max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 text-center z-10">
          {/* Hero Text */}
          <div className="mb-14">
            <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-primary-400/20 to-primary-500/20 text-primary-700 text-sm font-semibold rounded-full mb-6 animate-fade-in backdrop-blur-sm">
              <span className="icon-scroll">📜</span> زموږ  سند
            </div>
            <h2
              className="text-4xl md:text-5xl font-extrabold text-primary-700 mb-5 "
              lang="ar"
              // data-no-translate="true"
              // translate="no"
            >
             
د نقشبندیې شریفې طریقې شجره
            </h2>
            <p
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed "
              lang="ar"
              // data-no-translate="true"
              // translate="no"
            >
              د اولیاؤ او عارفانو روحاني سلسله
            </p>
          </div>

          {/* Sanad Section */}
          <div className="mt-12 relative">
            {/* Title Box */}

            <ShajaraSection showAll={false} showHero={false} />
            {/* Call to Action */}
            <div className="mt-10 text-center">
              <Link
                href="/sanad"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-150 transform hover:-translate-y-0.5"
              >
                <span>ټول سند وګورئ</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <LazyGallerySection />

      {/* gragutaion */}
      <section className="relative py-20 overflow-hidden bg-primary-50">
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          {/* Hero Text */}
          <div className="mb-14">
            <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-orange-400/20 to-orange-500/20 text-orange-700 text-sm font-semibold rounded-full mb-6 animate-fade-in backdrop-blur-sm">
              <span className="icon-graduation">🎓</span>{" "}
              {t("home.celebratingSuccess")}
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary-700 mb-5 leading-tight animate-fade-in-up">
              {t("home.ourGraduates")}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up delay-100">
              {t("home.graduatesDescription")}{" "}
              <span className="icon-star inline-block">🌟</span>
            </p>
          </div>
          {/* Graduates Section */}
          <div className="mt-12 relative">
            <GraduationsSection showAll={false} />
            {/* Call to Action */}
            <div className="mt-10 text-center">
              <Link
                href="/graduated-students"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-150 transform hover:-translate-y-0.5"
              >
                <span>{t("home.viewAllGraduation")}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* blogs Section */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          {/* Hero Text */}
          <div className="mb-2">
            <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-orange-400/20 to-orange-500/20 text-orange-700 text-sm font-semibold rounded-full mb-4 animate-fade-in backdrop-blur-sm">
              <span className="icon-pencil">📝</span> {t("home.readOurBlog")}
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary-700 mb-3 leading-tight animate-fade-in-up">
              {t("home.exploreOurBlog")}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up delay-100 mb-2">
              {t("home.blogDescription")}{" "}
              <span className="icon-star inline-block">🌟</span>
            </p>
          </div>

          {/* Blog Section */}
          <div className="relative">
            <Blogs limit={3} homePage={true} />
            <div className="mt-4 text-center">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-150 transform hover:-translate-y-0.5"
              >
                <span>{t("home.viewAllBlogs")}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16 bg-primary-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center px-6 relative z-10">
          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-pink-400/20 to-pink-500/20 text-pink-700 text-xs font-semibold rounded-full mb-4 backdrop-blur-sm">
            <span className="icon-heart">💝</span> {t("home.supportOurMission")}
          </div>
          <h2 className="text-3xl font-bold text-primary-700 mb-4">
            {t("home.helpUsContinue")}
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("home.donationDescription")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                icon: Coins,
                period: t("home.monthlySupport"),
                desc: t("home.helpStudentMonthly"),
              },
              {
                icon: Sprout,
                period: t("home.quarterlyDonation"),
                desc: t("home.supportPrograms"),
              },
              {
                icon: HeartHandshake,
                period: t("home.annualContribution"),
                desc: t("home.transformLivesYearly"),
              },
            ].map((tier, index) => {
              const IconComponent = tier.icon;
              // Assign animation class based on icon type
              let iconAnimationClass = "";

              if (tier.icon === Coins) {
                iconAnimationClass = "icon-coins";
              } else if (tier.icon === Sprout) {
                iconAnimationClass = "icon-sprout";
              } else if (tier.icon === HeartHandshake) {
                iconAnimationClass = "icon-heart-handshake";
              }

              return (
                <div
                  key={`tier-${index}`}
                  className="donation-card relative overflow-hidden bg-white p-6 rounded-xl border border-gray-200/60"
                >
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex justify-center mb-4">
                      <div className="relative p-4 bg-teal-50 rounded-xl">
                        <IconComponent
                          className={`relative w-12 h-12 text-teal-600 ${iconAnimationClass}`}
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-gray-800 font-bold text-base mb-2">
                        {tier.period}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {tier.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Link href="/donation">
            <Button
              variant="outline"
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 px-8 py-3 rounded-xl font-semibold transform hover:-translate-y-0.5 transition-all duration-150"
            >
              {t("home.donateNow")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
