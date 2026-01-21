'use client'

import { FormEvent } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { SocialLoginButtons } from '@/features/auth/components/social-login-button'
import type { Provider } from '@/features/auth/hooks/use-o-auth-urls'

const INPUT_BASE_CLASS =
  'h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100'

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
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/90 p-6 text-gray-900 shadow-xl backdrop-blur-xl sm:rounded-3xl sm:p-10"
    >
      {/* 로고 */}
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex h-18 w-18 items-center justify-center overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
          <Image src="/images/logo.png" alt="SOFTWARE CAMPUS 로고" width={56} height={56} className="object-contain" />
        </div>
        <div className="leading-none font-extrabold tracking-tight text-gray-900">
          <div className="text-lg">SOFTWARE</div>
          <div className="text-lg">CAMPUS</div>
        </div>
        <p className="text-sm text-gray-500">환영합니다. 로그인해 주세요.</p>
      </div>

      {/* 이메일 */}
      <div className="mb-4">
        <label className="mb-1 block text-gray-700">이메일</label>
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={e => onChangeEmail(e.target.value)}
          className={INPUT_BASE_CLASS}
        />
      </div>

      {/* 비밀번호 */}
      <div className="mb-3">
        <label className="mb-1 block text-gray-700">비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={e => onChangePassword(e.target.value)}
          className={INPUT_BASE_CLASS}
        />
      </div>

      {/* 비번 찾기 + 회원가입 */}
      <div className="mb-4 flex items-center justify-between text-gray-600">
        <button
          type="button"
          onClick={onFindAccountClick}
          className="underline-offset-2 hover:text-gray-900 hover:underline"
        >
          비밀번호 찾기
        </button>

        <Link href={signupHref} className="underline-offset-2 hover:text-gray-900 hover:underline">
          회원가입
        </Link>
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-1 h-10 w-full rounded-md bg-orange-500 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </button>

      {/* 소셜 로그인 */}
      <SocialLoginButtons
        onGoogle={() => onOAuthStart('google')}
        onGithub={() => onOAuthStart('github')}
        onKakao={() => onOAuthStart('kakao')}
      />
    </form>
  )
}
