'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { LoginFormCard } from '@/features/auth/components/LoginFormCard'
import { useLoginForm } from '@/features/auth/hooks/useLoginForm'
import { useOAuthUrls } from '@/features/auth/hooks/useOAuthUrls'
import { useAuthStore } from '@/store/authStore'

export default function LoginPageView() {
  const router = useRouter()
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const { email, password, isLoading, setEmail, setPassword, rememberMe, setRememberMe, handleSubmit } = useLoginForm()
  const { handleOAuthStart } = useOAuthUrls()

  // 이미 로그인 상태라면 홈으로 이동 (자동 로그인 UX)
  useEffect(() => {
    if (isLoggedIn) router.replace('/')
  }, [isLoggedIn, router])

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
