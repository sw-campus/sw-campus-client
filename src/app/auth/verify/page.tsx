'use client'

import { useEffect } from 'react'

import { useSearchParams } from 'next/navigation'

import { getVerifyEmailRedirectUrl } from '@/lib/axios'

export default function VerifyPage() {
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
