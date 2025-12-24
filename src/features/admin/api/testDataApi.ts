import { api } from '@/lib/axios'

/**
 * 테스트 데이터 생성 응답 타입
 */
export interface TestDataCreateResponse {
  batchId: string
  created: {
    organizations: number[]
    lectures: number[]
    members: number[]
    certificates: number[]
    reviews: number[]
    surveys: number[]
    banners: number[]
  }
  totalCount: number
}

/**
 * 테스트 데이터 현황 응답 타입
 */
export interface TestDataSummaryResponse {
  exists: boolean
  batchId: string | null
  counts: {
    organizations: number
    lectures: number
    members: number
    certificates: number
    reviews: number
    member_surveys: number
    banners: number
  } | null
  totalCount: number
  createdAt: string | null
}

/**
 * 테스트 데이터 생성 API
 */
export async function createTestData(): Promise<TestDataCreateResponse> {
  const { data } = await api.post<TestDataCreateResponse>('/admin/test-data')
  return data
}

/**
 * 테스트 데이터 삭제 API
 */
export async function deleteTestData(): Promise<void> {
  await api.delete('/admin/test-data')
}

/**
 * 테스트 데이터 현황 조회 API
 */
export async function fetchTestDataSummary(): Promise<TestDataSummaryResponse> {
  const { data } = await api.get<TestDataSummaryResponse>('/admin/test-data/summary')
  return data
}
