'use client'

import { FormEvent, useCallback, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { login as loginApi } from '@/features/auth/authApi'
import { LoginFormCard } from '@/features/auth/components/LoginFormCard'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const { login: setLogin } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // OAuth (Google / GitHub)
  const oauthRedirectUri = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? (typeof window !== 'undefined' ? window.location.origin : '')
    return {
      google: `${baseUrl}/auth/oauth/callback/google`,
      github: `${baseUrl}/auth/oauth/callback/github`,
    }
  }, [])

  // 구글
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

  // 깃허브
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
    (provider: 'google' | 'github') => {
      const target = provider === 'google' ? googleAuthUrl : githubAuthUrl

      if (!target) {
        toast.error('OAuth 환경변수(NEXT_PUBLIC_*_CLIENT_ID)가 설정되지 않았어요.')
        return
      }

      window.location.href = target
    },
    [googleAuthUrl, githubAuthUrl],
  )

  // 로그인 전송
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }

    try {
      setIsLoading(true)

      // authApi를 통한 로그인 요청
      const data = await loginApi({ email, password })

      // 응답에 유저 정보가 있을 경우 대비
      let userName = email.split('@')[0]

      if (data) userName = (data as any).name ?? (data as any).nickname ?? userName

      setLogin(userName)

      // 로그인 성공 후 메인으로 이동
      router.push('/')
    } catch (error) {
      console.error(error)
      alert('이메일 또는 비밀번호를 다시 확인해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 전체 로그인 영역*/}
      <section className="flex min-h-[500px] w-full items-center justify-center px-6 py-10">
        {/* 가운데 로그인 카드 */}
        <div className="relative z-10 flex w-full items-center justify-center">
          <LoginFormCard
            email={email}
            password={password}
            isLoading={isLoading}
            onChangeEmail={setEmail}
            onChangePassword={setPassword}
            onSubmit={handleSubmit}
            onOAuthStart={handleOAuthStart}
            signupHref="/signup"
            onFindAccountClick={() => {
              toast.message('아이디/비밀번호 찾기 기능은 아직 연결되지 않았어요.')
            }}
          />
        </div>
      </section>
    </div>
  )
}
