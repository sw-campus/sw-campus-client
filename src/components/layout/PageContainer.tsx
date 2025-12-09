'use client'

import type { PropsWithChildren } from 'react'

import { usePathname } from 'next/navigation'

export default function PageContainer({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  // ✅ 로그인 페이지: blur / 유리카드 없이 깔끔한 컨테이너만
  if (isLoginPage) {
    return <div className="mx-auto w-full max-w-7xl p-8 px-4">{children}</div>
  }

  // ✅ 그 외 페이지: 기존처럼 유리 카드 + blur 유지
  return (
    <div className="mx-auto w-full max-w-7xl rounded-3xl border border-white/10 bg-white/30 p-8 px-4 shadow-xl backdrop-blur-xl">
      {children}
    </div>
  )
}
