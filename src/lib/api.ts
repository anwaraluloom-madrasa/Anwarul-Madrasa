import { apiConfig, endpoints } from "./config";
import { logger } from "./logger";

// API Response Types
export interface PaginationMeta {
  current_page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
  has_next_page?: boolean;
  has_prev_page?: boolean;
  next_page?: number | null;
  prev_page?: number | null;
  [key: string]: number | boolean | null | undefined;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  pagination?: PaginationMeta | null;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

type QueryValue = string | number | boolean | null | undefined;

interface RequestOptions extends RequestInit {
  params?: Record<string, QueryValue>;
}

export interface ListParams {
  page?: number;
  limit?: number;
  [key: string]: QueryValue;
}

const DEFAULT_PAGE_SIZE = 12;

export function createPaginationMeta({
  page,
  limit,
  total,
}: {
  page: number;
  limit: number;
  total: number;
}): PaginationMeta {
  const safeLimit = Math.max(limit, 1);
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    current_page: page,
    per_page: safeLimit,
    total,
    total_pages: totalPages,
    has_next_page: hasNext,
    has_prev_page: hasPrev,
    next_page: hasNext ? page + 1 : null,
    prev_page: hasPrev ? page - 1 : null,
  };
}

// Request cache for deduplication and short-term caching
interface CacheEntry<T> {
  data: ApiResponse<T>;
  timestamp: number;
  promise?: Promise<ApiResponse<T>>;
}

