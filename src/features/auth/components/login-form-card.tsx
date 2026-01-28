'use client'

import { FormEvent } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { SocialLoginButtons } from '@/features/auth/components/social-login-button'
import type { Provider } from '@/features/auth/hooks/use-o-auth-urls'

type LoginFormCardProps = {
  email: string
  password: string
  isLoading: boolean
  onChangeEmail: (v: string) => void
  onChangePassword: (v: string) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>
  onOAuthStart: (provider: Provider) => void
  signupHref: string
  onFindAccountClick: () => void
}

export function LoginFormCard({
  email,
  password,
  isLoading,
  onChangeEmail,
  onChangePassword,
  onSubmit,
  onOAuthStart,
  signupHref,
  onFindAccountClick,
}: LoginFormCardProps) {
  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col px-6">
      {/* 로고 & 헤더 */}
      <div className="mb-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-3 flex h-12 w-12 items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="SOFTWARE CAMPUS"
            width={48}
            height={48}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">로그인</h1>
      </div>

      {/* 폼 필드 */}
      <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-backwards">
        {/* 이메일 */}
        <div className="group relative">
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => onChangeEmail(e.target.value)}
            placeholder=" "
            className="peer w-full border-b-2 border-border bg-transparent py-2.5 text-foreground outline-none transition-colors duration-200 placeholder:text-transparent focus:border-primary"
            autoComplete="email"
          />
          <label
            htmlFor="email"
            className="pointer-events-none absolute left-0 top-2.5 text-sm text-muted-foreground transition-all duration-200 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs"
          >
            이메일
          </label>
        </div>

        {/* 비밀번호 */}
        <div className="group relative">
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => onChangePassword(e.target.value)}
            placeholder=" "
            className="peer w-full border-b-2 border-border bg-transparent py-2.5 text-foreground outline-none transition-colors duration-200 placeholder:text-transparent focus:border-primary"
            autoComplete="current-password"
          />
          <label
            htmlFor="password"
            className="pointer-events-none absolute left-0 top-2.5 text-sm text-muted-foreground transition-all duration-200 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs"
          >
            비밀번호
          </label>
        </div>
      </div>

      {/* 비밀번호 찾기 */}
      <div className="mt-3 flex justify-end animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-backwards">
        <button
          type="button"
          onClick={onFindAccountClick}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          비밀번호 찾기
        </button>
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-5 h-11 w-full rounded-xl bg-primary font-medium text-primary-foreground transition-all duration-200 hover:brightness-105 active:scale-[0.98] disabled:opacity-60 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-backwards"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            로그인 중
          </span>
        ) : (
          '로그인'
        )}
      </button>

      {/* 구분선 */}
      <div className="relative my-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-backwards">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-xs text-muted-foreground">또는</span>
        </div>
      </div>

      {/* 소셜 로그인 */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-backwards">
        <SocialLoginButtons
          onGoogle={() => onOAuthStart('google')}
          onGithub={() => onOAuthStart('github')}
          onKakao={() => onOAuthStart('kakao')}
        />
      </div>

      {/* 회원가입 */}
      <p className="mt-6 text-center text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-backwards">
        계정이 없으신가요?{' '}
        <Link href={signupHref} className="font-medium text-foreground underline-offset-4 hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  )
}
