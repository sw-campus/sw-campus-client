'use client'

import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { oauthLogin } from '@/features/auth/authApi'
import { useAuthStore } from '@/store/authStore'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const search = useSearchParams()
  const params = useParams<{ provider: string }>()

  const { login: setLogin, setUserType } = useAuthStore()

  useEffect(() => {
    const run = async () => {
      const providerParam = (params?.provider ?? '').toString()
      const provider = providerParam === 'google' || providerParam === 'github' ? providerParam : null

      if (!provider) {
        toast.error('지원하지 않는 OAuth 제공자입니다.')
        router.replace('/login')
        return
      }

      const code = search.get('code')
      const state = search.get('state')
      if (!code) {
        toast.error('인증 코드가 없습니다. 다시 시도해주세요.')
        router.replace('/login')
        return
      }

      // Validate state (CSRF protection)
      try {
        const key = `oauth_state_${provider}`
        const expected = typeof window !== 'undefined' ? sessionStorage.getItem(key) : null
        if (expected && state && expected !== state) {
          toast.error('잘못된 요청입니다. (state 불일치)')
          router.replace('/login')
          return
        }
        if (expected) sessionStorage.removeItem(key)
      } catch {
        // ignore storage errors
      }

      try {
        const data = await oauthLogin(provider, code)

        let userName = '사용자'
        let userType: 'ORGANIZATION' | 'PERSONAL' | null = null

        if (data) {
          userName = (data as any).name ?? (data as any).nickname ?? (data as any).email?.split?.('@')?.[0] ?? '사용자'

          if ((data as any).userType === 'ORGANIZATION' || (data as any).userType === 'PERSONAL') {
            userType = (data as any).userType
          } else if ((data as any).userType === 'organization' || (data as any).userType === 'personal') {
            userType = (data as any).userType === 'organization' ? 'ORGANIZATION' : 'PERSONAL'
          } else if ((data as any).role) {
            userType = (data as any).role === 'ORGANIZATION' ? 'ORGANIZATION' : 'PERSONAL'
          } else if ((data as any).isOrganization !== undefined) {
            userType = (data as any).isOrganization ? 'ORGANIZATION' : 'PERSONAL'
          }
        }

        setUserType(userType)
        setLogin(userName)

        toast.success('로그인되었습니다.')
        router.replace('/')
      } catch (err) {
        console.error(err)
        toast.error('소셜 로그인 처리에 실패했습니다. 다시 시도해주세요.')
        router.replace('/login')
      }
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-medium">소셜 로그인 처리 중…</p>
        <p className="mt-2 text-sm text-gray-500">잠시만 기다려 주세요.</p>
      </div>
    </div>
  )
}
