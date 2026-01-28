'use client'

import { useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SURVEY_FIRST_LOGIN_KEY } from '@/features/auth/constants'
import { SurveyContainer, type SurveyStep } from '@/features/mypage/components/survey/survey-container'

const STEP_TITLES: Record<SurveyStep, string> = {
  basic: '기초 설문',
  aptitude: '성향 테스트',
  results: '정보 확인',
}

export function SurveyPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(true)
  const [currentStep, setCurrentStep] = useState<SurveyStep>('basic')

  // 최초 로그인 여부 확인 및 플래그 삭제
  const checkAndClearFirstLogin = (): boolean => {
    try {
      const isFirst = sessionStorage.getItem(SURVEY_FIRST_LOGIN_KEY) === 'true'
      if (isFirst) {
        sessionStorage.removeItem(SURVEY_FIRST_LOGIN_KEY)
      }
      return isFirst
    } catch {
      return false
    }
  }

  // 우선순위: 1. 최초 로그인 → 마이페이지  2. returnUrl → 해당 페이지  3. 그 외 → 이전 페이지
  const handleClose = () => {
    if (checkAndClearFirstLogin()) {
      router.replace('/mypage/personal')
      return
    }

    const returnUrl = searchParams.get('returnUrl')
    if (returnUrl && returnUrl.startsWith('/')) {
      // 상대 경로만 허용 (Open Redirect 방지)
      router.replace(returnUrl)
      return
    }

    router.back()
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) handleClose()
    setOpen(next)
  }

  const handleComplete = () => {
    handleClose()
  }

  const handleStepChange = (step: SurveyStep) => {
    setCurrentStep(step)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onOpenAutoFocus={e => e.preventDefault()}
        className="inset-0 flex max-h-full max-w-full translate-x-0 translate-y-0 flex-col rounded-none sm:!inset-auto sm:!top-1/2 sm:!left-1/2 sm:!max-h-[85vh] sm:!max-w-[calc(100%-2rem)] sm:!-translate-x-1/2 sm:!-translate-y-1/2 sm:!rounded-lg md:!max-w-[800px]"
      >
        <DialogHeader className="shrink-0 border-b px-4 py-4 sm:border-none sm:px-6 sm:pt-6 sm:pb-0">
          <DialogTitle>{STEP_TITLES[currentStep]}</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:pt-4 sm:pb-6">
          <SurveyContainer embedded onComplete={handleComplete} onStepChange={handleStepChange} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
