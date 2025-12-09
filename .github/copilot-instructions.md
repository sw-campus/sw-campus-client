# GitHub Copilot Instructions for sw-campus-client

> 이 문서는 GitHub Copilot이 PR 리뷰 및 코드 작성 시 참고하는 지침입니다.

## ⚠️ 중요: 언어 설정

- **모든 PR 리뷰 코멘트는 반드시 한글로 작성해주세요.**
- **코드 제안, 설명, 피드백 등 모든 응답은 한국어로 작성합니다.**

---

## 프로젝트 개요

- **프로젝트**: sw-campus-client (교육 플랫폼 프론트엔드)
- **기술 스택**: Next.js 16 (App Router), TypeScript, TailwindCSS 4, shadcn/ui
- **상태 관리**: TanStack Query (서버 상태), Zustand (클라이언트 상태)
- **패키지 매니저**: pnpm

---

## 디렉토리 구조

```
sw-campus-client/
├── src/
│   ├── app/                    # App Router (페이지, 레이아웃)
│   │   ├── globals.css         # 전역 스타일 (TailwindCSS 4)
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 홈 페이지
│   │   ├── (auth)/             # URL에 나타나지 않는 인증 그룹
│   │   │   ├── login/          # /login
│   │   │   ├── signup/         # /signup
│   │   │   └── reset-password/ # /reset-password
│   │   └── lecture/
│   │       ├── layout.tsx      # lecture 전용 레이아웃
│   │       ├── page.tsx        # /lecture (목록)
│   │       ├── @modal/         # 병렬 라우트 (모달)
│   │       └── [id]/           # /lecture/:id (상세)
│   ├── components/
│   │   ├── layout/             # 전역 레이아웃 (Header, Footer)
│   │   ├── providers/          # 전역 Provider
│   │   └── ui/                 # shadcn/ui 기반 UI 컴포넌트
│   ├── features/               # 도메인별 기능 (Feature-Sliced)
│   │   └── {domain}/
│   │       ├── api/            # 도메인 API 함수 (선택)
│   │       ├── components/     # 도메인 UI 컴포넌트
│   │       ├── hooks/          # 도메인 훅 (선택)
│   │       ├── types/          # 도메인 타입 (선택)
│   │       └── index.ts        # Public API
│   ├── hooks/                  # 공용 Custom Hooks
│   ├── lib/                    # 유틸리티
│   │   ├── axios.ts            # Axios 인스턴스, 인터셉터
│   │   ├── env.ts              # 환경변수
│   │   └── utils.ts            # 공통 유틸 함수 (Pure function)
│   └── store/                  # Zustand 스토어
│       └── {domain}.store.ts
└── ...
```

---

## PR 리뷰 중점 사항

### 1. 컴포넌트 분류 규칙 (높은 우선순위)

#### 서버/클라이언트 컴포넌트 구분
- ❌ 불필요한 `"use client"` 선언 금지
- ✅ 상호작용 요소가 없으면 서버 컴포넌트 유지
- ✅ useState, useEffect, 이벤트 핸들러, 브라우저 API 사용 시만 클라이언트 컴포넌트

#### 클라이언트 컴포넌트 필요 조건
| 상황 | 필요 여부 |
|------|----------|
| `useState`, `useReducer` 사용 | ✅ 필요 |
| `useEffect` 사용 | ✅ 필요 |
| 이벤트 핸들러 (`onClick`, `onChange`) | ✅ 필요 |
| 브라우저 전용 API (`window`, `document`) | ✅ 필요 |
| Custom Hooks (상태/이펙트 포함) | ✅ 필요 |
| 단순 데이터 표시, Props만 받아서 렌더링 | ❌ 불필요 |

#### 컴포넌트 위치
| 유형 | 위치 | 규칙 |
|------|------|------|
| 전역 레이아웃 | `components/layout/` | 순수 UI만, 도메인 로직/API 호출 금지 |
| UI 컴포넌트 | `components/ui/` | shadcn/ui CLI로 추가, 비즈니스 로직/전역 상태 접근 금지 |
| 도메인 컴포넌트 | `features/{domain}/components/` | 도메인 로직 포함 가능, `@/` 절대경로 사용 |

#### shadcn/ui 컴포넌트 추가 방법
```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
```
- ✅ CLI로 컴포넌트 추가
- ❌ 직접 코드 작성 금지, 생성된 코드 수정 금지

### 2. 상태 관리 분리 (높은 우선순위)

#### TanStack Query vs Zustand

