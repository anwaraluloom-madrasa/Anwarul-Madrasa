'use client';

import Image from "next/image";
import React, { useMemo, useRef } from "react";
import { getSimpleImageUrl } from "@/lib/utils";

interface EventDetailImageProps {
  src: string | null | undefined;
  alt: string;
  priority?: boolean;
}

export default function EventDetailImage({ src, alt, priority = false }: EventDetailImageProps) {
  const errorRef = useRef(false);

  const imageUrl = useMemo(() => {
    if (errorRef.current) return "/placeholder-event.jpg";
    return getSimpleImageUrl(src, "/placeholder-event.jpg");
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
          const target = e.currentTarget as HTMLImageElement;
          target.src = "/placeholder-event.jpg";
        }
      }}
    />
  );
}





