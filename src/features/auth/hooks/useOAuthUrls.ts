'use client'

import { useCallback, useMemo } from 'react'

import { toast } from 'sonner'

type Provider = 'google' | 'github'

export function useOAuthUrls() {
  // OAuth (Google / GitHub)
  const oauthRedirectUri = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? (typeof window !== 'undefined' ? window.location.origin : '')
    return {
      google: `${baseUrl}/auth/oauth/callback/google`,
      github: `${baseUrl}/auth/oauth/callback/github`,
    }
  }, [])

  const googleAuthUrl = useMemo(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) return null

    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    url.searchParams.set('client_id', clientId)
    url.searchParams.set('redirect_uri', oauthRedirectUri.google)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('scope', 'openid email profile')

    return url.toString()
  }, [oauthRedirectUri.google])

  const githubAuthUrl = useMemo(() => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
    if (!clientId) return null

    const url = new URL('https://github.com/login/oauth/authorize')
    url.searchParams.set('client_id', clientId)
    url.searchParams.set('redirect_uri', oauthRedirectUri.github)
    url.searchParams.set('scope', 'read:user user:email')

    return url.toString()
  }, [oauthRedirectUri.github])

  const handleOAuthStart = useCallback(
    (provider: Provider) => {
      const target = provider === 'google' ? googleAuthUrl : githubAuthUrl

      if (!target) {
        toast.error('OAuth 환경변수(NEXT_PUBLIC_*_CLIENT_ID)가 설정되지 않았어요.')
        return
      }

      window.location.href = target
    },
    [googleAuthUrl, githubAuthUrl],
  )

  return {
    oauthRedirectUri,
    googleAuthUrl,
    githubAuthUrl,
    handleOAuthStart,
  }
}
