'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getMySurvey,
  getSurveyResults,
  getSurveyStatus,
  saveBasicSurvey,
  submitAptitudeTest,
} from '../api/survey.api'
import type {
  SaveBasicSurveyRequest,
  SubmitAptitudeTestRequest,
  SurveyResponse,
  SurveyResultsResponse,
  SurveyStatus,
} from '../types/survey.type'

// Query keys
export const surveyKeys = {
  all: ['survey'] as const,
  detail: () => [...surveyKeys.all, 'detail'] as const,
  results: () => [...surveyKeys.all, 'results'] as const,
  status: () => [...surveyKeys.all, 'status'] as const,
}

/**
 * 설문조사 전체 데이터 조회 훅
 */
export function useSurveyQuery() {
  return useQuery<SurveyResponse | null, Error>({
    queryKey: surveyKeys.detail(),
    queryFn: getMySurvey,
    staleTime: 5 * 60 * 1000, // 5분
  })
}

/**
 * 설문 결과 조회 훅
 */
export function useSurveyResultsQuery(enabled = true) {
  return useQuery<SurveyResultsResponse, Error>({
    queryKey: surveyKeys.results(),
    queryFn: getSurveyResults,
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * 설문 상태 조회 훅
 */
export function useSurveyStatusQuery() {
  return useQuery<SurveyStatus, Error>({
    queryKey: surveyKeys.status(),
    queryFn: getSurveyStatus,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * 기초 설문 저장 뮤테이션 훅
 */
export function useSaveBasicSurveyMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: SaveBasicSurveyRequest) => saveBasicSurvey(request),
    onSuccess: () => {
      // 설문 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: surveyKeys.all })
      // 프로필의 hasSurvey 상태 업데이트를 위해 프로필 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

/**
 * 성향 테스트 제출 뮤테이션 훅
 */
export function useSubmitAptitudeTestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: SubmitAptitudeTestRequest) => submitAptitudeTest(request),
    onSuccess: () => {
      // 설문 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: surveyKeys.all })
    },
  })
}

/**
 * 설문 완료 상태 확인 유틸리티 훅
 */
export function useSurveyCompletionStatus() {
  const { data: survey, isLoading } = useSurveyQuery()

  return {
    isLoading,
    hasBasicSurvey: survey?.status?.hasBasicSurvey ?? false,
    hasAptitudeTest: survey?.status?.hasAptitudeTest ?? false,
    canUseBasicRecommendation: survey?.status?.canUseBasicRecommendation ?? false,
    canUsePreciseRecommendation: survey?.status?.canUsePreciseRecommendation ?? false,
    recommendedJob: survey?.results?.recommendedJob ?? null,
  }
}
