'use client'

import { toast } from 'sonner'

type Provider = 'google' | 'github'

export function useOAuthUrls() {
  // OAuth (Google / GitHub)
  const oauthRedirectUri = (() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? (typeof window !== 'undefined' ? window.location.origin : '')
    return {
      google: `${baseUrl}/auth/oauth/callback/google`,
      github: `${baseUrl}/auth/oauth/callback/github`,
    }
  })()

  const createOAuthState = (provider: Provider) => {
    if (typeof window === 'undefined') return null
    const key = `oauth_state_${provider}`
    const state =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID().replace(/-/g, '')
        : Math.random().toString(36).slice(2)
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

  const handleOAuthStart = (provider: Provider) => {
    const target = provider === 'google' ? googleAuthUrl : githubAuthUrl

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
    handleOAuthStart,
  }
}
