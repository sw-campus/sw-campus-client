'use client'

import { useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { FindPasswordModal } from '@/features/auth/components/find-password-modal'
import { LoginFormCard } from '@/features/auth/components/login-form-card'
import { useLoginForm } from '@/features/auth/hooks/use-login-form'
import { useOAuthUrls } from '@/features/auth/hooks/use-o-auth-urls'
import { useAuthStore } from '@/store/auth-store'

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
    <div className="flex min-h-dvh flex-col md:flex-row">
      {/* 왼쪽 브랜드 영역 - 데스크탑만 */}
      <div className="relative hidden overflow-hidden bg-gradient-to-r from-brand-gold/10 via-brand-gold/5 to-transparent md:flex md:w-1/2 md:flex-col md:items-center md:justify-center">
        {/* 상단 홈 버튼 */}
        <nav className="absolute top-0 left-0 flex h-14 items-center px-8">
          <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            ← 홈으로 돌아가기
          </Link>
        </nav>

        {/* 기하학적 도형들 */}
        <div className="pointer-events-none absolute inset-0">
          {/* 큰 원 */}
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full border-2 border-brand-gold/40" />
          <div className="absolute -top-10 -left-10 h-60 w-60 rounded-full border border-brand-gold/25" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full border-2 border-brand-gold/30" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full border border-brand-gold/35" />
          {/* 작은 원들 */}
          <div className="absolute top-[15%] right-[20%] h-4 w-4 rounded-full bg-brand-gold/70" />
          <div className="absolute top-[25%] left-[15%] h-3 w-3 rounded-full bg-brand-gold/60" />
          <div className="absolute top-[40%] right-[10%] h-5 w-5 rounded-full bg-brand-gold/50" />
          <div className="absolute bottom-[30%] left-[20%] h-4 w-4 rounded-full bg-brand-gold/65" />
          <div className="absolute bottom-[15%] right-[25%] h-3 w-3 rounded-full bg-brand-gold/55" />
          <div className="absolute top-[60%] left-[10%] h-3 w-3 rounded-full bg-brand-gold/45" />
          {/* 그리드 패턴 */}
          <div className="absolute inset-0 text-brand-gold opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>

        {/* 브랜드 콘텐츠 */}
        <div className="relative z-10 flex flex-col items-center gap-6 px-12">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-background/90 shadow-xl ring-1 ring-brand-gold/10 backdrop-blur-sm">
            <img src="/images/logo.png" alt="SOFTWARE CAMPUS" className="h-16 w-16 object-contain" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">SOFTWARE CAMPUS</h1>
            <p className="mt-4 max-w-xs text-base leading-relaxed text-muted-foreground">
              국비지원 IT 부트캠프를 비교하고<br />나에게 맞는 교육을 찾아보세요
            </p>
          </div>
          {/* 키워드 태그 */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-brand-gold/20 px-4 py-1.5 text-sm font-medium text-amber-700">부트캠프 비교</span>
            <span className="rounded-full bg-brand-gold/20 px-4 py-1.5 text-sm font-medium text-amber-700">수강 후기</span>
            <span className="rounded-full bg-brand-gold/20 px-4 py-1.5 text-sm font-medium text-amber-700">취업 정보</span>
          </div>
        </div>
      </div>

      {/* 오른쪽 로그인 영역 */}
      <div className="flex flex-1 flex-col md:w-1/2">
        {/* 상단 네비게이션 - 모바일만 */}
        <nav className="flex h-10 shrink-0 items-center px-5 md:hidden">
          <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            ← 홈으로 돌아가기
          </Link>
        </nav>

        {/* 로그인 폼 */}
        <section className="relative flex w-full flex-1 items-center justify-center px-6 py-4">
          {/* Decorative blobs - 모바일만 */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden md:hidden">
            <div className="bg-accent/35 absolute -top-10 -left-16 h-44 w-44 rounded-full blur-3xl" />
            <div className="bg-accent/25 absolute top-10 -right-20 h-56 w-56 rounded-full blur-3xl" />
          </div>

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
      </div>

      {/* 비밀번호 찾기 모달 */}
      <FindPasswordModal isOpen={isFindPasswordOpen} onClose={() => setIsFindPasswordOpen(false)} />
    </div>
  )
}
