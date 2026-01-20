# Gemini Code Review Instructions for sw-campus-client

> 이 문서는 Gemini가 PR 리뷰 및 코드 작성 시 참고하는 지침입니다.

## ⚠️ 중요: 언어 설정

- **모든 PR 리뷰 코멘트는 반드시 한국어로 작성해주세요.**
- **코드 제안, 설명, 피드백 등 모든 응답은 한국어로 작성합니다.**

---

## 프로젝트 개요

- **프로젝트**: sw-campus-client (교육 플랫폼 프론트엔드)
- **기술 스택**: Next.js 16, React 19, TypeScript, TailwindCSS 4
- **상태 관리**: TanStack Query (서버 상태), Zustand (클라이언트 상태)
- **아키텍처**: Feature-Sliced Architecture + App Router

---

## 프로젝트 구조

```
sw-campus-client/src/
├── app/                    # App Router (페이지, 레이아웃)
├── components/
│   ├── layout/             # 전역 레이아웃 (Header, Footer)
│   ├── providers/          # 전역 Provider
│   └── ui/                 # shadcn/ui 컴포넌트
├── features/{domain}/      # 도메인별 기능
│   ├── api/                # API 함수
│   ├── components/         # 도메인 컴포넌트
│   ├── hooks/              # 도메인 훅
│   ├── types/              # 타입 정의
│   └── index.ts            # Public API
├── hooks/                  # 공용 훅
├── lib/                    # axios, env, utils
└── store/                  # Zustand 스토어
```

---

## PR 리뷰 중점 사항

### 1. 성능 최적화 - Waterfall 제거 (🔴 높은 우선순위)

#### 1.1 Promise.all() 병렬 실행

```typescript
// ❌ 잘못된 예: 순차 실행 (Waterfall)
const lecture = await axiosInstance.get(`/lectures/${id}`);
const reviews = await axiosInstance.get(`/lectures/${id}/reviews`);
// 총 소요시간: A + B

// ✅ 올바른 예: 병렬 실행
const [lecture, reviews] = await Promise.all([
  axiosInstance.get(`/lectures/${id}`),
  axiosInstance.get(`/lectures/${id}/reviews`),
]);
// 총 소요시간: max(A, B)
```

#### 1.2 React Query 캐시 공유로 중복 호출 제거

```typescript
// ❌ 잘못된 예: 다른 queryKey로 중복 API 호출
// ActivitySummary.tsx
const { data } = useQuery({
  queryKey: ['completedLectures-summary'],
  queryFn: () => fetchCompletedLectures(),
})

// ReviewSection.tsx
const { data } = useQuery({
  queryKey: ['completedLectures-reviews'],  // 다른 키 → 중복 호출!
  queryFn: () => fetchCompletedLectures(),
})

// ✅ 올바른 예: 동일 queryKey로 캐시 공유
// hooks/useCompletedLecturesQuery.ts
export function useCompletedLecturesQuery() {
  return useQuery({
    queryKey: ['completedLectures'],  // 동일한 키
    queryFn: () => fetchCompletedLectures(),
  })
}

// 두 컴포넌트에서 동일 훅 사용 → 캐시 공유
const { data } = useCompletedLecturesQuery()
```

**규칙:**
- ✅ 같은 데이터는 같은 queryKey 사용
- ✅ 공용 Query Hook으로 추상화
- ❌ 컴포넌트마다 다른 queryKey 사용 금지

#### 1.3 종속 쿼리 병렬화 (enabled 옵션)

```typescript
// ❌ 잘못된 예: 독립 쿼리가 순차 실행
const { data } = useLectureDetailQuery(lectureId)

const { data: orgInfo } = useQuery({
  queryKey: ['org', data?.orgId],
  enabled: !!data?.orgId,
})

const { data: aiSummary } = useQuery({
  queryKey: ['aiSummary', lectureId],
  enabled: !!data,  // orgInfo 완료 후 시작 (불필요한 대기)
})

// ✅ 올바른 예: 독립 쿼리 병렬 실행
// orgInfo와 aiSummary는 서로 독립적이므로 둘 다 data만 의존하면 동시 시작됨
```

### 2. 로딩 상태 관리 (🔴 높은 우선순위)

```typescript
// ❌ 잘못된 예: 일부 쿼리의 로딩 상태 누락
const { data: org, isLoading: isOrgLoading } = useOrgQuery(orgId)
const { data: courses = [] } = useCoursesQuery(orgId)  // isLoading 없음!

if (isOrgLoading) return <Loading />  // courses 로딩 중에도 빈 배열 표시

// ✅ 올바른 예: 모든 쿼리의 로딩 상태 통합
const { data: org, isLoading: isOrgLoading } = useOrgQuery(orgId)
const { data: courses = [], isLoading: isCoursesLoading } = useCoursesQuery(orgId)

const isLoading = isOrgLoading || isCoursesLoading

if (isLoading) return <Loading />
```

