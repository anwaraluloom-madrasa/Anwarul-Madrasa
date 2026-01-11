import { NextRequest, NextResponse } from "next/server";
import { endpoints } from "@/lib/config";
import {
  BlogsApi,
  ArticlesApi,
  CoursesApi,
  AuthorsApi,
  BooksApi,
  EventsApi,
  IftahApi,
  AwlyaaApi,
  TasawwufApi,
} from "@/lib/api";

interface SearchResult {
  type:
    | "blog"
    | "course"
    | "author"
    | "book"
    | "event"
    | "fatwa"
    | "article"
    | "awlyaa"
    | "tasawwuf";
  id: number | string;
  title: string;
  description?: string;
  slug?: string;
  url: string;
  image?: string;
  date?: string;
  author?: string;
  score?: number;
}

interface SearchResponse {
  success: boolean;
  query: string;
  results: SearchResult[];
  total: number;
  types: {
    article: number;
    blog: number;
    course: number;
    author: number;
    book: number;
    event: number;
    fatwa: number;
    awlyaa: number;
    tasawwuf: number;
  };
  error?: string;
}

// Helper function to map Laravel model type to frontend type
function mapModelTypeToFrontendType(modelType: string): SearchResult["type"] {
  const typeMap: Record<string, SearchResult["type"]> = {
    article: "article",
    articles: "article",
    blog: "blog",
    blogs: "blog",
    book: "book",
    books: "book",
    course: "course",
    courses: "course",
    author: "author",
    authors: "author",
    event: "event",
    events: "event",
    "darul-ifta": "fatwa",
    iftah: "fatwa",
    fatwa: "fatwa",
    tag: "fatwa", // Tags are navigation items for fatwa categories
    "iftah-sub-category": "fatwa", // Subcategories are navigation items for fatwa categories
    awlyaa: "awlyaa",
    awlyaas: "awlyaa",
    tasawwuf: "tasawwuf",
    tasawwufs: "tasawwuf",
  };

  return typeMap[modelType.toLowerCase()] || "article";
}

// Helper function to generate URL based on type and data
function generateUrl(
  type: SearchResult["type"],
  data: any,
  modelType?: string
): string {
  // Handle tag and iftah-sub-category types that map to fatwa
  const originalModelType = modelType?.toLowerCase();

  if (originalModelType === "tag" || originalModelType === "tags") {
    // Tags link to category page - use ID or name (encoded)
    const tagId = data.id || data.tag_id;
    const tagName = data.name;
    if (tagId) {
      return `/iftah/category/${encodeURIComponent(tagName || tagId)}`;
    }
    return "/iftah";
  }

  if (
    originalModelType === "iftah-sub-category" ||
    originalModelType === "iftah_sub_category"
  ) {
    // Subcategories link to subcategory page - use ID
    const subCategoryId =
      data.id || data.sub_category_id || data.iftah_sub_category_id;
    if (subCategoryId) {
      return `/iftah/sub-category/${subCategoryId}`;
    }
    return "/iftah";
  }

  switch (type) {
    case "article":
      return `/articles/${data.slug || data.id}`;
    case "blog":
      return `/blogs/${data.slug || data.id}`;
    case "course":
      return `/courses/${data.slug || data.id}`;
    case "author":
      return `/authors/${data.id}`;
    case "book":
      return `/book/${data.id}`;
    case "event":
      return `/event/${data.slug || data.id}`;
    case "fatwa":
      return `/iftah/${data.slug || data.id}`;
    case "awlyaa":
      return `/awlayaa/${data.id}`;
    case "tasawwuf":
      return `/tasawwuf/${data.slug || data.id}`;
    default:
      return "/";
  }
}

