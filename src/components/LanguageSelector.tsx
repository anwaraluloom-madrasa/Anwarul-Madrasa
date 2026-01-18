"use client";

import React, { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

const languages = [
  { code: "ps", name: "پښتو" },
  { code: "en", name: "English" },
  { code: "fa", name: "فارسی" },
  { code: "ar", name: "العربية" },
  { code: "ur", name: "اردو" },
  { code: "tr", name: "Türkçe" },
  { code: "uz", name: "O'zbek" },
];

export default function LanguageSelector() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ps");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && wrapperRef.current) {
      // Set gtranslate settings
      (window as any).gtranslateSettings = {
        "default_language": "ps",
        "native_language_names": true,
        "languages": ["ps", "en", "fa", "ar", "ur", "tr", "uz"],
        "wrapper_selector": ".gtranslate_wrapper_footer"
      };

      // Function to load gtranslate
      const loadGTranslate = () => {
        const existingScript = document.querySelector('script[src*="gtranslate.net"]');
        
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = 'https://cdn.gtranslate.net/widgets/latest/lc.js';
          script.defer = true;
          script.async = true;
          script.onload = () => {
            // After script loads, initialize
            if ((window as any).gt_init) {
              (window as any).gt_init();
              setIsInitialized(true);
              
              // Wait a bit for gtranslate to render
              setTimeout(() => {
                const select = wrapperRef.current?.querySelector('select') as HTMLSelectElement;
                if (select) {
                  // Get current language from gtranslate cookie or default
                  const cookieValue = document.cookie.match(/googtrans=([^;]+)/);
                  const langCode = cookieValue ? cookieValue[1].split('/').pop() : "ps";
                  setCurrentLang(langCode || "ps");
                  
                  // Listen for changes from gtranslate
                  select.addEventListener('change', () => {
                    const newLang = select.value || "ps";
                    setCurrentLang(newLang);
                    setIsOpen(false);
                  });
                }
              }, 500);
            }
          };
          document.head.appendChild(script);
        } else {
          // Script already exists, check if initialized
          setTimeout(() => {
            const select = wrapperRef.current?.querySelector('select') as HTMLSelectElement;
            if (select) {
              const cookieValue = document.cookie.match(/googtrans=([^;]+)/);
              const langCode = cookieValue ? cookieValue[1].split('/').pop() : "ps";
              setCurrentLang(langCode || select.value || "ps");
              setIsInitialized(true);
            }
          }, 500);
        }
      };

      loadGTranslate();

      // Periodic check for initialization
      const checkAndInit = setInterval(() => {
        if ((window as any).gt_init && wrapperRef.current && !isInitialized) {
          (window as any).gt_init();
          setIsInitialized(true);
          clearInterval(checkAndInit);
          
          setTimeout(() => {
            const select = wrapperRef.current?.querySelector('select') as HTMLSelectElement;
            if (select) {
              const cookieValue = document.cookie.match(/googtrans=([^;]+)/);
              const langCode = cookieValue ? cookieValue[1].split('/').pop() : "ps";
              setCurrentLang(langCode || select.value || "ps");
              
              select.addEventListener('change', () => {
                const newLang = select.value || "ps";
                setCurrentLang(newLang);
                setIsOpen(false);
              });
            }
          }, 500);
        }
      }, 200);

      setTimeout(() => clearInterval(checkAndInit), 10000);

      return () => {
        clearInterval(checkAndInit);
      };
    }
  }, [isInitialized]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageClick = (langCode: string) => {
    const select = wrapperRef.current?.querySelector('select') as HTMLSelectElement;
    if (select) {
      // Change the select value
      select.value = langCode;
      
      // Create and dispatch a proper change event
      const changeEvent = new Event('change', { bubbles: true, cancelable: true });
      select.dispatchEvent(changeEvent);
      
      // Also trigger input event for better compatibility
      const inputEvent = new Event('input', { bubbles: true, cancelable: true });
      select.dispatchEvent(inputEvent);
      
      // Use gtranslate's API if available
      if ((window as any).doGTranslate) {
        (window as any).doGTranslate(langCode);
      }
      
      setCurrentLang(langCode);
      setIsOpen(false);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 lg:bottom-7 lg:left-6 z-50" ref={dropdownRef}>
      {/* Hidden gtranslate wrapper */}
      <div 
        className="gtranslate_wrapper_footer absolute opacity-0 pointer-events-none" 
        ref={wrapperRef} 
        style={{ width: '1px', height: '1px', overflow: 'hidden' }}
      ></div>
      
      {/* Custom Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-xs sm:text-sm"
          type="button"
          aria-label="Select Language"
          aria-expanded={isOpen}
        >
          <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700 flex-shrink-0" />
          <span className="font-medium text-gray-700 min-w-[45px] sm:min-w-[60px] text-left truncate">
            {currentLanguage.name}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-36 sm:w-40 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50 max-h-[200px] sm:max-h-none overflow-y-auto">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageClick(lang.code)}
                  className={`w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-left hover:bg-green-50 transition-colors duration-150 ${
                    currentLang === lang.code
                      ? 'bg-green-100 text-green-700 font-semibold'
                      : 'text-gray-700'
                  }`}
                  type="button"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

