import { api } from '@/lib/axios'

/**
 * 사용자 설문조사 응답 타입
 */
export interface SurveyResponse {
  surveyId: number | null
  major: string | null
  bootcampCompleted: boolean | null
  wantedJobs: string | null
  licenses: string | null
  hasGovCard: boolean | null
  affordableAmount: number | null
  exists: boolean
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
 * 사용자 설문조사 정보 조회 API
 * @returns 사용자의 설문조사 정보 (없으면 exists: false)
 */
export async function getSurvey(): Promise<SurveyResponse> {
  const { data } = await api.get<SurveyResponse>('/mypage/survey')
  return data
}

/**
 * 사용자 프로필 정보 조회 API
 * @returns 사용자의 프로필 정보 (주소 포함)
 */
export async function getProfile(): Promise<ProfileResponse> {
  const { data } = await api.get<ProfileResponse>('/mypage/profile')
  return data
}
