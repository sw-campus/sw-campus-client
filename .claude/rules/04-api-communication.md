# 04. API 통신

> Axios 인스턴스 사용 규칙 및 에러 처리 전략

---

## 1. Axios 인스턴스 설정

### 1.1 기본 인스턴스

```typescript
// src/lib/axios.ts
import axios from 'axios';
import { env } from './env';

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,  // 쿠키 인증 필수
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 1.2 핵심 규칙

| 규칙 | 상태 | 설명 |
|------|------|------|
| `api` 인스턴스 사용 | ✅ 필수 | `src/lib/axios.ts`의 인스턴스만 사용 |
| `withCredentials: true` | ✅ 필수 | 쿠키 기반 인증에 필요 |
| axios 직접 import | ❌ 금지 | 새 인스턴스 생성 금지 |
| fetch() 사용 | ❌ 금지 | 쿠키 인증 누락 위험 |
| baseURL 하드코딩 | ❌ 금지 | 환경변수 사용 필수 |

### 1.3 사용 예시

```typescript
// ✅ 올바른 사용
import { api } from '@/lib/axios';

const { data } = await api.get('/users');
await api.post('/users', { name: 'John' });

// ❌ 금지: axios 직접 import
import axios from 'axios';
const response = await axios.get('/api/users');

// ❌ 금지: fetch 사용
const response = await fetch('/api/users');

// ❌ 금지: 새 인스턴스 생성
const customApi = axios.create({ baseURL: 'http://...' });
```

---

## 2. 인터셉터 설정

### 2.1 응답 인터셉터 (에러 처리)

```typescript
// src/lib/axios.ts
import { toast } from 'sonner';

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 toast는 여기서만 처리
    const message = error.response?.data?.message || '오류가 발생했습니다.';

    // 특정 상태 코드별 처리
    switch (error.response?.status) {
      case 401:
        toast.error('로그인이 필요합니다.');
        break;
      case 403:
        toast.error('접근 권한이 없습니다.');
        break;
      case 404:
        toast.error('요청한 리소스를 찾을 수 없습니다.');
        break;
      case 500:
        toast.error('서버 오류가 발생했습니다.');
        break;
      default:
        toast.error(message);
    }

    return Promise.reject(error);
  }
);
```

---

## 3. 에러 처리 규칙

### 3.1 금지 사항

```typescript
// ❌ 컴포넌트에서 toast 중복 호출
function MyComponent() {
  const handleSubmit = async () => {
    try {
      await api.post('/data', formData);
    } catch (error) {
      toast.error('에러 발생!');  // 인터셉터와 중복!
    }
  };
}

// ❌ Hook에서 toast 호출
export function useAddToCart() {
  return useMutation({
    mutationFn: (data) => api.post('/cart', data),
    onError: () => {
      toast.error('장바구니 추가 실패');  // 인터셉터와 중복!
    },
  });
}
```

### 3.2 올바른 패턴

```typescript
// ✅ 에러 처리는 인터셉터에 위임
function MyComponent() {
  const mutation = useAddToCart();

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync(formData);
      toast.success('장바구니에 추가되었습니다.');  // 성공 toast만
    } catch (error) {
      // 에러 toast는 인터셉터에서 처리됨
      // 필요시 추가 로직만 작성 (폼 리셋, 상태 변경 등)
    }
  };
}

// ✅ Mutation에서는 성공 처리만
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/cart', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      // 성공 toast는 컴포넌트에서 처리
    },
    // onError 불필요 (인터셉터에서 처리)
  });
}
```

---

## 4. 인증/토큰 관리

### 4.1 Authorization Header 규칙

```typescript
// ✅ 인터셉터에서만 Authorization header 추가
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ❌ 컴포넌트에서 직접 header 설정
await api.get('/users', {
  headers: { Authorization: `Bearer ${token}` }  // 금지!
});
```

---

## 5. 환경변수 관리

```typescript
// src/lib/env.ts

// 필수 환경변수 검증 - 없으면 에러 발생
const required = (value: string | undefined, key: string): string => {
  if (!value) throw new Error(`Missing env: ${key}`)
  return value
}

export const env = {
  NODE_ENV: required(process.env.NODE_ENV, 'NODE_ENV'),
  isProd: process.env.NODE_ENV === 'production',
  isLocal: process.env.NODE_ENV === 'development',

  NEXT_PUBLIC_API_URL: required(process.env.NEXT_PUBLIC_API_URL, 'NEXT_PUBLIC_API_URL'),
}
```

**규칙:**
- ✅ 필수 환경변수는 `required()` 함수로 검증
- ✅ `env.isProd`, `env.isLocal`로 환경 판단
- ❌ 환경변수 직접 접근 금지 (`process.env.XXX`)

---

## 6. API 통신 체크리스트

```
□ api 인스턴스 import 경로: @/lib/axios
□ withCredentials: true 설정 확인
□ axios 직접 import 없음
□ fetch() 사용 없음
□ baseURL 하드코딩 없음
□ 컴포넌트/훅에서 에러 toast 중복 호출 없음
□ Authorization header는 인터셉터에서만 추가
□ 환경변수로 API URL 관리
```
