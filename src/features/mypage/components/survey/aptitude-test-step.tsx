'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { AxiosError } from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { Brain, ChevronLeft, Lightbulb, Loader2, Target } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

import { SURVEY_MESSAGES } from '../../constants/survey-messages'
import { ALL_APTITUDE_QUESTIONS as FALLBACK_QUESTIONS } from '../../constants/survey-questions'
import { usePublishedQuestionSetQuery, useSubmitAptitudeTestMutation } from '../../hooks/use-survey'
import type { AptitudeQuestion, JobTypeCode, SubmitAptitudeTestRequest } from '../../types/survey.type'
import { APTITUDE_TEST_STORAGE_KEY, mapQuestionSetToAptitudeQuestions } from '../../types/survey.type'

/** 다음 문항으로 자동 이동하는 딜레이 (ms) */
const AUTO_ADVANCE_DELAY_MS = 300

interface AptitudeTestStepProps {
  onComplete: () => void
  onSkip: () => void
  onProgressChange?: (answered: number) => void
}

interface DraftAnswers {
  part1: Record<string, number>
  part2: Record<string, number>
  part3: Record<string, JobTypeCode>
  currentQuestionIndex: number
  questionSetVersion: number | null
}

const DEFAULT_DRAFT: DraftAnswers = {
  part1: {},
  part2: {},
  part3: {},
  currentQuestionIndex: 0,
  questionSetVersion: null,
}

