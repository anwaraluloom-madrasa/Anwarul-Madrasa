# Madsreqa - Islamic Learning Platform

A modern, robust Islamic learning platform built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Architecture**: Built with Next.js 15 App Router and TypeScript
- **Centralized Theme System**: Complete design system with consistent colors, typography, and components
- **Robust API Layer**: Type-safe API client with error handling and caching
- **Environment Configuration**: Centralized configuration management
- **Responsive Design**: Mobile-first approach with beautiful UI components
- **Performance Optimized**: Server-side rendering, caching, and optimized images
- **Accessibility**: WCAG compliant with proper focus management and screen reader support

## 🏗️ Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── components/         # Page-specific components
│   ├── interfaces/         # Legacy type definitions
│   └── ...
├── component/              # Shared components
├── lib/                    # Core utilities and configuration
│   ├── api.ts             # API client and services
│   ├── config.ts          # App configuration
│   ├── theme.ts           # Design system and theme
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Utility functions
└── globals.css            # Global styles and CSS variables
```

### Core Systems

#### 1. Configuration Management (`src/lib/config.ts`)
- Centralized app configuration
- Environment variable management
- API endpoint configuration
- Feature flags
- Navigation structure

#### 2. Theme System (`src/lib/theme.ts`)
- Complete design token system
- Color palette with semantic colors
- Typography scale
- Spacing system
- Shadow and border radius definitions
- CSS variables for dynamic theming

#### 3. API Layer (`src/lib/api.ts`)
- Type-safe API client
- Error handling and retry logic
- Request/response interceptors
- Caching strategies
- Service-specific API classes

#### 4. Type System (`src/lib/types.ts`)
- Comprehensive TypeScript definitions
- API response types
- Component prop interfaces
- Utility types for common patterns

## 🎨 Design System

### Color Palette

- **Primary**: Blue shades (#3b82f6 to #1e3a8a)
- **Secondary**: Islamic Green (#22c55e to #14532d)
- **Neutral**: Gray scale (#f9fafb to #030712)
- **Semantic**: Success, Warning, Error colors

### Typography

- **Font Families**: Inter (sans), Georgia (serif), Noto Naskh Arabic (Arabic)
- **Font Sizes**: 12px to 60px scale
- **Font Weights**: 300 to 800
- **Line Heights**: Optimized for readability

### Components

- **Buttons**: Primary, Secondary, Outline, Ghost variants
- **Cards**: Consistent card layouts with hover effects
- **Forms**: Input fields with validation states
- **Navigation**: Responsive navigation with mobile menu
- **Loading**: Spinner and skeleton components

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
NEXT_PUBLIC_BLOGS_API_URL=https://your-api-domain.com/api/blogs
NEXT_PUBLIC_COURSES_API_URL=https://your-api-domain.com/api/courses
NEXT_PUBLIC_AUTHORS_API_URL=https://your-api-domain.com/api/authors
NEXT_PUBLIC_BOOKS_API_URL=https://your-api-domain.com/api/books
NEXT_PUBLIC_EVENTS_API_URL=https://your-api-domain.com/api/events
NEXT_PUBLIC_FATWA_API_URL=https://your-api-domain.com/api/fatwa
NEXT_PUBLIC_ARTICLES_API_URL=https://your-api-domain.com/api/articles

# App Configuration
NEXT_PUBLIC_APP_NAME=Madsreqa
NEXT_PUBLIC_APP_DESCRIPTION=Islamic Learning Platform
NEXT_PUBLIC_APP_URL=https://www.anwarululoom.com

# Cache Configuration
NEXT_PUBLIC_CACHE_DURATION=3600
NEXT_PUBLIC_REVALIDATE_INTERVAL=3600

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_SEARCH=true
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HaqMadrasa
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [https://www.anwarululoom.com](https://www.anwarululoom.com)

## 📦 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Key Features

### 1. Centralized Theme Control
All design tokens are managed in `src/lib/theme.ts`. Change colors, spacing, or typography in one place and it updates throughout the application.

### 2. Robust API Handling
The API layer provides:
- Automatic error handling
- Request caching
- Type-safe responses
- Retry logic for failed requests

### 3. Performance Optimizations
- Server-side rendering for better SEO
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Efficient caching strategies

### 4. Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## 🔄 API Integration

### Using the API Client

```typescript
import { BlogsApi, CoursesApi } from '@/lib/api';

// Fetch all blogs
const blogsResponse = await BlogsApi.getAll();
if (blogsResponse.success) {
  const blogs = blogsResponse.data;
}

// Fetch specific blog
const blogResponse = await BlogsApi.getBySlug('blog-slug');
```

### Server-side Data Fetching

```typescript
import { fetchWithCache } from '@/lib/api';
import { apiConfig } from '@/lib/config';

async function getBlogs() {
  return await fetchWithCache(apiConfig.endpoints.blogs);
}
```

## 🎨 Customization

### Adding New Colors

1. Update `src/lib/theme.ts`:
   ```typescript
   colors: {
     // ... existing colors
     custom: {
       50: '#fef7ff',
       500: '#a855f7',
       900: '#581c87',
     }
   }
   ```

2. Update `tailwind.config.js`:
   ```javascript
   colors: {
     // ... existing colors
     custom: theme.colors.custom,
   }
   ```

### Adding New Components

1. Create component in `src/component/`
2. Use theme tokens for styling
3. Add TypeScript interfaces in `src/lib/types.ts`
4. Export from component index file

## 🐛 Troubleshooting

### Common Issues

1. **API Errors**: Check environment variables and API endpoints
2. **Type Errors**: Ensure types match API response structure
3. **Styling Issues**: Verify theme tokens are properly configured
4. **Build Errors**: Check for missing dependencies or type conflicts

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=true
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Next.js and React
- Styled with Tailwind CSS
- Icons from Lucide React
- Arabic font support with Noto Naskh Arabic
