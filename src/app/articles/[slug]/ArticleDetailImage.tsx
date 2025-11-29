'use client';

import Image from "next/image";
import { useMemo, useRef } from "react";
import { getSimpleImageUrl } from "@/lib/utils";

interface ArticleDetailImageProps {
  src: string | null | undefined;
  alt: string;
  priority?: boolean;
}

export default function ArticleDetailImage({ src, alt, priority = false }: ArticleDetailImageProps) {
  const errorRef = useRef(false);
  
  // Memoize image URL to prevent unnecessary recalculations
  const imageUrl = useMemo(() => {
    if (errorRef.current) return "/placeholder-blog.jpg";
    return getSimpleImageUrl(src, "/placeholder-blog.jpg");
  }, [src]);
  
  return (
      <Image
      key={imageUrl}
      src={imageUrl}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
        priority={priority}
      onError={(e) => {
        if (!errorRef.current) {
          errorRef.current = true;
          e.currentTarget.src = "/placeholder-blog.jpg";
        }
      }}
      />
  );
}

