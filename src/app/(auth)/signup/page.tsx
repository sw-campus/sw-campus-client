'use client'

import { SignupHeader, SignupCards } from '@/features/auth/components'

export default function SignupSelectPage() {
  return (
    <div className="flex flex-col gap-4">
      <section className="relative flex min-h-135 w-full items-center justify-center rounded-3xl px-8 py-10">
        <div className="relative z-10 flex flex-col items-center gap-12">
          <SignupHeader />
          <SignupCards />
        </div>
      </section>
    </div>
  )
}
