'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { ComparisonResult, UserSurvey } from '@/features/lecture/actions/gemini'
import type { LectureDetail } from '@/features/lecture/api/lectureApi.types'

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
  const mutation = useMutation<ComparisonResult, Error, { survey: UserSurvey }>({
    mutationFn: async ({ survey }) => {
      if (!leftDetail || !rightDetail) {
        throw new Error('두 강의를 모두 선택해주세요')
      }
      
      // 동적 import로 Gemini 모듈 로드
      const { compareCoursesWithAI } = await import('@/features/lecture/actions/gemini')
      return compareCoursesWithAI(leftDetail, rightDetail, survey)
    },
    onSuccess: (data) => {
      // 성공 시 캐시에 저장
      if (queryKey) {
        queryClient.setQueryData(queryKey, data)
      }
      toast.success('AI 분석이 완료되었습니다!')
    },
    onError: (error) => {
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
    
    // 이미 캐시된 결과가 있으면 재사용
    if (cachedResult) {
      toast.success('캐시된 AI 분석 결과를 사용합니다!')
      return cachedResult
    }
    
    // 사용자 데이터 조회
    try {
      const surveyModule = await import('@/features/mypage/api/survey.api')
      
      const [survey, profile] = await Promise.all([
        surveyModule.getSurvey(),
        surveyModule.getProfile(),
      ])
      
      if (!survey.exists) {
        return { needsSurvey: true }
      }
      
      // AI 분석 실행
      await mutation.mutateAsync({
        survey: {
          ...survey,
          userLocation: profile.location,
        },
      })
    } catch (error) {
      console.error('AI Analysis Error:', error)
      toast.error('사용자 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
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
