import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { apiConfig } from "./config";

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to a readable string (consistent between server and client)
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  // Use a consistent format that doesn't depend on locale
  const year = d.getFullYear();
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  const day = d.getDate();
  return `${month} ${day}, ${year}`;
}

/**
 * Format date to a short string (consistent between server and client)
 */
export function formatDateShort(date: string | Date): string {
  const d = new Date(date);
  // Use a consistent format that doesn't depend on locale
  const year = d.getFullYear();
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day = d.getDate();
  return `${month} ${day}, ${year}`;
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string | null | undefined, length: number): string {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Generate a slug from a string
 */
export function generateSlug(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Get initials from a name
 */
export function getInitials(name: string | null | undefined): string {
  if (!name || typeof name !== 'string') return '';
  const trimmed = name.trim();
  if (!trimmed) return '';
  
  return trimmed
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format duration in minutes to human readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Check if a string is a valid URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generate a deterministic ID (consistent between server and client)
 */
export function generateId(): string {
  // Use timestamp and counter to avoid Math.random() hydration issues
  const timestamp = Date.now().toString(36);
  const counter = Math.floor(Math.random() * 1000).toString(36);
  return `${timestamp}-${counter}`;
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string | null | undefined): string {
  if (!str || typeof str !== 'string') return '';
  const trimmed = str.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string | null | undefined): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(str: string | null | undefined): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

const DEFAULT_IMAGE_PLACEHOLDER = "/placeholder-gallery.jpg";
const STORAGE_PATH_PREFIXES = [
  "madrasa/public/storage/",
  "public/storage/",
  "storage/",
];

const ensureLeadingSlash = (value: string) =>
  value.startsWith("/") ? value : `/${value}`;

const encodePathSegments = (value: string) =>
  value
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

const stripStoragePrefix = (value: string) => {
  let normalized = value.replace(/^\/+/, "");
  for (const prefix of STORAGE_PATH_PREFIXES) {
    if (normalized.startsWith(prefix)) {
      normalized = normalized.slice(prefix.length);
      break;
    }
  }
  return normalized.replace(/^\/+/, "");
};

const isRemoteUrl = (value: string) => /^https?:\/\//iu.test(value);
const isDataUrl = (value: string) => value.startsWith("data:");

const extractStoragePathFromUrl = (value: string) => {
  try {
    const url = new URL(value);
    const path = url.pathname.replace(/^\/+/, "");
    const normalized = stripStoragePrefix(path);
    return normalized || null;
  } catch {
    return null;
  }
};

const buildImageProxyUrl = (value: string) => {
  const normalized = stripStoragePrefix(value);
  if (!normalized) return null;

  const encodedPath = encodePathSegments(normalized);
  return encodedPath ? `/api/images/${encodedPath}` : null;
};

const resolveLocalAsset = (value: string) => {
  const normalized = value.replace(/^\/+/, "");
  if (!normalized) return null;

  if (normalized.includes("placeholder")) {
    return ensureLeadingSlash(normalized);
  }

  if (normalized.startsWith("public/")) {
    return ensureLeadingSlash(normalized.slice("public/".length));
  }

  if (normalized.startsWith("images/")) {
    return ensureLeadingSlash(normalized);
  }

  if (normalized.startsWith("assets/")) {
    return ensureLeadingSlash(normalized);
  }

  return null;
};

const resolveFallback = (fallback?: string | null) => {
  if (!fallback) return DEFAULT_IMAGE_PLACEHOLDER;
  const trimmed = fallback.trim();
  if (!trimmed) return DEFAULT_IMAGE_PLACEHOLDER;
  if (isRemoteUrl(trimmed) || isDataUrl(trimmed) || trimmed.startsWith("/")) {
    return trimmed;
  }
  return ensureLeadingSlash(trimmed);
};

export const buildStorageUrl = (path?: string | null) => {
  if (!path) return null;

  if (path.startsWith("http")) {
    return path;
  }

  const trimmedBase = apiConfig.storageBaseUrl.replace(/\/+$/u, "");
  const normalizedPath = path.replace(/^\/+/, "");
  return `${trimmedBase}/${normalizedPath}`;
};

// Simple image URL function - just prepend backend URL (recommended for most use cases)
// This is the preferred method for getting image URLs across the website
export const getSimpleImageUrl = (
  path: string | null | undefined,
  fallback: string = "/placeholder-blog.jpg"
): string => {
  if (!path) return fallback;
  
  // If already a full URL, return as is
  if (path.startsWith("http")) {
    return path;
  }
  
  // Remove leading slash if present
  const cleanPath = path.replace(/^\/+/, "");
  
  // Prepend backend storage URL
  return `https://website.anwarululoom.com/storage/${cleanPath}`;
};

// General image URL function that can be used everywhere (legacy - use getSimpleImageUrl for new code)
export const getImageUrl = (img?: string | null, fallback?: string | null) => {
  const fallbackUrl = resolveFallback(fallback);

  if (!img) return fallbackUrl;

  const rawValue = `${img}`.trim();
  if (!rawValue) return fallbackUrl;

  if (rawValue.startsWith("/images/")) {
    return rawValue;
  }

  if (isDataUrl(rawValue)) {
    return rawValue;
  }

  const localAsset = resolveLocalAsset(rawValue);
  if (localAsset) {
    return localAsset;
  }

  if (isRemoteUrl(rawValue)) {
    const storagePath = extractStoragePathFromUrl(rawValue);
    if (storagePath) {
      const proxied = buildImageProxyUrl(storagePath);
      if (proxied) return proxied;
    }
    return rawValue;
  }

  const proxied = buildImageProxyUrl(rawValue);
  if (proxied) return proxied;

  return fallbackUrl;
};

// Enhanced image URL function with fallback handling
export const getImageUrlWithFallback = (
  img?: string | null,
  fallback?: string | null
) => {
  const url = getImageUrl(img, fallback);
  return url || resolveFallback(fallback);
};
