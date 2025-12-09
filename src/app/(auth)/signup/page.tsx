'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaGoogle, FaGithub } from 'react-icons/fa'

export default function SignupSelectPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4">
      {/* 전체 영역 */}
      <section className="relative flex min-h-[540px] w-full items-center justify-center rounded-3xl px-8 py-10">
        {/* 실제 내용 */}
        <div className="relative z-10 flex flex-col items-center gap-12">
          {/* 상단 안내 문구 */}
          <p className="font-semibold text-neutral-200">소프트웨어 캠퍼스 회원가입을 환영합니다.</p>

          {/* 두 개의 카드 영역 */}
          <div className="flex w-full max-w-5xl gap-8">
            {/* 개인회원 카드 */}
            <button
              type="button"
              onClick={() => router.push('/signup/personal')}
              className="flex-[1.2] rounded-3xl bg-white/90 p-10 text-center shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            >
              {/* 그림 자리 */}
              <div className="mb-6 flex h-56 items-center justify-center overflow-hidden rounded-2xl">
                <Image
                  src="/images/signup_person.png"
                  alt="개인회원 가입 이미지"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>

              {/* 버튼 모양 텍스트 */}
              <div className="inline-flex items-center rounded-full bg-neutral-700 px-6 py-1 font-semibold text-white">
                개인회원 가입
              </div>

              {/* 하단 구글 / 깃허브 로고 */}
              <div className="mt-4 flex justify-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition hover:scale-105 hover:bg-neutral-100">
                  <FaGoogle className="text-red-500" size={18} />
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition hover:scale-105 hover:bg-neutral-100">
                  <FaGithub className="text-black" size={18} />
                </div>
              </div>
            </button>

            {/* 기업회원 카드 */}
            <button
              type="button"
              onClick={() => router.push('/signup/organization')}
              className="flex-[1.2] rounded-3xl bg-white/90 p-10 text-center shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            >
              {/* 그림 자리 */}
              <div className="mb-6 flex h-56 items-center justify-center overflow-hidden rounded-2xl">
                <Image
                  src="/images/signup_org.png"
                  alt="개인회원 가입 이미지"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>

              {/* 버튼 모양 텍스트 */}
              <div className="inline-flex items-center rounded-full bg-neutral-700 px-6 py-1 font-semibold text-white">
                기업회원 가입
              </div>

              {/* 설명 텍스트 */}
              <p className="mt-4 text-neutral-600">• 부트캠프를 홍보하려는 사업체 직원</p>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
