'use client'

import { useCallback, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SurveyContainer, type SurveyStep } from '@/features/mypage/components/survey/SurveyContainer'

const STEP_TITLES: Record<SurveyStep, string> = {
  basic: '기초 설문',
  aptitude: '성향 테스트',
  results: '정보 확인',
}

export default function SurveyCreatePage() {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const [currentStep, setCurrentStep] = useState<SurveyStep>('basic')

  const handleOpenChange = (next: boolean) => {
    if (!next) router.back()
    setOpen(next)
  }

  const handleComplete = () => {
    router.back()
  }

  const handleStepChange = useCallback((step: SurveyStep) => {
    setCurrentStep(step)
  }, [])

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
