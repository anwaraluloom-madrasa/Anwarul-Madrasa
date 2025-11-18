"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const RouteProgressBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const isAnimatingRef = useRef(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const hideProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsVisible(false);
    setProgress(0);
    isAnimatingRef.current = false;
  }, []);

  const finishProgress = useCallback(() => {
    if (!isAnimatingRef.current) return;

    setProgress(100);
    // Hide quickly for fast transitions
    setTimeout(() => {
      hideProgress();
    }, 100);
  }, [hideProgress]);

  const startProgress = useCallback(() => {
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    isAnimatingRef.current = true;
    setIsVisible(true);
    // Start at 20% for instant feedback
    setProgress(20);
    
    // Fast progress increase
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 100);
  }, []);

  useEffect(() => {
    const handleLinkNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;

      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.getAttribute("rel") === "external") return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const currentUrl = new URL(window.location.href);
      const destinationUrl = new URL(anchor.href);

      const isSameOrigin = currentUrl.origin === destinationUrl.origin;
      const isSameLocation =
        currentUrl.pathname === destinationUrl.pathname &&
        currentUrl.search === destinationUrl.search;

      if (isSameOrigin && !isSameLocation) {
        startProgress();
      }
    };

    document.addEventListener("click", handleLinkNavigation);
    return () => document.removeEventListener("click", handleLinkNavigation);
  }, [startProgress]);

  useEffect(() => {
    if (!isAnimatingRef.current) return;
    finishProgress();
  }, [pathname, searchParams, finishProgress]);

  useEffect(() => {
    // Only show progress on actual navigation, not on initial load
    // This prevents unnecessary progress bar on page load
  }, [startProgress, finishProgress]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed top-0 left-0 right-0 z-[10000] h-[3px] bg-transparent">
      <div className="h-full overflow-hidden bg-gray-100/50">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default RouteProgressBar;
