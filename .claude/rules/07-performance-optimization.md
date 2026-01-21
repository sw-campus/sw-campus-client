# 07. 성능 최적화

> React 19 + Next.js 15 애플리케이션 성능 최적화 규칙

---

## 0. React 버전 및 자동 최적화 (CRITICAL)

### 현재 스택
- **React 19** + **React Compiler** (자동 메모이제이션)
- **Next.js 15** (App Router)

### useMemo / useCallback / React.memo 사용 금지

React 19의 React Compiler가 **자동으로 메모이제이션을 처리**하므로 수동 최적화 훅이 불필요합니다.

```typescript
// ❌ 금지: 수동 메모이제이션 (React Compiler가 자동 처리)
const sortedItems = useMemo(() => items.sort((a, b) => a.order - b.order), [items])
const handleClick = useCallback(() => doSomething(id), [id])
const MemoizedComponent = React.memo(MyComponent)

// ✅ 권장: 그냥 작성 (React Compiler가 최적화)
const sortedItems = [...items].sort((a, b) => a.order - b.order)
const handleClick = () => doSomething(id)
function MyComponent() { ... }
```

**규칙:**
- ❌ `useMemo` 사용 금지
- ❌ `useCallback` 사용 금지
- ❌ `React.memo` 사용 금지
- ✅ 일반 함수/변수로 작성 → Compiler가 필요 시 자동 최적화

**참고:** 배열 mutation 방지를 위한 `[...array].sort()`는 최적화가 아닌 **불변성 유지**이므로 계속 사용

---

## 1. Waterfall 제거 (CRITICAL)

### 1.1 Promise.all()로 병렬 실행

독립적인 async 작업은 순차 실행하지 말고 **병렬로 실행**합니다.

```typescript
// ❌ 잘못된 예: 순차 실행 (Waterfall)
export async function getLectureDetail(id: number) {
  const lecture = await axiosInstance.get(`/lectures/${id}`);
  const reviews = await axiosInstance.get(`/lectures/${id}/reviews`);
  const instructor = await axiosInstance.get(`/lectures/${id}/instructor`);
  // 총 소요시간: A + B + C (3번의 네트워크 왕복)
  return { lecture, reviews, instructor };
}

// ✅ 올바른 예: 병렬 실행
export async function getLectureDetail(id: number) {
  const [lecture, reviews, instructor] = await Promise.all([
    axiosInstance.get(`/lectures/${id}`),
    axiosInstance.get(`/lectures/${id}/reviews`),
    axiosInstance.get(`/lectures/${id}/instructor`),
  ]);
  // 총 소요시간: max(A, B, C) (1번의 네트워크 왕복)
  return { lecture, reviews, instructor };
}
```

**성능 개선**: 2-10배 향상 가능

---

### 1.2 React Query 캐시 공유로 중복 호출 제거

여러 컴포넌트에서 **동일한 데이터**가 필요하면 같은 queryKey를 사용합니다.

```typescript
// ❌ 잘못된 예: 각 컴포넌트에서 독립적으로 데이터 페칭
// ActivitySummary.tsx
const { data } = useQuery({
  queryKey: ['completedLectures-summary'],  // 다른 키
  queryFn: () => fetchCompletedLectures(),
})

// ReviewSection.tsx
const { data } = useQuery({
  queryKey: ['completedLectures-reviews'],  // 다른 키 → 중복 API 호출!
  queryFn: () => fetchCompletedLectures(),
})

// ✅ 올바른 예: 동일한 queryKey로 캐시 공유
// hooks/useCompletedLecturesQuery.ts
export function useCompletedLecturesQuery() {
  return useQuery({
    queryKey: ['completedLectures'],  // 동일한 키
    queryFn: () => fetchCompletedLectures(),
  })
}
```

**규칙:**
- ✅ 같은 데이터는 같은 queryKey 사용
- ✅ 공용 Query Hook으로 추상화
- ❌ 컴포넌트마다 다른 queryKey 사용 금지

---

## 2. 번들 최적화 (CRITICAL)

### 2.1 Barrel Import 주의