// Base API Client
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private defaultTimeout = 10000; // Reduced to 10 seconds for faster failure detection
  private cache = new Map<string, CacheEntry<any>>();
  private readonly CACHE_DURATION = 5000; // 5 seconds cache for GET requests
  private inFlightRequests = new Map<string, Promise<ApiResponse<any>>>();

  constructor() {
    this.baseUrl = apiConfig.baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };

    // Clean up old cache entries periodically
    if (typeof window !== "undefined") {
      setInterval(() => this.cleanCache(), 30000); // Every 30 seconds
    }
  }

  private cleanCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.CACHE_DURATION * 2) {
        this.cache.delete(key);
      }
    }
  }

  private getCacheKey(
    endpoint: string,
    params?: Record<string, QueryValue>
  ): string {
    const sortedParams = params
      ? Object.keys(params)
          .sort()
          .map((k) => `${k}=${params[k]}`)
          .join("&")
      : "";
    return `${endpoint}?${sortedParams}`;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, QueryValue>
  ): string {
    const isAbsoluteEndpoint = /^https?:\/\//i.test(endpoint);
    let url: string;

    if (isAbsoluteEndpoint) {
      url = endpoint;
    } else {
      const base = this.baseUrl;

      // If endpoint is a local route (starts with /), use it as-is
      // Next.js will resolve relative URLs correctly in server components
      // For client-side, we'll need absolute URL
      if (endpoint.startsWith("/")) {
        // For server-side, relative URLs work fine with fetch
        // For client-side, we need absolute URL
        if (typeof window !== "undefined") {
          url = `${window.location.origin}${endpoint}`;
        } else {
          // Server-side: try to use app URL if available, otherwise use relative
          // Relative URLs work in Next.js server components via fetch
          const appUrl =
            process.env.NEXT_PUBLIC_APP_URL || "https://www.anwarululoom.com";
          url = `${appUrl}${endpoint}`;
        }
      } else {
        const needsSlash = !base.endsWith("/") && !endpoint.startsWith("/");
        url = `${base}${needsSlash ? "/" : ""}${endpoint}`;
      }
    }

    if (!params) {
      return url;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }
      searchParams.append(key, String(value));
    });

    const query = searchParams.toString();
    if (!query) {
      return url;
    }

    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}${query}`;
  }

  private createTimeoutSignal(method: string): AbortSignal | undefined {
    if (typeof AbortController === "undefined") {
      return undefined;
    }

    if (method.toUpperCase() === "OPTIONS") {
      return undefined;
    }

    // Try using AbortSignal.timeout() if available (modern browsers)
    if (typeof AbortSignal !== "undefined" && "timeout" in AbortSignal) {
      try {
        return AbortSignal.timeout(this.defaultTimeout);
      } catch (error) {
        // Fall back to manual controller if timeout() fails
        logger.debug(
          "AbortSignal.timeout() not supported, using manual controller",
          { error }
        );
      }
    }

    // Fallback: Use manual AbortController
    const controller = new AbortController();
    setTimeout(() => {
      controller.abort();
    }, this.defaultTimeout);

    return controller.signal;
  }

  private parseError(error: unknown): string {
    // Check for timeout/abort errors
    if (
      typeof DOMException !== "undefined" &&
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      return `Request timed out after ${this.defaultTimeout}ms. Please try again.`;
    }

    // Check for timeout in error message
    if (error instanceof Error) {
      if (
        error.name === "AbortError" ||
        error.message.includes("timeout") ||
        error.message.includes("timed out") ||
        error.message.includes("signal timed out")
      ) {
        return `Request timed out after ${this.defaultTimeout}ms. Please try again.`;
      }
    }

    if (error instanceof TypeError && /fetch failed/i.test(error.message)) {
      return "Unable to reach the server. Check your internet connection.";
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }

    return "An unexpected error occurred while contacting the server.";
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }

  private isPaginatedPayload(
    value: unknown
  ): value is { data: unknown; pagination?: PaginationMeta } {
    return (
      typeof value === "object" &&
      value !== null &&
      "data" in value &&
      Object.prototype.hasOwnProperty.call(value, "pagination")
    );
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, ...rest } = options;
    const method = (rest.method ?? "GET").toString().toUpperCase();
    const isGetRequest = method === "GET";

    // Check cache for GET requests
    if (isGetRequest) {
      const cacheKey = this.getCacheKey(endpoint, params);
      const cached = this.cache.get(cacheKey);
      const now = Date.now();

      if (cached && now - cached.timestamp < this.CACHE_DURATION) {
        logger.debug(`Cache hit for ${endpoint}`);
        return cached.data;
      }

      // Check if same request is already in-flight (deduplication)
      const inFlight = this.inFlightRequests.get(cacheKey);
      if (inFlight) {
        logger.debug(`Deduplicating request for ${endpoint}`);
        return inFlight;
      }
    }

    const url = this.buildUrl(endpoint, params);
    const headers: HeadersInit = {
      ...this.defaultHeaders,
      ...rest.headers,
    };
    const config: RequestInit = {
      ...rest,
      headers,
      signal: rest.signal ?? this.createTimeoutSignal(method),
      // Add cache control for better performance
      cache: isGetRequest ? "default" : "no-store",
    };

    const startTime = performance.now();
    logger.apiRequest(endpoint, params);

    // Create request promise for deduplication
    const cacheKey = isGetRequest ? this.getCacheKey(endpoint, params) : "";
    const requestPromise = this.executeRequest<T>(
      url,
      config,
      endpoint,
      cacheKey,
      isGetRequest
    );

    if (isGetRequest && cacheKey) {
      this.inFlightRequests.set(cacheKey, requestPromise);
      requestPromise.finally(() => {
        this.inFlightRequests.delete(cacheKey);
      });
    }

    return requestPromise;
  }

  private async executeRequest<T>(
    url: string,
    config: RequestInit,
    endpoint: string,
    cacheKey: string,
    isGetRequest: boolean
  ): Promise<ApiResponse<T>> {
    const startTime = performance.now();

    // Retry logic for failed requests - reduced retries for faster failure
    const maxRetries = Math.min(apiConfig.errorHandling.maxRetries, 2); // Max 2 retries instead of 3
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, config);
        const duration = Math.round(performance.now() - startTime);

        if (!response.ok) {
          const errorText = await response.text();
          const statusCode: number = response.status;

          // Don't retry for client errors (4xx) except 408, 429
          const shouldRetry =
            apiConfig.errorHandling.retryableStatusCodes.includes(
              statusCode as any
            );

          if (!shouldRetry) {
            // Check if error should be suppressed
            const shouldSuppress =
              apiConfig.errorHandling.suppressedStatusCodes.includes(
                statusCode as any
              );
            if (!shouldSuppress) {
              logger.apiError(endpoint, new Error(errorText), statusCode);
            }
            throw new Error(`HTTP error! status: ${statusCode}`);
          }

          // If it's the last attempt, throw the error
          if (attempt === maxRetries) {
            const shouldSuppress =
              apiConfig.errorHandling.suppressedStatusCodes.includes(
                statusCode as any
              );
            if (!shouldSuppress) {
              logger.apiError(endpoint, new Error(errorText), statusCode);
            }
            throw new Error(`HTTP error! status: ${statusCode}`);
          }

          // Wait before retry (faster exponential backoff)
          const delay = Math.min(
            apiConfig.errorHandling.retryDelay * attempt,
            2000
          ); // Cap at 2 seconds
          logger.debug(
            `Retrying ${endpoint} in ${delay}ms (attempt ${attempt}/${maxRetries})`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        logger.apiResponse(endpoint, duration, response.status);

        const rawPayload = await this.parseResponse<unknown>(response);
        let data = rawPayload as T;
        let pagination: PaginationMeta | null | undefined;

        if (this.isPaginatedPayload(rawPayload)) {
          data = rawPayload.data as T;
          pagination = rawPayload.pagination ?? null;
        }

        const result: ApiResponse<T> = {
          data,
          success: true,
          pagination,
        };

        // Cache successful GET requests
        if (isGetRequest && cacheKey) {
          this.cache.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          });
        }

        return result;
      } catch (error) {
        const normalized =
          error instanceof Error ? error : new Error(this.parseError(error));
        lastError = normalized;

        // Check if it's a timeout error
        const isTimeoutError =
          normalized.name === "AbortError" ||
          normalized.message.includes("timeout") ||
          normalized.message.includes("timed out") ||
          (normalized instanceof DOMException &&
            normalized.name === "AbortError");

        // Don't retry on certain errors (auth errors, timeout on last attempt)
        if (
          error instanceof Error &&
          (error.message.includes("401") ||
            error.message.includes("403") ||
            (isTimeoutError && attempt === maxRetries))
        ) {
          if (isTimeoutError) {
            logger.apiError(
              endpoint,
              new Error(`Request timed out after ${this.defaultTimeout}ms`)
            );
          } else {
            logger.apiError(endpoint, error);
          }
          break;
        }

        // For timeout errors, wait a bit longer before retry (but still capped)
        if (attempt < maxRetries) {
          const delay = isTimeoutError
            ? Math.min(apiConfig.errorHandling.retryDelay * attempt * 1.5, 2000) // Faster retry, cap at 2s
            : Math.min(apiConfig.errorHandling.retryDelay * attempt, 2000);

          if (isTimeoutError) {
            logger.debug(
              `Timeout error on ${endpoint}, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`
            );
          }
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // Log final error (suppress for endpoints with fallback data)
    if (lastError) {
      const isTimeoutError =
        lastError.message.includes("timeout") ||
        lastError.message.includes("timed out") ||
        lastError.name === "AbortError";

      const hasFallback =
        endpoint.includes("/iftah") ||
        endpoint.includes("/authors") ||
        endpoint.includes("/courses") ||
        endpoint.includes("/books") ||
        endpoint.includes("/events") ||
        endpoint.includes("/blogs") ||
        endpoint.includes("/articles");

      const shouldSuppress =
        (lastError.message.includes("404") &&
          apiConfig.errorHandling.suppressedStatusCodes.includes(404)) ||
        // Suppress timeout errors for endpoints that have graceful fallback handling
        (isTimeoutError && hasFallback);

      if (!shouldSuppress) {
        logger.apiError(endpoint, lastError);
      } else {
        // Only log as debug/warn level for endpoints with fallback
        logger.debug(
          `API request failed (fallback will be used): ${endpoint}`,
          {
            error: lastError.message,
          }
        );
      }
    }

    return {
      data: null as T,
      success: false,
      pagination: null,
      error:
        lastError?.message ||
        this.parseError("Connection failed after multiple attempts"),
    };
  }

  // Generic GET request
  async get<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "GET",
      ...options,
    });
  }

  // Generic POST request
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  // Generic PUT request
  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  // Generic DELETE request
  async delete<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      ...options,
    });
  }
}

// Create API client instance
export const apiClient = new ApiClient();

export function extractArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    const value = (payload as { data?: unknown }).data;
    if (Array.isArray(value)) {
      return value as T[];
    }
  }

  return [];
}

// Specific API services
export class BlogsApi {
  static async getAll(params: ListParams = {}) {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? DEFAULT_PAGE_SIZE;

    try {
      logger.info("Fetching blogs from API", { page, limit });
      const result = await apiClient.get(endpoints.blogs, {
        params: { page, limit, ...rest },
      });

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      logger.info("Successfully fetched blogs", {
        count: Array.isArray(result.data) ? result.data.length : 0,
      });

      if (result.pagination) {
        return result;
      }

      const total = Array.isArray(result.data) ? result.data.length : limit;

      return {
        ...result,
        pagination: createPaginationMeta({
          page,
          limit,
          total,
        }),
      };
    } catch (error) {
      logger.error("Blogs API failed", { error });
      throw error;
    }
  }

  static async getById(id: string) {
    try {
      const result = await apiClient.get(`${endpoints.blogs}/${id}`);
      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }
      return result;
    } catch (error) {
      logger.error("Blog getById failed", { id, error });
      throw error;
    }
  }

  static async getBySlug(slug: string) {
    try {
      // First try to get all blogs and find by slug
      const allBlogs = await this.getAll({ limit: 1000 });
      if (allBlogs.success && Array.isArray(allBlogs.data)) {
        const blog = allBlogs.data.find((b: any) => b.slug === slug);
        if (blog) {
          return {
            data: blog,
            success: true,
            message: "Blog found by slug",
          };
        }
      }

      // If not found in list, try direct API call
      const result = await apiClient.get(`${endpoints.blogs}/${slug}`);
      if (!result.success) {
        throw new Error(result.error || "Blog not found");
      }
      return result;
    } catch (error) {
      logger.error("Blog getBySlug failed", { slug, error });
      throw error;
    }
  }
}

export class DonationApi {
  static async getAll(params: ListParams = {}) {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? DEFAULT_PAGE_SIZE;

    const result = await apiClient.get(endpoints.donation, {
      params: { page, limit, ...rest },
    });

    if (!result.success) {
      return {
        data: [],
        success: false,
        error: result.error || "Failed to fetch donations",
        pagination: createPaginationMeta({
          page,
          limit,
          total: 0,
        }),
      };
    }

    if (result.pagination) {
      return result;
    }

    const total = Array.isArray(result.data) ? result.data.length : limit;

    return {
      ...result,
      pagination: createPaginationMeta({ page, limit, total }),
    };
  }

  static async getById(id: string) {
    const result = await apiClient.get(`${endpoints.donation}/${id}`);
    if (!result.success) {
      return {
        success: true,
        message: "Using fallback data due to API unavailability",
      };
    }
    return result;
  }

  static async getBySlug(slug: string) {
    const result = await apiClient.get(`${endpoints.donation}/${slug}`);
    if (!result.success) {
      return {
        success: true,
        message: "Using fallback data due to API unavailability",
      };
    }
    return result;
  }
}

export class CoursesApi {
  static async getAll(params: ListParams = {}) {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? DEFAULT_PAGE_SIZE;

    try {
      logger.info("Fetching courses from API", { page, limit });
      const result = await apiClient.get(endpoints.courses, {
        params: { page, limit, ...rest },
      });

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      logger.info("Successfully fetched courses", {
        count: Array.isArray(result.data) ? result.data.length : 0,
      });

      if (result.pagination) {
        return result;
      }

      const total = Array.isArray(result.data) ? result.data.length : limit;

      return {
        ...result,
        pagination: createPaginationMeta({ page, limit, total }),
      };
    } catch (error) {
      logger.error("Courses API failed", { error });
      throw error;
    }
  }

  static async getById(id: string) {
    try {
      const result = await apiClient.get(`${endpoints.courses}/${id}`);
      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }
      return result;
    } catch (error) {
      logger.error("Course getById failed", { id, error });
      throw error;
    }
  }

  static async getBySlug(slug: string) {
    try {
      // First try to get all courses and find by slug
      const allCourses = await this.getAll({ limit: 1000 });
      if (allCourses.success && Array.isArray(allCourses.data)) {
        const course = allCourses.data.find((c: any) => c.slug === slug);
        if (course) {
          return {
            data: course,
            success: true,
            message: "Course found by slug",
          };
        }
      }

      // If not found in list, try direct API call
      const result = await apiClient.get(`${endpoints.courses}/${slug}`);
      if (!result.success) {
        throw new Error(result.error || "Course not found");
      }
      return result;
    } catch (error) {
      logger.error("Course getBySlug failed", { slug, error });
      throw error;
    }
  }
}

interface CourseCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  courses_count: number;
}

interface CourseCategoryResponse {
  total: number;
  categories: CourseCategory[];
}

export class CourseCategoryApi {
  static async getCategories(): Promise<ApiResponse<CourseCategoryResponse>> {
    try {
      logger.info("Fetching course categories from API");
      const result = await apiClient.get(endpoints.courseCategories);

      if (!result.success) {
        logger.warn("CourseCategory getCategories API failed", {
          error: result.error,
        });
        return {
          data: { total: 0, categories: [] },
          success: false,
          error: result.error || "API request failed",
        };
      }

      // Handle different response formats
      let categoriesData: CourseCategoryResponse = { total: 0, categories: [] };
      
      if (result.data && typeof result.data === "object") {
        const data = result.data as Record<string, unknown>;
        if (data.categories && Array.isArray(data.categories)) {
          categoriesData = {
            total: (data.total as number) || (data.categories as CourseCategory[]).length,
            categories: data.categories as CourseCategory[]
          };
        } else if (data.data && typeof data.data === "object") {
          const innerData = data.data as Record<string, unknown>;
          if (innerData.categories && Array.isArray(innerData.categories)) {
            categoriesData = {
              total: (innerData.total as number) || (innerData.categories as CourseCategory[]).length,
              categories: innerData.categories as CourseCategory[]
            };
          }
        } else if (Array.isArray(result.data)) {
          categoriesData = {
            total: result.data.length,
            categories: result.data as CourseCategory[]
          };
        }
      }

      logger.info("Successfully fetched course categories", {
        count: categoriesData.categories.length,
      });

      return {
        data: categoriesData,
        success: true,
      };
    } catch (error) {
      logger.error("CourseCategory API failed", { error });
      return {
        data: { total: 0, categories: [] },
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch course categories",
      };
    }
  }
}

// awlayaa api

export interface AdmissionFormData {
  unique_id?: string;
  first_name: string;
  last_name: string;
  father_name: string;
  grandfather_name?: string;
  permanent_province?: string;
  permanent_distract?: string;
  permanent_vilage?: string;
  current_province?: string;
  current_distract?: string;
  current_vilage?: string;
  phone?: string;
  whatsapp_no?: string;
  dob?: string;
  blood_type?: string;
  degree_id?: number; // Optional - can be omitted to avoid validation error
  previous_degree?: string;
  previous_madrasa?: string;
  location_madrasa?: string;
  location?: string;
}

export class AdmissionsApi {
  // 🔹 Helper: Extract CSRF token from cookies with better debugging
  private static extractCsrfTokenFromCookies(): string | null {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split(";");
    console.log("🍪 [ADMISSIONS] All cookies:", document.cookie);
    console.log("🍪 [ADMISSIONS] Parsed cookies:", cookies);

    // Try XSRF-TOKEN first (Laravel Sanctum standard)
    const xsrfCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("XSRF-TOKEN=")
    );
    if (xsrfCookie) {
      const token = decodeURIComponent(xsrfCookie.split("=")[1].trim());
      console.log(
        "✅ [ADMISSIONS] Found XSRF-TOKEN:",
        token.substring(0, 20) + "..."
      );
      return token;
    }

    // Try lowercase version
    const xsrfCookieLower = cookies.find((cookie) =>
      cookie.trim().toLowerCase().startsWith("xsrf-token=")
    );
    if (xsrfCookieLower) {
      const token = decodeURIComponent(xsrfCookieLower.split("=")[1].trim());
      console.log(
        "✅ [ADMISSIONS] Found xsrf-token (lowercase):",
        token.substring(0, 20) + "..."
      );
      return token;
    }

    console.log("❌ [ADMISSIONS] No XSRF-TOKEN found in cookies");
    return null;
  }

  // 🔹 Get CSRF token (helper method) - IMPROVED VERSION
  static async getCsrfToken(): Promise<string | null> {
    try {
      // Step 1: Check if token already exists in cookies
      let token = this.extractCsrfTokenFromCookies();
      if (token) {
        console.log("✅ [ADMISSIONS] CSRF token already in cookies");
        return token;
      }

      // Step 2: Fetch CSRF cookie from server
      console.log("🔑 [ADMISSIONS] Fetching CSRF token from server...");
      console.log("🔑 [ADMISSIONS] CSRF endpoint:", endpoints.csrfCookie);

      try {
        const response = await fetch(endpoints.csrfCookie, {
          method: "GET",
          credentials: "include", // Must include credentials
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        console.log(
          "📥 [ADMISSIONS] CSRF endpoint response status:",
          response.status
        );
        console.log(
          "📥 [ADMISSIONS] CSRF endpoint response headers:",
          Object.fromEntries(response.headers.entries())
        );

        if (response.ok) {
          // Check cookies immediately (browser sets cookies synchronously)
          token = this.extractCsrfTokenFromCookies();

          if (token) {
            console.log("✅ [ADMISSIONS] CSRF token obtained from server");
            return token;
          } else {
            console.warn(
              "⚠ [ADMISSIONS] CSRF endpoint responded OK but no cookie found"
            );
            console.warn(
              "⚠ [ADMISSIONS] Check: 1) Same domain 2) CORS credentials 3) Cookie settings"
            );
          }
        } else {
          console.error(
            "❌ [ADMISSIONS] CSRF endpoint failed:",
            response.status,
            response.statusText
          );
        }
      } catch (csrfError) {
        console.error("❌ [ADMISSIONS] Error fetching CSRF token:", csrfError);
      }

      console.log("❌ [ADMISSIONS] No CSRF token found");
      return null;
    } catch (error) {
      console.error("❌ [ADMISSIONS] Error in getCsrfToken:", error);
      return null;
    }
  }

  // ... other methods stay the same ...

  // 🔹 Create a new admission (POST) - IMPROVED VERSION
  static async create(data: AdmissionFormData) {
    try {
      const apiUrl = endpoints.admissions;
      console.log("🚀 [ADMISSION API] Starting request to:", apiUrl);

      // ✅ STEP 1: Get CSRF cookie FIRST (CRITICAL!)
      console.log("🔑 [ADMISSION API] Step 1: Fetching CSRF cookie...");
      try {
        const csrfResponse = await fetch(endpoints.csrfCookie, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        console.log("📥 [ADMISSION API] CSRF cookie response:", {
          status: csrfResponse.status,
          statusText: csrfResponse.statusText,
          ok: csrfResponse.ok,
        });

        if (!csrfResponse.ok) {
          console.warn(
            "⚠️ [ADMISSION API] CSRF cookie fetch failed, continuing anyway..."
          );
          console.warn(
            `⚠️ [ADMISSION API] Status: ${csrfResponse.status} ${csrfResponse.statusText}`
          );
        } else {
          // Wait for cookie to be set
          await new Promise((resolve) => setTimeout(resolve, 150));
        }
      } catch (csrfError: any) {
        console.warn("⚠️ [ADMISSION API] CSRF cookie fetch error:", csrfError);
        console.warn(
          "⚠️ [ADMISSION API] Continuing without CSRF cookie - API may still work"
        );
      }

      // ✅ STEP 2: Get the CSRF token from cookies
      console.log(
        "🔑 [ADMISSION API] Step 2: Extracting CSRF token from cookies..."
      );
      const csrfToken = await this.getCsrfToken();

      // ✅ STEP 3: Prepare headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      };

      // Add CSRF token if available (optional - API routes might not require it)
      if (csrfToken) {
        console.log(
          "✅ [ADMISSION API] CSRF token obtained:",
          csrfToken.substring(0, 30) + "..."
        );
        headers["X-XSRF-TOKEN"] = csrfToken; // Laravel Sanctum expects this header name
      } else {
        console.warn(
          "⚠️ [ADMISSION API] No CSRF token available (may be due to CORS restrictions)"
        );
        console.warn(
          "⚠️ [ADMISSION API] Proceeding without CSRF token - API route may not require it"
        );
      }

      // Prepare request body
      const requestBody = { ...data };

      console.log("📤 [ADMISSION API] Request URL:", apiUrl);
      console.log("📤 [ADMISSION API] Request headers:", headers);
      console.log(
        "📤 [ADMISSION API] Request body:",
        JSON.stringify(requestBody, null, 2)
      );

      // ✅ STEP 4: Send POST request with credentials
      console.log("🌐 [ADMISSION API] Making POST request to:", apiUrl);
      console.log("🌐 [ADMISSION API] Full fetch URL will be:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include", // Must include credentials to send cookies
        headers,
        body: JSON.stringify(requestBody),
      });

      console.log("📥 [ADMISSION API] Response received!");
      console.log("📥 [ADMISSION API] Response status:", response.status);
      console.log(
        "📥 [ADMISSION API] Response status text:",
        response.statusText
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [ADMISSION API] Request failed!");
        console.error("❌ [ADMISSION API] Status:", response.status);
        console.error("❌ [ADMISSION API] Error response:", errorText);

        try {
          const errorJson = JSON.parse(errorText);
          console.error("❌ [ADMISSION API] Error JSON:", errorJson);

          if (errorJson.message && errorJson.message.includes("CSRF")) {
            throw new Error(
              `CSRF token mismatch (${response.status}). The CSRF token may not have been set correctly. Check browser console for cookie information.`
            );
          }
        } catch (e) {
          // Not JSON, that's fine
        }

        throw new Error(
          `API request failed with status ${response.status}: ${errorText}`
        );
      }

      const result = await response.json();
      console.log(
        "✅ [ADMISSION API] SUCCESS: Data sent to Laravel dashboard!"
      );
      console.log(
        "✅ [ADMISSION API] Response data:",
        JSON.stringify(result, null, 2)
      );

      return {
        data: result,
        success: true,
        message: "Admission submitted successfully",
      };
    } catch (error: any) {
      console.error("❌ [ADMISSION API] Exception occurred:", error);
      console.error("❌ [ADMISSION API] Error message:", error.message);

      // Don't wrap CSRF errors - let the server's response speak for itself
      // If the server requires CSRF and we don't have it, it will return a 419 error
      throw error;
    }
  }

  // 🔹 Submit admission form (wrapper that calls create)
  static async submit(data: AdmissionFormData) {
    console.log("📝 [ADMISSION SUBMIT] Starting form submission...");
    console.log("📝 [ADMISSION SUBMIT] Form data:", data);

    try {
      const result = await this.create(data);
      console.log("✅ [ADMISSION SUBMIT] Form submission successful!");
      return result;
    } catch (error: any) {
      console.error("❌ [ADMISSION SUBMIT] API submission failed:", error);
      console.error("❌ [ADMISSION SUBMIT] Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      throw error;
    }
  }
}

export class AwlyaaApi {
  static async getAll(params: ListParams = {}) {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? DEFAULT_PAGE_SIZE;

    return apiClient.get(endpoints.awlyaa, {
      params: { page, limit, ...rest },
    });
  }

  static async getById(id: string) {
    return apiClient.get(`${endpoints.awlyaa}/${id}`);
  }
}

export class AuthorsApi {
  static async getAll(params: ListParams = {}) {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? DEFAULT_PAGE_SIZE;

    try {
      logger.info("Fetching authors from API", { page, limit });
      const result = await apiClient.get(endpoints.authors, {
        params: { page, limit, ...rest },
      });

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      logger.info("Successfully fetched authors", {
        count: Array.isArray(result.data) ? result.data.length : 0,
      });

      if (result.pagination) {
        return result;
      }

      const total = Array.isArray(result.data) ? result.data.length : limit;

      return {
        ...result,
        pagination: createPaginationMeta({ page, limit, total }),
      };
    } catch (error) {
      logger.error("Authors API failed", { error });
      throw error;
    }
  }

  static async getById(id: string) {
    try {
      const result = await apiClient.get(`${endpoints.authors}/${id}`);
      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }
      return result;
    } catch (error) {
      logger.error("Author getById failed", { id, error });
      throw error;
    }
  }
}

export class BooksApi {
  static async getAll(params: ListParams = {}) {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? DEFAULT_PAGE_SIZE;

    try {
      logger.info("Fetching books from API", { page, limit });
      const result = await apiClient.get(endpoints.books, {
        params: { page, limit, ...rest },
      });

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      logger.info("Successfully fetched books", {
        count: Array.isArray(result.data) ? result.data.length : 0,
      });

      if (result.pagination) {
        return result;
      }

      const total = Array.isArray(result.data) ? result.data.length : limit;

      return {
        ...result,
        pagination: createPaginationMeta({ page, limit, total }),
      };
    } catch (error) {
      logger.error("Books API failed", { error });
      throw error;
    }
  }

  static async getById(id: string) {
    try {
      const result = await apiClient.get(`${endpoints.book}/${id}`);
      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }
      return result;
    } catch (error) {
      logger.error("Book getById failed", { id, error });
      throw error;
    }
  }
}

export class EventsApi {
  static async getAll(params: ListParams = {}) {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? DEFAULT_PAGE_SIZE;

    try {
      logger.info("Fetching events from API", { page, limit });
      const result = await apiClient.get(endpoints.events, {
        params: { page, limit, ...rest },
      });

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      logger.info("Successfully fetched events", {
        count: Array.isArray(result.data) ? result.data.length : 0,
      });

      if (result.pagination) {
        return result;
      }

      const total = Array.isArray(result.data) ? result.data.length : limit;

      return {
        ...result,
        pagination: createPaginationMeta({ page, limit, total }),
      };
    } catch (error) {
      logger.error("Events API failed", { error });
      throw error;
    }
  }

  static async getById(id: string) {
    try {
      const result = await apiClient.get(`${endpoints.events}/${id}`);
      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }
      return result;
    } catch (error) {
      logger.error("Event getById failed", { id, error });
      throw error;
    }
  }

  static async getBySlug(slug: string) {
    try {
      const result = await apiClient.get(`${endpoints.events}/${slug}`);
      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }
      return result;
    } catch (error) {
      logger.error("Event getBySlug failed", { slug, error });
      throw error;
    }
  }
}

// ifah qustion

export class IftahApi {
  static async getAll(params: ListParams = {}) {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? DEFAULT_PAGE_SIZE;

    try {
      logger.info("Fetching iftah from API", { page, limit });
      const result = await apiClient.get(endpoints.iftah, {
        params: { page, limit, ...rest },
      });

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      logger.info("Successfully fetched iftah", {
        count: Array.isArray(result.data) ? result.data.length : 0,
      });

      if (result.pagination) {
        return result;
      }

      const total = Array.isArray(result.data) ? result.data.length : limit;

      return {
        ...result,
        pagination: createPaginationMeta({ page, limit, total }),
      };
    } catch (error) {
      logger.error("Iftah API failed", { error });
      throw error;
    }
  }

  static async getById(id: string) {
    try {
      const result = await apiClient.get(`${endpoints.iftah}/${id}`);
      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }
      return result;
    } catch (error) {
      logger.error("Iftah getById failed", { id, error });
      throw error;
    }
  }

  static async getBySlug(slug: string) {
    try {
      const result = await apiClient.get(`${endpoints.iftah}/${slug}`);
      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }
      return result;
    } catch (error) {
      logger.error("Iftah getBySlug failed", { slug, error });
      throw error;
    }
  }

  static async getIftah(slug: string) {
    try {
      const result = await apiClient.get(`${endpoints.iftah}/${slug}`);
      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }
      return result;
    } catch (error) {
      logger.error("Iftah getIftah failed", { slug, error });
      throw error;
    }
  }

  static async getBySubCategory(
    subCategoryId: number,
    params: ListParams = {}
  ) {
    const { limit: rawLimit, ...rest } = params;
    const limit = rawLimit ?? 100;

    try {
      logger.info("Fetching iftah by subcategory from API", {
        subCategoryId,
        limit,
      });
      const result = await apiClient.get(
        `/api/iftah/sub-category/${subCategoryId}`,
        {
          params: { limit, ...rest },
        }
      );

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      logger.info("Successfully fetched iftah by subcategory", {
        subCategoryId,
        count: Array.isArray(result.data) ? result.data.length : 0,
      });

      return {
        data: Array.isArray(result.data) ? result.data : [],
        success: true,
      };
    } catch (error) {
      logger.warn("Iftah getBySubCategory failed", { subCategoryId, error });
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static extractCategories(fatwas: any[]): Array<{ id: number; name: string }> {
    if (!Array.isArray(fatwas) || fatwas.length === 0) {
      logger.info("extractCategories: No fatwas provided or empty array");
      console.log("📊 extractCategories: No fatwas provided or empty array");
      return [];
    }

    const categoryMap = new Map<number, { id: number; name: string }>();
    let processedCount = 0;
    let skippedCount = 0;

    fatwas.forEach((fatwa, index) => {
      try {
        // Log first item structure for debugging
        if (index === 0) {
          console.log("🔍 Sample fatwa structure:", {
            id: fatwa.id,
            title: fatwa.title,
            has_iftah_sub_category: !!fatwa?.iftah_sub_category,
            iftah_sub_category: fatwa?.iftah_sub_category,
            direct_tag: fatwa?.tag,
            tag_id: fatwa?.tag_id,
          });
        }

        let tagId: number | null = null;
        let tagName: string | null = null;

        // Priority 1: Check iftah_sub_category.tag (nested structure - most common)
        if (fatwa?.iftah_sub_category?.tag) {
          tagId = fatwa.iftah_sub_category.tag.id;
          tagName = fatwa.iftah_sub_category.tag.name;
          processedCount++;
        }
        // Priority 2: Check iftah_sub_category.tag_id (if tag object is missing)
        else if (fatwa?.iftah_sub_category?.tag_id) {
          tagId = fatwa.iftah_sub_category.tag_id;
          // Try to get name from subcategory or use tag_id as fallback
          tagName = fatwa.iftah_sub_category.name || `Tag ${tagId}`;
          processedCount++;
        }
        // Priority 3: Check direct tag on fatwa
        else if (fatwa?.tag) {
          tagId = fatwa.tag.id;
          tagName = fatwa.tag.name;
          processedCount++;
        }
        // Priority 4: Check direct tag_id
        else if (fatwa?.tag_id) {
          tagId = fatwa.tag_id;
          tagName = `Tag ${tagId}`;
          processedCount++;
        } else {
          skippedCount++;
          return; // Skip items without any category information
        }

        if (tagId && tagName && !categoryMap.has(tagId)) {
          categoryMap.set(Number(tagId), {
            id: Number(tagId),
            name: String(tagName),
          });
        }
      } catch (error) {
        logger.warn(
          `extractCategories: Error processing fatwa at index ${index}`,
          { error, fatwa }
        );
        console.error(
          `❌ extractCategories: Error at index ${index}:`,
          error,
          fatwa
        );
        skippedCount++;
      }
    });

    const categories = Array.from(categoryMap.values());
    logger.info(
      `extractCategories: Extracted ${categories.length} categories from ${fatwas.length} fatwas (processed: ${processedCount}, skipped: ${skippedCount})`
    );
    console.log(
      `📊 extractCategories: Extracted ${categories.length} categories from ${fatwas.length} fatwas`,
      {
        categories,
        processedCount,
        skippedCount,
      }
    );

    return categories;
  }

  static extractSubCategories(
    fatwas: any[],
    categoryId?: number | string | null
  ): Array<{ id: number; name: string; tag_id: number }> {
    if (!Array.isArray(fatwas) || fatwas.length === 0) {
      logger.info("extractSubCategories: No fatwas provided or empty array");
      console.log("📊 extractSubCategories: No fatwas provided or empty array");
      return [];
    }

    console.log(
      `🔍 extractSubCategories START: Processing ${
        fatwas.length
      } fatwas with categoryId: ${categoryId} (type: ${typeof categoryId})`
    );

    const subCategoryMap = new Map<
      number,
      { id: number; name: string; tag_id: number }
    >();
    let processedCount = 0;
    let skippedCount = 0;
    let noSubCategoryCount = 0;
    let categoryMismatchCount = 0;

    // Normalize categoryId to number for comparison
    const categoryIdNum =
      categoryId !== null && categoryId !== undefined
        ? Number(categoryId)
        : null;

    fatwas.forEach((fatwa, index) => {
      try {
        // Handle null iftah_sub_category - only process items that have it
        const subCategory = fatwa?.iftah_sub_category;

        if (!subCategory || !subCategory.id) {
          noSubCategoryCount++;
          skippedCount++;
          return; // Skip items without subcategory
        }

        // Get tag_id from nested tag structure or direct tag_id
        // Priority: subCategory.tag.id > subCategory.tag_id
        const subCategoryTagId =
          subCategory.tag?.id ?? subCategory.tag_id ?? null;

        // Convert to number for comparison
        const subCategoryTagIdNum =
          subCategoryTagId !== null ? Number(subCategoryTagId) : null;

        // If categoryId is specified, only include subcategories for that category
        if (categoryIdNum !== null) {
          // Match if tag.id OR tag_id matches the category
          const matchesCategory = subCategoryTagIdNum === categoryIdNum;

          if (!matchesCategory) {
            categoryMismatchCount++;
            // Log first few non-matching items for debugging
            if (categoryMismatchCount <= 3) {
              console.log(
                `❌ Subcategory "${subCategory.name}" (ID: ${subCategory.id}) doesn't match category ${categoryIdNum}:`,
                {
                  subCategoryTagId: subCategoryTagId,
                  subCategoryTagIdNum: subCategoryTagIdNum,
                  categoryIdNum: categoryIdNum,
                  tagObject: subCategory.tag,
                  directTagId: subCategory.tag_id,
                  fullSubCategory: subCategory,
                }
              );
            }
            return; // Skip if doesn't match category
          }

          // Log ALL matching items for debugging
          console.log(
            `✅ MATCH: Subcategory "${subCategory.name}" (ID: ${subCategory.id}) matches category ${categoryIdNum}`,
            {
              subCategoryTagId: subCategoryTagId,
              subCategoryTagIdNum: subCategoryTagIdNum,
              categoryIdNum: categoryIdNum,
              tagObject: subCategory.tag,
            }
          );
        } else {
          // No category filter - log first few items
          if (index < 3) {
            console.log(
              `📋 No category filter: Processing subcategory "${subCategory.name}" (ID: ${subCategory.id}, tag_id: ${subCategoryTagId})`
            );
          }
        }

        // Add to map if not already present
        if (!subCategoryMap.has(subCategory.id)) {
          processedCount++;
          subCategoryMap.set(subCategory.id, {
            id: Number(subCategory.id),
            name: String(subCategory.name || "Unnamed"),
            tag_id: Number(subCategoryTagId || 0),
          });
          console.log(
            `➕ Added subcategory "${subCategory.name}" (ID: ${subCategory.id}, tag_id: ${subCategoryTagId}) to map`
          );
        } else {
          console.log(
            `⏭️ Subcategory "${subCategory.name}" (ID: ${subCategory.id}) already in map, skipping duplicate`
          );
        }
      } catch (error) {
        logger.warn(
          `extractSubCategories: Error processing fatwa at index ${index}`,
          { error, fatwa }
        );
        console.error(
          `❌ extractSubCategories: Error at index ${index}:`,
          error,
          fatwa
        );
        skippedCount++;
      }
    });

    const subCategories = Array.from(subCategoryMap.values());

    // Comprehensive final summary
    console.log(`📊 extractSubCategories FINAL SUMMARY:`, {
      totalFatwas: fatwas.length,
      extractedSubCategories: subCategories.length,
      categoryId: categoryIdNum,
      processedCount,
      skippedCount,
      noSubCategoryCount,
      categoryMismatchCount:
        categoryIdNum !== null ? categoryMismatchCount : "N/A (no filter)",
      extractedSubCategoriesList: subCategories.map((s) => ({
        id: s.id,
        name: s.name,
        tag_id: s.tag_id,
      })),
    });

    logger.info(
      `extractSubCategories: Extracted ${
        subCategories.length
      } subcategories from ${fatwas.length} fatwas${
        categoryIdNum ? ` for category ${categoryIdNum}` : ""
      } (processed: ${processedCount}, skipped: ${skippedCount}, no subcategory: ${noSubCategoryCount}, mismatch: ${categoryMismatchCount})`
    );

    return subCategories;
  }

  static async getSubCategories(
    params: ListParams = {}
  ): Promise<ApiResponse<any[]>> {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? DEFAULT_PAGE_SIZE;

    try {
      logger.info("Fetching iftah subcategories from API", {
        page,
        limit,
        ...rest,
      });
      // Use local API route proxy which forwards to external API
      const result = await apiClient.get("/api/iftah/sub-categories", {
        params: { page, limit, ...rest },
      });

      if (!result.success) {
        // API endpoint might not exist, return empty array gracefully
        logger.info(
          "Iftah subcategories API not available, returning empty array"
        );
        return {
          data: [],
          success: true, // Return success: true so calling code doesn't treat it as an error
          error: undefined,
          pagination: createPaginationMeta({ page, limit, total: 0 }),
        };
      }

      const subCategoriesData = Array.isArray(result.data) ? result.data : [];
      logger.info("Successfully fetched iftah subcategories", {
        count: subCategoriesData.length,
      });

      if (result.pagination) {
        return {
          ...result,
          data: subCategoriesData,
        } as ApiResponse<any[]>;
      }

      const total = subCategoriesData.length || limit;

      return {
        ...result,
        data: subCategoriesData,
        pagination: createPaginationMeta({ page, limit, total }),
      } as ApiResponse<any[]>;
    } catch (error) {
      // API endpoint doesn't exist or failed, return empty array gracefully
      logger.info(
        "Iftah getSubCategories API not available, returning empty array"
      );
      return {
        data: [],
        success: true, // Return success: true so calling code doesn't treat it as an error
        error: undefined,
        pagination: createPaginationMeta({ page, limit, total: 0 }),
      };
    }
  }

  // Get subcategory by ID (includes all iftah items for that subcategory)
  static async getSubCategoryById(subCategoryId: number | string): Promise<
    ApiResponse<{
      sub_category_id: string | number;
      total: number;
      data: any[];
    }>
  > {
    try {
      logger.info("Fetching subcategory by ID from API", { subCategoryId });
      // Use local API route proxy which forwards to external API
      const result = await apiClient.get(
        `/api/iftah/sub-category/${subCategoryId}`
      );

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      // The API route returns: { data: { sub_category_id: "1", total: 2, data: [...] }, success: true }
      // But apiClient might unwrap it. Check both structures
      let responseData = result.data as any;

      // If the apiClient unwrapped the response, the structure might be different
      // Check if we have the nested structure: { data: { sub_category_id, total, data: [...] } }
      if (responseData && typeof responseData === "object") {
        // If responseData has a data property with sub_category_id, that's our structure
        if (
          responseData.sub_category_id !== undefined ||
          responseData.data !== undefined
        ) {
          // This is the correct structure: { sub_category_id: "1", total: 2, data: [...] }
          logger.info("Successfully fetched subcategory by ID", {
            subCategoryId,
            hasSubCategoryId: !!responseData?.sub_category_id,
            hasData: !!responseData?.data,
            dataCount: Array.isArray(responseData?.data)
              ? responseData.data.length
              : 0,
            total: responseData?.total,
            keys: Object.keys(responseData),
          });

          return {
            ...result,
            data: responseData,
            success: true,
          };
        }
      }

      // Fallback: try to use result.data as is
      logger.info("Using fallback response structure", {
        subCategoryId,
        dataType: typeof result.data,
        keys: result.data ? Object.keys(result.data as any) : [],
      });

      return {
        ...result,
        data: responseData || {
          sub_category_id: subCategoryId,
          total: 0,
          data: [],
        },
        success: true,
      };
    } catch (error) {
      logger.warn("Iftah getSubCategoryById failed", { subCategoryId, error });
      return {
        data: { sub_category_id: subCategoryId, total: 0, data: [] },
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        pagination: null,
      };
    }
  }

  // Get all tags
  static async getTags(params: ListParams = {}): Promise<ApiResponse<any[]>> {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? 100; // Default to 100 for tags

    try {
      logger.info("Fetching iftah tags from API", { page, limit, ...rest });
      // Use local API route proxy which forwards to external API
      const result = await apiClient.get("/api/iftah/tags", {
        params: { page, limit, ...rest },
      });

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      const tagsData = Array.isArray(result.data) ? result.data : [];
      logger.info("Successfully fetched iftah tags", {
        count: tagsData.length,
      });

      if (result.pagination) {
        return {
          ...result,
          data: tagsData,
        } as ApiResponse<any[]>;
      }

      const total = tagsData.length || limit;

      return {
        ...result,
        data: tagsData,
        pagination: createPaginationMeta({ page, limit, total }),
      } as ApiResponse<any[]>;
    } catch (error) {
      logger.warn("Iftah getTags failed", { error });
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        pagination: createPaginationMeta({ page, limit, total: 0 }),
      };
    }
  }

  // Get iftah items by tag ID (fetches all iftah with this tag)
  static async getByTag(
    tagId: number | string,
    params: ListParams = {}
  ): Promise<ApiResponse<any[]>> {
    const { limit: rawLimit, ...rest } = params;
    const limit = rawLimit ?? 100;

    try {
      logger.info("Fetching iftah by tag from API", { tagId, limit });
      const result = await apiClient.get(endpoints.iftah, {
        params: {
          tag_id: tagId,
          limit,
          ...rest,
        },
      });

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      const iftahData = Array.isArray(result.data) ? result.data : [];
      logger.info("Successfully fetched iftah by tag", {
        tagId,
        count: iftahData.length,
      });

      if (result.pagination) {
        return {
          ...result,
          data: iftahData,
        } as ApiResponse<any[]>;
      }

      const total = iftahData.length || limit;

      return {
        ...result,
        data: iftahData,
        success: true,
        pagination: createPaginationMeta({ page: 1, limit, total }),
      };
    } catch (error) {
      logger.warn("Iftah getByTag failed", { tagId, error });
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        pagination: createPaginationMeta({ page: 1, limit, total: 0 }),
      };
    }
  }

  // Get tag information by tag ID (includes tag info and all iftah items for that tag)
  static async getTagById(
    tagId: number | string
  ): Promise<
    ApiResponse<{ tag_id: string | number; data: any[]; pagination?: any }>
  > {
    try {
      logger.info("Fetching tag by ID from API", { tagId });
      // Use local API route proxy which forwards to external API
      const result = await apiClient.get(`/api/iftah/tag/${tagId}`);

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      // The API returns: { tag_id: "1", data: [...], pagination: {...} }
      const responseData = result.data as any;
      logger.info("Successfully fetched tag by ID", {
        tagId,
        hasData: !!responseData?.data,
        dataCount: Array.isArray(responseData?.data)
          ? responseData.data.length
          : 0,
      });

      return {
        ...result,
        data: responseData || { tag_id: tagId, data: [], pagination: null },
        success: true,
        pagination: responseData?.pagination || result.pagination || null,
      };
    } catch (error) {
      logger.warn("Iftah getTagById failed", { tagId, error });
      return {
        data: { tag_id: tagId, data: [], pagination: null },
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        pagination: null,
      };
    }
  }
}

