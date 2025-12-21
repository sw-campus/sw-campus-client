# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Run production server
pnpm lint         # Run ESLint
```

## Tech Stack

- **Framework:** Next.js 16 with App Router, React 19, TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui components (Radix UI primitives)
- **State Management:** Zustand (client state), TanStack React Query v5 (server state)
- **HTTP Client:** Axios with interceptors for auth token injection
- **Forms:** React Hook Form + Zod validation
- **AI:** Google Gemini API for lecture summaries and comparisons

## Architecture

### Feature-Based Module Structure

Code is organized by feature in `src/features/`. Each feature follows this pattern:

```
src/features/[feature]/
├── api/
│   ├── [feature]Api.ts          # Main export
│   ├── [feature]Api.client.ts   # API functions
│   ├── [feature]Api.types.ts    # Backend response types
│   └── [feature]Api.mapper.ts   # Transform backend → frontend types
├── components/                   # Feature UI components
├── hooks/                        # React Query hooks
├── types/                        # Frontend TypeScript interfaces
└── validation/                   # Zod schemas
```

Key features: `auth`, `lecture`, `organization`, `category`, `cart`, `storage`, `mypage`, `admin`

### API Layer Pattern

Backend and frontend types are separated using mappers:

```typescript
// Backend type (ApiLectureDetail) → Mapper → Frontend type (LectureDetail)
export async function getLectureDetail(id: number): Promise<LectureDetail> {
  const response = await axiosInstance.get(`/lectures/${id}`);
  return mapApiLectureDetailToLectureDetail(response.data);
}
```

### State Management

- **Zustand stores** (`src/store/`):
  - `authStore` - Access token, login status, user type (PERSONAL/ORGANIZATION)
  - `signupStore` - Multi-step signup form state
  - `cartCompare.store` - Cart comparison state

- **React Query** for server state with hooks in `features/[feature]/hooks/`

### Route Groups

```
src/app/
├── (default)/      # Public routes with guest layout
├── (auth)/         # Auth routes (OAuth callbacks)
├── (admin)/        # Admin dashboard
└── mypage/         # User dashboard
```

## Key Patterns

### Axios Instance (`src/lib/axios.ts`)

- Request interceptor: Adds Bearer token from authStore
- Response interceptor: Global error handling with Sonner toast

### S3 File Uploads (`src/features/storage/`)

Supports single file and multipart uploads via presigned URLs.

### Server Actions (`src/features/lecture/actions/gemini.ts`)

- `generateGeminiSummary()` - AI lecture summarization
- `compareCoursesWithAI()` - Comparative analysis

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API endpoint (required)
- `GEMINI_API_KEY` - For AI features

## Path Alias

`@/*` maps to `./src/*`
