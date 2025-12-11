"use client";

import { useEffect, useState } from "react";
import { GalleryApi, extractArray } from "@/lib/api";
import Gallery from "./../components/gallery/Gallery";
import IslamicHeader from "../components/IslamicHeader";
import Breadcrumb from "@/components/Breadcrumb";
import UnifiedLoader from "@/components/loading/UnifiedLoader";
import ErrorDisplay from "@/components/ErrorDisplay";

interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  category: string;
  image: string;
  featured?: boolean;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getImages() {
      try {
        const response = await GalleryApi.getAll();
        if (!response.success) {
          console.warn("Gallery API failed, using fallback data");
          setImages([{
            id: 1,
            title: "Gallery temporarily unavailable",
            description: "Please try again later",
            category: "General",
            image: "/placeholder-gallery.jpg",
            featured: false,
          }]);
          return;
        }

        const rawData = extractArray<any>(response.data);
        if (!rawData || !Array.isArray(rawData)) {
          console.warn("Invalid gallery data received, using fallback");
          setImages([{
            id: 1,
            title: "Gallery temporarily unavailable",
            description: "Please try again later",
            category: "General",
            image: "/placeholder-gallery.jpg",
            featured: false,
          }]);
          return;
        }

        const mappedData = rawData.map((item: any) => ({
          id: Number(item.id) || 1,
          title: item.title || "Untitled",
          description: item.description || "",
          category: item.category || "General",
          image: item.image || "/placeholder-gallery.jpg",
          featured: item.featured || false,
        }));

        setImages(mappedData);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        setError(error instanceof Error ? error.message : "Failed to load gallery");
        setImages([{
          id: 1,
          title: "Gallery temporarily unavailable",
          description: "Please try again later",
          category: "General",
          image: "/placeholder-gallery.jpg",
          featured: false,
        }]);
      } finally {
        setLoading(false);
      }
    }

    getImages();
  }, []);

  if (loading) {
    return <UnifiedLoader variant="grid" count={8} showFilters={false} />;
  }

  if (error) {
    return (
      <div>
        <IslamicHeader pageType="gallery" />
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
          <div className="mt-4 sm:mt-8 md:mt-12 mb-6 sm:mb-8">
            <Breadcrumb />
          </div>
        </div>
        <div className="pb-16">
          <ErrorDisplay 
            error={error} 
            variant="full" 
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <IslamicHeader pageType="gallery" />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
        <div className="mt-4 sm:mt-8 md:mt-12 mb-6 sm:mb-8">
          <Breadcrumb />
        </div>
      </div>
      <div className="pb-16">
        <Gallery initialImages={images} />
      </div>
    </div>
  );
}
