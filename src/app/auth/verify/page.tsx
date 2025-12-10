'use client'

import { useEffect } from 'react'

import { useSearchParams } from 'next/navigation'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      alert('인증 토큰이 없습니다.')
      return
    }
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/email/verify?token=${token}`
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>이메일 인증 확인 중입니다...</p>
    </div>
  )
}
