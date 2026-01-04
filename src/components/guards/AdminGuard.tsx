'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useAuthStore } from '@/store/authStore'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const { isLoggedIn, userType, hasHydrated } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // 하이드레이션이 완료될 때까지 대기
    if (!hasHydrated) {
      return
    }

    // 로그인 상태 확인
    if (!isLoggedIn) {
      router.replace('/login')
      return
    }

    // 관리자 권한 확인
    if (userType !== 'ADMIN') {
      router.replace('/')
      return
    }

    setIsChecking(false)
  }, [isLoggedIn, userType, router, hasHydrated])

  // 권한 확인 중에는 로딩 표시
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-purple-500" />
          <span className="text-sm text-gray-500">권한 확인 중...</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
