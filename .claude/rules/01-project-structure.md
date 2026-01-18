# 01. 프로젝트 구조

> Next.js App Router + Feature-Sliced Architecture 기반 디렉토리 구조

---

## 📁 전체 구조

```
sw-campus-client/
├── src/
│   ├── app/                    # App Router (페이지, 레이아웃)
│   │   ├── globals.css         # 전역 스타일
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 홈 페이지
│   │   │
│   │   ├── (auth)/             # URL에 나타나지 않는 인증 그룹
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # /login
│   │   │   ├── signup/
│   │   │   │   └── page.tsx    # /signup
│   │   │   └── reset-password/
│   │   │       └── page.tsx    # /reset-password
│   │   │
│   │   └── lecture/
│   │       ├── layout.tsx      # lecture 전용 레이아웃
│   │       ├── page.tsx        # /lecture (목록)
│   │       └── [id]/
│   │           └── page.tsx    # /lecture/:id (상세)
│   │
│   ├── components/
│   │   ├── layout/             # 전역 레이아웃 (Header, Footer)
│   │   ├── providers/          # 전역 Provider
│   │   │   └── query-client-provider.tsx
│   │   └── ui/                 # shadcn/ui 기반 UI 컴포넌트
│   │
│   ├── features/               # 도메인별 기능 (Feature-Sliced)
│   │   └── {domain}/
│   │       ├── api/            # 도메인 API 함수 (선택)
│   │       ├── components/     # 도메인 UI 컴포넌트
│   │       ├── hooks/          # 도메인 훅 (선택)
│   │       ├── types/          # 도메인 타입 (선택)
│   │       └── index.ts        # Public API
│   │
│   ├── hooks/                  # 공용 Custom Hooks
│   ├── lib/                    # 유틸리티 및 API 설정
│   │   ├── axios.ts            # Axios 인스턴스
│   │   ├── env.ts              # 환경변수
│   │   └── utils.ts            # 공통 유틸 함수
│   │
│   ├── store/                  # Zustand 스토어
│   │   └── {domain}.store.ts
│   │
│   └── types/                  # 공용 타입 정의
│       └── {domain}.type.ts
└── ...
```

---

## 📂 레이어별 설명

### 1. App Layer (`src/app/`)

Next.js App Router 기반 페이지 및 레이아웃

**라우팅 규칙:**
| 패턴 | 용도 | 예시 |
|------|------|------|
| `(group)` | URL에 나타나지 않는 그룹 | `(auth)/login` → `/login` |
| `[param]` | 동적 라우트 파라미터 | `[id]/page.tsx` → `/lecture/123` |
| `@slot` | 병렬 라우트 (모달 등) | `@modal/default.tsx` |

**규칙:**
- ✅ 서버 컴포넌트가 기본
- ✅ 필요 시 `"use client"` 선언
- ✅ `(auth)` 그룹으로 인증 페이지 묶기
- ❌ Layout에서 비즈니스 로직/데이터 패칭 금지

---

### 2. Components Layer (`src/components/`)

#### Layout 컴포넌트
- 전역 공용 레이아웃 컴포넌트 (Header, Footer)
- 순수 UI만 담당
- ❌ 도메인 로직 금지

#### UI 컴포넌트
- shadcn/ui 기반
- 재사용 가능한 UI-only 레이어
- ❌ 비즈니스 로직 금지

---

### 3. Features Layer (`src/features/`)

도메인 단위(Feature-Sliced)로 강하게 분리

**규칙:**
- ✅ 도메인 로직은 해당 feature 폴더 내에만 위치
- ✅ `index.ts`를 통한 Public API 노출
- ✅ api/, hooks/, types/는 도메인에 따라 선택적 생성
- ✅ 공용 로직 발생 시 `hooks/` 또는 `lib/`로 승격
- ❌ feature 간 직접 import 지양

**index.ts 예시:**
```typescript
// src/features/cart/index.ts
export { useAddToCart } from './hooks/useAddToCart';
export { AddToCartButton } from './components/AddToCartButton';
export type { CartItem } from './types/cart.type';
```

---

### 4. Shared Layer

#### Store (`src/store/`)
- ✅ 전역 공유가 필요한 UI 상태만 처리
- ✅ localStorage persist 가능
- ❌ 서버 상태(API 응답) 저장 금지
- ❌ 과도한 비즈니스 로직 금지

---

## 📋 파일 위치 결정 가이드

| 파일 유형 | 위치 |
|----------|------|
| 페이지 컴포넌트 | `app/{route}/page.tsx` |
| 레이아웃 | `app/{route}/layout.tsx` |
| 인증 페이지 | `app/(auth)/{route}/page.tsx` |
| 전역 레이아웃 | `components/layout/` |
| 전역 Provider | `components/providers/` |
| 재사용 UI 컴포넌트 | `components/ui/` |
| 도메인 API 함수 | `features/{domain}/api/` |
| 도메인 컴포넌트 | `features/{domain}/components/` |
| 도메인 훅 | `features/{domain}/hooks/` |
| 도메인 타입 | `features/{domain}/types/` |
| 공용 타입 | `types/` |
| 공용 훅 | `hooks/` |
| Axios 설정 | `lib/axios.ts` |
| 유틸리티 함수 | `lib/utils.ts` |
| Zustand 스토어 | `store/` |
