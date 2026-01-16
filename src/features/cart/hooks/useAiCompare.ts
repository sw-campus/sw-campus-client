'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type {
  AiSurveyInput,
  ComparisonResult,
  RecommendationLevel,
} from '@/features/lecture/actions/gemini'
import type { LectureDetail } from '@/features/lecture/api/lectureApi.types'
import type { ProfileResponse } from '@/features/mypage/api/survey.api'
import type { SurveyResponse } from '@/features/mypage/types/survey.type'

/**
 * AI 비교 결과 캐시 키 생성
 * - 두 강의 ID를 정렬하여 동일한 조합이면 같은 키가 되도록 함
 * - [1, 2]와 [2, 1]이 같은 캐시를 사용
 */
function getCompareQueryKey(leftId: number | string, rightId: number | string) {
  const left = typeof leftId === 'string' ? parseInt(leftId, 10) : leftId
  const right = typeof rightId === 'string' ? parseInt(rightId, 10) : rightId
  const sortedIds = [left, right].sort((a, b) => a - b)
  return ['ai-compare', sortedIds[0], sortedIds[1]] as const
}

/**
 * SurveyResponse를 AiSurveyInput으로 변환
 * 설문 완료 상태에 따라 recommendationLevel 결정
 */
function toAiSurveyInput(survey: SurveyResponse, profile: ProfileResponse): AiSurveyInput {
  const level: RecommendationLevel = survey.status?.canUsePreciseRecommendation ? 'precise' : 'basic'

  return {
    major: survey.basicSurvey?.majorInfo?.hasMajor
      ? (survey.basicSurvey.majorInfo.majorName ?? '')
      : '비전공',
    programmingExperience: {
      hasExperience: survey.basicSurvey?.programmingExperience?.hasExperience ?? false,
      bootcampName: survey.basicSurvey?.programmingExperience?.bootcampName ?? null,
    },
    preferredLearningMethod: survey.basicSurvey?.preferredLearningMethod ?? 'MIXED',
    desiredJobs: survey.basicSurvey?.desiredJobs ?? [],
    affordableBudgetRange: survey.basicSurvey?.affordableBudgetRange ?? 'RANGE_100_200',
    recommendedJob: survey.results?.recommendedJob,
    userLocation: profile.location,
    recommendationLevel: level,
  }
}

interface UseAiCompareOptions {
  leftId: number | string | null
  rightId: number | string | null
  leftDetail: LectureDetail | null | undefined
  rightDetail: LectureDetail | null | undefined
  isLoggedIn: boolean
}

/**
 * AI 비교 분석 훅 (TanStack Query 캐싱 적용)
 *
 * 캐시 전략:
 * - staleTime: 30분 (같은 비교 결과 30분간 재사용)
 * - gcTime: 1시간 (메모리에서 1시간 유지)
 * - 강의 조합별로 캐시 (leftId, rightId 정렬하여 키 생성)
 */
export function useAiCompare({ leftId, rightId, leftDetail, rightDetail, isLoggedIn }: UseAiCompareOptions) {
  const queryClient = useQueryClient()

  // 캐시 키 (두 강의 ID가 있을 때만 유효)
  const queryKey = leftId && rightId ? getCompareQueryKey(leftId, rightId) : null

  // 기존 캐시된 결과 조회
  const { data: cachedResult } = useQuery<ComparisonResult | null>({
    queryKey: queryKey ?? ['ai-compare', 'none'],
    queryFn: () => null, // 초기 쿼리는 null 반환 (mutate로 데이터 저장)
    enabled: false, // 자동 실행 비활성화
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000, // 1시간
  })

  // AI 비교 분석 실행 mutation
  const mutation = useMutation<ComparisonResult, Error, { survey: AiSurveyInput }>({
    mutationFn: async ({ survey }) => {
      if (!leftDetail || !rightDetail) {
        throw new Error('두 강의를 모두 선택해주세요')
      }

      // 동적 import로 Gemini 모듈 로드
      const { compareCoursesWithAI } = await import('@/features/lecture/actions/gemini')
      return compareCoursesWithAI(leftDetail, rightDetail, survey)
    },
    onSuccess: data => {
      // 성공 시 캐시에 저장
      if (queryKey) {
        queryClient.setQueryData(queryKey, data)
      }
      toast.success('AI 분석이 완료되었습니다!')
    },
    onError: error => {
      const errorMessage = error.message || 'AI 분석 중 오류가 발생했습니다.'
      toast.error(`${errorMessage} 잠시 후 다시 시도해주세요.`)
    },
  })

  // 캐시된 결과가 있으면 반환, 없으면 mutation 결과 반환
  const result = cachedResult ?? mutation.data ?? null

  // 비교 분석 실행 함수
  const analyze = async () => {
    if (!leftDetail || !rightDetail) {
      toast.error('두 강의를 모두 선택해주세요')
      return
    }

    if (!isLoggedIn) {
      toast.error('로그인이 필요한 기능입니다')
      return
    }

    // 일반 회원만 AI 비교 기능 사용 가능 (기관 회원/관리자 차단)
    try {
      const { useAuthStore } = await import('@/store/authStore')
      const userType = useAuthStore.getState().userType
      if (userType === 'ORGANIZATION' || userType === 'ADMIN') {
        toast.error('AI 비교 기능은 일반 회원만 이용 가능합니다.')
        return
      }
    } catch {
      // 인증 스토어 접근 실패시 계속 진행
    }

    // 이미 캐시된 결과가 있으면 재사용
    if (cachedResult) {
      toast.success('캐시된 AI 분석 결과를 사용합니다!')
      return cachedResult
    }

    // 사용자 데이터 조회
    try {
      const surveyModule = await import('@/features/mypage/api/survey.api')

      const [survey, profile] = await Promise.all([
        surveyModule.getMySurvey(),
        surveyModule.getProfile(),
      ])

      // 설문이 없거나 기초 설문 미완료 시
      if (!survey || !survey.status?.hasBasicSurvey) {
        return { needsSurvey: true }
      }

      // 설문 데이터를 AI 입력 형식으로 변환
      const aiSurveyInput = toAiSurveyInput(survey, profile)

      // AI 분석 실행
      await mutation.mutateAsync({ survey: aiSurveyInput })
    } catch (error) {
      console.error('AI Analysis Error:', error)
      // 권한 에러 (기관 회원/관리자)인 경우 별도 메시지
      if (error instanceof Error && (error.message.includes('403') || error.message.includes('권한'))) {
        toast.error('AI 비교 기능은 일반 회원만 이용 가능합니다.')
      } else {
        toast.error('AI 비교 기능은 일반 회원만 이용 가능합니다.')
      }
    }
  }

  // 캐시 초기화
  const clearResult = () => {
    if (queryKey) {
      queryClient.removeQueries({ queryKey })
    }
    mutation.reset()
  }

  return {
    result,
    isLoading: mutation.isPending,
    analyze,
    clearResult,
    hasCachedResult: !!cachedResult,
  }
}