export function AptitudeTestStep({ onComplete, onSkip, onProgressChange }: AptitudeTestStepProps) {
  const submitAptitudeTest = useSubmitAptitudeTestMutation()
  const { data: questionSet, isLoading: isLoadingQuestions } = usePublishedQuestionSetQuery('APTITUDE')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<DraftAnswers>(DEFAULT_DRAFT)
  const [isTransitioning, setIsTransitioning] = useState(false) // 전환 중 클릭 비활성화
  const isInitializedRef = useRef(false)
  const versionCheckedRef = useRef(false) // 버전 체크 완료 여부

  // 서버에서 가져온 문항 또는 fallback 사용
  const allQuestions = useMemo<AptitudeQuestion[]>(() => {
    const dynamicQuestions = mapQuestionSetToAptitudeQuestions(questionSet ?? null)
    return dynamicQuestions ?? FALLBACK_QUESTIONS
  }, [questionSet])

  // Part별 문항 분류 (isAllAnswered에서 사용)
  const { part1Questions, part2Questions, part3Questions } = useMemo(() => {
    return {
      part1Questions: allQuestions.filter((q) => q.part === 1),
      part2Questions: allQuestions.filter((q) => q.part === 2),
      part3Questions: allQuestions.filter((q) => q.part === 3),
    }
  }, [allQuestions])

  const totalQuestions = allQuestions.length

  // localStorage에 저장하는 헬퍼 함수
  const saveToLocalStorage = useCallback((data: DraftAnswers) => {
    try {
      localStorage.setItem(APTITUDE_TEST_STORAGE_KEY, JSON.stringify(data))
    } catch {
      // 저장 실패 무시
    }
  }, [])

  // localStorage에서 임시 저장 데이터 로드
  useEffect(() => {
    try {
      const saved = localStorage.getItem(APTITUDE_TEST_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as DraftAnswers
        setAnswers(parsed)
        setCurrentIndex(parsed.currentQuestionIndex || 0)
      }
      isInitializedRef.current = true
    } catch {
      // 파싱 실패 시 기본값 사용
      isInitializedRef.current = true
    }
  }, [])

  // 문항 세트 버전 확인 및 저장
  useEffect(() => {
    if (!isInitializedRef.current || !questionSet || versionCheckedRef.current) return

    const savedVersion = answers.questionSetVersion

    // 저장된 버전이 없으면 현재 버전 저장
    if (savedVersion === null) {
      const newAnswers = { ...answers, questionSetVersion: questionSet.version }
      setAnswers(newAnswers)
      saveToLocalStorage(newAnswers)
      versionCheckedRef.current = true
      return
    }

    // 저장된 버전과 현재 발행된 버전이 다르면 진행 상황 초기화
    if (savedVersion !== questionSet.version) {
      const resetAnswers = { ...DEFAULT_DRAFT, questionSetVersion: questionSet.version }
      setAnswers(resetAnswers)
      setCurrentIndex(0)
      saveToLocalStorage(resetAnswers)
      toast.info('문항이 변경되어 처음부터 다시 시작합니다.')
    }

    versionCheckedRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps -- answers는 의도적으로 제외 (무한 루프 방지)
  }, [questionSet, answers.questionSetVersion, saveToLocalStorage])

  // 진행률을 상위 컴포넌트에 전달
  useEffect(() => {
    const answered =
      Object.keys(answers.part1).length +
      Object.keys(answers.part2).length +
      Object.keys(answers.part3).length
    onProgressChange?.(answered)
  }, [answers, onProgressChange])

  const currentQuestion = allQuestions[currentIndex]
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0

  const getCurrentAnswer = useCallback(() => {
    if (!currentQuestion) return undefined
    const { id, part } = currentQuestion
    if (part === 1) return answers.part1[id]
    if (part === 2) return answers.part2[id]
    if (part === 3) return answers.part3[id]
    return undefined
  }, [currentQuestion, answers])

  const handleSelectAnswer = useCallback(
    (value: number | JobTypeCode) => {
      if (!currentQuestion || isTransitioning) return

      const { id, part } = currentQuestion

      setAnswers((prev) => {
        const newAnswers = { ...prev, currentQuestionIndex: currentIndex }
        if (part === 1) {
          newAnswers.part1 = { ...prev.part1, [id]: value as number }
        } else if (part === 2) {
          newAnswers.part2 = { ...prev.part2, [id]: value as number }
        } else {
          newAnswers.part3 = { ...prev.part3, [id]: value as JobTypeCode }
        }
        // 답변과 함께 즉시 localStorage에 저장 (race condition 방지)
        saveToLocalStorage(newAnswers)
        return newAnswers
      })

      // 자동으로 다음 문항으로 이동 (마지막 문항 제외)
      if (currentIndex < totalQuestions - 1) {
        setIsTransitioning(true)
        setTimeout(() => {
          setCurrentIndex((prev) => {
            const nextIndex = prev + 1
            // currentIndex도 localStorage에 업데이트
            setAnswers((currentAnswers) => {
              const updated = { ...currentAnswers, currentQuestionIndex: nextIndex }
              saveToLocalStorage(updated)
              return updated
            })
            return nextIndex
          })
          // 애니메이션 완료 후 클릭 허용 (애니메이션 200ms + 여유 100ms)
          setTimeout(() => {
            setIsTransitioning(false)
          }, 300)
        }, AUTO_ADVANCE_DELAY_MS)
      }
    },
    [currentQuestion, currentIndex, isTransitioning, saveToLocalStorage, totalQuestions]
  )

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }, [currentIndex])

  const isAllAnswered = useCallback(() => {
    const part1Complete = part1Questions.every((q) => answers.part1[q.id] !== undefined)
    const part2Complete = part2Questions.every((q) => answers.part2[q.id] !== undefined)
    const part3Complete = part3Questions.every((q) => answers.part3[q.id] !== undefined)
    return part1Complete && part2Complete && part3Complete
  }, [answers, part1Questions, part2Questions, part3Questions])

  const handleSubmit = async () => {
    if (!isAllAnswered()) {
      toast.error(SURVEY_MESSAGES.ERROR.INCOMPLETE_ANSWERS)
      return
    }

    // 저장된 버전 또는 현재 questionSet 버전 사용
    const version = answers.questionSetVersion ?? questionSet?.version
    if (!version) {
      toast.error('문항 세트 정보를 불러올 수 없습니다.')
      return
    }

    try {
      const request: SubmitAptitudeTestRequest = {
        part1Answers: answers.part1,
        part2Answers: answers.part2,
        part3Answers: answers.part3,
        questionSetVersion: version,
      }
      await submitAptitudeTest.mutateAsync(request)
      // 성공 시 localStorage 정리
      localStorage.removeItem(APTITUDE_TEST_STORAGE_KEY)
      toast.success(SURVEY_MESSAGES.SUCCESS.APTITUDE_COMPLETED)
      onComplete()
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status
        if (!error.response) {
          toast.error(SURVEY_MESSAGES.ERROR.NETWORK_ERROR)
        } else if (status === 401 || status === 403) {
          toast.error(SURVEY_MESSAGES.ERROR.UNAUTHORIZED)
        } else if (status && status >= 500) {
          toast.error(SURVEY_MESSAGES.ERROR.SERVER_ERROR)
        } else {
          toast.error(SURVEY_MESSAGES.ERROR.SUBMIT_FAILED)
        }
      } else {
        toast.error(SURVEY_MESSAGES.ERROR.SUBMIT_FAILED)
      }
    }
  }

  // Part 정보
  const getPartInfo = (part: number) => {
    switch (part) {
      case 1:
        return { icon: Brain, label: 'Part 1: 논리 및 사고력', color: 'text-blue-600' }
      case 2:
        return { icon: Lightbulb, label: 'Part 2: 끈기 및 학습 태도', color: 'text-success' }
      case 3:
        return { icon: Target, label: 'Part 3: 직무 성향', color: 'text-purple-600' }
      default:
        return { icon: Brain, label: '', color: '' }
    }
  }

  const partInfo = currentQuestion ? getPartInfo(currentQuestion.part) : null
  const PartIcon = partInfo?.icon || Brain

  // 로딩 상태
  if (isLoadingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <p className="mt-4 text-gray-500">문항을 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">개발자 성향 테스트</h2>
        <p className="mt-1 text-sm text-gray-500">
          {totalQuestions}문항 / 약 1분 소요 / 건너뛰기 가능
        </p>
      </div>

      {/* 진행률 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">진행률</span>
          <span className="font-medium text-amber-600">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Part 표시 */}
      {partInfo && (
        <div className={`flex items-center gap-2 ${partInfo.color}`}>
          <PartIcon className="h-5 w-5" />
          <span className="font-medium">{partInfo.label}</span>
        </div>
      )}

      {/* 문항 */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="rounded-xl bg-gray-50 p-6">
              <p className="whitespace-pre-line text-lg font-medium text-gray-900">
                Q{currentIndex + 1}. {currentQuestion.question}
              </p>
            </div>

            <div className="space-y-3" role="listbox" aria-label="선택지">
              {currentQuestion.options.map((option, index) => {
                const isSelected = getCurrentAnswer() === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={isTransitioning}
                    onClick={() => handleSelectAnswer(option.value)}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                      isSelected
                        ? 'border-warning bg-warning/10'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                          isSelected
                            ? 'bg-warning text-warning-foreground'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className={isSelected ? 'text-amber-900' : 'text-gray-700'}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 네비게이션 */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          이전
        </Button>

        {/* 마지막 문항에서만 결과 확인 버튼 표시 */}
        {currentIndex === totalQuestions - 1 && (
          <Button
            onClick={handleSubmit}
            disabled={!isAllAnswered() || submitAptitudeTest.isPending}
            className="bg-warning text-warning-foreground hover:bg-warning/90"
          >
            {submitAptitudeTest.isPending ? '제출 중...' : '결과 확인'}
          </Button>
        )}
      </div>

      {/* 건너뛰기 */}
      <div className="border-t border-gray-200 pt-4 text-center">
        <button
          type="button"
          onClick={onSkip}
          className="text-sm text-gray-500 underline hover:text-gray-700"
        >
          나중에 하기 (기초 설문만으로도 AI 추천을 받을 수 있습니다)
        </button>
      </div>
    </div>
  )
}
