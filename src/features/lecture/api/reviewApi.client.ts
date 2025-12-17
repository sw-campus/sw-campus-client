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
