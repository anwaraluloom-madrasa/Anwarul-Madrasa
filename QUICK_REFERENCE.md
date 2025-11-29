# API Architecture Quick Reference

## Import Statements

```typescript
// Hooks
import { useApi, useApiMutation } from '@/hooks/useApi';
import { useToast } from '@/components/Toast';

// Components
import UnifiedLoader from '@/components/loading/UnifiedLoader';
import ErrorDisplay, { classifyError } from '@/components/ErrorDisplay';
import ErrorBoundary from '@/components/ErrorBoundary';

// Utilities
import { logger } from '@/lib/logger';

// APIs
import { BlogsApi, CoursesApi, ArticlesApi } from '@/lib/api';
```

## Patterns

### List Page Component

```typescript
function BlogsListPage() {
  const { data, isLoading, error, errorType, refetch } = useApi(
    () => BlogsApi.getAll({ page: 1 }),
    { isDetail: false, showToast: true }
  );

  if (isLoading) return <UnifiedLoader variant="card-grid" count={6} />;
  if (error) return <ErrorDisplay error={error} errorType={errorType} onRetry={refetch} />;

  return <div>{/* Render data */}</div>;
}
```

### Detail Page Component

```typescript
function BlogDetailPage({ params }: { params: { slug: string } }) {
  return (
    <ErrorBoundary variant="full">
      <BlogDetailContent slug={params.slug} />
    </ErrorBoundary>
  );
}

function BlogDetailContent({ slug }: { slug: string }) {
  const { data, isLoading, error, refetch } = useApi(
    () => BlogsApi.getBySlug(slug),
    { isDetail: true } // Throws error for ErrorBoundary to catch
  );

  if (isLoading) return <UnifiedLoader variant="detail" />;

  return <div>{/* Render data */}</div>;
}
```

### Form Component

```typescript
function ContactForm() {
  const toast = useToast();
  const [formData, setFormData] = useState({ name: '', email: '' });

  const { mutate, isLoading } = useApiMutation(
    (data) => ContactApi.submit(data),
    {
      onSuccess: () => {
        toast.success('Submitted successfully!');
        setFormData({ name: '', email: '' });
      },
      onError: (err) => toast.error(err.message),
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Fields */}
      <button disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### API Service Class

```typescript
export class MyApi {
  // List endpoint - returns fallback on error
  static async getAll(params: ListParams = {}) {
    const { page = 1, limit = 12 } = params;
    
    try {
      logger.info('Fetching items', { page, limit });
      const result = await apiClient.get(endpoints.myApi, { params });
      
      if (!result.success) {
        throw new Error(result.error || 'API failed');
      }
      
      logger.info('Successfully fetched items', { count: result.data.length });
      return result;
    } catch (error) {
      logger.warn('API failed, using fallback', { error });
      
      const fallback = getFallbackData("myApi");
      return {
        data: fallback,
        success: true,
        message: "Using cached data",
        pagination: createPaginationMeta({ page, limit, total: fallback.length }),
      };
    }
  }

  // Detail endpoint - throws error
  static async getBySlug(slug: string) {
    try {
      const result = await apiClient.get(`${endpoints.myApi}/${slug}`);
      if (!result.success) {
        throw new Error(result.error || 'API failed');
      }
      return result;
    } catch (error) {
      logger.warn('Detail fetch failed', { slug, error });
      
      if (!apiConfig.fallback.useForDetailEndpoints) {
        throw error; // Let ErrorBoundary catch it
      }
      
      return { data: null, success: true };
    }
  }
}
```

## Loading Variants

```typescript
// Card grid (blogs, articles, courses)
<UnifiedLoader variant="card-grid" count={6} showFilters />

// List view
<UnifiedLoader variant="list" count={5} />

// Detail page
<UnifiedLoader variant="detail" />

// Form
<UnifiedLoader variant="form" />

// Inline (small spinner)
<UnifiedLoader variant="inline" />
```

## Error Display Variants

```typescript
// Full page error
<ErrorDisplay 
  error={error} 
  errorType="network" 
  variant="full" 
  onRetry={handleRetry} 
/>

