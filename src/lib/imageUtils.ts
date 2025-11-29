import { getImageUrl, getSimpleImageUrl } from "./utils";

// Re-export image utilities from the main utils file for easier access
export { getImageUrl, getSimpleImageUrl, isValidUrl } from "./utils";

/**
 * Helper function to get image URL with fallback
 * @param imagePath - The image path (filename or full URL)
 * @param fallbackPath - Fallback image path if primary fails
 * @returns string | null - Full image URL or null
 */
export const getImageUrlWithFallback = (
  imagePath: string | null | undefined,
  fallbackPath?: string | null | undefined
): string | null => {
  const url = getImageUrl(imagePath, fallbackPath);
  return url ?? null;
};

/**
 * Helper function to get placeholder image URL
 * @param type - Type of placeholder (article, course, author, etc.)
 * @returns string - Placeholder image URL
 */
export const getPlaceholderImageUrl = (type: 'article' | 'course' | 'author' | 'book' | 'event' | 'default' = 'default'): string => {
  const placeholders = {
    article: '/placeholder-blog.jpg',
    course: '/placeholder-course.jpg', 
    author: '/placeholder-author.jpg',
    book: '/placeholder-book.jpg',
    event: '/placeholder-event.jpg',
    default: '/placeholder-gallery.jpg'
  };
  
  return placeholders[type];
};

/**
 * Helper function to check if image exists (for future use with API)
 * @param imageUrl - The image URL to check
 * @returns Promise<boolean> - True if image exists, false otherwise
 */
export const checkImageExists = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Helper function to get optimized image URL (for future use with image optimization)
 * @param imagePath - The image path
 * @param width - Desired width
 * @param height - Desired height
 * @param quality - Image quality (1-100)
 * @returns string | null - Optimized image URL
 */
export const getOptimizedImageUrl = (
  imagePath: string | null | undefined,
  width?: number,
  height?: number,
  quality: number = 80
): string | null => {
  const baseUrl = getImageUrl(imagePath);
  if (!baseUrl) return null;
  
  // Add optimization parameters if needed
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};
