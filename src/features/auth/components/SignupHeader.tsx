'use client'

import Image from 'next/image'

export default function SignupHeader() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Image src="/images/logo.png" alt="소프트웨어 캠퍼스 로고" width={56} height={56} priority />
      <p className="text-center text-sm font-semibold text-white/70 md:text-base">
        소프트웨어 캠퍼스 회원가입을 환영합니다.
      </p>
    </div>
  )
}