// Iftah Question Form API
export class IftahQuestionApi {
  static async getCsrfToken(): Promise<string | null> {
    try {
      // Try to get CSRF token from meta tag first
      const metaToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");
      if (metaToken) {
        console.log("🔑 CSRF token found in meta tag:", metaToken);
        return metaToken;
      }

      // If not in meta tag, try to get from cookies
      const cookies = document.cookie.split(";");
      const csrfCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("XSRF-TOKEN=")
      );
      if (csrfCookie) {
        const token = decodeURIComponent(csrfCookie.split("=")[1]);
        console.log("🔑 CSRF token found in cookies:", token);
        return token;
      }

      // Try to fetch CSRF token from Laravel Sanctum endpoint
      console.log("🔑 Fetching CSRF token from server...");
      const response = await fetch(endpoints.csrfCookie, {
        method: "GET",
        // Remove credentials to avoid CORS wildcard issue
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (response.ok) {
        // Extract CSRF token from cookies after the request
        const updatedCookies = document.cookie.split(";");
        const updatedCsrfCookie = updatedCookies.find((cookie) =>
          cookie.trim().startsWith("XSRF-TOKEN=")
        );
        if (updatedCsrfCookie) {
          const token = decodeURIComponent(updatedCsrfCookie.split("=")[1]);
          console.log("🔑 CSRF token obtained from server:", token);
          return token;
        }
      }

      console.log("❌ No CSRF token found");
      return null;
    } catch (error) {
      console.error("❌ Error fetching CSRF token:", error);
      return null;
    }
  }

  static async submit(payload: {
    name: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    question: string;
    tagId?: number; // Changed from tag_id to tagId
    iftah_sub_category_id?: number;
  }) {
    logger.info("Submitting Iftah question", { payload });

    try {
      const apiUrl = endpoints.IftahQuestionForm;
      console.log("🚀 [IFTAH QUESTION API] Starting request to:", apiUrl);

      // ✅ STEP 1: Get CSRF cookie FIRST (CRITICAL!)
      console.log("🔑 [IFTAH QUESTION API] Step 1: Fetching CSRF cookie...");
      try {
        const csrfResponse = await fetch(endpoints.csrfCookie, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        console.log("📥 [IFTAH QUESTION API] CSRF cookie response:", {
          status: csrfResponse.status,
          statusText: csrfResponse.statusText,
          ok: csrfResponse.ok,
        });

        if (!csrfResponse.ok) {
          console.warn(
            "⚠️ [IFTAH QUESTION API] CSRF cookie fetch failed, continuing anyway..."
          );
        } else {
          // Wait for cookie to be set
          await new Promise((resolve) => setTimeout(resolve, 150));
        }
      } catch (csrfError: any) {
        console.warn(
          "⚠️ [IFTAH QUESTION API] CSRF cookie fetch error:",
          csrfError
        );
        console.warn(
          "⚠️ [IFTAH QUESTION API] Continuing without CSRF cookie - API may still work"
        );
      }

      // ✅ STEP 2: Get the CSRF token from cookies
      console.log(
        "🔑 [IFTAH QUESTION API] Step 2: Extracting CSRF token from cookies..."
      );
      const csrfToken = await this.getCsrfToken();

      // ✅ STEP 3: Prepare headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      };

      // Add CSRF token if available
      if (csrfToken) {
        console.log(
          "✅ [IFTAH QUESTION API] CSRF token obtained:",
          csrfToken.substring(0, 30) + "..."
        );
        headers["X-XSRF-TOKEN"] = csrfToken; // Laravel Sanctum expects this header name
      } else {
        console.warn(
          "⚠️ [IFTAH QUESTION API] No CSRF token available (may be due to CORS restrictions)"
        );
        console.warn(
          "⚠️ [IFTAH QUESTION API] Proceeding without CSRF token - API route may not require it"
        );
      }

      // Prepare request body for iftah_questions table
      // Database columns: name, email, phone, whatsapp, question, tag_id, iftah_sub_category_id, created_at, updated_at

      const requestBody: Record<string, string | number> = {
        name: payload.name.trim(),
        email: payload.email.trim(),
        question: payload.question.trim(),
      };

      // Only include phone if it's provided and not empty
      if (payload.phone && payload.phone.trim()) {
        requestBody.phone = payload.phone.trim();
      }

      // Only include whatsapp if it's provided and not empty
      if (payload.whatsapp && payload.whatsapp.trim()) {
        requestBody.whatsapp = payload.whatsapp.trim();
      }

      // Include tagId if provided (send as "tagId" to backend)
      if (payload.tagId && payload.tagId > 0) {
        requestBody.tagId = payload.tagId;
        console.log("🏷️ [IFTAH QUESTION API] Including tagId:", payload.tagId);
      }

      // Include iftah_sub_category_id if provided
      if (payload.iftah_sub_category_id && payload.iftah_sub_category_id > 0) {
        requestBody.iftah_sub_category_id = payload.iftah_sub_category_id;
        console.log(
          "📁 [IFTAH QUESTION API] Including iftah_sub_category_id:",
          payload.iftah_sub_category_id
        );
      }

      const safeRequestBody = requestBody;

      console.log("📤 [IFTAH QUESTION API] Request URL:", apiUrl);
      console.log("📤 [IFTAH QUESTION API] Request headers:", headers);
      console.log(
        "📤 [IFTAH QUESTION API] Request body (final):",
        JSON.stringify(safeRequestBody, null, 2)
      );
      console.log(
        "📤 [IFTAH QUESTION API] Request body keys:",
        Object.keys(safeRequestBody)
      );
      console.log("📤 [IFTAH QUESTION API] Fields included:", {
        hasTagId: "tagId" in safeRequestBody,
        hasSubCategoryId: "iftah_sub_category_id" in safeRequestBody,
        tagIdValue: safeRequestBody.tagId || "not included",
        subCategoryIdValue:
          safeRequestBody.iftah_sub_category_id || "not included",
        bodyKeys: Object.keys(safeRequestBody),
      });

      // ✅ STEP 4: Send POST request with credentials
      // Sending all fields including tag_id and iftah_sub_category_id if provided
      const response = await fetch(apiUrl, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include", // Must include credentials to send cookies
        headers,
        body: JSON.stringify(safeRequestBody), // Includes tag_id and iftah_sub_category_id if provided
      });

      console.log("📥 [IFTAH QUESTION API] Response received!");
      console.log("📥 [IFTAH QUESTION API] Response status:", response.status);
      console.log(
        "📥 [IFTAH QUESTION API] Response status text:",
        response.statusText
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [IFTAH QUESTION API] Request failed!");
        console.error("❌ [IFTAH QUESTION API] Status:", response.status);
        console.error(
          "❌ [IFTAH QUESTION API] Status Text:",
          response.statusText
        );
        console.error(
          "❌ [IFTAH QUESTION API] Error response (raw):",
          errorText
        );
        console.error(
          "❌ [IFTAH QUESTION API] Request body that was sent:",
          JSON.stringify(requestBody, null, 2)
        );

        let errorMessage = `API request failed with status ${response.status}`;
        let errorDetails: any = null;

        try {
          const errorJson = JSON.parse(errorText);
          console.error(
            "❌ [IFTAH QUESTION API] Error JSON:",
            JSON.stringify(errorJson, null, 2)
          );
          errorMessage = errorJson.message || errorJson.error || errorMessage;
          errorDetails = errorJson;

          // Show more details for 500 errors
          if (response.status === 500) {
            console.error(
              "❌ [IFTAH QUESTION API] 500 Internal Server Error Details:"
            );
            console.error("   - Message:", errorJson.message);
            console.error("   - Error:", errorJson.error);
            console.error("   - File:", errorJson.file);
            console.error("   - Line:", errorJson.line);
            console.error("   - Trace:", errorJson.trace);

            // Get tag/subcategory names from payload for better error messages
            const tagName = payload.tagId
              ? `Tag ID: ${payload.tagId}`
              : "No tag";
            const subCategoryName = payload.iftah_sub_category_id
              ? `Subcategory ID: ${payload.iftah_sub_category_id}`
              : "No subcategory";

            if (
              errorJson.message?.includes("Column not found") ||
              errorJson.message?.includes("tagId") ||
              errorJson.message?.includes("tag_id")
            ) {
              errorMessage = `خطای پایگاه داده: ستون tagId در جدول iftah_questions وجود ندارد. ${
                tagName !== "No tag" ? `(${tagName})` : ""
              } لطفاً به مدیر سیستم اطلاع دهید.`;
            } else if (errorJson.message?.includes("iftah_sub_category_id")) {
              errorMessage = `خطای پایگاه داده: ستون iftah_sub_category_id در جدول iftah_questions وجود ندارد. ${
                subCategoryName !== "No subcategory"
                  ? `(${subCategoryName})`
                  : ""
              } لطفاً به مدیر سیستم اطلاع دهید.`;
            } else {
              // Generic 500 error with context
              errorMessage = `خطای سرور (500). ${
                tagName !== "No tag" || subCategoryName !== "No subcategory"
                  ? `${tagName}, ${subCategoryName}. `
                  : ""
              }لطفاً بعداً تلاش کنید یا با مدیر سیستم تماس بگیرید.`;
            }
          }

          if (errorMessage.includes("CSRF")) {
            throw new Error(
              `CSRF token mismatch (${response.status}). The CSRF token may not have been set correctly. Check browser console for cookie information.`
            );
          }
        } catch (e) {
          // Not JSON, use the text as is
          const tagName = payload.tagId ? `Tag ID: ${payload.tagId}` : "";
          if (
            errorText.includes("Column not found") ||
            errorText.includes("tagId") ||
            errorText.includes("tag_id")
          ) {
            errorMessage = `خطای پایگاه داده: ستون tagId در جدول iftah_questions وجود ندارد. ${
              tagName ? `(${tagName})` : ""
            } لطفاً به مدیر سیستم اطلاع دهید.`;
          } else if (errorText.includes("iftah_sub_category_id")) {
            const subCategoryName = payload.iftah_sub_category_id
              ? `Subcategory ID: ${payload.iftah_sub_category_id}`
              : "";
            errorMessage = `خطای پایگاه داده: ستون iftah_sub_category_id در جدول iftah_questions وجود ندارد. ${
              subCategoryName ? `(${subCategoryName})` : ""
            } لطفاً به مدیر سیستم اطلاع دهید.`;
          }
        }

        const fullError = new Error(errorMessage);
        (fullError as any).details = errorDetails;
        (fullError as any).status = response.status;
        throw fullError;
      }

      const result = await response.json();
      console.log(
        "✅ [IFTAH QUESTION API] SUCCESS: Data sent to Laravel dashboard!"
      );
      console.log(
        "✅ [IFTAH QUESTION API] Response data:",
        JSON.stringify(result, null, 2)
      );

      return {
        success: true,
        data: result.data || result,
        message: result.message || "Question submitted successfully",
      };
    } catch (error: any) {
      console.error("❌ [IFTAH QUESTION API] Exception occurred:", error);
      console.error("❌ [IFTAH QUESTION API] Error message:", error.message);
      logger.error("Iftah question submission failed", { error, payload });

      // Try to store in localStorage as fallback (for manual processing)
      if (typeof window !== "undefined") {
        try {
          const questionData = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...payload,
            status: "pending",
            source: "iftah-form",
            error: error?.message || "API submission failed",
          };

          const existingQuestions = JSON.parse(
            localStorage.getItem("iftah-questions") || "[]"
          );
          existingQuestions.unshift(questionData);
          localStorage.setItem(
            "iftah-questions",
            JSON.stringify(existingQuestions)
          );

          console.log(
            "📝 [IFTAH QUESTION] Data stored in localStorage as fallback"
          );
        } catch (storageError) {
          console.error("Failed to store in localStorage:", storageError);
        }
      }

      // Re-throw the error so the UI can handle it
      throw error;
    }
  }

