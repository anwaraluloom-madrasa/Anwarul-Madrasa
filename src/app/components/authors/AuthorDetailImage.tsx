'use client';

import Image from "next/image";
import { User } from "lucide-react";
import React from "react";
import { getSimpleImageUrl } from "@/lib/utils";

// Memoized Image component with error handling
export default React.memo(function AuthorDetailImage({ 
  src, 
  alt 
}: { 
  src: string | null | undefined; 
  alt: string;
}) {
  const errorRef = React.useRef(false);
  
  const imageUrl = React.useMemo(() => {
    if (errorRef.current) return "/placeholder-author.jpg";
    return getSimpleImageUrl(src, "/placeholder-author.jpg");
  }, [src]);
  
  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600">
        <User className="w-20 h-20 text-gray-400" />
      </div>
    );
  }
  
  return (
    <Image
      key={imageUrl}
      src={imageUrl}
      alt={alt}
      fill
      sizes="(max-width: 768px) 192px, 224px"
      className="object-cover object-center"
      priority
      onError={(e) => {
        if (!errorRef.current) {
          errorRef.current = true;
          const target = e.currentTarget as HTMLImageElement;
          target.src = "/placeholder-author.jpg";
        }
      }}
    />
  );
});






