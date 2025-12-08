'use client'

import { FormEvent } from 'react'

export default function SignupOrganizationPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: 실제 기업 회원가입 로직 (API 연동)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 전체 영역 */}
      <section className="relative flex min-h-[540px] w-full items-center justify-center rounded-3xl px-8 py-10">
        {/* 가운데 회원가입 카드 */}
        <div className="relative z-10 flex w-full items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl rounded-xl bg-white/90 p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
          >
            {/* 이메일 + 인증 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">이메일</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="email"
                  className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
                />
                <button type="button" className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white">
                  인증
                </button>
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">비밀번호</label>
              <input
                type="password"
                placeholder="password"
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
              />
            </div>

            {/* 비밀번호 확인 + 확인 버튼 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">비밀번호 확인</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="password"
                  className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
                />
                <button type="button" className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white">
                  확인
                </button>
              </div>
            </div>

            {/* 회사명 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">회사명</label>
              <input
                type="text"
                placeholder="office"
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
              />
            </div>

            {/* 직무 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">직무</label>
              <input
                type="text"
                placeholder="job"
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
              />
            </div>

            {/* 전화번호 + 인증 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">전화번호</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="phone"
                  className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
                />
                <button type="button" className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white">
                  인증
                </button>
              </div>
            </div>

            {/* 재직증명서 + 인증 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">재직증명서</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="images"
                  className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
                />
                <button type="button" className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white">
                  인증
                </button>
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <button type="submit" className="mt-6 h-9 w-full rounded-md bg-neutral-900 font-semibold text-white">
              회원가입
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
