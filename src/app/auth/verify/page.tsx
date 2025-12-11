'use client'

import { Suspense, useEffect } from 'react'

import { useSearchParams } from 'next/navigation'

import { getVerifyEmailRedirectUrl } from '@/lib/axios'

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      alert('인증 토큰이 없습니다.')
      return
    }
    window.location.href = getVerifyEmailRedirectUrl(token)
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>이메일 인증 확인 중입니다...</p>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">로딩 중...</div>}>
      <VerifyContent />
    </Suspense>
  )
}
