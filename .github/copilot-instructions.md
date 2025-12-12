# Copilot 지침 — sw-campus-client

요약: 이 파일은 AI 코딩 에이전트가 이 리포지토리에서 바로 생산적으로 작업할 수 있도록, 프로젝트 구조·빌드·패턴·통합 포인트를 요약합니다.

- **프로젝트 유형:** Next.js 16 앱 (App Router) — 서버·클라이언트 혼합, `output: 'standalone'`로 도커 최적화됨 ([next.config.ts](next.config.ts#L1)).
- **패키지 매니저 / 실행:** pnpm 권장. 주요 스크립트는 `dev`, `build`, `start` ([package.json](package.json#L1)).

핵심 구조 (빠른 요약)

- 앱 엔트리: `src/app` — App Router 레이아웃과 페이지가 위치합니다. 예: 로그인 페이지 [src/app/(auth)/login/page.tsx](<src/app/(auth)/login/page.tsx#L1>).
- API 통신: `src/lib/axios.ts`에서 `api` 인스턴스를 생성해 공통 인터셉터로 에러 토스트 처리를 수행합니다 ([src/lib/axios.ts](src/lib/axios.ts#L1)).
- 환경: 런타임 환경 변수는 `src/lib/env.ts`로 한 곳에서 검증/노출됩니다 — 반드시 여기서 사용되는 키를 확인하세요 ([src/lib/env.ts](src/lib/env.ts#L1)).
- 기능별 모듈: `src/features/*` 안에 API 호출과 검증 로직이 있으며, 예시는 `src/features/auth/authApi.ts`입니다 ([src/features/auth/authApi.ts](src/features/auth/authApi.ts#L1)).
- 상태 관리: 전역 클라이언트 상태는 `zustand`를 사용합니다. 예: `src/store/authStore.ts` ([src/store/authStore.ts](src/store/authStore.ts#L1)).

중요 개발 워크플로우 (AI가 직접 실행하거나 제안 시 따를 것)

- 로컬 개발: `pnpm dev` → Next.js 개발서버(포트 3000 기본) ([README.md](README.md#L1)).
- 빌드: `pnpm build` (Next 빌드). `next.config.ts`가 `eslint`/`typescript` 빌드 에러를 무시하도록 설정되어 있으므로 변경 시 주의.
- 환경 변수: `src/lib/env.ts`에서 필수 변수를 강제함 — `NEXT_PUBLIC_API_URL` 등 누락 시 런타임 에러 발생.

프로젝트 고유 패턴 / 규칙

- API 호출은 항상 `src/lib/axios.ts`의 `api`를 통해 수행. 공통 에러 메시지/토스트는 인터셉터에서 처리되므로 개별 컴포넌트에서는 중복 에러 UI를 만들 필요가 적음 ([src/lib/axios.ts](src/lib/axios.ts#L1)).
- 파일 업로드(기관 회원가입)는 `FormData`를 사용해 multipart 전송 구현([src/features/auth/authApi.ts](src/features/auth/authApi.ts#L1)).
- OAuth flow: 클라이언트에서 `NEXT_PUBLIC_*_CLIENT_ID` 환경변수로 인증 URL을 생성하고, 리다이렉트는 앱 라우트(예: `/auth/oauth/callback/*`)로 받음 ([src/app/(auth)/login/page.tsx](<src/app/(auth)/login/page.tsx#L1>)).
- 전역 상태는 `zustand`로 작고 단순하게 유지: 로그인 플래그와 이름만 관리([src/store/authStore.ts](src/store/authStore.ts#L1)).

통합 포인트 / 외부 의존성

- 백엔드 API: `NEXT_PUBLIC_API_URL` 환경변수로 지정되는 도메인과 쿠키 기반 인증 사용(요청에 `withCredentials: true`) — CORS·쿠키 정책 유의([src/lib/axios.ts](src/lib/axios.ts#L1), [src/lib/env.ts](src/lib/env.ts#L1)).
- OAuth 제공자: Google, GitHub 클라이언트 ID가 클라이언트 환경변수로 필요 ([src/app/(auth)/login/page.tsx](<src/app/(auth)/login/page.tsx#L1>)).

작업 시 유의사항 (AI 에이전트 전용)

- 절대경로 별칭: 코드에서 `@/`를 사용하므로 편집/추가 시 동일 규칙을 따르세요.
- 환경 변경은 `src/lib/env.ts` 영향 범위를 확인 후 적용 — 누락 시 앱이 강제 종료될 수 있음.
- `next.config.ts`에 `standalone` 출력 설정이 있어 Docker화/배포 관련 파일 변경 시 빌드 산출물을 고려하세요.
- ESLint/TypeScript 빌드 규칙을 로컬에서 엄격하게 적용하려면 `next.config.ts`의 `ignoreDuringBuilds`/`ignoreBuildErrors` 설정을 변경해야 함 — PR로 제안 시 팀 합의 필요.

예시 PR 체크리스트 (짧음)

- 변경 파일에서 `@/` import가 깨지지 않는지 확인.
- 환경변수(`NEXT_PUBLIC_API_URL`, OAuth 클라이언트 ID 등) 의존성이 문서화/README에 반영되었는지 확인.
- 네트워크 호출은 반드시 `src/lib/axios.ts`의 `api`를 사용하도록 리팩토링.

질문/피드백: 이 초안에 누락된 프로젝트 규칙(예: monorepo 정책, 배포 파이프라인, 테스트 명령)이 있으면 알려주세요. 명확히 하면 바로 반영하겠습니다.
