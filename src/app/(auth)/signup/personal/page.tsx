import { Suspense } from 'react'

import Script from 'next/script'

import SignupForm from '@/app/(auth)/signup/personal/SignupForm'

export default function SignupPersonalPage() {
  return (
    <div className="flex flex-col gap-4">
      <Script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />
      {/* 전체 영역 */}
      <section className="relative flex min-h-[540px] w-full items-center justify-center rounded-3xl px-8 py-10">
        {/* 가운데 회원가입 카드 */}
        <div className="relative z-10 flex w-full items-center justify-center">
          <Suspense fallback={null}>
            <SignupForm />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