  // Note: Dashboard methods removed since you already have a dashboard
  // The data will be sent to your existing IftahQuestionForm endpoint

  static async getCategories(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch("/api/iftah/category", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error(`❌ HTTP error! status: ${response.status}`);
        return { data: [], success: true };
      }

      const data = await response.json();
      console.log("✅ Iftah categories received:", data);

      // Handle different response formats
      if (Array.isArray(data)) {
        return { data, success: true };
      } else if (data && Array.isArray(data.data)) {
        return { data: data.data, success: true };
      } else {
        console.warn("⚠️ Unexpected Iftah categories data format:", data);
        return { data: [], success: true };
      }
    } catch (error) {
      console.error("❌ Failed to fetch Iftah categories:", error);
      return { data: [], success: true };
    }
  }
}

export class ArticlesApi {
  static async getAll(params: ListParams = {}) {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? DEFAULT_PAGE_SIZE;

    try {
      logger.info("Fetching articles from API", { page, limit });
      const result = await apiClient.get(endpoints.articles, {
        params: { page, limit, ...rest },
      });

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      logger.info("Successfully fetched articles", {
        count: Array.isArray(result.data) ? result.data.length : 0,
      });
      return result;
    } catch (error) {
      logger.error("Articles API failed", { error });
      throw error;
    }
  }

