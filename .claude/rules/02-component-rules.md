# 02. 컴포넌트 규칙

> 서버/클라이언트 컴포넌트 구분, shadcn/ui 사용 규칙

---

## 1. 서버 컴포넌트 vs 클라이언트 컴포넌트

### 1.1 기본 원칙

Next.js App Router에서는 **서버 컴포넌트가 기본**입니다.

### 1.2 클라이언트 컴포넌트가 필요한 경우

| 상황 | 필요 여부 |
|------|----------|
| `useState`, `useReducer` 사용 | ✅ 필요 |
| `useEffect` 사용 | ✅ 필요 |
| 이벤트 핸들러 (`onClick`, `onChange`) | ✅ 필요 |
| 브라우저 전용 API (`window`, `document`) | ✅ 필요 |
| Custom Hooks (상태/이펙트 포함) | ✅ 필요 |
| 단순 데이터 표시 | ❌ 불필요 |
| Props만 받아서 렌더링 | ❌ 불필요 |

### 1.3 규칙

```typescript
// ❌ 불필요한 "use client" 선언
"use client";  // 상호작용 없는데 왜?

export function StaticCard({ title }: { title: string }) {
  return <div>{title}</div>;
}
```

```typescript
// ✅ 서버 컴포넌트로 유지
export function StaticCard({ title }: { title: string }) {
  return <div>{title}</div>;
}
```

```typescript
// ✅ 클라이언트 컴포넌트가 필요한 경우
"use client";

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### 1.4 useSearchParams Suspense 경계 (CRITICAL)

`useSearchParams()` 훅을 사용하는 컴포넌트는 **반드시 Suspense로 감싸야** 합니다.
Next.js 정적 생성(SSG) 시 search params를 빌드 타임에 알 수 없어 CSR bailout 에러가 발생합니다.

```typescript
// ❌ 빌드 에러: useSearchParams() should be wrapped in a suspense boundary
// page.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function Page() {
  const searchParams = useSearchParams()  // 에러!
  return <div>{searchParams.get('q')}</div>
}
```

```typescript
// ✅ 올바른 패턴: Suspense로 감싸기
// page.tsx (서버 컴포넌트)
import { Suspense } from 'react'
import { SearchContent } from './SearchContent'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  )
}

// SearchContent.tsx (클라이언트 컴포넌트)
'use client'

import { useSearchParams } from 'next/navigation'

export function SearchContent() {
  const searchParams = useSearchParams()
  return <div>{searchParams.get('q')}</div>
}
```

**규칙:**
- ✅ `useSearchParams()` 사용 컴포넌트는 Suspense 필수
- ✅ 페이지를 서버 컴포넌트로 유지하고, 클라이언트 부분만 분리
- ✅ 간접 사용(훅 내부)도 동일하게 적용
- ❌ 페이지 전체에 `'use client'` + `useSearchParams()` 조합 금지

**간접 사용 예시:**
```typescript
// useOAuthUrls 훅이 내부에서 useSearchParams() 사용
// → 이 훅을 사용하는 컴포넌트도 Suspense 필요

// page.tsx
import { Suspense } from 'react'
import { OAuthButtons } from './OAuthButtons'

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <OAuthButtons />  {/* 내부에서 useOAuthUrls → useSearchParams 사용 */}
    </Suspense>
  )
}
```

**대안: loading.tsx 사용**

Next.js는 `loading.tsx` 파일을 자동으로 Suspense boundary로 인식합니다.
해당 라우트 폴더에 `loading.tsx`를 추가하면 페이지 전체에 자동 적용됩니다.

```
app/
├── search/
│   ├── page.tsx        # useSearchParams 사용
│   └── loading.tsx     # 자동 Suspense boundary 역할
```

```typescript
// app/search/loading.tsx
export default function Loading() {
  return <div>Loading...</div>  // 또는 스켈레톤 UI
}

// app/search/page.tsx - Suspense 없이도 동작
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchPage() {
  const searchParams = useSearchParams()  // loading.tsx가 Suspense 역할
  return <div>{searchParams.get('q')}</div>
}
```

**주의:** `loading.tsx`는 페이지 전체를 감싸므로, 부분적인 Suspense가 필요하면 명시적 `<Suspense>` 사용 권장

---

## 2. 컴포넌트 분류별 규칙

### 2.1 Layout 컴포넌트 (`components/layout/`)

**규칙:**
- ✅ 전역 공용 레이아웃 컴포넌트
- ✅ 순수 UI만 담당
- ❌ 도메인 로직 금지
- ❌ API 호출 금지

### 2.2 UI 컴포넌트 (`components/ui/`)

shadcn/ui 기반 재사용 컴포넌트

**컴포넌트 추가 방법:**
```bash
# shadcn/ui CLI로 컴포넌트 추가
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add card
```

**규칙:**
- ✅ shadcn/ui CLI로 컴포넌트 추가
- ✅ `src/components/ui/` 아래에 자동 생성됨
- ✅ 생성된 코드는 수정하지 않고 그대로 사용
- ❌ 직접 컴포넌트 코드 작성 금지
- ❌ 비즈니스 로직 금지
- ❌ API 호출 금지
- ❌ 전역 상태 접근 금지

### 2.3 Feature 컴포넌트 (`features/{domain}/components/`)

도메인 특화 컴포넌트

```typescript
// src/features/cart/components/CartList.tsx
"use client";

import { useCartQuery } from '@/features/cart/hooks/useCartQuery';
import { CartItem } from '@/features/cart/components/CartItem';

export function CartList() {
  const { data: cartItems, isLoading } = useCartQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {cartItems?.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
```

**규칙:**
- ✅ 도메인 로직 포함 가능
- ✅ 도메인 훅 사용
- ✅ 해당 feature 폴더 내에만 위치
- ✅ 같은 폴더 내 파일은 상대경로 (`./`) 사용
- ✅ 다른 폴더 파일은 절대경로 (`@/`) 사용
- ❌ 다른 feature 직접 import 지양

---

## 3. Root Layout 규칙

### 3.1 Provider 순서

```typescript
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="relative flex min-h-screen flex-col">
        <QueryClientProviderWrapper>
          <Header />
          {children}
          <Footer />
          <FloatingCart />
          <Toaster richColors closeButton />
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
```

**필수 순서:**
1. `QueryClientProviderWrapper`
2. `Header`
3. `{children}`
4. `Footer`
5. `FloatingCart` (전역 장바구니)
6. `Toaster`

### 3.2 금지 사항

- ❌ 페이지 내부에서 Header/Footer 중복 렌더링
- ❌ 페이지 내부에서 Toaster 재생성
- ❌ Layout에서 비즈니스 로직/데이터 패칭
- ❌ `lang="ko"` 변경
- ❌ html/body 태그를 컴포넌트에서 재사용

---

## 4. 컴포넌트 작성 체크리스트

```
□ "use client"가 정말 필요한가?
□ useSearchParams() 사용 시 Suspense로 감쌌는가?
□ 적절한 폴더에 위치하는가?
  - 전역 UI → components/ui/
  - 전역 레이아웃 → components/layout/
  - 도메인 특화 → features/{domain}/components/
□ UI 컴포넌트에 비즈니스 로직이 없는가?
□ TailwindCSS 토큰을 사용하는가?
□ Props 타입이 명시되어 있는가?
```
