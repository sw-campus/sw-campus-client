'use client'

import { FormEvent } from 'react'

import Link from 'next/link'

import { SocialLoginButtons } from '@/features/auth/components/SocialLoginButton'

const INPUT_BASE_CLASS =
  'h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white'

type LoginFormCardProps = {
  email: string
  password: string
  isLoading: boolean
  onChangeEmail: (v: string) => void
  onChangePassword: (v: string) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>
  onOAuthStart: (provider: 'google' | 'github') => void
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
    <form onSubmit={onSubmit} className="w-full max-w-md rounded-xl bg-white p-10">
      {/* 이메일 */}
      <div className="mb-4">
        <label className="mb-1 block text-neutral-700">이메일</label>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={e => onChangeEmail(e.target.value)}
          className={INPUT_BASE_CLASS}
        />
      </div>

      {/* 비밀번호 */}
      <div className="mb-3">
        <label className="mb-1 block text-neutral-700">비밀번호</label>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={e => onChangePassword(e.target.value)}
          className={INPUT_BASE_CLASS}
        />
      </div>

      {/* 아이디/비번 찾기 + 회원가입 */}
      <div className="mb-4 flex justify-between text-neutral-500">
        <button type="button" onClick={onFindAccountClick} className="underline-offset-2 hover:underline">
          아이디/비밀번호 찾기
        </button>

        <Link href={signupHref} className="underline-offset-2 hover:underline">
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

      {/* 소셜 로그인 */}
      <SocialLoginButtons onGoogle={() => onOAuthStart('google')} onGithub={() => onOAuthStart('github')} />
    </form>
  )
}
