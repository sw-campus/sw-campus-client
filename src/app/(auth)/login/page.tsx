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
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-white p-10">
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

            {/* 로그인 버튼 */}
            <button type="submit" className="mt-1 h-9 w-full rounded-md bg-neutral-900 font-semibold text-white">
              로그인
            </button>

            {/* 소셜 로그인 영역 */}
            {/* 하단 구글 / 깃허브 로고 */}
            <div className="mt-4 flex justify-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition hover:scale-105 hover:bg-neutral-100">
                <FaGoogle className="text-red-500" size={18} />
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition hover:scale-105 hover:bg-neutral-100">
                <FaGithub className="text-black" size={18} />
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