// Helper function to extract title from data
function extractTitle(data: any): string {
  return (
    data.title ||
    data.name ||
    data.question ||
    `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
    "Untitled"
  );
}

// Helper function to extract description from data
function extractDescription(data: any): string | undefined {
  return (
    data.description || data.excerpt || data.answer || data.bio || undefined
  );
}

// Helper function to check if a result matches the search query with improved precision
function matchesQuery(result: SearchResult, query: string): boolean {
  const searchTerm = query.toLowerCase().trim();

  // Pashto stop words to filter out
  const stopWords = new Set([
    "د",
    "دی",
    "څو",
    "ته",
    "وايې",
    "او",
    "یا",
    "چی",
    "کې",
    "په",
    "نه",
    "دا",
    "دغه",
    "هغه",
    "یو",
    "دوه",
    "درې",
    "څلور",
    "پنځه",
    "شپږ",
    "اووم",
    "اتم",
    "نهم",
    "لسه",
    "کول",
    "کړل",
    "کړې",
    "کړي",
    "کېږي",
    "کېدل",
    "کېږې",
    "کېدي",
    "شو",
    "شوه",
    "شوي",
    "کېږي",
    "کېږې",
    "کېږي",
    "وي",
    "وو",
    "وې",
    "وي",
    "؟",
    "!",
    ".",
    ",",
    ";",
    ":",
  ]);

  // Build searchable text from result
  const searchableText = [result.title, result.description, result.author]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[؟!.,;:]+/g, "");

  // Split query into words
  const allWords = searchTerm.split(/\s+/).filter((t) => t.length > 0);
  const meaningfulWords = allWords.filter(
    (word) =>
      word.length > 1 && !stopWords.has(word) && !/^[؟!.,;:]+$/.test(word)
  );

  const originalPhrase = searchTerm.replace(/[؟!.,;:]+/g, "").trim();
  const searchTerms = meaningfulWords.length > 0 ? meaningfulWords : allWords;

  // First, try exact phrase matching (most precise)
  if (originalPhrase.length > 5 && searchableText.includes(originalPhrase)) {
    return true;
  }

  // If we have meaningful words, require at least 60% of them to match
  if (searchTerms.length > 0) {
    const matchedWords = searchTerms.filter((term) =>
      searchableText.includes(term)
    );
    const matchRatio = matchedWords.length / searchTerms.length;

    // Require at least 60% of meaningful words to match, or all words if query is short
    const requiredMatchRatio = searchTerms.length <= 2 ? 1.0 : 0.6;

    if (matchRatio >= requiredMatchRatio) {
      return true;
    }
  }

  // Fallback: if no meaningful words, require exact phrase match
  if (meaningfulWords.length === 0 && searchableText.includes(originalPhrase)) {
    return true;
  }

  return false;
}

// Helper function to transform Laravel search result to frontend format
function transformSearchResult(
  item: any,
  modelType: string
): SearchResult | null {
  try {
    const type = mapModelTypeToFrontendType(modelType);
    const title = extractTitle(item);

    if (!title || title === "Untitled") {
      return null;
    }

    return {
      type,
      id: item.id || item.slug || Math.random(),
      title,
      description: extractDescription(item),
      slug: item.slug,
      url: generateUrl(type, item, modelType),
      image: item.image || item.featuredImage || item.photo,
      date:
        item.created_at || item.publishedAt || item.date || item.written_year,
      author:
        item.author?.name ||
        (item.author
          ? `${item.author.first_name || ""} ${
              item.author.last_name || ""
            }`.trim()
          : undefined) ||
        (item.recorded_by
          ? `${item.recorded_by.first_name || ""} ${
              item.recorded_by.last_name || ""
            }`.trim()
          : undefined),
      score: item.score || item.relevance_score,
    };
  } catch (error) {
    console.error("Error transforming search result:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  try {
    if (!query.trim()) {
      return NextResponse.json<SearchResponse>({
        success: true,
        query: "",
        results: [],
        total: 0,
        types: {
          article: 0,
          blog: 0,
          course: 0,
          author: 0,
          book: 0,
          event: 0,
          fatwa: 0,
          awlyaa: 0,
          tasawwuf: 0,
        },
      });
    }

    // Call Laravel global search endpoint
    const searchUrl = `${endpoints.searchGlobal}?q=${encodeURIComponent(
      query.trim()
    )}`;

    let response: Response;
    let laravelResponse: any;

    try {
      response = await fetch(searchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Search API error (${response.status}):`, errorText);

        // Try to parse error message from Laravel response
        let errorMessage = `Search API returned ${response.status}: ${response.statusText}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage = errorJson.message;
            // Check if it's a database column error
            if (
              errorJson.message.includes("Column not found") ||
              errorJson.message.includes("Unknown column")
            ) {
              errorMessage =
                "Database schema issue in search API. Please check the Laravel SearchController.";
            }
          }
        } catch {
          // If not JSON, use the text as is
          errorMessage = errorText.substring(0, 500);
        }

        throw new Error(errorMessage);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error(
          "Search API returned non-JSON response:",
          text.substring(0, 500)
        );
        throw new Error("Search API returned non-JSON response");
      }

      laravelResponse = await response.json();
    } catch (fetchError) {
      console.warn(
        "Global search failed, falling back to individual API searches:",
        fetchError
      );

      // Fallback: Use individual API calls if global search fails
      const searchTerm = query.toLowerCase().trim();

      // Pashto stop words to filter out (common words that don't add meaning)
      const stopWords = new Set([
        "د",
        "دی",
        "څو",
        "ته",
        "وايې",
        "او",
        "یا",
        "چی",
        "کې",
        "په",
        "نه",
        "دا",
        "دغه",
        "هغه",
        "یو",
        "دوه",
        "درې",
        "څلور",
        "پنځه",
        "شپږ",
        "اووم",
        "اتم",
        "نهم",
        "لسه",
        "کول",
        "کړل",
        "کړې",
        "کړي",
        "کېږي",
        "کېدل",
        "کېدې",
        "کېدي",
        "شو",
        "شوه",
        "شوي",
        "کېږي",
        "کېږې",
        "کېږي",
        "وي",
        "وو",
        "وې",
        "وي",
        "؟",
        "!",
        ".",
        ",",
        ";",
        ":",
      ]);

      // Split into words and filter out stop words and very short words
      const allWords = searchTerm.split(/\s+/).filter((t) => t.length > 0);
      const meaningfulWords = allWords.filter(
        (word) =>
          word.length > 1 && !stopWords.has(word) && !/^[؟!.,;:]+$/.test(word)
      );

      // If no meaningful words after filtering, use all words (but require exact phrase match)
      const searchTerms =
        meaningfulWords.length > 0 ? meaningfulWords : allWords;
      const originalPhrase = searchTerm.replace(/[؟!.,;:]+/g, "").trim();

      const results: SearchResult[] = [];

      // Helper function to check if item matches search with improved logic
      const matchesSearch = (item: any, fields: string[]): boolean => {
        const searchableText = fields
          .map((field) => {
            const value = field
              .split(".")
              .reduce((obj: any, key) => obj?.[key], item);
            return value
              ? String(value)
                  .toLowerCase()
                  .replace(/[؟!.,;:]+/g, "")
              : "";
          })
          .join(" ");

        // First, try exact phrase matching (most precise)
        if (
          originalPhrase.length > 5 &&
          searchableText.includes(originalPhrase)
        ) {
          return true;
        }

        // If we have meaningful words, require at least 60% of them to match
        if (searchTerms.length > 0) {
          const matchedWords = searchTerms.filter((term) =>
            searchableText.includes(term)
          );
          const matchRatio = matchedWords.length / searchTerms.length;

          // Require at least 60% of meaningful words to match, or all words if query is short
          const requiredMatchRatio = searchTerms.length <= 2 ? 1.0 : 0.6;

          if (matchRatio >= requiredMatchRatio) {
            return true;
          }
        }

        // Fallback: if no meaningful words, require exact phrase match
        if (
          meaningfulWords.length === 0 &&
          searchableText.includes(originalPhrase)
        ) {
          return true;
        }

        return false;
      };

      try {
        // Fetch all models in parallel - get more items to filter client-side
        // Note: Some APIs might not support 'search' parameter, so we fetch all and filter
        const [
          blogsRes,
          articlesRes,
          coursesRes,
          authorsRes,
          booksRes,
          eventsRes,
          iftahRes,
          awlyaaRes,
          tasawwufRes,
        ] = await Promise.allSettled([
          BlogsApi.getAll({ limit: 50 }), // Fetch more to filter
          ArticlesApi.getAll({ limit: 50 }),
          CoursesApi.getAll({ limit: 50 }),
          AuthorsApi.getAll({ limit: 50 }),
          BooksApi.getAll({ limit: 50 }),
          EventsApi.getAll({ limit: 50 }),
          IftahApi.getAll({ limit: 100 }), // Iftah doesn't support search param
          AwlyaaApi.getAll({ limit: 50 }),
          TasawwufApi.getAll({ limit: 50 }),
        ]);

        // Process blogs
        if (blogsRes.status === "fulfilled" && blogsRes.value.success) {
          const blogs = Array.isArray(blogsRes.value.data)
            ? blogsRes.value.data
            : [];
          blogs.forEach((blog: any) => {
            if (
              matchesSearch(blog, [
                "title",
                "description",
                "excerpt",
                "author.name",
              ])
            ) {
              results.push({
                type: "blog",
                id: blog.id,
                title: blog.title || "",
                description: blog.description || blog.excerpt,
                slug: blog.slug,
                url: `/blogs/${blog.slug}`,
                image: blog.featuredImage || blog.image,
                date: blog.publishedAt || blog.created_at,
                author: blog.author?.name || blog.author,
              });
            }
          });
        }

        // Process articles
        if (articlesRes.status === "fulfilled" && articlesRes.value.success) {
          const articles = Array.isArray(articlesRes.value.data)
            ? articlesRes.value.data
            : [];
          articles.forEach((article: any) => {
            if (
              matchesSearch(article, [
                "title",
                "description",
                "excerpt",
                "author.name",
              ])
            ) {
              results.push({
                type: "article",
                id: article.id,
                title: article.title || "",
                description: article.description || article.excerpt,
                slug: article.slug,
                url: `/articles/${article.slug}`,
                image: article.featuredImage || article.image,
                date: article.publishedAt || article.created_at,
                author: article.author?.name || article.author,
              });
            }
          });
        }

        // Process courses
        if (coursesRes.status === "fulfilled" && coursesRes.value.success) {
          const courses = Array.isArray(coursesRes.value.data)
            ? coursesRes.value.data
            : [];
          courses.forEach((course: any) => {
            if (matchesSearch(course, ["title", "name", "description"])) {
              results.push({
                type: "course",
                id: course.id,
                title: course.title || course.name || "",
                description: course.description,
                slug: course.slug,
                url: `/courses/${course.slug}`,
                image: course.image || course.featuredImage,
                date: course.created_at,
              });
            }
          });
        }

        // Process authors
        if (authorsRes.status === "fulfilled" && authorsRes.value.success) {
          const authors = Array.isArray(authorsRes.value.data)
            ? authorsRes.value.data
            : [];
          authors.forEach((author: any) => {
            if (matchesSearch(author, ["first_name", "last_name", "bio"])) {
              const fullName = `${author.first_name || ""} ${
                author.last_name || ""
              }`.trim();
              results.push({
                type: "author",
                id: author.id,
                title: fullName,
                description: author.bio,
                url: `/authors/${author.id}`,
                image: author.image,
              });
            }
          });
        }

        // Process books
        if (booksRes.status === "fulfilled" && booksRes.value.success) {
          const books = Array.isArray(booksRes.value.data)
            ? booksRes.value.data
            : [];
          books.forEach((book: any) => {
            if (
              matchesSearch(book, [
                "title",
                "description",
                "author.first_name",
                "author.last_name",
              ])
            ) {
              results.push({
                type: "book",
                id: book.id,
                title: book.title || "",
                description: book.description,
                url: `/book/${book.id}`,
                image: book.image,
                date: book.written_year,
                author: book.author
                  ? `${book.author.first_name || ""} ${
                      book.author.last_name || ""
                    }`.trim()
                  : undefined,
              });
            }
          });
        }

        // Process events
        if (eventsRes.status === "fulfilled" && eventsRes.value.success) {
          const events = Array.isArray(eventsRes.value.data)
            ? eventsRes.value.data
            : [];
          events.forEach((event: any) => {
            if (matchesSearch(event, ["title", "name", "description"])) {
              results.push({
                type: "event",
                id: event.id,
                title: event.title || event.name || "",
                description: event.description,
                slug: event.slug,
                url: `/event/${event.slug}`,
                image: event.image || event.featuredImage,
                date: event.date || event.created_at,
              });
            }
          });
        }

        // Process fatwas (iftah) - search in question and answer
        if (iftahRes.status === "fulfilled" && iftahRes.value.success) {
          const fatwas = Array.isArray(iftahRes.value.data)
            ? iftahRes.value.data
            : [];
          fatwas.forEach((fatwa: any) => {
            // For iftah, search in question and answer fields
            if (matchesSearch(fatwa, ["question", "answer"])) {
              results.push({
                type: "fatwa",
                id: fatwa.id,
                title: fatwa.question || "",
                description: fatwa.answer,
                slug: fatwa.slug,
                url: `/iftah/${fatwa.slug}`,
                date: fatwa.created_at,
              });
            }
          });
        }

        // Process awlyaa
        if (awlyaaRes.status === "fulfilled" && awlyaaRes.value.success) {
          const awlyaas = Array.isArray(awlyaaRes.value.data)
            ? awlyaaRes.value.data
            : [];
          awlyaas.forEach((awlyaa: any) => {
            if (
              matchesSearch(awlyaa, [
                "name",
                "first_name",
                "last_name",
                "description",
                "bio",
              ])
            ) {
              const name =
                awlyaa.name ||
                `${awlyaa.first_name || ""} ${awlyaa.last_name || ""}`.trim();
              results.push({
                type: "awlyaa",
                id: awlyaa.id,
                title: name || "Untitled",
                description: awlyaa.description || awlyaa.bio,
                url: `/awlayaa/${awlyaa.id}`,
                image: awlyaa.image || awlyaa.photo,
                date: awlyaa.created_at,
              });
            }
          });
        }

        // Process tasawwuf
        if (tasawwufRes.status === "fulfilled" && tasawwufRes.value.success) {
          const tasawwufs = Array.isArray(tasawwufRes.value.data)
            ? tasawwufRes.value.data
            : [];
          tasawwufs.forEach((tasawwuf: any) => {
            if (matchesSearch(tasawwuf, ["title", "name", "description"])) {
              results.push({
                type: "tasawwuf",
                id: tasawwuf.id,
                title: tasawwuf.title || tasawwuf.name || "",
                description: tasawwuf.description,
                slug: tasawwuf.slug,
                url: `/tasawwuf/${tasawwuf.slug || tasawwuf.id}`,
                image: tasawwuf.image,
                date: tasawwuf.created_at,
              });
            }
          });
        }

        // Count by type
        const types = {
          article: results.filter((r) => r.type === "article").length,
          blog: results.filter((r) => r.type === "blog").length,
          course: results.filter((r) => r.type === "course").length,
          author: results.filter((r) => r.type === "author").length,
          book: results.filter((r) => r.type === "book").length,
          event: results.filter((r) => r.type === "event").length,
          fatwa: results.filter((r) => r.type === "fatwa").length,
          awlyaa: results.filter((r) => r.type === "awlyaa").length,
          tasawwuf: results.filter((r) => r.type === "tasawwuf").length,
        };

        return NextResponse.json<SearchResponse>(
          {
            success: true,
            query,
            results,
            total: results.length,
            types,
          },
          {
            status: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
          }
        );
      } catch (fallbackError) {
        console.error("Fallback search also failed:", fallbackError);
        // If fallback also fails, throw the original error
        if (
          fetchError instanceof Error &&
          fetchError.message.includes("fetch failed")
        ) {
          throw new Error(
            "Unable to connect to search API. Please check if the API server is running."
          );
        }
        throw fetchError;
      }
    }

    // Transform Laravel response to frontend format
    const results: SearchResult[] = [];

    // Log the response structure for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      console.log(
        "Laravel search response keys:",
        Object.keys(laravelResponse)
      );
      console.log(
        "Laravel search response sample:",
        JSON.stringify(laravelResponse).substring(0, 1000)
      );
    }

    // Handle different possible response structures from Laravel
    if (laravelResponse.data && Array.isArray(laravelResponse.data)) {
      // If response has a data array with model_type field
      laravelResponse.data.forEach((item: any) => {
        const modelType =
          item.model_type || item.type || item.model || "article";
        const transformed = transformSearchResult(item, modelType);
        if (transformed) {
          results.push(transformed);
        }
      });
    } else if (
      laravelResponse.results &&
      Array.isArray(laravelResponse.results)
    ) {
      // If response has a results array
      laravelResponse.results.forEach((item: any) => {
        const modelType =
          item.model_type || item.type || item.model || "article";
        const transformed = transformSearchResult(item, modelType);
        if (transformed) {
          results.push(transformed);
        }
      });
    } else if (Array.isArray(laravelResponse)) {
      // If response is directly an array
      laravelResponse.forEach((item: any) => {
        const modelType =
          item.model_type || item.type || item.model || "article";
        const transformed = transformSearchResult(item, modelType);
        if (transformed) {
          results.push(transformed);
        }
      });
    } else if (
      laravelResponse.articles ||
      laravelResponse.blogs ||
      laravelResponse.courses ||
      laravelResponse.awlyaa ||
      laravelResponse.tasawwuf ||
      laravelResponse.authors ||
      laravelResponse.books ||
      laravelResponse.events ||
      laravelResponse["darul-ifta"]
    ) {
      // If response is grouped by type
      Object.entries(laravelResponse).forEach(([key, items]: [string, any]) => {
        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            const transformed = transformSearchResult(item, key);
            if (transformed) {
              results.push(transformed);
            }
          });
        }
      });
    } else {
      // If we don't recognize the structure, log it and try to extract any arrays
      console.warn(
        "Unknown Laravel response structure. Keys:",
        Object.keys(laravelResponse)
      );
      // Try to find any array in the response
      Object.entries(laravelResponse).forEach(([key, value]: [string, any]) => {
        if (Array.isArray(value) && value.length > 0) {
          console.log(`Found array in key "${key}" with ${value.length} items`);
          value.forEach((item: any) => {
            const transformed = transformSearchResult(item, key);
            if (transformed) {
              results.push(transformed);
            }
          });
        }
      });
    }

    // Filter results to ensure they match the query with improved precision
    const filteredResults = results.filter((result) =>
      matchesQuery(result, query)
    );

    // Count by type
    const types = {
      article: filteredResults.filter((r) => r.type === "article").length,
      blog: filteredResults.filter((r) => r.type === "blog").length,
      course: filteredResults.filter((r) => r.type === "course").length,
      author: filteredResults.filter((r) => r.type === "author").length,
      book: filteredResults.filter((r) => r.type === "book").length,
      event: filteredResults.filter((r) => r.type === "event").length,
      fatwa: filteredResults.filter((r) => r.type === "fatwa").length,
      awlyaa: filteredResults.filter((r) => r.type === "awlyaa").length,
      tasawwuf: filteredResults.filter((r) => r.type === "tasawwuf").length,
    };

    return NextResponse.json<SearchResponse>(
      {
        success: true,
        query,
        results: filteredResults,
        total: filteredResults.length,
        types,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("Search API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to perform search";
    console.error("Error details:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      query: query,
      searchUrl: `${endpoints.searchGlobal}?q=${encodeURIComponent(
        query.trim()
      )}`,
    });

    return NextResponse.json<SearchResponse>(
      {
        success: false,
        query: query,
        results: [],
        total: 0,
        types: {
          article: 0,
          blog: 0,
          course: 0,
          author: 0,
          book: 0,
          event: 0,
          fatwa: 0,
          awlyaa: 0,
          tasawwuf: 0,
        },
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
