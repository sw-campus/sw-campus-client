# CLAUDE.md - Client

This file provides guidance to Claude Code when working with sw-campus-client.

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

### State Management

- **Zustand stores** (`src/store/`): UI 상태 (모달, 장바구니 선택 등)
- **React Query**: 서버 상태 (API 응답, 캐시)
- **중요**: 서버 응답을 Zustand에 저장 금지

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

- `withCredentials: true` 필수 (쿠키 인증)
- Response interceptor에서 에러 toast 처리
- 컴포넌트/훅에서 중복 toast 호출 금지

### Server Components

- 서버 컴포넌트가 기본
- `"use client"` 선언은 필요한 경우에만 (useState, onClick 등)

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API endpoint (required)
- `GEMINI_API_KEY` - For AI features (server-only)

## Path Alias

`@/*` maps to `./src/*`

## Code Rules

상세 규칙은 `.claude/rules/` 폴더에서 자동으로 로드됩니다:

| 파일 | 내용 |
|-----|------|
| `01-project-structure.md` | 프로젝트 구조 |
| `02-component-rules.md` | 컴포넌트 규칙 (서버/클라이언트) |
| `03-state-management.md` | 상태 관리 (Query vs Zustand) |
| `04-api-communication.md` | API 통신 규칙 |
| `05-styling-rules.md` | TailwindCSS 스타일링 규칙 |
| `06-eslint-rules.md` | ESLint 규칙 |
| `07-performance-optimization.md` | 성능 최적화 |
| `08-security.md` | 보안 규칙 |
| `09-naming-conventions.md` | 네이밍 컨벤션 |