  static async getById(id: string) {
    try {
      const result = await apiClient.get(`${endpoints.articles}/${id}`);
      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }
      return result;
    } catch (error) {
      logger.warn("Article getById failed", { id, error });
      if (!apiConfig.fallback.useForDetailEndpoints) {
        throw error;
      }
      return { data: null, success: true, pagination: null };
    }
  }

  static async getBySlug(slug: string) {
    try {
      const result = await apiClient.get(`${endpoints.articles}/${slug}`);
      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }
      return result;
    } catch (error) {
      logger.warn("Article getBySlug failed", { slug, error });
      if (!apiConfig.fallback.useForDetailEndpoints) {
        throw error;
      }
      return { data: null, success: true, pagination: null };
    }
  }

  static async getCategories(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch("/api/articles/category", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        logger.warn("Articles categories API failed", {
          status: response.status,
        });
        const fallbackCategories = [
          { id: 1, name: "General" },
          { id: 2, name: "Islamic Studies" },
          { id: 3, name: "Quran" },
          { id: 4, name: "Hadith" },
          { id: 5, name: "Fiqh" },
        ];
        return { data: fallbackCategories, success: true };
      }

      const data = await response.json();
      logger.info("Categories received", {
        count: Array.isArray(data) ? data.length : "unknown",
      });

      // Handle different response formats
      if (Array.isArray(data)) {
        return { data, success: true };
      } else if (data && Array.isArray(data.data)) {
        return { data: data.data, success: true };
      } else {
        logger.warn("Unexpected categories data format");
        const fallbackCategories = [
          { id: 1, name: "General" },
          { id: 2, name: "Islamic Studies" },
          { id: 3, name: "Quran" },
        ];
        return { data: fallbackCategories, success: true };
      }
    } catch (error) {
      logger.error("Failed to fetch categories", error);
      const fallbackCategories = [
        { id: 1, name: "General" },
        { id: 2, name: "Islamic Studies" },
        { id: 3, name: "Quran" },
        { id: 4, name: "Hadith" },
        { id: 5, name: "Fiqh" },
      ];
      return { data: fallbackCategories, success: true };
    }
  }
}

