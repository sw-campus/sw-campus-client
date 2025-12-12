'use client'

import { FormEvent, useCallback, useMemo, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaGoogle, FaGithub } from 'react-icons/fa'

import { login as loginApi } from '@/features/auth/authApi'
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
    // 필요 시 동의 화면을 항상 띄우려면 아래 주석 해제
    // url.searchParams.set('prompt', 'consent')
    // refresh token 필요하면 access_type=offline 고려
    // url.searchParams.set('access_type', 'offline')

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
        alert('OAuth 환경변수(NEXT_PUBLIC_*_CLIENT_ID)가 설정되지 않았어요.')
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

      if (data) {
        userName = (data as any).name ?? (data as any).nickname ?? userName
      }

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
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-white p-10">
            {/* 이메일 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">이메일</label>
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
              />
            </div>

            {/* 비밀번호 */}
            <div className="mb-3">
              <label className="mb-1 block text-neutral-700">비밀번호</label>
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
              />
            </div>

            {/* 아이디/비번 찾기 + 회원가입 */}
            <div className="mb-4 flex justify-between text-neutral-500">
              <button type="button" className="underline-offset-2 hover:underline">
                아이디/비밀번호 찾기
              </button>
              <Link href="/signup" className="underline-offset-2 hover:underline">
                회원가입
              </Link>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 h-9 w-full rounded-md bg-neutral-900 font-semibold text-white disabled:opacity-60"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>

            {/* 소셜 로그인 영역 */}
            {/* 하단 구글 / 깃허브 로고 */}
            <div className="mt-4 flex justify-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition hover:scale-105 hover:bg-neutral-100">
                <button
                  type="button"
                  onClick={() => handleOAuthStart('google')}
                  aria-label="Google로 로그인"
                  className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition hover:scale-105 hover:bg-neutral-100"
                >
                  <FaGoogle className="text-red-500" size={18} />
                </button>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition hover:scale-105 hover:bg-neutral-100">
                <button
                  type="button"
                  onClick={() => handleOAuthStart('github')}
                  aria-label="GitHub로 로그인"
                  className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition hover:scale-105 hover:bg-neutral-100"
                >
                  <FaGithub className="text-black" size={18} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
