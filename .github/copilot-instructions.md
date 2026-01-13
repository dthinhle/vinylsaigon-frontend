# Copilot Instructions - Vinyl Sài Gòn Frontend

- Never generate summary or explanation text.
- Never use emoji in your responses.
- Always format your responses as code snippets.
- Keep your responses concise and to the point.
- Make sure to implement feature in a service and call the service in the controller or model
- Keep comments minimal. Remove obvious comments
- Stimulus controllers needed to be registered in application.js

## Project Overview

This is a Next.js 15 e-commerce frontend for Vinyl Sài Gòn (audio equipment retailer) with Vietnamese localization, using App Router, TypeScript, Tailwind CSS, and Zustand for state management.

## Architecture Patterns

### API Integration & Data Flow

- **Rails Backend Communication**: All API calls go through `/lib/axios.ts` which auto-transforms snake_case ↔ camelCase using `humps`
  - Backend requests: `decamelizeKeys()` converts camelCase → snake_case
  - Backend responses: `camelizeKeys()` converts snake_case → camelCase
  - Always import from `@/lib/axios` (not raw axios) to maintain this convention
  - Auth tokens managed via `localStorage` with auto-refresh in axios interceptors

### Routing & URL Structure

- **Vietnamese/English Dual URLs**: Uses Next.js `rewrites` in `next.config.ts` to map Vietnamese URLs to English routes
  - Example: `/dang-nhap` → `/login`, `/tin-tuc/:slug` → `/news/:slug`
  - Always define paths in `FRONTEND_PATH` constant (`/lib/constants.ts`) for type-safe routing
  - Route groups: `(auth)` for auth pages (no header/footer), `(account)` for protected account pages

### State Management (Zustand)

- **Store Pattern**: All stores use devtools middleware and follow a consistent structure:
  - State properties (e.g., `user`, `loading`, `error`)
  - Public actions (e.g., `signIn`, `refresh`)
  - Internal helpers prefixed with `_` (e.g., `_setUser`, `_setLoading`)
  - See `/app/store/auth-store.ts` and `/app/store/shop-store.ts` for patterns

### Route Protection

- Use `<ProtectedRoute>` wrapper from `/app/components/auth/ProtectedRoute.tsx` for authenticated routes
- Use `<PublicRoute>` wrapper for auth pages (redirects authenticated users)
- Auth state synced to `localStorage` and checked on mount via `useAuthStore`

### ISR & Cache Strategy

- **Revalidation Tags**: Use for granular cache invalidation
  - `menu-config`, `global-data`, `search-suggestions`, `redirections`, `blogs`, `blog-{slug}`
  - Webhook endpoints at `/app/api/revalidate-*/route.ts` accept `REVALIDATION_SECRET` bearer token
- **Page-level ISR**: Set `export const revalidate = {seconds}` in page components
  - Common values: 600 (10min) for dynamic content, 3600 (1hr) for semi-static, 86400 (1d) for static pages

### Search Implementation

- **Meilisearch Integration**: Singleton client at `/lib/meilisearch.ts`
  - Connects to `API_QUERY_URL` (Rails backend search proxy)
  - Used for product search, instant search suggestions
  - Faceted filters via `react-instantsearch` components

## Development Workflow

### Prerequisites & Setup

```bash
# Node.js >= 22, npm >= 11
cp .env.example .env
npm install
npm run dev  # Runs with Turbopack
```

### Code Quality Commands

```bash
npm run lint       # ESLint with auto-fix
npm run format     # Prettier check
npm run format:fix # Prettier write
```

### Environment Variables (Required)

- `NEXT_PUBLIC_API_BASE_URL`: Rails backend base URL
- `NEXT_PUBLIC_APP_URL`: Frontend canonical URL
- `REVALIDATION_SECRET`: Webhook security token for cache invalidation

## UI & Styling Conventions

### Component Library

- **shadcn/ui**: Components in `/components/ui/` (managed via `components.json` config)
  - Import as `@/components/ui/{component}` (e.g., `@/components/ui/button`)
  - Tailwind CSS with CSS variables for theming (see `app/index.css`)
  - Icons from `lucide-react`

### Path Aliases

- `@/*` → root directory
- `@/components` → `/components`
- `@/lib/utils` → `/lib/utils`
- `@/app` → `/app` directory

### Styling Patterns

- Use `cn()` utility from `/lib/utils` for conditional classes (clsx + tailwind-merge)
- Motion animations via `motion` package (Framer Motion fork)
- Responsive images configured in `next.config.ts` with Rails Active Storage CDN patterns

## Key Files Reference

- `/lib/constants.ts` - Path definitions, API URLs, route configurations
- `/app/layout.tsx` - Global data fetching (menu, store info, redirections)
- `/middleware.ts` - Pathname injection into headers
- `/next.config.ts` - Rewrites (i18n routing), image domains, headers/caching
- `/components.json` - shadcn/ui configuration

## Common Patterns

### Adding New Pages

1. Define Vietnamese/English route mapping in `next.config.ts` rewrites
2. Add path constant to `FRONTEND_PATH` in `/lib/constants.ts`
3. Set appropriate `revalidate` time based on content freshness needs
4. Fetch data with `camelizeKeys()` if from backend API
5. Apply route protection wrapper if authentication required

### API Requests

```typescript
// Always use configured axios instance
import { apiClient } from '@/lib/axios'

// Data auto-transformed (snake_case ↔ camelCase)
const response = await apiClient.get('/products', {
  params: { categorySlug: 'tai-nghe' }, // Sent as category_slug
})
const products = response.data // Already camelized
```

### SEO & Metadata

- Use Next.js `generateMetadata()` for dynamic pages
- Base metadata in `/app/layout.tsx` includes og:image, favicons
- Vietnamese content requires proper encoding in URLs
