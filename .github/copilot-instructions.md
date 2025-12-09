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
│   │   ├── globals.css         # 전역 스타일
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   └── page.tsx            # 홈 페이지
│   ├── components/
│   │   ├── layout/             # 전역 레이아웃 (Header, Footer)
│   │   └── ui/                 # shadcn/ui 기반 UI 컴포넌트
│   ├── features/               # 도메인별 기능 (Feature-Sliced)
│   │   └── {domain}/
│   │       ├── components/     # 도메인 UI 컴포넌트
│   │       ├── hooks/          # 도메인 훅 (API, 로직)
│   │       ├── types/          # 도메인 타입
│   │       └── index.ts        # Public API
│   ├── hooks/                  # 공용 Custom Hooks
│   ├── lib/                    # 유틸리티
│   │   ├── axios.ts            # Axios 인스턴스
│   │   ├── env.ts              # 환경변수
│   │   └── utils.ts            # 공통 유틸 함수
│   ├── providers/              # 전역 Provider
│   └── store/                  # Zustand 스토어
└── ...
```

---

## PR 리뷰 중점 사항

### 1. 컴포넌트 분류 규칙 (높은 우선순위)

#### 서버/클라이언트 컴포넌트 구분
- ❌ 불필요한 `"use client"` 선언 금지
- ✅ 상호작용 요소가 없으면 서버 컴포넌트 유지
- ✅ useState, useEffect, 이벤트 핸들러 사용 시만 클라이언트 컴포넌트

#### 컴포넌트 위치
| 유형 | 위치 | 설명 |
|------|------|------|
| 전역 레이아웃 | `components/layout/` | Header, Footer (도메인 로직 금지) |
| UI 컴포넌트 | `components/ui/` | shadcn/ui 기반 (비즈니스 로직 금지) |
| 도메인 컴포넌트 | `features/{domain}/components/` | 특정 도메인 전용 |

### 2. 상태 관리 분리 (높은 우선순위)

#### TanStack Query vs Zustand

| 상태 유형 | 도구 | 예시 |
|----------|------|------|
| 서버 상태 | TanStack Query | API 응답, 캐시 데이터 |
| 클라이언트 상태 | Zustand | UI 상태, 장바구니 |

#### 금지 사항
- ❌ 서버 응답 데이터를 Zustand에 저장
- ❌ API 캐시를 수동으로 관리
- ❌ Query와 Zustand 혼합 사용

### 3. API 통신 규칙 (높은 우선순위)

#### Axios 사용 규칙
- ✅ 반드시 `src/lib/axios.ts`의 `api` 인스턴스 사용
- ❌ axios 직접 import 및 새 인스턴스 생성 금지
- ❌ fetch() 사용 금지 (쿠키 인증 누락 위험)
- ❌ baseURL 하드코딩 금지

#### 에러 처리
- ❌ 컴포넌트/훅에서 toast 중복 호출 금지 (인터셉터에서 처리)
- ❌ axios error 메시지 재가공 금지
- ❌ queryFn 내부에서 toast 호출 금지

#### 인증/토큰
- ✅ Authorization header는 axios 인터셉터에서만 추가
- ❌ 컴포넌트에서 header 직접 설정 금지

### 4. TanStack Query 규칙 (중간 우선순위)

#### 기본 옵션 준수
```typescript
{
  staleTime: 5000,      // 5초
  gcTime: 180000,       // 3분
  retry: 1,
  refetchOnWindowFocus: false
}
```

#### Query Key 규칙
- ✅ 배열 형태 사용: `['cart', userId]`
- ❌ 문자열 단독 사용 지양

#### 금지 사항
- ❌ 페이지/컴포넌트 내부에서 새 QueryClient 생성
- ❌ QueryClientProvider 중첩 사용

### 5. 스타일링 규칙 (중간 우선순위)

#### TailwindCSS 토큰 사용
- ✅ `bg-background`, `text-foreground`, `text-muted-foreground`
- ✅ `rounded-lg`, `rounded-md` (전역 radius 토큰)
- ❌ `bg-[#fff3e0]`, `text-[#333]` 등 하드코딩 금지
- ❌ `rounded-[8px]` 등 임의 값 금지

#### 잘못된 예시
```tsx
// ❌ 금지
<div className="rounded-[8px] bg-[#fff3e0]">

// ✅ 올바름
<div className="rounded-lg bg-background text-foreground">
```

### 6. 레이아웃 규칙 (중간 우선순위)

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
├── components/     # Cart UI 컴포넌트
├── hooks/          # useCartQuery, useAddToCart
├── types/          # CartItem, CartState
└── index.ts        # export { useCartQuery, CartList }
```

#### 규칙
- ✅ 도메인 로직은 해당 feature 폴더 내에만 위치
- ✅ 공용 로직 발생 시 `hooks/` 또는 `lib/`로 승격
- ❌ feature 간 직접 import 지양

---

## ESLint 규칙 준수

### TypeScript
- ⚠️ `any` 사용 가능하나 지양 권고
- ❌ 사용되지 않는 변수 금지 (`_` prefix 예외)
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

## 리뷰 시 확인 체크리스트

```
□ 불필요한 "use client" 선언 없음
□ 서버 상태는 TanStack Query, UI 상태는 Zustand 사용
□ axios 인스턴스(api) 사용
□ 에러 toast 중복 호출 없음
□ TailwindCSS 토큰 사용 (하드코딩 색상/radius 금지)
□ Feature 폴더 구조 준수
□ console.log 제거됨
□ const 사용 (let 최소화)
□ === 사용 (== 금지)
□ var 사용 없음
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
// ❌ let 불필요 사용
let x = 10;  // 재할당 없으면 const로

// ❌ var 금지
var y = 3;

// ❌ console.log 금지
console.log('debug');

// ❌ 느슨한 비교 금지
if (a == '1') { }

// ❌ 하드코딩 색상 금지
<div className="bg-[#f5f5f5]">

// ❌ 서버 상태를 Zustand에 저장
const useStore = create((set) => ({
  users: [],  // ❌ API 응답은 TanStack Query로
}));
```

---

## 코드 규칙 문서 참조

상세 규칙은 `sw-campus-docs/code-rules/front/` 참조
