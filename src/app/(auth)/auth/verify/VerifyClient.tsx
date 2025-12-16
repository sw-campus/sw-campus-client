'use client'

import { useEffect } from 'react'

import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { getVerifyEmailRedirectUrl } from '@/lib/axios'

export default function VerifyClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const signupTypeParam = searchParams.get('type')
  const signupType = signupTypeParam === 'organization' ? 'organization' : 'personal'

  useEffect(() => {
    if (!token) {
      toast.error('인증 토큰이 없습니다.')
      return
    }
    window.location.href = getVerifyEmailRedirectUrl(token, signupType)
  }, [token, signupType])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>이메일 인증 확인 중입니다...</p>
    </div>
  )
}
