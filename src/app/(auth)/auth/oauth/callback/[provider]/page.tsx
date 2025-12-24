'use client'

import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { oauthLogin } from '@/features/auth/authApi'
import { getProfile } from '@/features/mypage/api/survey.api'
import { parseUserType, parseUserName, parseNickname, type LoginResponse } from '@/lib/parseLoginResponse'
import { useAuthStore } from '@/store/authStore'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const search = useSearchParams()
  const params = useParams<{ provider: string }>()

  const { login: setLogin, setUserType, setNickname } = useAuthStore()

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
        const data = (await oauthLogin(provider, code)) as LoginResponse | null

        const userName = parseUserName(data)
        const userType = parseUserType(data)

        setUserType(userType)
        setLogin(userName)

        // 닉네임 설정: 응답에 있으면 사용, 없으면 프로필 조회
        try {
          const nickFromResponse = parseNickname(data)
          if (nickFromResponse) {
            setNickname(nickFromResponse)
          } else {
            const profile = await getProfile()
            if (profile?.nickname) setNickname(profile.nickname)
          }
        } catch {
          // ignore nickname fetch errors
        }

        toast.success('로그인되었습니다.')
        // 관리자인 경우 /admin 페이지로, 그 외에는 홈으로 리다이렉트
        if (userType === 'ADMIN') {
          router.replace('/admin')
        } else {
          router.replace('/')
        }
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
