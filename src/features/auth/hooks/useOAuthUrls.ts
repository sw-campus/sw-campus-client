'use client'

import { toast } from 'sonner'

export type Provider = 'google' | 'github' | 'kakao'

export function useOAuthUrls() {
  // OAuth (Google / GitHub / Kakao)
  const oauthRedirectUri = (() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? (typeof window !== 'undefined' ? window.location.origin : '')
    return {
      google: `${baseUrl}/auth/oauth/callback/google`,
      github: `${baseUrl}/auth/oauth/callback/github`,
      kakao: `${baseUrl}/auth/oauth/callback/kakao`,
    }
  })()

  const createOAuthState = (provider: Provider) => {
    if (typeof window === 'undefined') return null
    const key = `oauth_state_${provider}`

    // 🔒 보안: 암호학적으로 안전한 난수 생성
    let state: string
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      // 최신 브라우저: crypto.randomUUID() 사용
      state = crypto.randomUUID().replace(/-/g, '')
    } else if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
      // 구형 브라우저 fallback: crypto.getRandomValues() 사용
      const array = new Uint8Array(16)
      crypto.getRandomValues(array)
      state = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    } else {
      // 극히 드문 환경: 경고 로그 후 빈 state 반환 (OAuth 진행은 가능)
      console.warn('crypto API not available for secure state generation')
      return null
    }

    try {
      sessionStorage.setItem(key, state)
    } catch {
      // ignore storage failures (private mode, etc.)
    }
    return state
  }

  const googleAuthUrl = (() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) return null

    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    url.searchParams.set('client_id', clientId)
    url.searchParams.set('redirect_uri', oauthRedirectUri.google)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('scope', 'openid email profile')
    const state = createOAuthState('google')
    if (state) url.searchParams.set('state', state)
    url.searchParams.set('include_granted_scopes', 'true')

    return url.toString()
  })()

  const githubAuthUrl = (() => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
    if (!clientId) return null

    const url = new URL('https://github.com/login/oauth/authorize')
    url.searchParams.set('client_id', clientId)
    url.searchParams.set('redirect_uri', oauthRedirectUri.github)
    url.searchParams.set('scope', 'read:user user:email')
    const state = createOAuthState('github')
    if (state) url.searchParams.set('state', state)
    url.searchParams.set('allow_signup', 'true')

    return url.toString()
  })()

  const kakaoAuthUrl = (() => {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
    if (!clientId) return null

    const url = new URL('https://kauth.kakao.com/oauth/authorize')
    url.searchParams.set('client_id', clientId)
    url.searchParams.set('redirect_uri', oauthRedirectUri.kakao)
    url.searchParams.set('response_type', 'code')
    const state = createOAuthState('kakao')
    if (state) url.searchParams.set('state', state)

    return url.toString()
  })()

  const handleOAuthStart = (provider: Provider) => {
    const targets = {
      google: googleAuthUrl,
      github: githubAuthUrl,
      kakao: kakaoAuthUrl,
    }
    const target = targets[provider]

    if (!target) {
      toast.error('OAuth 환경변수(NEXT_PUBLIC_*_CLIENT_ID)가 설정되지 않았어요.')
      return
    }

    window.location.href = target
  }

  return {
    oauthRedirectUri,
    googleAuthUrl,
    githubAuthUrl,
    kakaoAuthUrl,
    handleOAuthStart,
  }
}
