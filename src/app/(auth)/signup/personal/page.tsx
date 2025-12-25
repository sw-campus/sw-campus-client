import { Suspense } from 'react'

import Script from 'next/script'

import SignupForm from '@/app/(auth)/signup/personal/SignupForm'

export default function SignupPersonalPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />
      <section className="relative flex w-full flex-1 items-center justify-center px-6 py-14">
        {/* Decorative blobs (배경은 RootLayout의 bg 유지) */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="bg-accent/35 absolute -top-10 -left-16 h-44 w-44 rounded-full blur-3xl" />
          <div className="bg-accent/25 absolute top-10 -right-20 h-56 w-56 rounded-full blur-3xl" />
          <div className="bg-primary/20 absolute -bottom-20 left-10 h-64 w-64 rounded-full blur-3xl" />
          <div className="bg-primary/15 absolute right-4 bottom-6 h-40 w-40 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex w-full items-center justify-center">
          <Suspense fallback={null}>
            <SignupForm />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
