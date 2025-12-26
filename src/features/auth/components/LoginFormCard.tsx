'use client'

import { FormEvent } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { SocialLoginButtons } from '@/features/auth/components/SocialLoginButton'

const INPUT_BASE_CLASS =
  'h-10 w-full rounded-md border border-white/15 bg-white/10 px-3 text-white placeholder:text-white/45 outline-none focus:border-white/35 focus:bg-white/15'

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
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-10 text-white shadow-xl backdrop-blur-xl"
    >
      {/* 로고 */}
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex h-18 w-18 items-center justify-center overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15">
          <Image src="/images/logo.png" alt="SOFTWARE CAMPUS 로고" width={56} height={56} className="object-contain" />
        </div>
        <div className="leading-none font-extrabold tracking-tight">
          <div className="text-lg">SOFTWARE</div>
          <div className="text-lg">CAMPUS</div>
        </div>
        <p className="text-sm text-white/60">환영합니다. 로그인해 주세요.</p>
      </div>

      {/* 이메일 */}
      <div className="mb-4">
        <label className="mb-1 block text-white/75">이메일</label>
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
        <label className="mb-1 block text-white/75">비밀번호</label>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={e => onChangePassword(e.target.value)}
          className={INPUT_BASE_CLASS}
        />
      </div>

      {/* 아이디/비번 찾기 + 회원가입 */}
      <div className="mb-4 flex items-center justify-end gap-4 text-white/65">
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
        className="mt-1 h-10 w-full rounded-md bg-white/85 font-semibold text-black transition hover:bg-white disabled:opacity-60"
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </button>

      {/* 소셜 로그인 */}
      <SocialLoginButtons onGoogle={() => onOAuthStart('google')} onGithub={() => onOAuthStart('github')} />
    </form>
  )
}
