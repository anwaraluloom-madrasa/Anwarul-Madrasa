'use client';

import Image from "next/image";
import React from "react";
import { getImageUrl } from "@/lib/utils";

interface ArticleDetailImageProps {
  src: string | null | undefined;
  alt: string;
  priority?: boolean;
}

export default function ArticleDetailImage({ src, alt, priority = false }: ArticleDetailImageProps) {
  const [imgSrc, setImgSrc] = React.useState<string | null>(null);
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    if (!src) {
      setImgSrc("/placeholder-blog.jpg");
      setIsLoading(false);
      return;
    }
    
    const newUrl = getImageUrl(src, "/placeholder-blog.jpg");
    setImgSrc(newUrl);
    setHasError(false);
    setIsLoading(true);
    
    // Log image URL for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('🖼️ Article detail image:', {
        original: src,
        processed: newUrl,
        alt
      });
    }
  }, [src, alt]);
  
  const handleError = () => {
    console.warn('⚠️ Article detail image failed to load:', imgSrc);
    setHasError(true);
    setImgSrc("/placeholder-blog.jpg");
    setIsLoading(false);
  };
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  if (hasError || !imgSrc) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }
  
  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
          <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
      />
    </>
  );
}

