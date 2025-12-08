'use client'

import { FormEvent } from 'react'

export default function SignupPersonalPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: 실제 회원가입 로직 (API 연동)
  }

  return (
    <div className="flex flex-col gap-4 text-sm">
      {/* 전체 영역 */}
      <section className="relative flex min-h-[540px] w-full items-center justify-center rounded-3xl px-8 py-10">
        {/* 가운데 회원가입 카드 */}
        <div className="relative z-10 flex w-full items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl rounded-xl bg-neutral-200/95 p-8 text-xs shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
          >
            {/* 이메일 + 인증 */}
            <div className="mb-4">
              <label className="mb-1 block text-[11px] text-neutral-700">이메일</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="email"
                  className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 text-[11px] outline-none focus:border-neutral-500 focus:bg-white"
                />
                <button
                  type="button"
                  className="h-9 rounded-md bg-neutral-900 px-4 text-[11px] font-semibold text-white"
                >
                  인증
                </button>
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="mb-4">
              <label className="mb-1 block text-[11px] text-neutral-700">비밀번호</label>
              <input
                type="password"
                placeholder="password"
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 text-[11px] outline-none focus:border-neutral-500 focus:bg-white"
              />
            </div>

            {/* 비밀번호 확인 + 확인 버튼 */}
            <div className="mb-4">
              <label className="mb-1 block text-[11px] text-neutral-700">비밀번호 확인</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="password"
                  className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 text-[11px] outline-none focus:border-neutral-500 focus:bg-white"
                />
                <button
                  type="button"
                  className="h-9 rounded-md bg-neutral-900 px-4 text-[11px] font-semibold text-white"
                >
                  확인
                </button>
              </div>
            </div>

            {/* 이름 */}
            <div className="mb-4">
              <label className="mb-1 block text-[11px] text-neutral-700">이름</label>
              <input
                type="text"
                placeholder="name"
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 text-[11px] outline-none focus:border-neutral-500 focus:bg-white"
              />
            </div>

            {/* 닉네임 */}
            <div className="mb-4">
              <label className="mb-1 block text-[11px] text-neutral-700">닉네임</label>
              <input
                type="text"
                placeholder="nickname"
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 text-[11px] outline-none focus:border-neutral-500 focus:bg-white"
              />
            </div>

            {/* 전화번호 + 인증 */}
            <div className="mb-4">
              <label className="mb-1 block text-[11px] text-neutral-700">전화번호</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="phone"
                  className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 text-[11px] outline-none focus:border-neutral-500 focus:bg-white"
                />
                <button
                  type="button"
                  className="h-9 rounded-md bg-neutral-900 px-4 text-[11px] font-semibold text-white"
                >
                  인증
                </button>
              </div>
            </div>

            {/* 주소 + 검색 + 상세주소 */}
            <div className="mb-3">
              <label className="mb-1 block text-[11px] text-neutral-700">주소</label>
              <div className="mb-2 flex gap-2">
                <input
                  type="text"
                  placeholder="address"
                  className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 text-[11px] outline-none focus:border-neutral-500 focus:bg-white"
                />
                <button
                  type="button"
                  className="h-9 rounded-md bg-neutral-900 px-4 text-[11px] font-semibold text-white"
                >
                  검색
                </button>
              </div>
              <input
                type="text"
                placeholder="상세 주소"
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 text-[11px] outline-none focus:border-neutral-500 focus:bg-white"
              />
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              className="mt-6 h-9 w-full rounded-md bg-neutral-900 text-[11px] font-semibold text-white"
            >
              회원가입
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