**Next.js 13.5+ 설정** (권장):

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns',
      'lodash',
    ],
  },
};
```

이 설정으로 barrel import를 사용해도 자동으로 직접 import로 변환됩니다.

### 2.2 Dynamic Import (next/dynamic)

무거운 컴포넌트는 **lazy-load**합니다.

```typescript
// ❌ 잘못된 예: 정적 import (초기 번들에 포함)
import { MonacoEditor } from '@/features/editor/components/MonacoEditor';

// ✅ 올바른 예: Dynamic import (필요 시 로드)
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(
  () => import('@/features/editor/components/MonacoEditor'),
  { ssr: false }  // 클라이언트에서만 로드
);
```

**Dynamic import가 필요한 경우:**
| 컴포넌트 | 이유 |
|----------|------|
| 에디터 (Monaco, CodeMirror) | 번들 사이즈 큼 (300KB+) |
| PDF 뷰어 | 브라우저 API 필요, 사이즈 큼 |
| 차트 라이브러리 | D3, Chart.js 등 무거움 |
| 지도 (Google Maps, Kakao) | 외부 스크립트 의존 |

---

## 3. Suspense 경계 전략 (HIGH)

데이터 로딩을 기다리지 않고 **정적 UI를 먼저 표시**합니다.

```typescript
// ✅ 올바른 예: Suspense로 점진적 로딩
import { Suspense } from 'react';

export default function LecturePage({ params }: Props) {
  return (
    <div>
      <Header />  {/* 즉시 표시 */}

      <Suspense fallback={<LectureContentSkeleton />}>
        <LectureContent lectureId={params.id} />
      </Suspense>

      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews lectureId={params.id} />
      </Suspense>

      <Footer />  {/* 즉시 표시 */}
    </div>
  );
}
```

**Suspense 배치 규칙:**
| 상황 | Suspense 사용 |
|------|--------------|
| 헤더, 푸터, 네비게이션 | ❌ 즉시 렌더 |
| 메인 콘텐츠 (데이터 의존) | ✅ Suspense 감싸기 |
| 사이드바 (데이터 의존) | ✅ Suspense 감싸기 |
| 댓글, 리뷰 섹션 | ✅ Suspense 감싸기 |

---

## 4. 상태 관리 최적화 (HIGH)

### 4.1 함수형 setState 사용

setState에서 이전 상태를 참조할 때 **함수형 업데이트**를 사용합니다.

```typescript
// ❌ 잘못된 예: 직접 상태 참조 (stale closure 위험)
const addItem = (newItem: Item) => {
  setItems([...items, newItem])  // items가 오래된 값일 수 있음
}

// ✅ 올바른 예: 함수형 업데이트
const addItem = (newItem: Item) => {
  setItems(prev => [...prev, newItem])  // 항상 최신 상태
}
```

### 4.2 지연 상태 초기화

비용이 큰 초기화는 **함수로 감싸서** 한 번만 실행되게 합니다.

```typescript
// ❌ 잘못된 예: 매 렌더마다 초기화 함수 실행
const [data, setData] = useState(expensiveComputation(items));

// ✅ 올바른 예: 함수로 감싸서 최초 1회만 실행
const [data, setData] = useState(() => expensiveComputation(items));
```

---

## 5. 성능 최적화 체크리스트

```
□ React Compiler 자동 최적화
  □ useMemo 사용 없음
  □ useCallback 사용 없음
  □ React.memo 사용 없음

□ Waterfall 제거
  □ 독립적인 API 호출에 Promise.all() 사용
  □ 동일 데이터는 같은 queryKey로 캐시 공유

□ 번들 최적화
  □ next.config.js에 optimizePackageImports 설정
  □ 무거운 컴포넌트에 next/dynamic 적용

□ 서버 컴포넌트 성능
  □ Suspense 경계로 점진적 로딩
  □ 클라이언트 컴포넌트에 필요한 props만 전달

□ 상태 관리 최적화
  □ setState에 함수형 업데이트 사용
  □ 비용 큰 초기화에 useState(() => ...) 사용
```
