'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuthStore } from '@/store/authStore'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const { isLoggedIn, userType, hasHydrated } = useAuthStore()

  // 권한 상태를 계산으로 도출
  const isAuthorized = hasHydrated && isLoggedIn && userType === 'ADMIN'
  const shouldRedirectToLogin = hasHydrated && !isLoggedIn
  const shouldRedirectToHome = hasHydrated && isLoggedIn && userType !== 'ADMIN'

  // 리다이렉트 처리
  useEffect(() => {
    if (shouldRedirectToLogin) {
      router.replace('/login')
    } else if (shouldRedirectToHome) {
      router.replace('/')
    }
  }, [shouldRedirectToLogin, shouldRedirectToHome, router])

  // 권한 확인 중이거나 리다이렉트 대기 중에는 로딩 표시
  if (!isAuthorized) {
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
