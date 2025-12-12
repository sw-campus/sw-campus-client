'use client'

import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { oauthLogin } from '@/features/auth/authApi'
import { useAuthStore } from '@/store/authStore'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const params = useParams<{ provider: string }>()
  const searchParams = useSearchParams()

  const { login: setLogin } = useAuthStore()

  useEffect(() => {
    const provider = params.provider as 'google' | 'github'
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      alert('OAuth 인증이 취소/실패했어요.')
      router.replace('/login')
      return
    }

    if (!code) {
      alert('인가 코드(code)가 없어요.')
      router.replace('/login')
      return
    }

    ;(async () => {
      try {
        const data = await oauthLogin(provider, code)

        // 응답 형태에 맞게 골라서 저장 (예시)
        const userName = (data as any)?.name ?? (data as any)?.nickname ?? (data as any)?.email ?? '사용자'

        setLogin(userName)

        router.replace('/')
      } catch (e) {
        console.error(e)
        alert('소셜 로그인에 실패했어요. 다시 시도해주세요.')
        router.replace('/login')
      }
    })()
  }, [params.provider, router, searchParams, setLogin])

  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <p className="text-neutral-600">소셜 로그인 처리 중...</p>
    </div>
  )
}
