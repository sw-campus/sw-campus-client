# 09. 네이밍 컨벤션

> 파일명, 변수, 함수, 타입 등 일관된 네이밍 규칙

---

## 1. 파일/폴더 네이밍 (kebab-case)

### 1.1 파일명 규칙

| 유형 | 패턴 | 예시 |
|------|------|------|
| 컴포넌트 | `kebab-case.tsx` | `course-card.tsx` |
| 훅 | `use-{name}.ts` | `use-course-query.ts` |
| API | `{domain}-api.ts` | `course-api.ts` |
| 타입 | `{domain}.type.ts` | `course.type.ts` |
| 스토어 | `{domain}.store.ts` | `cart.store.ts` |
| 유틸리티 | `kebab-case.ts` | `format-date.ts` |

### 1.2 폴더명 규칙

```
src/
├── features/
│   └── my-page/           # kebab-case
│       ├── components/
│       │   └── activity-summary.tsx
│       └── hooks/
│           └── use-activity-query.ts
```

**규칙:**
- ✅ 모든 파일/폴더명은 kebab-case
- ✅ 타입 파일은 `.type.ts` 접미사
- ✅ 스토어 파일은 `.store.ts` 접미사
- ❌ PascalCase 파일명 금지 (`CourseCard.tsx`)
- ❌ camelCase 파일명 금지 (`courseApi.ts`)

---

## 2. 코드 내 네이밍

### 2.1 컴포넌트 export (PascalCase)

```typescript
// 파일: course-card.tsx
export function CourseCard({ course }: CourseCardProps) {
  return <div>{course.title}</div>
}

// 파일: use-course-query.ts
export function useCourseQuery(courseId: number) {
  return useQuery({ ... })
}
```

### 2.2 변수 (camelCase)

```typescript
// ✅ 올바른 예
const userName = 'John'
const isLoading = true
const cartItems = []

// ❌ 잘못된 예
const user_name = 'John'  // snake_case 금지
const UserName = 'John'   // PascalCase 금지
```

### 2.3 상수 (UPPER_SNAKE_CASE)

```typescript
// ✅ 올바른 예
const MAX_RETRY_COUNT = 3
const API_TIMEOUT = 5000
const DEFAULT_PAGE_SIZE = 10

// ❌ 잘못된 예
const maxRetryCount = 3   // camelCase 금지
const max_retry_count = 3 // lower_snake_case 금지
```

### 2.4 함수 (camelCase + 동사)

```typescript
// ✅ 올바른 예
function fetchUserData() { }
function handleClick() { }
function validateForm() { }
function formatDate() { }

// ❌ 잘못된 예
function userData() { }     // 동사 없음
function FetchUserData() { } // PascalCase 금지
```

### 2.5 타입/인터페이스 (PascalCase)

```typescript
// ✅ 올바른 예
interface User { }
interface LectureResponse { }
type CartItem = { }

// ❌ 잘못된 예
interface IUser { }          // I prefix 금지
interface user { }           // camelCase 금지
interface LECTURE_RESPONSE { } // UPPER_SNAKE 금지
```

---

## 3. 특수 컨텍스트 규칙

### 3.1 환경변수

```bash
# UPPER_SNAKE_CASE
NEXT_PUBLIC_API_URL=https://api.example.com
GEMINI_API_KEY=xxx
```

### 3.2 Query Params / URL

```typescript
// kebab-case (URL 표준)
const url = '/api/user-profile?page-size=10'
```

### 3.3 Storage Keys

```typescript
// kebab-case
localStorage.setItem('auth-token', token)
localStorage.setItem('user-preferences', JSON.stringify(prefs))
```

### 3.4 Query Keys

```typescript
// camelCase 배열
const queryKey = ['userProfile', userId]
const queryKey = ['cartItems', { page: 1 }]
```

---

## 4. 네이밍 요약표

| 대상 | 규칙 | 예시 |
|------|------|------|
| 파일/폴더명 | kebab-case | `course-card.tsx` |
| 컴포넌트 export | PascalCase | `CourseCard` |
| 변수 | camelCase | `userName` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 함수 | camelCase + 동사 | `fetchUserData()` |
| 타입/인터페이스 | PascalCase (I prefix 없음) | `User`, `LectureResponse` |
| 환경변수 | UPPER_SNAKE_CASE | `NEXT_PUBLIC_API_URL` |
| Query Params | kebab-case | `page-size` |
| Storage Keys | kebab-case | `auth-token` |
| Query Keys | camelCase 배열 | `['userProfile', userId]` |

---

## 5. 마이그레이션 정책

### 5.1 적용 범위

- **새 파일**: kebab-case 적용 필수
- **기존 파일**: 별도 리팩토링 PR로 진행

### 5.2 호환성

기존 코드와의 호환성을 위해:
- 기존 PascalCase 파일은 당장 변경하지 않음
- 새로 생성하는 파일부터 kebab-case 적용
- 파일명 변경 시 import 경로도 함께 수정

---

## 6. 네이밍 체크리스트

```
□ 파일/폴더명
  □ 새 파일은 kebab-case 사용
  □ 타입 파일은 .type.ts 접미사
  □ 스토어 파일은 .store.ts 접미사

□ 코드 내 네이밍
  □ 컴포넌트 export는 PascalCase
  □ 변수는 camelCase
  □ 상수는 UPPER_SNAKE_CASE
  □ 함수는 camelCase + 동사
  □ 타입/인터페이스는 PascalCase (I prefix 없음)

□ 특수 컨텍스트
  □ 환경변수는 UPPER_SNAKE_CASE
  □ Query Params는 kebab-case
  □ Storage Keys는 kebab-case
```
