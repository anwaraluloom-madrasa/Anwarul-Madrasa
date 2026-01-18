"use client";

import React, { useEffect, useRef } from "react";

export default function LanguageSelector() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && wrapperRef.current) {
      // Set gtranslate settings
      interface GTranslateSettings {
        default_language: string;
        native_language_names: boolean;
        languages: string[];
        wrapper_selector: string;
      }

      interface WindowWithGTranslate extends Window {
        gtranslateSettings?: GTranslateSettings;
        gt_init?: () => void;
      }

      const win = window as WindowWithGTranslate;
      win.gtranslateSettings = {
        "default_language": "ps",
        "native_language_names": true,
        "languages": ["ps", "en", "fa", "ar", "ur", "tr", "uz"],
        "wrapper_selector": ".gtranslate_wrapper_footer"
      };

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
        if (win.gt_init && wrapperRef.current) {
          win.gt_init();
          clearInterval(checkAndInit);
        }
      }, 100);

      // Clear interval after 5 seconds
      setTimeout(() => clearInterval(checkAndInit), 5000);

      // Style the gtranslate select when it's ready to make it look like a dropdown
      let isStyled = false;
      
      const styleSelect = () => {
        if (!wrapperRef.current) return;
        
        const select = wrapperRef.current.querySelector('select') as HTMLSelectElement;
        if (select && !select.hasAttribute('data-custom-styled')) {
          // Mark as styled to avoid re-styling
          select.setAttribute('data-custom-styled', 'true');
          isStyled = true;
          
          // Apply custom styles to make it look like a modern dropdown
          select.style.cssText = `
            padding: 0.5rem 2.5rem 0.5rem 0.75rem !important;
            font-size: 0.875rem !important;
            font-weight: 500 !important;
            border: 1px solid #d1d5db !important;
            border-radius: 0.5rem !important;
            background-color: white !important;
            color: #374151 !important;
            cursor: pointer !important;
            appearance: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
            background-repeat: no-repeat !important;
            background-position: right 0.5rem center !important;
            padding-right: 2.5rem !important;
            min-width: 120px !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
            width: auto !important;
            display: block !important;
          `;
          
          // Store original styles for reset
          const originalBorderColor = '#d1d5db';
          const originalBoxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          
          // Add hover effect
          select.addEventListener('mouseenter', () => {
            select.style.setProperty('border-color', '#9ca3af', 'important');
            select.style.setProperty('box-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 'important');
          });
          
          select.addEventListener('mouseleave', () => {
            select.style.setProperty('border-color', originalBorderColor, 'important');
            select.style.setProperty('box-shadow', originalBoxShadow, 'important');
          });
          
          // Add focus effect
          select.addEventListener('focus', () => {
            select.style.setProperty('outline', 'none', 'important');
            select.style.setProperty('border-color', '#10b981', 'important');
            select.style.setProperty('box-shadow', '0 0 0 3px rgba(16, 185, 129, 0.1)', 'important');
          });
          
          select.addEventListener('blur', () => {
            select.style.setProperty('border-color', originalBorderColor, 'important');
            select.style.setProperty('box-shadow', originalBoxShadow, 'important');
          });
        }
      };

      // Try to style immediately and then periodically
      styleSelect();
      const styleInterval = setInterval(() => {
        if (!isStyled) {
          styleSelect();
        } else {
          clearInterval(styleInterval);
        }
      }, 200);

      // Also use MutationObserver to catch when gtranslate adds the select
      const observer = new MutationObserver(() => {
        if (!isStyled) {
          styleSelect();
        }
      });

      if (wrapperRef.current) {
        observer.observe(wrapperRef.current, {
          childList: true,
          subtree: true
        });
      }

      setTimeout(() => {
        clearInterval(styleInterval);
        observer.disconnect();
      }, 10000);

      return () => {
        clearInterval(checkAndInit);
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 lg:bottom-7 lg:left-6 z-50">
      <div 
        className="gtranslate_wrapper_footer" 
        ref={wrapperRef}
        style={{
          display: 'block',
          visibility: 'visible',
          opacity: 1,
        }}
      ></div>
    </div>
  );
}