// Inline error
<ErrorDisplay 
  error={error} 
  errorType={classifyError(error)} 
  variant="inline" 
  onRetry={handleRetry} 
/>

// Minimal error
<ErrorDisplay 
  error={error} 
  variant="minimal" 
/>
```

## Toast Notifications

```typescript
const toast = useToast();

toast.success('Success message');
toast.error('Error message');
toast.warning('Warning message');
toast.info('Info message');

// With custom duration
toast.success('Message', 3000); // 3 seconds
```

## Logger Usage

```typescript
// Regular logs
logger.debug('Debug info', { data });
logger.info('Operation completed', { count: 10 });
logger.warn('Warning occurred', { issue });
logger.error('Error occurred', error, { context });

// API logs
logger.apiRequest('/api/blogs', { page: 1 });
logger.apiResponse('/api/blogs', 123, 200);
logger.apiError('/api/blogs', error, 404);

// Performance timing
const endTimer = logger.startTimer('Operation');
// ... do work ...
endTimer(); // Logs duration
```

## Error Classification

```typescript
import { classifyError } from '@/components/ErrorDisplay';

const errorType = classifyError(error);
// Returns: 'network' | 'server' | 'not-found' | 'unknown'
```

## Common Patterns

### With Pagination

```typescript
const { data, page, goToPage, hasNextPage } = usePaginatedApi(
  (params) => BlogsApi.getAll(params),
  { pageSize: 12, initialPage: 1 }
);

<PaginationControls 
  page={page} 
  hasNextPage={hasNextPage}
  onPageChange={goToPage}
/>
```

### With Search/Filter

```typescript
const [search, setSearch] = useState('');

const { data, isLoading } = useApi(
  () => ArticlesApi.getAll({ search, category: 'tech' }),
  { enabled: true }
);
```

### Conditional Fetching

```typescript
const { data } = useApi(
  () => BlogsApi.getAll(),
  { enabled: shouldFetch } // Only fetch when true
);
```

### Manual Refetch

```typescript
const { data, refetch } = useApi(() => BlogsApi.getAll());

<button onClick={() => refetch()}>Refresh</button>
```

## Configuration

```typescript
// In src/lib/config.ts

export const apiConfig = {
  errorHandling: {
    maxRetries: 3,
    retryDelay: 1000,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    suppressedStatusCodes: [404],
  },
  notifications: {
    showSuccessToast: false,
    showErrorToast: true,
    toastDuration: 5000,
  },
  fallback: {
    useForListEndpoints: true,
    useForDetailEndpoints: false,
    showFallbackMessage: true,
  },
};
```

## Checklist for Updating Components

- [ ] Replace `useState` for loading/error with `useApi` or `useApiMutation`
- [ ] Replace custom loading UI with `UnifiedLoader`
- [ ] Replace custom error UI with `ErrorDisplay`
- [ ] Add `toast` notifications for user feedback
- [ ] Wrap detail pages in `ErrorBoundary`
- [ ] Update API class to use `logger` instead of `console.log` 
- [ ] Ensure list endpoints return fallback data
- [ ] Ensure detail endpoints throw errors
- [ ] Test loading, error, and success states

## Before/After Example

### Before
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  async function fetch() {
    try {
      setLoading(true);
      const res = await BlogsApi.getAll();
      setData(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }
  fetch();
}, []);

if (loading) return <CustomSkeleton />;
if (error) return <div>Error: {error.message}</div>;
```

### After
```typescript
const { data, isLoading, error, refetch } = useApi(
  () => BlogsApi.getAll(),
  { isDetail: false }
);

if (isLoading) return <UnifiedLoader variant="card-grid" />;
if (error) return <ErrorDisplay error={error} onRetry={refetch} />;
```

## Tips

1. Always use `UnifiedLoader` - don't create custom skeletons
2. Use `toast` for success messages, not inline alerts
3. Use `logger` instead of `console.log`
4. List endpoints should return fallback, detail endpoints should throw
5. Wrap detail pages in `ErrorBoundary`
6. Always provide retry functionality
7. Keep error messages user-friendly
8. Test in both development and production modes

