import axios, { AxiosHeaders } from 'axios'
import { toast } from 'sonner'

import { useAuthStore } from '@/store/authStore'

import { env } from './env'

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10_000,
})

// A lightweight client without interceptors for refresh calls
const refreshClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10_000,
})

// 401/토큰만료 시 중복 로그아웃/토스트/리다이렉트를 막기 위한 플래그
let isHandlingUnauthorized = false
let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

function isAuthExpired(status?: number, errorCode?: string) {
  const normalized = String(errorCode ?? '').toUpperCase()
  return (
    status === 401 ||
    status === 419 ||
    status === 440 ||
    status === 498 ||
    normalized === 'AUTH_TOKEN_EXPIRED' ||
    normalized === 'TOKEN_EXPIRED' ||
    normalized === 'AUTH_EXPIRED' ||
    normalized === 'INVALID_TOKEN'
  )
}

function extractAccessToken(data: unknown): string | null {
  const get = (obj: unknown, path: string[]): unknown => {
    let cur: unknown = obj
    for (const key of path) {
      if (cur && typeof cur === 'object' && key in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[key]
      } else return undefined
    }
    return cur
  }

  const candidates = [
    get(data, ['accessToken']),
    get(data, ['access_token']),
    get(data, ['token']),
    get(data, ['data', 'accessToken']),
  ]
  const found = candidates.find(v => typeof v === 'string' && v.length > 0)
  return (found as string) ?? null
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    // 서버가 HttpOnly refresh cookie를 사용하는 전제
    const res = await refreshClient.post('/auth/refresh', {})
    const newToken = extractAccessToken(res.data)
    if (newToken) {
      try {
        const state = useAuthStore.getState()
        state.setAuth(newToken, state.userType)
      } catch {
        // ignore
      }

      // Update default Authorization header using AxiosHeaders API when available
      try {
        const common = api.defaults?.headers?.common as unknown as AxiosHeaders | undefined
        if (common && typeof common.set === 'function') common.set('Authorization', `Bearer ${newToken}`)
      } catch {
        // ignore
      }

      return newToken
    }
    return null
  } catch {
    return null
  }
}

type ClearAuthOptions = {
  notify?: boolean
  redirectToLogin?: boolean
}

function clearAuthState(options: ClearAuthOptions = {}) {
  if (isHandlingUnauthorized) return
  isHandlingUnauthorized = true

  const { notify = true, redirectToLogin = true } = options

  try {
    // ✅ 1) Zustand 인증 상태 초기화
    let store = undefined as ReturnType<typeof useAuthStore.getState> | undefined
    try {
      store = useAuthStore.getState()
    } catch {
      // ignore: store may be unavailable in non-browser contexts
    }

    if (store) {
      if (typeof store.resetAuth === 'function') store.resetAuth()
      else if (typeof store.logout === 'function') store.logout()
    }

    // Ensure axios instance stops sending stale Authorization header
    try {
      const common = api.defaults?.headers?.common as unknown as AxiosHeaders | undefined
      common?.delete?.('Authorization')
    } catch {
      // ignore
    }

    // ✅ 2) persist 사용 시 로컬 저장소 정리(키가 다를 수 있어 후보 제거)
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('auth-storage')
        window.localStorage.removeItem('authStore')
        window.localStorage.removeItem('auth')
        // cross-tab broadcast (optional)
        window.localStorage.setItem('__auth_logout__', String(Date.now()))
      } catch {
        // ignore
      }

      // ✅ 3) 사용자 안내 + (선택) 로그인 이동
      if (notify) toast.error('세션이 만료되어 로그아웃되었습니다')
      if (redirectToLogin) {
        // 기본 로그인 경로. 필요 시 환경/라우팅에 맞게 조정
        window.location.replace('/login')
      }
    }
  } finally {
    // replace로 이동되지만, 테스트/특수 환경에서는 finally가 의미가 있어 유지
    isHandlingUnauthorized = false
  }
}

function isAuthPublicFlowRequest(url: string): boolean {
  // 회원가입/인증/중복검사 등: 로그인 상태가 없어도 호출되는 엔드포인트
  // - 여기서 401이 나더라도 "세션 만료"로 간주해 /login으로 보내면 UX가 깨짐
  return /\/auth\/(email|signup|oauth)/i.test(url) || /\/members\/nickname\/check/i.test(url)
}

function isOnAuthPublicPage(): boolean {
  if (typeof window === 'undefined') return false
  const path = window.location?.pathname ?? ''
  return path.startsWith('/signup') || path.startsWith('/login')
}