export class GraduationsApi {
  static async getAll(params: ListParams = {}) {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? DEFAULT_PAGE_SIZE;

    try {
      logger.info("Fetching graduations from API", { page, limit });
      const result = await apiClient.get(endpoints.graduated, {
        params: { page, limit, ...rest },
      });

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      logger.info("Successfully fetched graduations", {
        count: Array.isArray(result.data) ? result.data.length : 0,
      });

      if (result.pagination) {
        return result;
      }

      const total = Array.isArray(result.data) ? result.data.length : limit;

      return {
        ...result,
        pagination: createPaginationMeta({ page, limit, total }),
      };
    } catch (error) {
      logger.error("Graduations API failed", { error });
      throw error;
    }
  }

  static async getById(id: string) {
    try {
      const result = await apiClient.get(`${endpoints.graduated}/${id}`);
      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }
      return result;
    } catch (error) {
      logger.error("Graduation getById failed", { id, error });
      throw error;
    }
  }

  static async getBySlug(slug: string) {
    try {
      const result = await apiClient.get(`${endpoints.graduated}/${slug}`);
      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }
      return result;
    } catch (error) {
      logger.error("Graduation getBySlug failed", { slug, error });
      throw error;
    }
  }
}

export class TasawwufApi {
  static async getAll(params: ListParams = {}) {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? DEFAULT_PAGE_SIZE;

    try {
      logger.info("Fetching tasawwuf from API", { page, limit });
      const result = await apiClient.get(endpoints.tasawwuf, {
        params: { page, limit, ...rest },
        cache: "no-store",
      });

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      logger.info("Successfully fetched tasawwuf", {
        count: Array.isArray(result.data) ? result.data.length : 0,
      });

      const payload = extractArray<unknown>(result.data);
      const data = payload.length ? payload : result.data ? [result.data] : [];

      if (result.pagination) {
        return {
          ...result,
          data,
        };
      }

      const total = Array.isArray(result.data)
        ? result.data.length
        : data.length;

      return {
        ...result,
        data,
        pagination: createPaginationMeta({ page, limit, total }),
      };
    } catch (error) {
      logger.error("Tasawwuf API failed", { error });
      throw error;
    }
  }

