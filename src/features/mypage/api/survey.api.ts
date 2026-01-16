import { AxiosError } from 'axios'

import { api } from '@/lib/axios'

import type {
  SaveBasicSurveyRequest,
  SubmitAptitudeTestRequest,
  SurveyResponse,
  SurveyResultsResponse,
  SurveyStatus,
} from '../types/survey.type'

/**
 * 설문조사 전체 조회
 * GET /api/v1/members/me/survey
 * 404 응답 시 null 반환 (설문이 없는 경우)
 */
export async function getMySurvey(): Promise<SurveyResponse | null> {
  try {
    const { data } = await api.get<SurveyResponse>('/members/me/survey')
    return data
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * 설문조사 전체 조회 (호환성 alias)
 * @see getMySurvey
 */
export const getSurvey = getMySurvey

/**
 * 기초 설문 저장
 * POST /api/v1/members/me/survey/basic
 */
export async function saveBasicSurvey(
  request: SaveBasicSurveyRequest
): Promise<SurveyResponse> {
  const { data } = await api.post<SurveyResponse>('/members/me/survey/basic', request)
  return data
}

/**
 * 성향 테스트 제출
 * POST /api/v1/members/me/survey/aptitude-test
 */
export async function submitAptitudeTest(
  request: SubmitAptitudeTestRequest
): Promise<SurveyResponse> {
  const { data } = await api.post<SurveyResponse>('/members/me/survey/aptitude-test', request)
  return data
}

/**
 * 설문 결과만 조회
 * GET /api/v1/members/me/survey/results
 */
export async function getSurveyResults(): Promise<SurveyResultsResponse> {
  const { data } = await api.get<SurveyResultsResponse>('/members/me/survey/results')
  return data
}

/**
 * 설문 상태 조회
 * GET /api/v1/members/me/survey/status
 */
export async function getSurveyStatus(): Promise<SurveyStatus> {
  const { data } = await api.get<SurveyStatus>('/members/me/survey/status')
  return data
}

// ============================================
// Legacy API (Deprecated - 호환성 유지용)
// ============================================

/**
 * @deprecated Use getMySurvey() instead
 */
export interface LegacySurveyResponse {
  surveyId: number | null
  major: string | null
  hasProgrammingExperience: boolean | null
  bootcampName: string | null
  preferredLearningMethod: string | null
  desiredJobs: string[] | null
  desiredJobOther: string | null
  affordableBudgetRange: string | null
  exists: boolean
}

/**
 * @deprecated Use getMySurvey() instead
 */
export async function getLegacySurvey(): Promise<LegacySurveyResponse> {
  const { data } = await api.get<LegacySurveyResponse>('/mypage/survey')
  return data
}

/**
 * 사용자 프로필 응답 타입
 */
export interface ProfileResponse {
  email: string
  name: string
  nickname: string
  phone: string | null
  location: string | null
  provider: string
  role: string
  hasSurvey: boolean
}

/**
 * 사용자 프로필 정보 조회 API
 * @returns 사용자의 프로필 정보 (주소 포함)
 */
export async function getProfile(): Promise<ProfileResponse> {
  const { data } = await api.get<ProfileResponse>('/mypage/profile')
  return data
}