| 상태 유형 | 도구 | 예시 |
|----------|------|------|
| 서버 상태 | TanStack Query | API 응답, 캐시 데이터, 사용자 정보 |
| 클라이언트 상태 | Zustand | UI 상태, 모달 열림/닫힘, 장바구니 |

#### 금지 사항
- ❌ 서버 응답 데이터를 Zustand에 저장
- ❌ API 캐시를 수동으로 관리 (useState + useEffect)
- ❌ Query와 Zustand 혼합 사용

#### 잘못된 예시
```typescript
// ❌ 서버 응답을 Zustand에 저장
const useStore = create((set) => ({
  users: [],  // API 응답은 TanStack Query로!
  setUsers: (users) => set({ users }),
}));

// ❌ 수동 캐시 관리
const [data, setData] = useState(null);
useEffect(() => {
  api.get('/users').then(res => setData(res.data));
}, []);
```

### 3. API 통신 규칙 (높은 우선순위)

#### Axios 사용 규칙
| 규칙 | 상태 | 설명 |
|------|------|------|
| `api` 인스턴스 사용 | ✅ 필수 | `src/lib/axios.ts`의 인스턴스만 사용 |
| `withCredentials: true` | ✅ 필수 | 쿠키 기반 인증에 필요 |
| axios 직접 import | ❌ 금지 | 새 인스턴스 생성 금지 |
| fetch() 사용 | ❌ 금지 | 쿠키 인증 누락 위험 |
| baseURL 하드코딩 | ❌ 금지 | 환경변수 사용 필수 |

```typescript
// ✅ 올바른 사용
import { api } from '@/lib/axios';
const { data } = await api.get('/users');

// ❌ 금지
import axios from 'axios';
const response = await axios.get('/api/users');
const response = await fetch('/api/users');
```

#### 에러 처리 규칙
- ❌ 컴포넌트/훅에서 toast 중복 호출 금지 (인터셉터에서 처리)
- ❌ axios error 메시지 재가공 금지
- ❌ queryFn 내부에서 toast 호출 금지
- ✅ 성공 toast만 컴포넌트에서 처리

```typescript
// ✅ 올바른 패턴
const handleSubmit = async () => {
  try {
    await mutation.mutateAsync(formData);
    toast.success('저장되었습니다.');  // 성공만 처리
  } catch (error) {
    // 에러 toast는 인터셉터에서 처리됨
  }
};

// ❌ 금지
catch (error) {
  toast.error('에러 발생!');  // 인터셉터와 중복!
}
```

#### 인증/토큰
- ✅ Authorization header는 axios 인터셉터에서만 추가
- ❌ 컴포넌트에서 header 직접 설정 금지

### 4. TanStack Query 규칙 (중간 우선순위)

#### 기본 옵션 준수
```typescript
{
  staleTime: 5000,           // 5초
  gcTime: 180000,            // 3분 (구 cacheTime)
  retry: 1,
  refetchOnWindowFocus: false
}
```

#### Query Key 규칙
```typescript
// ✅ 배열 형태 사용 (권장)
['cart', userId]
['users']
['product', productId]
['cart', userId, 'items']

// ❌ 문자열 단독 사용 (지양)
'cart'
```

#### 금지 사항
- ❌ 페이지/컴포넌트 내부에서 새 QueryClient 생성
- ❌ QueryClientProvider 중첩 사용

### 5. 스타일링 규칙 (중간 우선순위)

#### TailwindCSS 4 토큰 사용

**색상 토큰:**
```tsx
// ✅ 올바른 사용
<div className="bg-background text-foreground">
<div className="bg-muted text-muted-foreground">
<div className="bg-primary text-primary-foreground">
<div className="border border-border">
<input className="bg-input focus:ring-ring">

// ❌ 금지: 하드코딩 색상
<div className="bg-[#fff3e0]">
<div className="text-[#333]">
<div className="bg-[rgb(255,255)]">
```

**반지름 토큰:**
```tsx
// ✅ 올바른 사용
<div className="rounded-sm">   {/* --radius-sm */}
<div className="rounded-md">   {/* --radius-md */}
<div className="rounded-lg">   {/* --radius-lg */}
<div className="rounded-xl">   {/* --radius-xl */}

// ❌ 금지: 임의 값
<div className="rounded-[8px]">
```

### 6. 레이아웃 규칙 (중간 우선순위)

#### App Router 라우팅 패턴
| 패턴 | 용도 | 예시 |
|------|------|------|
| `(group)` | URL에 나타나지 않는 그룹 | `(auth)/login` → `/login` |
| `[param]` | 동적 라우트 파라미터 | `[id]/page.tsx` → `/lecture/123` |
| `@slot` | 병렬 라우트 (모달 등) | `@modal/default.tsx` |