// Header 등에서 사용: 포커스/탭 복귀 시 세션을 조용히 점검
// - 세션 유효: 유지(+가능하면 nickname/userType 보정)
// - 세션 만료/무효: 인증 상태만 초기화(리다이렉트/토스트 없음)
export async function ensureSessionActive(): Promise<boolean> {
  try {
    const { isLoggedIn } = useAuthStore.getState()
    if (!isLoggedIn) return true

    // NOTE: 현재 서버 인증은 쿠키 기반(accessToken/refreshToken HttpOnly)일 수 있어
    // refresh 호출 실패만으로 로그아웃 처리하면(특히 로컬 http 환경에서 Secure 쿠키 미저장) 오탐이 발생할 수 있음.
    // 따라서 세션 확인은 실제 인증이 필요한 엔드포인트로 검증한다.
    type ProfileResponse = {
      nickname?: string | null
      role?: string | null
      userType?: string | null
    }

    const res = await refreshClient.get<ProfileResponse>('/mypage/profile')
    const profile = res?.data

    // 가능한 범위에서 헤더 표시용 값 보정
    try {
      const state = useAuthStore.getState()

      const nickname = typeof profile?.nickname === 'string' && profile.nickname.length > 0 ? profile.nickname : null
      if (!state.nickname && nickname) state.setNickname(nickname)

      const roleOrType = (profile?.userType ?? profile?.role ?? '')
      if (roleOrType === 'ORGANIZATION' || roleOrType === 'organization') state.setUserType('ORGANIZATION')
      else if (roleOrType) state.setUserType('PERSONAL')
    } catch {
      // ignore
    }

    return true
  } catch (err) {
    const status = (err as { response?: { status?: number } })?.response?.status
    if (status === 401 || status === 419 || status === 440 || status === 498) {
      clearAuthState({ notify: false, redirectToLogin: false })
      return false
    }
    // 네트워크/일시적 오류는 로그인 UI를 유지
    return true
  }
}

// 요청 인터셉터
api.interceptors.request.use(
  config => {
    // If an access token exists in the client store, attach it.
    try {
      const token = useAuthStore.getState().accessToken
      if (token) {
        const headers = AxiosHeaders.from(config.headers ?? {})
        headers.set('Authorization', `Bearer ${token}`)
        config.headers = headers
      } else if (config.headers) {
        // ensure no stale header is sent
        const headers = AxiosHeaders.from(config.headers)
        headers.delete('Authorization')
        config.headers = headers
      }
    } catch {
      // ignore: store may not be available in some environments
    }
    return config
  },
  error => {
    toast.error('요청 생성 중 오류 발생')
    return Promise.reject(error)
  },
)

// 응답 인터셉터
api.interceptors.response.use(
  response => response,
  error => {
    // ✅ 네트워크/타임아웃 등: response 자체가 없는 케이스
    if (!error.response) {
      const isTimeout =
        error.code === 'ECONNABORTED' ||
        String(error.message ?? '')
          .toLowerCase()
          .includes('timeout')
      toast.error(isTimeout ? '요청 시간이 초과되었습니다' : '네트워크 오류가 발생했습니다')
      return Promise.reject(error)
    }

    const status = error.response.status
    const message = error.response.data?.message
    const errorCode = error.response.data?.code
    const requestUrl: string = error.config?.url ?? ''

    const suppressUnauthorizedRedirect = isOnAuthPublicPage() || isAuthPublicFlowRequest(requestUrl)

    // ✅ 토큰 만료/인증 실패 → 자동 로그아웃 (확장된 상태/에러코드)
    // refresh/login/logout 호출 중에는 무시하여 루프 방지
    if (isAuthExpired(status, errorCode) && !/auth\/(refresh|logout|login)/i.test(requestUrl)) {
      // 회원가입/인증 플로우에서는 401이 나도 로그인으로 보내지 않는다.
      if (suppressUnauthorizedRedirect) return Promise.reject(error)

      const originalRequest = error.config || {}

      if (!isRefreshing) {
        isRefreshing = true
        refreshPromise = refreshAccessToken().finally(() => {
          isRefreshing = false
        })
      }

      return (refreshPromise as Promise<string | null>)
        .then(newToken => {
          if (!newToken) {
            clearAuthState({ notify: true, redirectToLogin: true })
            return Promise.reject(error)
          }
          // 새 토큰으로 원 요청 재시도
          if (originalRequest.headers) {
            const headersMaybe = originalRequest.headers as unknown as { set?: (k: string, v: string) => void }
            if (typeof headersMaybe.set === 'function') {
              ;(originalRequest.headers as unknown as AxiosHeaders).set('Authorization', `Bearer ${newToken}`)
            } else {
              originalRequest.headers = {
                ...(originalRequest.headers as Record<string, string>),
                Authorization: `Bearer ${newToken}`,
              }
            }
          } else {
            originalRequest.headers = { Authorization: `Bearer ${newToken}` }
          }
          return api.request(originalRequest)
        })
        .catch(err => {
          clearAuthState({ notify: true, redirectToLogin: true })
          return Promise.reject(err)
        })
    }

    // 공통 에러 처리
    if (status === 400) toast.error(message ?? '잘못된 요청입니다')
    if (status === 403) toast.error(message ?? '접근 권한이 없습니다')
    if (status === 404) toast.error(message ?? '요청한 리소스를 찾을 수 없습니다')
    if (status === 409) toast.error(message ?? '이미 처리된 요청입니다')
    if (status === 429) toast.error(message ?? '요청이 너무 많습니다. 잠시 후 다시 시도해주세요')
    if (status >= 500) toast.error(message ?? '서버 오류가 발생했습니다')

    return Promise.reject(error)
  },
)

// 이메일 인증 리다이렉트 URL 생성
export const getVerifyEmailRedirectUrl = (token: string, signupType: 'personal' | 'organization' = 'personal') => {
  const params = new URLSearchParams({
    token,
    type: signupType,
  })

  return `${env.NEXT_PUBLIC_API_URL}/auth/email/verify?${params.toString()}`
}