  static async getBySlug(slug: string) {
    try {
      // First try direct API call
      const result = await apiClient.get(`${endpoints.tasawwuf}/${slug}`, {
        cache: "no-store",
      });
      if (result.success && result.data) {
        return result;
      }

      // If direct call fails, try to get all and find by slug
      const allPosts = await this.getAll({ limit: 1000 });
      if (allPosts.success && Array.isArray(allPosts.data)) {
        const post = allPosts.data.find((p: any) => p.slug === slug);
        if (post) {
          return {
            data: post,
            success: true,
            message: "Tasawwuf post found by slug",
          };
        }
      }

      // If still not found, return error
      return {
        data: null,
        success: false,
        error: "Tasawwuf post not found",
      };
    } catch (error) {
      logger.error("Tasawwuf getBySlug failed", { slug, error });
      // Try fallback: get all and find by slug
      try {
        const allPosts = await this.getAll({ limit: 1000 });
        if (allPosts.success && Array.isArray(allPosts.data)) {
          const post = allPosts.data.find((p: any) => p.slug === slug);
          if (post) {
            return {
              data: post,
              success: true,
              message: "Tasawwuf post found by slug (fallback)",
            };
          }
        }
      } catch (fallbackError) {
        logger.error("Tasawwuf getBySlug fallback failed", {
          slug,
          error: fallbackError,
        });
      }

      return {
        data: null,
        success: false,
        error:
          error instanceof Error ? error.message : "Tasawwuf post not found",
      };
    }
  }
}