**규칙:**
- ✅ 병렬 쿼리 시 모든 isLoading 상태 통합
- ✅ 기본값(`= []`)과 로딩 상태를 함께 사용
- ❌ isLoading 없이 기본값만 사용 금지

### 3. 상태 관리 분리 (🟠 중간 우선순위)

| 상태 유형 | 도구 | 예시 |
|----------|------|------|
| **서버 상태** | TanStack Query | API 응답, 캐시 데이터 |
| **클라이언트 상태** | Zustand | UI 상태, 모달, 장바구니 |

```typescript
// ❌ 서버 응답 데이터를 Zustand에 저장
const useStore = create((set) => ({
  users: [],  // API 응답은 TanStack Query로!
  setUsers: (users) => set({ users }),
}));

// ✅ 서버 상태는 TanStack Query
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: () => api.get('/users').then(res => res.data),
});

// ✅ 클라이언트 상태는 Zustand
const useUIStore = create((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
}));
```

### 4. 컴포넌트 규칙 (🟠 중간 우선순위)

#### 서버/클라이언트 컴포넌트

```typescript
// ❌ 불필요한 "use client" 선언
"use client";

export function StaticCard({ title }: { title: string }) {
  return <div>{title}</div>;  // 상호작용 없음
}

// ✅ 서버 컴포넌트로 유지
export function StaticCard({ title }: { title: string }) {
  return <div>{title}</div>;
}

// ✅ 클라이언트 컴포넌트가 필요한 경우
"use client";

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}
```

**"use client" 필요 조건:**
- useState, useEffect 사용
- 이벤트 핸들러 (onClick, onChange)
- 브라우저 API (window, document)

### 5. API 통신 규칙 (🟠 중간 우선순위)

```typescript
// ✅ axios 인스턴스 사용
import { api } from '@/lib/axios';

const { data } = await api.get('/users');

// ❌ 금지: axios 직접 import
import axios from 'axios';
const response = await axios.get('/api/users');

// ❌ 금지: fetch 사용
const response = await fetch('/api/users');

// ❌ 금지: 컴포넌트에서 에러 toast 중복 호출 (인터셉터에서 처리됨)
try {
  await api.post('/data', formData);
} catch (error) {
  toast.error('에러 발생!');  // 인터셉터와 중복!
}
```

### 6. 스타일링 규칙 (🟢 낮은 우선순위)

```tsx
// ✅ 디자인 토큰 사용
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">
<div className="rounded-md border border-border">

// ❌ 하드코딩 색상/반지름 금지
<div className="bg-[#fff3e0]">
<div className="text-[#333]">
<div className="rounded-[8px]">
```

### 7. ESLint 규칙 (🟢 낮은 우선순위)

| 규칙 | 레벨 | 설명 |
|------|------|------|
| `no-explicit-any` | warn | any 사용 경고 (허용) |
| `no-unused-vars` | error | 미사용 변수 금지 (_ prefix 예외) |
| `no-console` | error | console.log 금지 (warn, error 허용) |
| `prefer-const` | error | const 우선 사용 |
| `no-var` | error | var 완전 금지 |
| `eqeqeq` | error | === 필수 |

---

## 파일 네이밍 컨벤션

| 유형 | 패턴 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `CourseCard.tsx` |
| 훅 | camelCase + use prefix | `useCourseQuery.ts` |
| 타입 | `{domain}.type.ts` | `course.type.ts` |
| API | `{domain}Api.ts` | `courseApi.ts` |
| 스토어 | `{domain}.store.ts` | `cart.store.ts` |

---

## 리뷰 시 확인 체크리스트

```
□ Waterfall 제거
  □ 독립적인 API 호출에 Promise.all() 사용
  □ 동일 데이터는 같은 queryKey로 캐시 공유
  □ 독립적인 종속 쿼리는 병렬 실행 확인

□ 로딩 상태 관리
  □ 병렬 쿼리 시 모든 isLoading 상태 통합
  □ 기본값(= [])과 isLoading 함께 사용

□ 상태 관리 분리
  □ 서버 상태 → TanStack Query
  □ 클라이언트 상태 → Zustand
  □ API 응답을 Zustand에 저장하지 않음

□ 컴포넌트 규칙
  □ 불필요한 "use client" 없음
  □ 적절한 폴더에 위치

□ API 통신
  □ @/lib/axios 인스턴스 사용
  □ axios 직접 import 없음
  □ fetch() 사용 없음
  □ 에러 toast 중복 호출 없음

□ 스타일링
  □ 하드코딩 색상/반지름 없음
  □ 디자인 토큰 사용

□ ESLint
  □ console.log 없음
  □ var 사용 없음
  □ === 사용
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
- 07-performance-optimization.md
