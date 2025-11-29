"use client";

import React, { useEffect, useRef } from "react";

export default function LanguageSelector() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && wrapperRef.current) {
      // Set gtranslate settings
      (window as any).gtranslateSettings = {
        "default_language": "ps",
        "native_language_names": true,
        "languages": ["ps", "en", "fa", "ar", "ur", "tr", "uz"],
        "wrapper_selector": ".gtranslate_wrapper_footer"
      };

      // Add custom styles for gtranslate widget
      const style = document.createElement('style');
      style.textContent = `
        .gtranslate_wrapper_footer select {
          background-color: #1e293b !important;
          color: #e2e8f0 !important;
          border: 1px solid #475569 !important;
          border-radius: 0.5rem !important;
          padding: 0.5rem 2.5rem 0.5rem 0.75rem !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
        }
        .gtranslate_wrapper_footer select:hover {
          background-color: #334155 !important;
          border-color: #f59e0b !important;
          color: #ffffff !important;
        }
        .gtranslate_wrapper_footer select:focus {
          outline: none !important;
          border-color: #f59e0b !important;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2) !important;
        }
        .gtranslate_wrapper_footer a {
          color: #e2e8f0 !important;
        }
        .gtranslate_wrapper_footer a:hover {
          color: #f59e0b !important;
        }
        .gtranslate_wrapper_footer .gt_container {
          background: transparent !important;
        }
      `;
      document.head.appendChild(style);

      // Function to load gtranslate
      const loadGTranslate = () => {
        // Check if script already exists
        const existingScript = document.querySelector('script[src*="gtranslate.net"]');
        
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = 'https://cdn.gtranslate.net/widgets/latest/lc.js';
          script.defer = true;
          script.async = true;
          document.head.appendChild(script);
        }
      };

      // Load script
      loadGTranslate();

      // Try to initialize after script loads
      const checkAndInit = setInterval(() => {
        if ((window as any).gt_init && wrapperRef.current) {
          (window as any).gt_init();
          clearInterval(checkAndInit);
        }
      }, 100);

      // Clear interval after 5 seconds
      setTimeout(() => clearInterval(checkAndInit), 5000);

      return () => {
        clearInterval(checkAndInit);
        document.head.removeChild(style);
      };
    }
  }, []);

  return (
    <div className="gtranslate_wrapper_footer" ref={wrapperRef}></div>
  );
}

