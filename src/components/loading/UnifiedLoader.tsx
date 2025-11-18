/**
 * UnifiedLoader - Simple, fast spinner for all page transitions
 * Auto-hides after 800ms maximum for quick loading
 */

"use client";

import { useState, useEffect } from 'react';
import IslamicLoader from './IslamicLoader';

interface UnifiedLoaderProps {
  variant?: 'grid' | 'list' | 'detail';
  count?: number;
  showFilters?: boolean;
  className?: string;
  maxDuration?: number; // Maximum time to show loader in milliseconds
}

export default function UnifiedLoader({
  variant = 'grid',
  count = 6,
  showFilters = false,
  className = '',
  maxDuration = 800, // 800ms - very fast
}: UnifiedLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Scroll to top when loader appears
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, maxDuration);

    return () => clearTimeout(timer);
  }, [maxDuration]);

  if (!isVisible) {
    return null;
  }

  // Simple, fast spinner for all variants
  return <IslamicLoader />;
}

