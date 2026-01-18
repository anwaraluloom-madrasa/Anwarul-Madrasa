"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState, useRef } from "react";
import { PiList } from "react-icons/pi";

import { appConfig, navigation } from "@/lib/config";
import RouteProgressBar from "@/components/RouteProgressBar";
import { Suspense } from "react";
import { FaSearch } from "react-icons/fa";
import { Gift } from "lucide-react";


const PRIMARY_LINK_LIMIT = 9; // Increased to show books and tasawwuf in main navigation
const NAV_LABELS: Record<string, string> = {
  home: "کور پاڼه",
  courses: " کورسونه",
  iftah: "افتاء",
  article: "مقالې",
  awlayaa: "اولیا",
  // awlyaacharts: "اولیا چارټونه", // Temporarily hidden
  admission: "نوم لیکنه",
  books: "کتابتون",
  onlineCourses: "انلاین کورسونه",
  donation: "مرسته",
  blogs: "د علم څرک",
  author: "لیکوالان",
  event: "علمی مجالس",
  tasawwuf: "تصوف",
  graduation: "فراغتونه",
  sanad: "شجره",
  contact: "اړیکه",
};

const Navbar = memo(function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isCoursesMenuOpen, setCoursesMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLang, setCurrentLang] = useState<string>('ps');
  const searchRef = useRef<HTMLDivElement>(null);
  const coursesMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Get language and direction dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('i18nextLng') || 'ps';
      setCurrentLang(savedLang);
      
      // Update when language changes
      const handleLanguageChange = () => {
        const lang = localStorage.getItem('i18nextLng') || 'ps';
        setCurrentLang(lang);
      };
      
      window.addEventListener('languagechange', handleLanguageChange);
      window.addEventListener('storage', (e) => {
        if (e.key === 'i18nextLng') {
          handleLanguageChange();
        }
      });
      
      return () => {
        window.removeEventListener('languagechange', handleLanguageChange);
      };
    }
  }, []);

  // Always RTL since website only has RTL languages
  const isRTL = true;
  const direction = 'rtl';

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    setCoursesMenuOpen(false);
  }, [pathname]);

  // Close search, courses menu, and more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if click is on a toggle button - if so, don't close (let toggle handle it)
      const isToggleButton = target.closest('button[aria-haspopup="true"]') || 
                             target.closest('button[aria-expanded]');
      
      // If clicking on toggle button, skip closing (toggle function will handle it)
      if (isToggleButton) {
        return;
      }
      
      // Close search if clicking outside
      if (searchRef.current && !searchRef.current.contains(target as Node)) {
        setSearchOpen(false);
      }
      
      // Close courses menu if clicking outside
      if (isCoursesMenuOpen) {
        const coursesMenuElement = coursesMenuRef.current;
        const coursesLi = coursesMenuElement?.closest('li.group');
        if (coursesLi && !coursesLi.contains(target)) {
          setCoursesMenuOpen(false);
        }
      }
      
      // Close more menu if clicking outside
      if (isMoreMenuOpen) {
        const moreMenuElement = moreMenuRef.current;
        const moreLi = moreMenuElement?.closest('li.relative');
        if (moreLi && !moreLi.contains(target)) {
          setMoreMenuOpen(false);
        }
      }
    };

    if (isSearchOpen || isCoursesMenuOpen || isMoreMenuOpen) {
      document.addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isSearchOpen, isCoursesMenuOpen, isMoreMenuOpen]);


  const { desktop, mobile } = useMemo(() => {
    const now = new Date();
    const gregorianFull = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const gregorianCompact = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    try {
      const hijriFull = new Intl.DateTimeFormat("en-u-ca-islamic", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(now);
      const hijriCompact = new Intl.DateTimeFormat("en-u-ca-islamic", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(now);

      return {
        desktop: `${hijriFull.replace("AH", "Hijri")} ${gregorianFull}`.trim(),
        mobile: `${hijriCompact.replace("AH", "Hijri")} ${gregorianCompact}`.trim(),
      };
    } catch {
      return {
        desktop: gregorianFull,
        mobile: gregorianCompact,
      };
    }
  }, []);

  const primaryLinks = useMemo(
    () => navigation.main.slice(0, PRIMARY_LINK_LIMIT).filter(link => link.name !== 'onlineCourses').map(link => ({
      ...link,
      name: NAV_LABELS[link.name as keyof typeof NAV_LABELS] || link.name
    })),
    []
  );
  const secondaryLinks = useMemo(
    () => navigation.main.slice(PRIMARY_LINK_LIMIT).map(link => ({
      ...link,
      name: NAV_LABELS[link.name as keyof typeof NAV_LABELS] || link.name
    })),
    []
  );
  
  // Get courses links for dropdown
  const coursesLinks = useMemo(() => {
    // Only include onlineCourses, exclude courses
    const onlineCourses = navigation.main.find(link => link.name === 'onlineCourses');
    return [
      { ...onlineCourses!, name: NAV_LABELS['onlineCourses' as keyof typeof NAV_LABELS] || onlineCourses!.name }
    ].filter(Boolean);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((previous) => !previous);
  }, []);

  const toggleMoreMenu = useCallback(() => {
    setMoreMenuOpen((previous) => {
      const newState = !previous;
      // Close courses menu when opening more menu
      if (newState) {
        setCoursesMenuOpen(false);
      }
      return newState;
    });
  }, []);

  const toggleCoursesMenu = useCallback(() => {
    setCoursesMenuOpen((previous) => {
      const newState = !previous;
      // Close more menu when opening courses menu
      if (newState) {
        setMoreMenuOpen(false);
      }
      return newState;
    });
  }, []);

  const toggleSearch = useCallback(() => {
    setSearchOpen((previous) => {
      const newState = !previous;
      // Close other menus when opening search
      if (newState) {
        setCoursesMenuOpen(false);
        setMoreMenuOpen(false);
      }
      return newState;
    });
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search page with query
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }, [searchQuery, router]);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const closeMoreMenu = useCallback(() => setMoreMenuOpen(false), []);
  const closeCoursesMenu = useCallback(() => setCoursesMenuOpen(false), []);

  return (
    <header className="fixed inset-x-0 top-0 z-50" dir={direction} lang={currentLang}>
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_rgba(255,255,255,0))]" aria-hidden="true" />
        <div className="absolute -left-12 top-6 h-24 w-24 rounded-full bg-primary-700/40 blur-2xl" aria-hidden="true" />
        <div className="absolute -right-10 bottom-0 h-20 w-20 rounded-full bg-secondary-400/30 blur-2xl" aria-hidden="true" />
        <div className="max-w-screen-xl relative mx-auto px-4 py-2 md:py-4">
          <div className="hidden md:flex items-center justify-between text-sm text-primary-50/90 flex-row-reverse">
            <span className="text-right">{desktop}</span>
            <span className="arabic text-xl font-bold tracking-widest text-secondary-100 drop-shadow-sm">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </span>
          </div>
          <div className="md:hidden text-center space-y-2">
            <span className="arabic block text-lg font-bold tracking-widest text-secondary-100 drop-shadow-sm">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </span>
            <span className="inline-flex items-center justify-center gap-2 text-[11px] font-medium text-primary-50/90">
              <svg
                className="h-3 w-3 text-primary-200"
                fill="currentColor"
                viewBox="0 0 20 20" 
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{mobile}</span>
            </span>
          </div>
        </div>
      </div>

      <nav
        className={`relative bg-white/95 backdrop-blur transition-all duration-300 border-b border-primary-100/70 ${
          hasScrolled ? "shadow-am" : ""
        }`}
        aria-label="Primary"
      >
        <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-2">
          <div className="flex items-center justify-between gap-4" dir="rtl">
            {/* Logo - Right side for RTL */}
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
            >
                <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                  <Image
                    src="/logo.png"
                    alt="د انور العلوم نښان"
                    fill
                    sizes="(max-width: 768px) 120px, 150px"
                    className="object-contain"
                    priority
                  />
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary-900">
                  {appConfig.name}
                </div>
                <div className="text-sm text-primary-600 font-bold">
                  د اسلامي زده کړو پلیټفارم
                </div>
              </div>
            </Link>

            {/* Navigation - Center */}
            <div className="hidden lg:flex py-3 items-center justify-center flex-1">
              <ul className="flex items-center gap-6" dir="rtl">
                {primaryLinks.map(({ href, name }) => {
                  const isActive = pathname === href;
                  const isCoursesLink = name === NAV_LABELS['courses'];
                  
                  if (isCoursesLink) {
                    // Courses dropdown
                    const coursesActive = pathname === '/courses' || pathname === '/onlin-courses';
                    return (
                      <li key={href} className="group relative">
                        <button
                          type="button"
                          onClick={toggleCoursesMenu}
                          className={`font-bold text-base uppercase tracking-wide transition-colors duration-200 py-2 text-primary-800 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none flex items-center gap-1 ${
                            coursesActive ? "text-primary-600" : ""
                          }`}
                          aria-haspopup="true"
                          aria-expanded={isCoursesMenuOpen}
                        >
                          {name}
                          <svg
                            className={`h-4 w-4 transition-transform ${
                              isCoursesMenuOpen ? "rotate-180" : ""
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <div
                          ref={coursesMenuRef}
                          className={`absolute top-full mt-3 w-56 rounded-xl border border-primary-100 bg-white shadow-xl transition-all duration-200 right-0 ${
                            isCoursesMenuOpen
                              ? "visible opacity-100"
                              : "invisible -translate-y-2 opacity-0"
                          }`}
                          role="menu"
                        >
                          <ul className="py-3">
                            {coursesLinks.map(({ href: courseHref, name: courseName }) => {
                              const courseIsActive = pathname === courseHref;
                              return (
                                <li key={courseHref}>
                                  <Link
                                    href={courseHref}
                                    onClick={closeCoursesMenu}
                                    className={`block px-4 py-3 uppercase text-sm font-bold transition-colors duration-200 focus:outline-none focus-visible:outline-none text-right ${
                                      courseIsActive
                                        ? "bg-primary-50 text-primary-700"
                                        : "text-primary-700 hover:bg-primary-50 hover:text-primary-600"
                                    }`}
                                  >
                                    {courseName}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </li>
                    );
                  }
                  
                  return (
                    <li key={href} className="group relative">
                      <Link
                        href={href}
                        className={`font-bold text-base uppercase tracking-wide transition-colors duration-200 py-2 text-primary-800 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none text-right ${
                          isActive ? "text-primary-600" : ""
                        }`}
                      >
                        {name}
                      </Link>
                      <span
                        className={`absolute -bottom-1 h-0.5 w-full rounded-full bg-secondary-500 transition-opacity duration-200 right-0 ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                        aria-hidden="true"
                      />
                    </li>
                  );
                })}

                {secondaryLinks.length > 0 && (
                  <li className="relative">
                    <button
                      type="button"
                      onClick={toggleMoreMenu}
                      className="flex items-center gap-2 font-bold text-base uppercase tracking-wide text-primary-800 hover:text-primary-600 transition-colors duration-200 focus:outline-none focus-visible:outline-none"
                      aria-haspopup="true"
                      aria-expanded={isMoreMenuOpen}
                    >
                      نور
                      <svg
                        className={`h-4 w-4 transition-transform ${
                          isMoreMenuOpen ? "rotate-180" : ""
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div
                      ref={moreMenuRef}
                      className={`absolute top-full mt-3 w-56 rounded-xl border border-primary-100 bg-white shadow-xl transition-all duration-200 right-0 ${
                        isMoreMenuOpen
                          ? "visible opacity-100"
                          : "invisible -translate-y-2 opacity-0"
                      }`}
                      role="menu"
                    >
                      <ul className="py-3">
                        {secondaryLinks.map(({ href, name }) => {
                          const isActive = pathname === href;
                          return (
                            <li key={href}>
                              <Link
                                href={href}
                                onClick={closeMoreMenu}
                                className={`block px-4 py-3 uppercase text-sm font-bold transition-colors duration-200 focus:outline-none focus-visible:outline-none text-right ${
                                  isActive
                                    ? "bg-primary-50 text-primary-700"
                                    : "text-primary-700 hover:bg-primary-50 hover:text-primary-600"
                                }`}
                              >
                                {name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Left side - Donation, Search, Mobile Menu for RTL */}
            <div className="flex items-center gap-2" dir="ltr">
              {/* Donation Button - Left side for RTL */}
              <Link href="/donation" className="hidden md:block">
                <button
                  className="group relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105 active:scale-100 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 overflow-hidden border border-primary-500/30"
                >
                  {/* Subtle shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                  
                  {/* Ripple effect on hover */}
                  <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-all duration-300"></span>
                  
                  <span className="whitespace-nowrap relative z-10 tracking-wide">مرسته وکړئ</span>
                  
                  {/* Gift icon with up-down animation */}
                  <Gift className="w-4 h-4 relative z-10 animate-bounce-vertical" />
                </button>
              </Link>
              
              {/* Search Button - Improved Design */}
              <div ref={searchRef} className="relative">
                <button
                  type="button"
                  onClick={toggleSearch}
                  className={`inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all duration-300 ${
                    isSearchOpen 
                      ? 'bg-primary-600 text-white shadow-lg scale-105' 
                      : 'bg-primary-50 hover:bg-primary-100 border border-primary-200 shadow-sm hover:shadow-md hover:scale-105'
                  }`}
                  aria-label="Toggle search"
                >
                  <FaSearch size={18} className={isSearchOpen ? "text-white" : "text-primary-700"} />
                </button>
                
                {/* Search Overlay - Mobile Optimized (No Dark Shadow) */}
                {isSearchOpen && (
                  <>
                    {/* Search Form - Centered on Mobile, Dropdown on Desktop */}
                    <div className="fixed inset-x-0 top-16 z-50 flex items-start justify-center pt-4 md:absolute md:inset-x-auto md:top-full md:mt-3 md:left-0 md:pt-0 md:w-96">
                      <form onSubmit={handleSearch} className="relative w-full max-w-[90%] sm:max-w-md md:max-w-full mx-auto md:mx-0" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border-2 border-primary-200 p-3 sm:p-4 md:p-5">
                          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="پلټنه..."
                              className="flex-1 min-w-0 h-10 sm:h-11 md:h-12 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-primary-50 border-2 border-primary-200 text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-sm sm:text-base md:text-lg text-right overflow-x-auto scrollbar-hide"
                              dir="rtl"
                              autoFocus
                              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            />
                            {searchQuery && (
                              <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="text-primary-400 hover:text-primary-600 transition-colors p-1.5 flex-shrink-0 rounded-full hover:bg-primary-100"
                                aria-label="Clear search"
                              >
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                            <button
                              type="submit"
                              className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg sm:rounded-xl hover:from-primary-700 hover:to-primary-800 active:scale-95 transition-all duration-200 text-xs sm:text-sm md:text-base font-semibold shadow-md hover:shadow-lg flex-shrink-0 flex items-center justify-center gap-1.5 whitespace-nowrap"
                            >
                              <FaSearch className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">پلټنه</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </>
                )}
              </div>
              
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 hover:bg-primary-100 border border-primary-200 shadow-sm transition-colors duration-200 lg:hidden"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                <PiList size={22} className="text-primary-700" />
              </button>
            </div>

 
          </div>
        </div>
        <Suspense fallback={null}>
          <RouteProgressBar />
        </Suspense>
      </nav>

      <div
        className={`lg:hidden fixed inset-0 z-40 bg-primary-900/40 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={closeMobileMenu}
      />

      <aside
        className={`lg:hidden fixed inset-y-0 z-50 w-4/5 max-w-sm transform bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } right-0`}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary-100/60 bg-gradient-to-r from-primary-50 to-primary-100 flex-row-reverse flex-shrink-0">
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="د انور العلوم نښان"
                fill
                sizes="(max-width: 768px) 120px, 150px"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-primary-900 tracking-wide text-right">{appConfig.name}</span>
          </div>
          
          <div className="flex items-center gap-3 flex-row-reverse">
            <button
              type="button"
              onClick={closeMobileMenu}
              className="rounded-full p-2 text-primary-700 hover:text-primary-600 focus:outline-none focus-visible:outline-none transition-colors duration-200"
              aria-label="Close navigation menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-6 overscroll-contain" aria-label="Mobile" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="space-y-3">
            {primaryLinks.map(({ href, name }) => {
              const isActive = pathname === href;
              const isCoursesLink = name === NAV_LABELS['courses'];
              
              if (isCoursesLink) {
                const coursesActive = pathname === '/courses' || pathname === '/onlin-courses';
                return (
                  <div key={href}>
                    <button
                      type="button"
                      onClick={toggleCoursesMenu}
                      className={`flex w-full items-center justify-between rounded-xl p-4 text-base font-bold transition-all duration-200 shadow-sm ${
                        coursesActive
                          ? 'border-r-4 border-primary-600 bg-gradient-to-r from-primary-400/30 to-primary-300/30 text-primary-900'
                          : "text-primary-800/90 hover:bg-primary-100/40"
                      }`}
                      aria-expanded={isCoursesMenuOpen}
                    >
                      <span className="text-right">{name}</span>
                      <svg
                        className={`h-4 w-4 text-primary-500 transition-transform ${
                          isCoursesMenuOpen ? "rotate-180" : ""
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div
                      className={`mt-2 space-y-2 overflow-hidden transition-all duration-300 ${
                        isCoursesMenuOpen ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      {coursesLinks.map(({ href: courseHref, name: courseName }) => {
                        const courseIsActive = pathname === courseHref;
                        return (
                          <Link
                            key={courseHref}
                            href={courseHref}
                            onClick={() => {
                              closeMobileMenu();
                              closeCoursesMenu();
                            }}
                            className={`block rounded-lg p-3 text-base font-bold transition-all duration-200 ${
                              courseIsActive
                                ? "bg-primary-100/50 text-primary-900"
                                : "text-primary-700 hover:bg-primary-100/30"
                            }`}
                          >
                            {courseName}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobileMenu}
                  className={`flex items-center justify-between rounded-xl p-4 text-base font-bold transition-all duration-200 shadow-sm ${
                    isActive
                      ? 'border-r-4 border-primary-600 bg-gradient-to-r from-primary-400/30 to-primary-300/30 text-primary-900'
                      : "text-primary-800/90 hover:bg-primary-100/40"
                  }`}
                >
                  <span className="text-right">{name}</span>
                </Link>
              );
            })}

            {secondaryLinks.length > 0 && (
              <div className="pt-5 mt-6 border-t border-primary-100/60">
                <button
                  type="button"
                  onClick={toggleMoreMenu}
                  className="flex w-full items-center justify-between rounded-xl bg-primary-100/40 p-4 text-base font-bold text-primary-800 hover:bg-primary-100/60 transition-all duration-200 focus:outline-none focus-visible:outline-none"
                  aria-expanded={isMoreMenuOpen}
                >
                  <span className="flex items-center gap-3">
                    <svg
                      className="h-5 w-5 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                    نور انتخابونه
                  </span>
                  <svg
                    className={`h-4 w-4 text-primary-500 transition-transform ${
                      isMoreMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <div
                  className={`mt-2 space-y-2 overflow-hidden transition-all duration-300 ${
                    isMoreMenuOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  {secondaryLinks.map(({ href, name }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => {
                          closeMobileMenu();
                          closeMoreMenu();
                        }}
                        className={`block rounded-lg p-3 text-base font-bold transition-all duration-200 ${
                          isActive
                            ? "bg-primary-100/50 text-primary-900"
                            : "text-primary-700 hover:bg-primary-100/30"
                        }`}
                      >
                        {name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Contact Link */}
            <div className="pt-5 mt-6 border-t border-primary-100/60">
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className={`flex items-center justify-between rounded-xl p-4 text-base font-bold transition-all duration-200 shadow-sm ${
                  pathname === '/contact'
                    ? 'border-r-4 border-primary-600 bg-gradient-to-r from-primary-400/30 to-primary-300/30 text-primary-900'
                    : "text-primary-800/90 hover:bg-primary-100/40"
                }`}
              >
                <span className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {NAV_LABELS['contact']}
                </span>
              </Link>
            </div>
            
            {/* Donation Button at Bottom - Improved Design */}
            <div className="pt-6 mt-8 border-t border-primary-100/60 flex justify-center">
              <Link href="/donation" onClick={closeMobileMenu} className="w-full">
                <button
                  className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-100 focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-offset-2 overflow-hidden border border-primary-500/30"
                >
                  {/* Subtle shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                  
                  {/* Ripple effect on hover */}
                  <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-all duration-300"></span>
                  
                  <span className="relative z-10 whitespace-nowrap text-lg tracking-wide">مرسته وکړئ</span>
                  
                  {/* Gift icon with up-down animation */}
                  <Gift className="w-5 h-5 relative z-10 animate-bounce-vertical" />
                </button>
              </Link>
            </div>
          </div>
        </nav>
      </aside>
    </header>
  );
});

export default Navbar;
