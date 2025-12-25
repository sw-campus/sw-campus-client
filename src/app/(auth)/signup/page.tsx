'use client'

import { SignupHeader, SignupCards } from '@/features/auth/components'

export default function SignupSelectPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <section className="relative flex w-full flex-1 items-center justify-center px-6 py-14">
        {/* Decorative blobs (배경은 RootLayout의 bg 유지) */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="bg-accent/35 absolute -top-10 -left-16 h-44 w-44 rounded-full blur-3xl" />
          <div className="bg-accent/25 absolute top-10 -right-20 h-56 w-56 rounded-full blur-3xl" />
          <div className="bg-primary/20 absolute -bottom-20 left-10 h-64 w-64 rounded-full blur-3xl" />
          <div className="bg-primary/15 absolute right-4 bottom-6 h-40 w-40 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/15 bg-white/10 px-6 py-6 shadow-xl backdrop-blur-xl md:px-8 md:py-8">
          <div className="flex flex-col items-center gap-6 md:gap-8">
            <SignupHeader />
            <SignupCards />
          </div>
        </div>
      </section>
    </div>
  )
}