// Comment About Sheik API
export class CommentAboutSheikApi {
  static async getCategories(): Promise<ApiResponse<any[]>> {
    try {
      logger.info("Fetching comment about sheik categories from API");
      const result = await apiClient.get(endpoints.commentAboutSheikCategories);

      if (!result.success) {
        logger.warn("CommentAboutSheik getCategories API failed", {
          error: result.error,
        });
        return {
          data: [],
          success: false,
          error: result.error || "API request failed",
        };
      }

      // Handle different response formats
      let categoriesData: any[] = [];
      if (Array.isArray(result.data)) {
        categoriesData = result.data;
      } else if (
        result.data &&
        typeof result.data === "object" &&
        "data" in result.data &&
        Array.isArray((result.data as { data: any[] }).data)
      ) {
        categoriesData = (result.data as { data: any[] }).data;
      }

      logger.info("Successfully fetched comment about sheik categories", {
        count: categoriesData.length,
        rawData: result.data,
      });

      return {
        ...result,
        data: categoriesData,
        success: true,
      };
    } catch (error) {
      logger.warn("CommentAboutSheik getCategories failed", { error });
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async getCategoryBySlug(slug: string): Promise<ApiResponse<any>> {
    try {
      logger.info("Fetching comment about sheik category by slug from API", {
        slug,
      });
      const result = await apiClient.get(
        endpoints.commentAboutSheikCategory(slug)
      );

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      logger.info("Successfully fetched comment about sheik category by slug", {
        slug,
      });

      return {
        ...result,
        success: true,
      };
    } catch (error) {
      logger.warn("CommentAboutSheik getCategoryBySlug failed", {
        slug,
        error,
      });
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async getCommentBySlug(slug: string): Promise<ApiResponse<any>> {
    try {
      logger.info("Fetching comment about sheik comment by slug from API", {
        slug,
      });
      const result = await apiClient.get(
        endpoints.commentAboutSheikComment(slug)
      );

      if (!result.success) {
        logger.warn("CommentAboutSheik getCommentBySlug API failed", {
          slug,
          error: result.error,
        });
        return {
          data: null,
          success: false,
          error: result.error || "API request failed",
        };
      }

      logger.info("Successfully fetched comment about sheik comment by slug", {
        slug,
      });

      return {
        ...result,
        success: true,
      };
    } catch (error) {
      logger.warn("CommentAboutSheik getCommentBySlug failed", {
        slug,
        error,
      });
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export class GalleryApi {
  static async getAll(params: ListParams = {}) {
    const page = params.page ?? 1;
    const limit = params.limit ?? DEFAULT_PAGE_SIZE;
    const { page: _page, limit: _limit, ...rest } = params;

    try {
      logger.info("Fetching gallery from API", { page, limit });
      const result = await apiClient.get(endpoints.gallery, {
        cache: "no-store",
        params: { page, limit, ...rest },
      });

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      logger.info("Successfully fetched gallery", {
        count: Array.isArray(result.data) ? result.data.length : 0,
      });

      const data = extractArray<unknown>(result.data);

      if (result.pagination) {
        return {
          ...result,
          data,
        };
      }

      const total = Array.isArray(result.data)
        ? result.data.length
        : data.length;

      return {
        ...result,
        data,
        pagination: createPaginationMeta({ page, limit, total }),
      };
    } catch (error) {
      logger.error("Gallery API failed", { error });
      throw error;
    }
  }
}

export class DegreesApi {
  static async getAll(params: ListParams = {}) {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? 100; // Default to 100 for degrees

    try {
      logger.info("Fetching degrees from API", { page, limit });
      const result = await apiClient.get(endpoints.degrees, {
        params: { page, limit, ...rest },
      });

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      logger.info("Successfully fetched degrees", {
        count: Array.isArray(result.data) ? result.data.length : 0,
      });

      // Extract array from response
      const degreesData = extractArray<any>(result.data);

      if (result.pagination) {
        return {
          ...result,
          data: degreesData,
        } as ApiResponse<any[]>;
      }

      const total = degreesData.length || limit;

      return {
        ...result,
        data: degreesData,
        pagination: createPaginationMeta({ page, limit, total }),
      } as ApiResponse<any[]>;
    } catch (error) {
      logger.warn("Degrees API failed, using fallback data", { error });

      // Fallback degrees data
      const fallbackDegrees = [
        { id: 1, name: "درجه اول" },
        { id: 2, name: "درجه دوم" },
        { id: 3, name: "درجه سوم" },
        { id: 4, name: "درجه چهارم" },
        { id: 5, name: "درجه پنجم" },
      ];

      return {
        data: fallbackDegrees,
        success: true,
        message: apiConfig.fallback.showFallbackMessage
          ? "Using cached data due to API unavailability"
          : undefined,
        pagination: createPaginationMeta({
          page,
          limit,
          total: fallbackDegrees.length,
        }),
      };
    }
  }

  static async getById(id: string | number) {
    try {
      const result = await apiClient.get(`${endpoints.degrees}/${id}`);
      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }
      return result;
    } catch (error) {
      logger.warn("Degree getById failed", { id, error });
      if (!apiConfig.fallback.useForDetailEndpoints) {
        throw error;
      }
      return {
        data: { id: 1, name: "درجه اول" },
        success: true,
        message: "Using cached data due to API unavailability",
      };
    }
  }
}

export class ContactApi {
  // Helper: Extract CSRF token from cookies
  private static extractCsrfTokenFromCookies(): string | null {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split(";");
    console.log("🍪 [CONTACT] All cookies:", document.cookie);

    // Try XSRF-TOKEN first (Laravel Sanctum standard)
    const xsrfCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("XSRF-TOKEN=")
    );
    if (xsrfCookie) {
      const token = decodeURIComponent(xsrfCookie.split("=")[1].trim());
      console.log(
        "✅ [CONTACT] Found XSRF-TOKEN:",
        token.substring(0, 20) + "..."
      );
      return token;
    }

    // Try lowercase version
    const xsrfCookieLower = cookies.find((cookie) =>
      cookie.trim().toLowerCase().startsWith("xsrf-token=")
    );
    if (xsrfCookieLower) {
      const token = decodeURIComponent(xsrfCookieLower.split("=")[1].trim());
      console.log(
        "✅ [CONTACT] Found xsrf-token (lowercase):",
        token.substring(0, 20) + "..."
      );
      return token;
    }

    console.log("❌ [CONTACT] No XSRF-TOKEN found in cookies");
    return null;
  }

  // Get CSRF token (similar to AdmissionsApi)
  private static async getCsrfToken(): Promise<string | null> {
    try {
      // Step 1: Check if token already exists in cookies
      let token = this.extractCsrfTokenFromCookies();
      if (token) {
        console.log("✅ [CONTACT] CSRF token already in cookies");
        return token;
      }

      try {
        const response = await fetch(endpoints.csrfCookie, {
          method: "GET",
          credentials: "include", // Must include credentials
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        if (response.ok) {
          // Check cookies immediately (browser sets cookies synchronously)
          token = this.extractCsrfTokenFromCookies();

          if (token) {
            console.log("✅ [CONTACT] CSRF token obtained from server");
            return token;
          } else {
            console.warn(
              "⚠ [CONTACT] CSRF endpoint responded OK but no cookie found"
            );
          }
        } else {
          console.error(
            "❌ [CONTACT] CSRF endpoint failed:",
            response.status,
            response.statusText
          );
        }
      } catch (csrfError) {
        console.error("❌ [CONTACT] Error fetching CSRF token:", csrfError);
      }

      console.log("❌ [CONTACT] No CSRF token found");
      return null;
    } catch (error) {
      console.error("❌ [CONTACT] Error in getCsrfToken:", error);
      return null;
    }
  }

  static async submit(payload: Record<string, unknown>) {
    logger.info("Submitting contact form", { payload });

    try {
      // Validate the payload
      if (!payload.name || !payload.email || !payload.message) {
        return {
          success: false,
          data: null,
          error: "Please fill in all required fields.",
        };
      }

      const apiUrl = endpoints.contact;
      console.log("🚀 [CONTACT API] Starting request to:", apiUrl);

      // ✅ STEP 1: Get CSRF cookie FIRST (CRITICAL!)
      console.log("🔑 [CONTACT API] Step 1: Fetching CSRF cookie...");
      const csrfResponse = await fetch(endpoints.csrfCookie, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      console.log("📥 [CONTACT API] CSRF cookie response:", {
        status: csrfResponse.status,
        statusText: csrfResponse.statusText,
        ok: csrfResponse.ok,
      });

      if (!csrfResponse.ok) {
        console.warn(
          "⚠️ [CONTACT API] CSRF cookie fetch failed, continuing anyway..."
        );
      }

      // Wait for cookie to be set
      await new Promise((resolve) => setTimeout(resolve, 150));

      // ✅ STEP 2: Get the CSRF token from cookies
      console.log(
        "🔑 [CONTACT API] Step 2: Extracting CSRF token from cookies..."
      );
      const csrfToken = await this.getCsrfToken();

      // ✅ STEP 3: Prepare headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      };

      // Add CSRF token if available
      if (csrfToken) {
        console.log(
          "✅ [CONTACT API] CSRF token obtained:",
          csrfToken.substring(0, 30) + "..."
        );
        headers["X-XSRF-TOKEN"] = csrfToken; // Laravel Sanctum expects this header name
      } else {
        console.warn(
          "⚠️ [CONTACT API] No CSRF token available (may be due to CORS restrictions)"
        );
        console.warn(
          "⚠️ [CONTACT API] Proceeding without CSRF token - API route may not require it"
        );
      }

      // Prepare request body
      const requestBody = { ...payload };

      console.log("📤 [CONTACT API] Request URL:", apiUrl);
      console.log("📤 [CONTACT API] Request headers:", headers);
      console.log(
        "📤 [CONTACT API] Request body:",
        JSON.stringify(requestBody, null, 2)
      );

      // ✅ STEP 4: Send POST request with credentials
      const response = await fetch(apiUrl, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include", // Must include credentials to send cookies
        headers,
        body: JSON.stringify(requestBody),
      });

      console.log("📥 [CONTACT API] Response status:", response.status);
      console.log(
        "📥 [CONTACT API] Response status text:",
        response.statusText
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [CONTACT API] Request failed!");
        console.error("❌ [CONTACT API] Status:", response.status);
        console.error("❌ [CONTACT API] Error response:", errorText);

        let errorMessage = `API request failed with status ${response.status}`;

        try {
          const errorJson = JSON.parse(errorText);
          console.error("❌ [CONTACT API] Error JSON:", errorJson);
          errorMessage = errorJson.message || errorJson.error || errorMessage;

          if (errorMessage.includes("CSRF")) {
            throw new Error(
              `CSRF token mismatch (${response.status}). The CSRF token may not have been set correctly. Check browser console for cookie information.`
            );
          }
        } catch (e) {
          // Not JSON, use the text as is
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("✅ [CONTACT API] SUCCESS: Data sent to Laravel dashboard!");
      console.log(
        "✅ [CONTACT API] Response data:",
        JSON.stringify(result, null, 2)
      );

      return {
        success: true,
        data: result.data || result,
        message:
          result.message ||
          "Your message has been received! We will get back to you soon.",
      };
    } catch (error: any) {
      console.error("❌ [CONTACT API] Exception occurred:", error);
      console.error("❌ [CONTACT API] Error message:", error.message);
      logger.error("Contact form submission failed", { error, payload });

      // Try to store in localStorage as fallback (for manual processing)
      if (typeof window !== "undefined") {
        try {
          const contactData = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...payload,
            status: "pending",
            source: "website",
            error: error?.message || "API submission failed",
          };

          const existingContacts = JSON.parse(
            localStorage.getItem("contactSubmissions") || "[]"
          );
          existingContacts.push(contactData);
          localStorage.setItem(
            "contactSubmissions",
            JSON.stringify(existingContacts)
          );

          console.log("📝 [CONTACT] Data stored in localStorage as fallback");
        } catch (storageError) {
          console.error("Failed to store in localStorage:", storageError);
        }
      }

      // Re-throw the error so the UI can handle it
      throw error;
    }
  }

  // Helper method to get stored contact submissions (for admin dashboard)
  static getStoredSubmissions() {
    if (typeof window === "undefined") return [];

    try {
      const submissions = JSON.parse(
        localStorage.getItem("contactSubmissions") || "[]"
      );
      return submissions;
    } catch (error) {
      console.error("Error retrieving stored submissions:", error);
      return [];
    }
  }

  // Helper method to clear stored submissions (for admin dashboard)
  static clearStoredSubmissions() {
    if (typeof window === "undefined") return;

    localStorage.removeItem("contactSubmissions");
    console.log("📝 Contact submissions cleared");
  }
}

export class AwlyaaChartsApi {
  static async getAll(params: ListParams = {}) {
    const result = await apiClient.get<any[]>(endpoints.awlyaaCharts, {
      params,
    });
    if (!result.success) {
      return {
        data: [],
        success: false,
        error: result.error || result.message || "Failed to load Awlyaa charts",
        pagination: null,
      };
    }
    return result;
  }
}

export class ShajaraApi {
  static async getAll(params: ListParams = {}) {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? DEFAULT_PAGE_SIZE;

    const result = await apiClient.get(endpoints.shajara, {
      params: { page, limit, ...rest },
    });

    if (!result.success) {
      // Return fallback data if API fails
      const fallbackData = [
        {
          id: 1,
          name: "شجرهٔ حضرات کابل  شجرهٔ عاليهٔ حضرات عالي درجات نقشبنديه مجدديه عمريه (قدسنا الله باسرارهم العاليه)  خانقاه عاليه مجدديه عمريه ارغندی، پغمان، كابل",
          created_at: "2025-10-13T05:17:47.000000Z",
          updated_at: "2025-10-13T05:17:47.000000Z",
        },
      ];

      return {
        data: fallbackData,
        success: true,
        message: "Showing offline Shajara data.",
        pagination: createPaginationMeta({
          page,
          limit,
          total: fallbackData.length,
        }),
      };
    }

    const data = extractArray<unknown>(result.data);
    const total = Array.isArray(result.data) ? result.data.length : data.length;

    return {
      ...result,
      data,
      pagination: createPaginationMeta({ page, limit, total }),
    };
  }

  static async getById(id: string) {
    return apiClient.get(`${endpoints.shajara}/${id}`);
  }
}

export class SanadApi {
  static async getAll(params: ListParams = {}) {
    const { page: rawPage, limit: rawLimit, ...rest } = params;
    const page = rawPage ?? 1;
    const limit = rawLimit ?? DEFAULT_PAGE_SIZE;

    try {
      logger.info("Fetching sanads from API", { page, limit });
      const result = await apiClient.get(endpoints.sanad, {
        params: { page, limit, ...rest },
      });

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      logger.info("Successfully fetched sanads", {
        count: Array.isArray(result.data) ? result.data.length : 0,
      });

      if (result.pagination) {
        return result;
      }

      const total = Array.isArray(result.data) ? result.data.length : limit;

      return {
        ...result,
        pagination: createPaginationMeta({ page, limit, total }),
      };
    } catch (error) {
      logger.warn("Sanads API failed, using fallback data", { error });

      // Return fallback data if API fails
      const fallbackData = [
        {
          id: 1,
          name: "شجرهٔ حضرات کابل  شجرهٔ عاليهٔ حضرتات عالي درجات نقشبنديه مجدديه عمريه (قدسنا الله باسرارهم العاليه)  خانقاه عاليه مجدديه عمريه ارغندی، پغمان، كابل",
          created_at: "2025-10-13T05:17:47.000000Z",
          updated_at: "2025-10-13T05:17:47.000000Z",
        },
      ];

      return {
        data: fallbackData,
        success: true,
        message: apiConfig.fallback.showFallbackMessage
          ? "Using cached data due to API unavailability"
          : undefined,
        pagination: createPaginationMeta({
          page,
          limit,
          total: fallbackData.length,
        }),
      };
    }
  }

  static async getById(id: string) {
    try {
      const result = await apiClient.get(`${endpoints.sanad}/${id}`);
      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }
      return result;
    } catch (error) {
      logger.warn("Sanad getById failed", { id, error });
      if (!apiConfig.fallback.useForDetailEndpoints) {
        throw error;
      }
      return {
        data: null,
        success: true,
        message: "Using cached data due to API unavailability",
      };
    }
  }
}

// Server-side data fetching with caching
export async function fetchWithCache<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    next: { revalidate: apiConfig.cache.revalidate },
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Utility function for handling API errors
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
}

// Type-safe API response wrapper
export function createApiResponse<T>(
  data: T,
  success: boolean = true,
  message?: string,
  error?: string
): ApiResponse<T> {
  return {
    data,
    success,
    message,
    error,
  };
}
