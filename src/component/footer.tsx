"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart, GraduationCap } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import LanguageSelector from "@/components/LanguageSelector";

const Footer = () => {
  const { t: tRaw } = useTranslation('common', { useSuspense: false });
  
  // Create a wrapper that always returns a string
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === 'string' ? result : key;
  };

  return (
  <footer className="relative bg-gradient-to-b from-slate-800 to-slate-900 mt-16 overflow-hidden">
    {/* Simple Pattern Background */}
    <div className="absolute inset-0 opacity-5" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3Cpath d='M20 20c0 11.046 8.954 20 20 20V20H20z'/%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    
    {/* Simple Accent Line */}
    
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
    
    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
      {/* Main Footer Content */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-8 mb-8">
        {/* Navigation */}
        <div className="space-y-4 order-2 md:order-1">
          <h3 className="text-lg font-bold text-white mb-4 border-b border-amber-500 pb-2">
            {t('footer.quickLinks')}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/courses" className="text-gray-300 hover:text-amber-300 transition-colors text-sm">
              {t('navbar.courses')}
            </Link>
            <Link href="/book" className="text-gray-300 hover:text-amber-300 transition-colors text-sm">
              {t('navbar.books')}
            </Link>
            <Link href="/authors" className="text-gray-300 hover:text-amber-300 transition-colors text-sm">
              {t('navbar.author')}
            </Link>
            <Link href="/blogs" className="text-gray-300 hover:text-amber-300 transition-colors text-sm">
              {t('navbar.blogs')}
            </Link>
            <Link href="/articles" className="text-gray-300 hover:text-amber-300 transition-colors text-sm">
              {t('navbar.article')}
            </Link>
            <Link href="/event" className="text-gray-300 hover:text-amber-300 transition-colors text-sm">
              {t('navbar.event')}
            </Link>
            <Link href="/graduated-students" className="text-gray-300 hover:text-amber-300 transition-colors text-sm">
              {t('navbar.graduation')}
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-amber-300 transition-colors text-sm">
              {t('header.about.title')}
            </Link>
          </div>
        </div>


        {/* Contact & Social */}
        <div className="space-y-4 order-3 md:order-2">
          <h3 className="text-lg font-bold text-white mb-4 border-b border-amber-500 pb-2">
            {t('footer.contactInfo')}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">{t('footer.address')}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">{t('footer.phone')}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">{t('footer.email')}</span>
            </div>
          </div>
        </div>

        {/* Logo & Social Media */}
        <div className="space-y-4 order-1 md:order-3">
          <div className="flex flex-col items-start">
            {/* Logo */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-xl border-4 border-amber-400/30 flex-shrink-0 overflow-hidden">
                <Image
                  src="/logo.png" 
                  alt={t('footer.brandName')} 
                  width={120}
                  height={120}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain rounded-full w-full h-full scale-110"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white mb-1" dir="rtl">{t('footer.brandName')}</h2>
                <p className="text-amber-200 text-xs" dir="rtl">{t('footer.tagline')}</p>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t('footer.followUs')}</h4>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=100085056932016&mibextid=ZbWKwL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-slate-700/50 text-gray-300 hover:bg-blue-500 hover:text-white transition-all duration-300 rounded-md"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/khaksarpaktiawa/status/1760494499027931617?t=ep_4SWVp_FHLDvsS2w-cQA&s=19"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-slate-700/50 text-gray-300 hover:bg-sky-500 hover:text-white transition-all duration-300 rounded-md"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-slate-700/50 text-gray-300 hover:bg-amber-500 hover:text-white transition-all duration-300 rounded-md"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href={`https://wa.me/+93796148087?text=${encodeURIComponent(
                    `Hi!اسلام علیکم ورحمته الله وبرکاته `
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-slate-700/50 text-gray-300 hover:bg-green-500 hover:text-white transition-all duration-300 rounded-md"
                >
                  <FaWhatsapp className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-amber-500/30 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-gray-300">
            <GraduationCap className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-medium">&copy; {new Date().getFullYear()} {t('footer.copyright')}</span>
            <Heart className="h-4 w-4 text-amber-400" />
          </div>
          
          {/* Language Selector */}
          <LanguageSelector />
          
          <div className="flex items-center gap-6 text-sm">
            <Button variant="link" className="text-gray-400 hover:text-amber-300 p-0 h-auto font-medium transition-colors text-sm">
              {t('footer.privacyPolicy')}
            </Button>
            <Button variant="link" className="text-gray-400 hover:text-amber-300 p-0 h-auto font-medium transition-colors text-sm">
              {t('footer.termsOfService')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