#### Root Layout Provider 순서
```tsx
<QueryClientProviderWrapper>
  <Header />
  {children}
  <Footer />
  <Toaster />
</QueryClientProviderWrapper>
```

#### 금지 사항
- ❌ 페이지 내부에서 Header/Footer 중복 렌더링
- ❌ 페이지 내부에서 Toaster 재생성
- ❌ Layout에서 비즈니스 로직/데이터 패칭

### 7. Feature-Sliced 구조 (중간 우선순위)

#### 도메인별 분리
```
features/cart/
├── api/            # Cart API 함수 (선택)
├── components/     # Cart UI 컴포넌트
├── hooks/          # useCartQuery, useAddToCart
├── types/          # CartItem, CartState
└── index.ts        # Public API 노출
```

#### index.ts 예시
```typescript
// src/features/cart/index.ts
export { useAddToCart } from './hooks/useAddToCart';
export { AddToCartButton } from './components/AddToCartButton';
export type { CartItem } from './types/cart.type';
```

#### 규칙
- ✅ 도메인 로직은 해당 feature 폴더 내에만 위치
- ✅ api/, hooks/, types/는 도메인에 따라 선택적 생성
- ✅ 공용 로직 발생 시 `hooks/` 또는 `lib/`로 승격
- ❌ feature 간 직접 import 지양

---

## ESLint 규칙 준수

### TypeScript
- ⚠️ `any` 사용 가능하나 지양 권고 (경고만 표시)
- ❌ 사용되지 않는 변수 금지 (`_` prefix 예외: `_event`, `_unused`)
- ✅ optional chaining 우선 사용 (`?.`)

### 코드 스타일
- ❌ `console.log` 금지 (`console.warn`, `console.error`는 허용)
- ✅ `const` 우선 사용 (재할당 없으면 필수)
- ❌ `var` 완전 금지
- ❌ `==`, `!=` 금지 (반드시 `===`, `!==` 사용)

### Next.js
- ✅ `<a>` 태그 사용 가능 (App Router에서 허용)
- ✅ `<Link>` 권장하나 강제하지 않음

---

## 파일 위치 결정 가이드

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
| 공용 훅 | `hooks/` |
| Axios 설정 | `lib/axios.ts` |
| 유틸리티 함수 | `lib/utils.ts` |
| Zustand 스토어 | `store/` |

---

## 리뷰 시 확인 체크리스트

```
□ 불필요한 "use client" 선언 없음
□ 서버 상태는 TanStack Query, UI 상태는 Zustand 사용
□ axios 인스턴스(api) 사용, fetch() 사용 없음
□ 에러 toast 중복 호출 없음 (인터셉터에 위임)
□ TailwindCSS 토큰 사용 (하드코딩 색상/radius 금지)
□ Feature 폴더 구조 준수, index.ts로 Public API 노출
□ console.log 제거됨 (warn, error만 허용)
□ const 사용 (let 최소화, var 금지)
□ === 사용 (== 금지)
□ shadcn/ui 컴포넌트는 CLI로 추가
```

---

## 허용/금지 예시

### 허용
```typescript
// any 경고는 있지만 허용
const fetchData = async () => {
  const result: any = await api.get('/test');
  return result;
};

// _ prefix로 미사용 변수 허용
const handleClick = (_event: MouseEvent) => { ... };
```

### 금지
```typescript
// ❌ 불필요한 "use client"
"use client";  // 상호작용 없는데 왜?
export function StaticCard({ title }: { title: string }) {
  return <div>{title}</div>;
}

// ❌ let 불필요 사용
let x = 10;  // 재할당 없으면 const로

// ❌ var 금지
var y = 3;

// ❌ console.log 금지
console.log('debug');

// ❌ 느슨한 비교 금지
if (a == '1') { }

// ❌ 하드코딩 색상/radius 금지
<div className="bg-[#f5f5f5] rounded-[8px]">

// ❌ 서버 상태를 Zustand에 저장
const useStore = create((set) => ({
  users: [],  // API 응답은 TanStack Query로
}));

// ❌ fetch() 또는 axios 직접 import
await fetch('/api/users');
import axios from 'axios';
```

---

## 코드 규칙 문서 참조

상세 규칙은 `sw-campus-docs/code-rules/front/` 참조:
- 01-project-structure.md
- 02-component-rules.md
- 03-state-management.md
- 04-api-communication.md
- 05-styling-rules.md
- 06-eslint-rules.md
