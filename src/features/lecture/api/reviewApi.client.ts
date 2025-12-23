import { api } from '@/lib/axios'

import type { Review } from './reviewApi.types'

/**
 * 강의별 승인된 후기 조회 API
 */
export async function getLectureReviews(lectureId: string | number): Promise<Review[]> {
  const { data } = await api.get<Review[]>(`/lectures/${lectureId}/reviews`)
  return data
}

/**
 * 기관별 승인된 후기 조회 API
 */
export async function getOrganizationReviews(organizationId: string | number): Promise<Review[]> {
  const { data } = await api.get<Review[]>(`/organizations/${organizationId}/reviews`)
  return data
}

/**
 * 강의 후기 등록 API
 * 서버 스펙이 확정되기 전까지 최소 필드로 요청합니다.
 */
export async function createLectureReview(
  lectureId: string | number,
  payload: {
    lectureId: string | number
    comment: string
    score: number
    detailScores: Array<{ category: string; score: number; comment: string }>
  },
) {
  const { data } = await api.post(`/lectures/${lectureId}/reviews`, payload)
  return data
}
