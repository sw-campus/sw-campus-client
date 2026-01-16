'use client'

import { useCallback, useEffect, useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, FileText, Target } from 'lucide-react'

import {
  STEP_QUESTION_COUNTS,
  TOTAL_SURVEY_QUESTIONS,
} from '../../constants/surveyQuestions'
import { useSurveyQuery } from '../../hooks/useSurvey'
import { APTITUDE_TEST_STORAGE_KEY } from '../../types/survey.type'

import { AptitudeContinueModal } from './AptitudeContinueModal'
import { AptitudeTestStep } from './AptitudeTestStep'
import { BasicSurveyStep } from './BasicSurveyStep'
import { SurveyResultsStep } from './SurveyResultsStep'

export type SurveyStep = 'basic' | 'aptitude' | 'results'

interface SurveyContainerProps {
  embedded?: boolean
  onComplete?: () => void
}

export function SurveyContainer({ embedded = false, onComplete }: SurveyContainerProps) {
  const { data: survey, isLoading, refetch } = useSurveyQuery()
  const [currentStep, setCurrentStep] = useState<SurveyStep>('basic')
  const [showContinueModal, setShowContinueModal] = useState(false)
  const [aptitudeProgress, setAptitudeProgress] = useState(0)

  // 설문 상태에 따라 초기 스텝 결정 (primitive 값으로 의존성 분리하여 무한 루프 방지)
  const hasBasicSurvey = survey?.status?.hasBasicSurvey ?? false
  const hasAptitudeTest = survey?.status?.hasAptitudeTest ?? false

  useEffect(() => {
    if (hasAptitudeTest) {
      setCurrentStep('results')
    } else if (hasBasicSurvey) {
      setCurrentStep('aptitude')
    } else {
      setCurrentStep('basic')
    }
  }, [hasBasicSurvey, hasAptitudeTest])

  // 전체 진행률 계산 (실제 완료 여부 기준, 동적 계산)
  const calculateOverallProgress = useCallback(() => {
    // 완료된 문항 수 계산
    let completedQuestions = 0

    if (hasBasicSurvey) {
      completedQuestions += STEP_QUESTION_COUNTS.basic
    }

    if (hasAptitudeTest) {
      completedQuestions += STEP_QUESTION_COUNTS.aptitude
    } else if (currentStep === 'aptitude') {
      // 성향 테스트 진행 중: 답변한 문항 수 반영
      completedQuestions += aptitudeProgress
    }

    return (completedQuestions / TOTAL_SURVEY_QUESTIONS) * 100
  }, [hasBasicSurvey, hasAptitudeTest, currentStep, aptitudeProgress])

  const handleBasicComplete = useCallback(() => {
    refetch()
    setShowContinueModal(true)
  }, [refetch])

  const handleContinueToAptitude = useCallback(() => {
    setShowContinueModal(false)
    setCurrentStep('aptitude')
  }, [])

  const handleSkipToResults = useCallback(() => {
    setShowContinueModal(false)
    setCurrentStep('results')
  }, [])

  const handleAptitudeProgressChange = useCallback((answered: number) => {
    setAptitudeProgress(answered)
  }, [])

  const handleAptitudeComplete = useCallback(() => {
    // 임시 저장 데이터 삭제
    localStorage.removeItem(APTITUDE_TEST_STORAGE_KEY)
    refetch()
    setCurrentStep('results')
    // 결과 화면을 보여주기 위해 onComplete는 호출하지 않음
  }, [refetch])

  const handleSkipAptitude = useCallback(() => {
    onComplete?.()
  }, [onComplete])

  const handleRetakeAptitude = useCallback(() => {
    setCurrentStep('aptitude')
  }, [])

  const handleEditBasic = useCallback(() => {
    setCurrentStep('basic')
  }, [])

  // 스텝 인디케이터
  const steps = [
    { id: 'basic', label: '기초 설문', icon: FileText },
    { id: 'aptitude', label: '성향 테스트', icon: Target },
    { id: 'results', label: '결과 확인', icon: CheckCircle2 },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  const containerClass = embedded
    ? 'w-full'
    : 'mx-auto w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-sm'

  return (
    <div className={containerClass}>
      {/* Step Indicator */}
      <div className={`${embedded ? 'pb-6' : 'border-b border-gray-200 px-8 py-6'}`}>
        {/* Progress Display */}
        <div className="mb-4 flex items-center justify-end gap-2 text-sm">
          <span className="text-gray-500">진행률</span>
          <span className="font-semibold text-amber-600">
            {Math.round(calculateOverallProgress())}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStepIndex
            const isCompleted = index < currentStepIndex
            // 클릭 가능 여부: 성향 테스트 중일 때만 기초 설문으로 돌아갈 수 있음
            // (결과 화면에서는 기존 수정/다시하기 버튼 사용)
            const isClickable = currentStep === 'aptitude' && isCompleted

            const handleStepClick = () => {
              if (isClickable && !isActive) {
                setCurrentStep(step.id as SurveyStep)
              }
            }

            return (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={handleStepClick}
                    disabled={!isClickable || isActive}
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                      isActive
                        ? 'bg-amber-500 text-white'
                        : isCompleted
                          ? `bg-green-500 text-white${isClickable ? ' hover:bg-green-600 cursor-pointer' : ''}`
                          : 'bg-gray-100 text-gray-400'
                    } ${isClickable && !isActive ? 'hover:scale-110' : ''}`}
                    title={isClickable && !isActive ? `${step.label}(으)로 이동` : undefined}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isActive ? 'text-amber-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 flex-1 transition-colors ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className={embedded ? '' : 'px-8 py-6'}>
        <AnimatePresence mode="wait">
          {currentStep === 'basic' && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <BasicSurveyStep
                existingData={survey?.basicSurvey}
                onComplete={handleBasicComplete}
              />
            </motion.div>
          )}

          {currentStep === 'aptitude' && (
            <motion.div
              key="aptitude"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <AptitudeTestStep
                onComplete={handleAptitudeComplete}
                onSkip={handleSkipAptitude}
                onProgressChange={handleAptitudeProgressChange}
              />
            </motion.div>
          )}

          {currentStep === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <SurveyResultsStep
                survey={survey}
                onEditBasic={handleEditBasic}
                onRetakeAptitude={handleRetakeAptitude}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 기초 설문 완료 후 성향 테스트 진행 확인 모달 */}
      <AptitudeContinueModal
        open={showContinueModal}
        onContinue={handleContinueToAptitude}
        onLater={handleSkipToResults}
      />
    </div>
  )
}
