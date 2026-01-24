'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SURVEY_FIRST_LOGIN_KEY } from '@/features/auth/constants'
import { useAuthStore } from '@/store/auth-store'

export default function WelcomePage() {
  const router = useRouter()
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)

  // 비로그인 사용자 접근 방지
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/')
    }
  }, [isLoggedIn, router])

  // 비로그인 시 렌더링 방지
  if (!isLoggedIn) {
    return null
  }

  const handleGoHome = () => {
    try {
      sessionStorage.removeItem(SURVEY_FIRST_LOGIN_KEY)
    } catch {
      // ignore storage errors
    }
    router.replace('/')
  }

  const handleGoSurvey = () => {
    // sessionStorage 플래그 유지
    router.push('/mypage/survey')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="mx-4 w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">회원가입을 축하합니다!</CardTitle>
          <CardDescription>
            SW Campus에 오신 것을 환영합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            설문조사를 완료하시면 더 많은 기능을 이용할 수 있습니다:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>
                <strong>기초설문 완료 시</strong>
                <br />
                <span className="text-muted-foreground">AI 강의 비교 분석 이용 가능</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>
                <strong>성향 테스트까지 완료 시</strong>
                <br />
                <span className="text-muted-foreground">더 정밀한 맞춤형 AI 분석</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>
                <strong>과정 리뷰 열람 가능</strong>
                <br />
                <span className="text-muted-foreground">수강생들의 실제 후기 확인</span>
              </span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleGoHome}>
            메인으로
          </Button>
          <Button className="flex-1" onClick={handleGoSurvey}>
            설문 시작하기
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
