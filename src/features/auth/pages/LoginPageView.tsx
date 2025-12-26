'use client'

import { useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { FindPasswordModal } from '@/features/auth/components/FindPasswordModal'
import { LoginFormCard } from '@/features/auth/components/LoginFormCard'
import { useLoginForm } from '@/features/auth/hooks/useLoginForm'
import { useOAuthUrls } from '@/features/auth/hooks/useOAuthUrls'
import { useAuthStore } from '@/store/authStore'

export default function LoginPageView() {
  const router = useRouter()
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const userType = useAuthStore(state => state.userType)
  const { email, password, isLoading, setEmail, setPassword, handleSubmit } = useLoginForm()
  const { handleOAuthStart } = useOAuthUrls()

  // 비밀번호 찾기 모달 상태
  const [isFindPasswordOpen, setIsFindPasswordOpen] = useState(false)

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
    <div className="flex min-h-dvh flex-col">
      {/* 전체 로그인 영역 */}
      <section className="relative flex w-full flex-1 items-center justify-center px-6 py-14">
        {/* Decorative blobs (배경은 RootLayout의 bg 유지) */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="bg-accent/35 absolute -top-10 -left-16 h-44 w-44 rounded-full blur-3xl" />
          <div className="bg-accent/25 absolute top-10 -right-20 h-56 w-56 rounded-full blur-3xl" />
          <div className="bg-primary/20 absolute -bottom-20 left-10 h-64 w-64 rounded-full blur-3xl" />
          <div className="bg-primary/15 absolute right-4 bottom-6 h-40 w-40 rounded-full blur-3xl" />
        </div>
        {/* 가운데 로그인 카드 */}
        <div className="relative z-10 flex w-full items-center justify-center">
          <LoginFormCard
            email={email}
            password={password}
            isLoading={isLoading}
            onChangeEmail={setEmail}
            onChangePassword={setPassword}
            onSubmit={handleSubmit}
            onOAuthStart={handleOAuthStart}
            signupHref="/signup"
            onFindAccountClick={() => setIsFindPasswordOpen(true)}
          />
        </div>
      </section>

      {/* 비밀번호 찾기 모달 */}
      <FindPasswordModal isOpen={isFindPasswordOpen} onClose={() => setIsFindPasswordOpen(false)} />
    </div>
  )
}
