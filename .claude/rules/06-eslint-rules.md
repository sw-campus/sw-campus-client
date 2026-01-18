# 06. ESLint 규칙

> TypeScript 및 JavaScript 코드 품질 규칙

---

## 1. 규칙 개요

### 1.1 기본 설정

```javascript
// eslint.config.mjs
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "warn",        // any 경고
      "@typescript-eslint/no-unused-vars": ["error", {     // 미사용 변수
        argsIgnorePattern: "^_",                           // _ prefix 허용
        varsIgnorePattern: "^_",
      }],

      // JavaScript
      "no-console": ["warn", {                            // console.log 금지
        allow: ["warn", "error"],                          // warn, error 허용
      }],
      "prefer-const": "error",                             // const 우선
      "no-var": "error",                                   // var 금지
      "eqeqeq": ["error", "always"],                       // === 필수

      // Next.js
      "@next/next/no-html-link-for-pages": "off",          // <a> 허용
    },
  },
];
```

---

## 2. TypeScript 규칙

### 2.1 any 타입 사용

```typescript
// ⚠️ 경고 (허용되지만 지양)
const fetchData = async (): Promise<any> => {
  const result = await api.get('/test');
  return result;
};

// ✅ 권장: 타입 명시
interface User {
  id: string;
  name: string;
}

const fetchData = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>('/users');
  return data;
};
```

**규칙:**
- `any` 사용 시 **경고**만 표시 (에러 아님)
- 가능하면 구체적인 타입 사용 권장

### 2.2 미사용 변수

```typescript
// ❌ 에러: 사용하지 않는 변수
const unused = 'value';

// ✅ 허용: _ prefix 사용
const _unused = 'value';

// ✅ 허용: 함수 매개변수에 _ prefix
const handleClick = (_event: MouseEvent) => {
  // event를 사용하지 않지만 시그니처 유지 필요
};
```

---

## 3. JavaScript 규칙

### 3.1 console 사용

```typescript
// ❌ 에러: console.log 금지
console.log('debug');
console.log('데이터:', data);

// ✅ 허용: warn, error
console.warn('경고 메시지');
console.error('에러 발생:', error);
```

### 3.2 변수 선언

```typescript
// ❌ 에러: var 금지 (완전 금지)
var x = 10;

// ❌ 에러: 재할당 없는 let
let y = 20;
console.warn(y);  // y가 변경되지 않음

// ✅ const 사용 (재할당 없을 때)
const y = 20;

// ✅ let 사용 (재할당 필요할 때)
let count = 0;
count += 1;
```

### 3.3 비교 연산자

```typescript
// ❌ 에러: 느슨한 비교
if (a == '1') { }
if (b != null) { }

// ✅ 엄격한 비교 필수
if (a === '1') { }
if (b !== null) { }
```

---

## 4. 규칙 요약표

| 규칙 | 레벨 | 설명 |
|------|------|------|
| `@typescript-eslint/no-explicit-any` | warn | any 사용 경고 (허용) |
| `@typescript-eslint/no-unused-vars` | error | 미사용 변수 금지 (_ prefix 예외) |
| `no-console` | error | console.log 금지 (warn, error 허용) |
| `prefer-const` | error | const 우선 사용 |
| `no-var` | error | var 완전 금지 |
| `eqeqeq` | error | === 필수 |
| `@next/next/no-html-link-for-pages` | off | `<a>` 태그 허용 |

---

## 5. 허용/금지 예시 모음

### 5.1 허용되는 코드

```typescript
// any 경고는 있지만 허용
const fetchData = async () => {
  const result: any = await api.get('/test');
  return result;
};

// _ prefix로 미사용 변수 허용
const handleClick = (_event: MouseEvent) => {
  doSomething();
};

// console.warn, console.error 허용
console.warn('주의: 데이터가 없습니다');
console.error('오류:', error);

// <a> 태그 허용
<a href="/external" target="_blank">External Link</a>
```

### 5.2 금지되는 코드

```typescript
// ❌ let 불필요 사용
let x = 10;  // 재할당 없으면 const로

// ❌ var 금지
var y = 3;

// ❌ console.log 금지
console.log('debug');

// ❌ 느슨한 비교 금지
if (a == '1') { }

// ❌ 미사용 변수 (prefix 없음)
const unused = 'value';
```

---

## 6. ESLint 체크리스트

```
□ any 사용 최소화 (경고 확인)
□ 미사용 변수에 _ prefix 추가 또는 제거
□ console.log 제거 (warn, error만 사용)
□ const 사용 (재할당 없을 때)
□ var 사용 없음
□ === / !== 사용 (== / != 금지)
□ ESLint 경고/에러 0개 확인
```
