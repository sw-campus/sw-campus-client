'use client'

import { FormEvent } from 'react'

import Link from 'next/link'
import { FaGoogle, FaGithub } from 'react-icons/fa'

export default function LoginPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: 실제 로그인 로직 넣기 (API 요청 등)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 전체 로그인 영역*/}
      <section className="flex min-h-[500px] w-full items-center justify-center px-6 py-10">
        {/* 가운데 로그인 카드 */}
        <div className="relative z-10 flex w-full items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-xl bg-white/90 p-10 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
          >
            {/* 이메일 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">이메일</label>
              <input
                type="email"
                placeholder="email"
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
              />
            </div>

            {/* 비밀번호 */}
            <div className="mb-3">
              <label className="mb-1 block text-neutral-700">비밀번호</label>
              <input
                type="password"
                placeholder="password"
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

            {/* 작은 동그라미 3개 (디자인용) */}
            <div className="mb-5 flex items-center justify-center gap-3">
              <button type="button" className="h-4 w-4 rounded-full bg-[#4CD137] shadow-sm" aria-label="첫 번째 상태" />
              <button type="button" className="h-4 w-4 rounded-full bg-neutral-400" aria-label="두 번째 상태" />
              <button type="button" className="h-4 w-4 rounded-full bg-neutral-700" aria-label="세 번째 상태" />
            </div>

            {/* 로그인 버튼 */}
            <button type="submit" className="mt-1 h-9 w-full rounded-md bg-neutral-900 font-semibold text-white">
              로그인
            </button>

            {/* 소셜 로그인 영역 */}
            <div className="mt-4 space-y-2">
              {/* 구글 로그인 버튼 */}
              <button
                type="button"
                className="flex h-9 w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white text-sm text-neutral-700 hover:bg-neutral-100"
                // TODO: 구글 로그인 로직 추가 (OAuth 연동 등)
              >
                <FaGoogle className="text-red-500" />
                <span className="text-sm">Google로 로그인</span>
              </button>

              {/* 깃허브 로그인 버튼 */}
              <button
                type="button"
                className="flex h-9 w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-neutral-900 text-sm text-white hover:bg-neutral-800"
                // TODO: 깃허브 로그인 로직 추가 (OAuth 연동 등)
              >
                <FaGithub />
                <span className="text-sm">GitHub로 로그인</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
