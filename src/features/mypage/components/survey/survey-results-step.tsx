'use client'

import { useState } from 'react'

import { Code2, Database, Layers, Palette, Pencil, RefreshCw, Sparkles, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { usePublishedQuestionSetQuery } from '../../hooks/use-survey'
import type { RecommendedJob, SurveyResponse } from '../../types/survey.type'
import {
  BUDGET_RANGE_LABELS,
  DESIRED_JOB_LABELS,
  LEARNING_METHOD_LABELS,
  RECOMMENDED_JOB_LABELS,
} from '../../types/survey.type'

interface SurveyResultsStepProps {
  survey: SurveyResponse | null | undefined
  onEditBasic: () => void
  onRetakeAptitude: () => void
  onClose?: () => void
}

const RECOMMENDED_JOB_ICONS: Record<RecommendedJob, LucideIcon> = {
  FRONTEND: Palette,
  BACKEND: Code2,
  DATA: Database,
  FULLSTACK: Layers,
}

function RecommendedJobIcon({ job, className }: { job: RecommendedJob | undefined; className?: string }) {
  const Icon = job ? RECOMMENDED_JOB_ICONS[job] : Sparkles
  return <Icon className={className} />
}

export function SurveyResultsStep({
  survey,
  onEditBasic,
  onRetakeAptitude,
  onClose,
}: SurveyResultsStepProps) {
  const [showRetakeConfirm, setShowRetakeConfirm] = useState(false)
  const basicSurvey = survey?.basicSurvey
  const results = survey?.results
  const status = survey?.status

  // 발행된 성향 테스트 문항 세트 조회 (문항 수 표시용)
  const { data: aptitudeQuestionSet } = usePublishedQuestionSetQuery('APTITUDE')
  const questionCount = aptitudeQuestionSet?.questions?.length ?? 0

  const handleRetakeClick = () => {
    if (status?.hasAptitudeTest) {
      // 이미 테스트를 완료한 경우 확인 모달 표시
      setShowRetakeConfirm(true)
    } else {
      // 처음 테스트하는 경우 바로 시작
      onRetakeAptitude()
    }
  }

  const handleConfirmRetake = () => {
    setShowRetakeConfirm(false)
    onRetakeAptitude()
  }

  // 추천 직무 설명
  const getRecommendedJobDescription = (job: RecommendedJob | undefined) => {
    switch (job) {
      case 'FRONTEND':
        return '사용자 인터페이스와 시각적 경험을 만드는 것에 재능이 있어요. 창의적인 디자인과 사용자 경험에 관심이 많은 당신에게 딱 맞아요!'
      case 'BACKEND':
        return '시스템과 로직을 설계하는 것에 재능이 있어요. 안정적인 서버와 효율적인 데이터 처리에 관심이 많은 당신에게 딱 맞아요!'
      case 'DATA':
        return '데이터 분석과 인사이트 도출에 재능이 있어요. 숫자로 세상을 이해하고 AI를 활용하는 것에 관심이 많은 당신에게 딱 맞아요!'
      case 'FULLSTACK':
        return '프론트엔드와 백엔드 모두에 관심이 있어요. 서비스 전체를 이해하고 다양한 기술을 활용하고 싶은 당신에게 딱 맞아요!'
      default:
        return '성향 테스트를 완료하면 맞춤 직무를 추천받을 수 있어요.'
    }
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">설문조사 결과</h2>
        <p className="mt-1 text-sm text-gray-500">
          AI 추천에 활용되는 당신의 프로필입니다
        </p>
        {/* 설문조사 완료 상태 표시 */}
        <div className="mt-3">
          {status?.hasAptitudeTest ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-sm font-medium text-success">
              <span className="h-2 w-2 rounded-full bg-success" />
              설문조사가 완료되었습니다
            </span>
          ) : status?.hasBasicSurvey ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-sm font-medium text-warning">
              <span className="h-2 w-2 rounded-full bg-warning" />
              기초 설문 완료 (성향 테스트 미완료)
            </span>
          ) : null}
        </div>
      </div>

      {/* 추천 직무 카드 (성향 테스트 완료 시) */}
      {results?.recommendedJob && (
        <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white/20 p-3">
              <RecommendedJobIcon job={results.recommendedJob} className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white/80">당신에게 추천하는 직무</p>
              <h3 className="mt-1 text-2xl font-bold">
                {RECOMMENDED_JOB_LABELS[results.recommendedJob]}
              </h3>
              <p className="mt-2 text-sm text-white/90">
                {getRecommendedJobDescription(results.recommendedJob)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 성향 테스트 미완료 시 안내 */}
      {!status?.hasAptitudeTest && (
        <div className="rounded-xl border-2 border-dashed border-warning/50 bg-warning/10 p-6 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-warning" />
          <h3 className="mt-3 font-semibold text-gray-900">
            성향 테스트를 완료하면 맞춤 직무를 추천받을 수 있어요!
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {questionCount > 0 ? `${questionCount}문항` : '문항'} / 약 1분 소요 / AI 정밀 추천 활성화
          </p>
          <Button
            onClick={handleRetakeClick}
            className="mt-4 bg-warning text-warning-foreground hover:bg-warning/90"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            성향 테스트 시작
          </Button>
        </div>
      )}

      {/* AI 추천 상태 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div
          className={`rounded-xl border p-4 ${
            status?.canUseBasicRecommendation
              ? 'border-success/30 bg-success/10'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${
                status?.canUseBasicRecommendation ? 'bg-success' : 'bg-gray-300'
              }`}
            />
            <span className="font-medium text-gray-900">AI 기본 추천</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {status?.canUseBasicRecommendation
              ? '사용 가능'
              : '기초 설문 완료 필요'}
          </p>
        </div>
        <div
          className={`rounded-xl border p-4 ${
            status?.canUsePreciseRecommendation
              ? 'border-success/30 bg-success/10'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${
                status?.canUsePreciseRecommendation ? 'bg-success' : 'bg-gray-300'
              }`}
            />
            <span className="font-medium text-gray-900">AI 정밀 추천</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {status?.canUsePreciseRecommendation
              ? '사용 가능'
              : '성향 테스트 완료 필요'}
          </p>
        </div>
      </div>

      {/* 기초 설문 요약 */}
      {basicSurvey && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">기초 설문 정보</h3>
            <Button variant="ghost" size="sm" onClick={onEditBasic} className="gap-1">
              <Pencil className="h-4 w-4" />
              수정
            </Button>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">전공</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {basicSurvey.majorInfo?.hasMajor
                    ? basicSurvey.majorInfo.majorName
                    : '비전공'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">프로그래밍 경험</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {basicSurvey.programmingExperience?.hasExperience ? '있음' : '없음'}
                  {basicSurvey.programmingExperience?.bootcampName && ` (${basicSurvey.programmingExperience.bootcampName})`}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">선호 수업 방식</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {LEARNING_METHOD_LABELS[basicSurvey.preferredLearningMethod]}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">희망 직무</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {basicSurvey.desiredJobs.map((j) => DESIRED_JOB_LABELS[j]).join(', ')}
                  {basicSurvey.desiredJobOther && ` (${basicSurvey.desiredJobOther})`}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">교육비 부담 가능 금액</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {BUDGET_RANGE_LABELS[basicSurvey.affordableBudgetRange]}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="flex flex-col items-center gap-3">
        {onClose && (
          <Button onClick={onClose} className="w-full max-w-xs">
            확인
          </Button>
        )}

        {status?.hasAptitudeTest && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleRetakeClick}
              className="w-full max-w-xs gap-2 text-gray-600"
            >
              <RefreshCw className="h-4 w-4" />
              성향 테스트 다시하기
            </Button>
            <p className="mt-2 text-xs text-gray-400">
              다시 테스트하면 기존 결과가 덮어씌워집니다
            </p>
          </div>
        )}
      </div>

      {/* 성향 테스트 재응시 확인 모달 */}
      <Dialog open={showRetakeConfirm} onOpenChange={setShowRetakeConfirm}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>성향 테스트를 다시 하시겠습니까?</DialogTitle>
            <DialogDescription>
              테스트를 다시 진행하면 기존 결과(추천 직무)가 새 결과로 덮어씌워집니다.
              이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRetakeConfirm(false)}>
              취소
            </Button>
            <Button onClick={handleConfirmRetake}>
              다시 테스트하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
