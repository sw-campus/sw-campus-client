'use client'

import { useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { oauthLogin } from '@/features/auth/auth-api'
import { OAUTH_RETURN_URL_KEY, SURVEY_FIRST_LOGIN_KEY } from '@/features/auth/constants'
import { useMigrateGuestCart } from '@/features/cart/hooks/use-migrate-guest-cart'
import { getProfile } from '@/features/mypage/api/survey.api'
import { parseUserType, parseUserName, parseNickname, type LoginResponse } from '@/lib/parse-login-response'
import { useAuthStore } from '@/store/auth-store'

interface OAuthCallbackClientProps {
  provider: string
}

export default function OAuthCallbackClient({ provider }: OAuthCallbackClientProps) {
  const router = useRouter()
  const search = useSearchParams()

  const { login: setLogin, setUserType, setNickname } = useAuthStore()
  const { migrateGuestCart } = useMigrateGuestCart()

  useEffect(() => {
    const run = async () => {
      const validProvider = (['google', 'github', 'kakao'] as const).find(p => p === provider) ?? null

      if (!validProvider) {
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
        const key = `oauth_state_${validProvider}`
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
        const data = (await oauthLogin(validProvider, code)) as LoginResponse | null

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

        // Guest cart 마이그레이션 (로그인 성공 후)
        try {
          await migrateGuestCart()
        } catch {
          // ignore migration errors
        }

        toast.success('로그인되었습니다.')

        // 최초 로그인 여부 확인
        const isFirstLogin = (data as { isFirstLogin?: boolean })?.isFirstLogin ?? false

        // returnUrl 확인 (sessionStorage에서)
        let returnUrl: string | null = null
        try {
          returnUrl = sessionStorage.getItem(OAUTH_RETURN_URL_KEY)
          sessionStorage.removeItem(OAUTH_RETURN_URL_KEY)
        } catch {
          // ignore storage errors
        }

        // 리다이렉트: 최초 로그인 > returnUrl > 관리자면 /admin > 홈
        if (isFirstLogin) {
          // 최초 로그인: 환영 페이지로 이동
          try {
            sessionStorage.setItem(SURVEY_FIRST_LOGIN_KEY, 'true')
          } catch {
            // ignore storage errors
          }
          router.replace('/welcome')
        } else if (returnUrl && returnUrl.startsWith('/')) {
          router.replace(returnUrl)
        } else if (userType === 'ADMIN') {
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
        <p className="mt-2 text-sm text-muted-foreground">잠시만 기다려 주세요.</p>
      </div>
    </div>
  )
}
