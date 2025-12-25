import { api } from '@/lib/axios'

import type { Review, ReviewPageResponse, ReviewSortType } from './reviewApi.types'

/**
 * 강의별 승인된 후기 조회 API
 */
export async function getLectureReviews(lectureId: string | number): Promise<Review[]> {
  const { data } = await api.get<Review[]>(`/lectures/${lectureId}/reviews`)
  return data
}

/**
 * 기관별 승인된 후기 조회 API (페이지네이션, 정렬 지원)
 */
export async function getOrganizationReviews(
  organizationId: string | number,
  page: number = 0,
  size: number = 6,
  sort: ReviewSortType = 'LATEST',
): Promise<ReviewPageResponse> {
  const { data } = await api.get<ReviewPageResponse>(`/organizations/${organizationId}/reviews`, {
    params: { page, size, sort },
  })
  return data
}

/**
 * 강의 후기 등록 API
 * 서버 스펙이 확정되기 전까지 최소 필드로 요청합니다.
 */
export async function createCompletedLectureReview(
  lectureId: string | number,
  payload: { comment: string; detail_scores: Array<{ category: string; score: number; comment: string }> },
) {
  const { data } = await api.post(`/mypage/completed-lectures/${lectureId}/review`, payload)
  return data
}

/**
 * 후기 생성 API (스펙: POST /reviews)
 */
export async function createReview(
  lectureId: string | number,
  payload: { comment: string; detail_scores: Array<{ category: string; score: number; comment: string }> },
) {
  // 서버 DTO는 camelCase 키를 기대합니다: lectureId, detailScores
  const body = {
    lectureId: Number(lectureId),
    comment: payload.comment,
    detailScores: payload.detail_scores.map(item => ({
      category: item.category,
      score: item.score,
      comment: item.comment,
    })),
  }
  const { data } = await api.post(`/reviews`, body)
  return data
}

/**
 * 수료증 인증/작성 가능 여부를 확인하기 위해 마이페이지 리뷰 조회를 시도합니다.
 * - 200 OK 응답이면 인증된(또는 작성 가능) 상태로 간주합니다.
 * - 404/403 등 오류면 미인증으로 간주합니다.
 */
export async function isCertificateVerified(lectureId: string | number): Promise<boolean> {
  try {
    const { data } = await api.get<{ certified?: boolean }>(`/certificates/check`, {
      params: { lectureId },
    })
    return Boolean(data?.certified)
  } catch {
    return false
  }
}
