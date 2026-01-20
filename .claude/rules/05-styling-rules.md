# 05. 스타일링

> TailwindCSS 4 기반 스타일링 규칙 및 디자인 토큰 사용법

---

## 1. TailwindCSS 4 설정

### 1.1 OKLCH 색상 시스템

TailwindCSS 4에서는 **OKLCH** 색상 공간을 사용합니다:
- `oklch(Lightness Chroma Hue)`
- 더 균일한 색상 지각 제공
- 접근성 향상

---

## 2. 디자인 토큰 사용 규칙

### 2.1 색상 토큰

```tsx
// ✅ 올바른 사용
<div className="bg-background text-foreground">
<div className="bg-muted text-muted-foreground">
<div className="bg-primary text-primary-foreground">
<div className="bg-secondary text-secondary-foreground">
<div className="border border-border">
<input className="bg-input focus:ring-ring">

// ❌ 금지: 하드코딩 색상
<div className="bg-[#fff3e0]">      {/* 하드코딩 금지 */}
<div className="text-[#333]">       {/* 하드코딩 금지 */}
<div className="bg-[rgb(255,255)]"> {/* 하드코딩 금지 */}
```

### 2.2 반지름 토큰

```tsx
// ✅ 올바른 사용
<div className="rounded-sm">   {/* --radius-sm */}
<div className="rounded-md">   {/* --radius-md */}
<div className="rounded-lg">   {/* --radius-lg */}
<div className="rounded-xl">   {/* --radius-xl */}
<div className="rounded-full"> {/* 원형 */}

// ❌ 금지: 임의 값
<div className="rounded-[8px]">    {/* 임의 값 금지 */}
<div className="rounded-[0.5rem]"> {/* 임의 값 금지 */}
```

### 2.3 주요 색상 토큰 매핑

| 토큰 | 용도 |
|------|------|
| `background` | 페이지 배경 |
| `foreground` | 기본 텍스트 |
| `card` / `card-foreground` | 카드 컴포넌트 |
| `popover` / `popover-foreground` | 팝오버, 드롭다운 |
| `primary` / `primary-foreground` | 주요 버튼, 강조 요소 |
| `secondary` / `secondary-foreground` | 보조 버튼 |
| `muted` / `muted-foreground` | 비활성화된 텍스트, 배경 |
| `accent` / `accent-foreground` | 하이라이트 요소 |
| `destructive` | 삭제, 오류 (빨간색 계열) |
| `border` | 테두리 |
| `input` | 입력 필드 배경 |
| `ring` | 포커스 링 |

---

## 3. 반응형 디자인

### 3.1 브레이크포인트

```tsx
// TailwindCSS 4 기본 브레이크포인트
// sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px

<div className="w-full md:w-1/2 lg:w-1/3">
  {/* 모바일: 100%, 태블릿: 50%, 데스크톱: 33% */}
</div>

<div className="flex flex-col md:flex-row">
  {/* 모바일: 세로 정렬, 태블릿 이상: 가로 정렬 */}
</div>
```

### 3.2 컨테이너

```tsx
// ✅ 올바른 사용
<div className="container mx-auto px-4">

// 또는 최대 너비 지정
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

---

## 4. shadcn/ui 컴포넌트 스타일링

### 4.1 cn 유틸리티 사용

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 4.2 컴포넌트에서 사용

```tsx
// 기본 스타일 + 커스텀 스타일 병합
import { cn } from "@/lib/utils";

<Button
  className={cn(
    "w-full",           // 커스텀 스타일
    isLoading && "opacity-50"
  )}
>
  Submit
</Button>
```

---

## 5. 금지 사항 요약

| 금지 | 대안 |
|------|------|
| `bg-[#fff3e0]` | `bg-muted` 또는 토큰 정의 |
| `text-[#333]` | `text-foreground` |
| `rounded-[8px]` | `rounded-md` |
| `text-[14px]` | `text-sm` |
| `p-[10px]` | `p-2.5` |
| 인라인 style 속성 | Tailwind 클래스 |

---

## 6. 스타일링 체크리스트

```
□ 하드코딩 색상 없음 (bg-[#xxx], text-[#xxx])
□ 하드코딩 반지름 없음 (rounded-[Npx])
□ 디자인 토큰 사용 (bg-background, text-foreground 등)
□ cn 유틸리티로 클래스 병합
□ 반응형 브레이크포인트 적용
□ OKLCH 색상 시스템 이해
```
