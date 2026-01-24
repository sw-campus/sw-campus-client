'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SURVEY_FIRST_LOGIN_KEY } from '@/features/auth/constants'
import { SurveyContainer, type SurveyStep } from '@/features/mypage/components/survey/survey-container'

const STEP_TITLES: Record<SurveyStep, string> = {
  basic: '기초 설문',
  aptitude: '성향 테스트',
  results: '정보 확인',
}

export default function SurveyCreatePage() {
  const router = useRouter()
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

  // 최초 로그인이면 마이페이지로, 아니면 이전 페이지로
  const handleClose = () => {
    if (checkAndClearFirstLogin()) {
      router.replace('/mypage/personal')
    } else {
      router.back()
    }
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
      <DialogContent className="sm:max-w-[calc(100%-2rem)] md:max-w-[800px]">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{STEP_TITLES[currentStep]}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[75vh] overflow-y-auto px-6 pb-6">
          <SurveyContainer embedded onComplete={handleComplete} onStepChange={handleStepChange} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
