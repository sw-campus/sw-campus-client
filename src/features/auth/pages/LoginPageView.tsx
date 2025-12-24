'use client'

import { useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { LoginFormCard } from '@/features/auth/components/LoginFormCard'
import { useLoginForm } from '@/features/auth/hooks/useLoginForm'
import { useOAuthUrls } from '@/features/auth/hooks/useOAuthUrls'
import { useAuthStore } from '@/store/authStore'

export default function LoginPageView() {
  const router = useRouter()
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const userType = useAuthStore(state => state.userType)
  const { email, password, isLoading, setEmail, setPassword, rememberMe, setRememberMe, handleSubmit } = useLoginForm()
  const { handleOAuthStart } = useOAuthUrls()

  // 마운트 시점의 로그인 상태를 저장
  const wasLoggedInOnMount = useRef(isLoggedIn)

  // 이미 로그인된 상태로 /login 페이지에 접근한 경우에만 리다이렉트
  // 로그인 폼 제출 후 상태가 바뀌는 경우는 useLoginForm에서 처리
  useEffect(() => {
    if (wasLoggedInOnMount.current && isLoggedIn) {
      if (userType === 'ADMIN') {
        router.replace('/admin')
      } else {
        router.replace('/')
      }
    }
  }, [isLoggedIn, userType, router])

  return (
    <div className="flex flex-col gap-4">
      {/* 전체 로그인 영역*/}
      <section className="flex min-h-125 w-full items-center justify-center px-6 py-10">
        {/* 가운데 로그인 카드 */}
        <div className="relative z-10 flex w-full items-center justify-center">
          <LoginFormCard
            email={email}
            password={password}
            isLoading={isLoading}
            onChangeEmail={setEmail}
            onChangePassword={setPassword}
            rememberMe={rememberMe}
            onChangeRememberMe={setRememberMe}
            onSubmit={handleSubmit}
            onOAuthStart={handleOAuthStart}
            signupHref="/signup"
            onFindAccountClick={() => {
              toast.message('아이디/비밀번호 찾기 기능은 아직 연결되지 않았어요.')
            }}
          />
        </div>
      </section>
    </div>
  )
}
