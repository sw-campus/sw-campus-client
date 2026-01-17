import { api } from '@/lib/axios'

export type CertificateStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type CompletedLecture = {
  certificateId: number
  lectureId: number
  lectureName: string
  lectureImageUrl?: string
  organizationName: string
  certifiedAt: string
  canWriteReview: boolean
  reviewId?: number
  certificateImageUrl?: string
  certificateStatus?: CertificateStatus
}

export type ReviewResponse = {
  approvalStatus?: string
}

/**
 * 수료 강의 목록 조회
 */
export async function getCompletedLectures(): Promise<CompletedLecture[]> {
  const { data } = await api.get<CompletedLecture[]>('/mypage/completed-lectures')
  return Array.isArray(data) ? data : []
}

/**
 * 특정 강의의 리뷰 상태 조회
 */
export async function getReviewStatus(lectureId: number): Promise<ReviewStatus> {
  try {
    const { data } = await api.get<ReviewResponse>(`/mypage/completed-lectures/${lectureId}/review`)
    const statusStr = String(data?.approvalStatus ?? '').toUpperCase()
    if (statusStr === 'APPROVED') return 'APPROVED'
    if (statusStr === 'REJECTED') return 'REJECTED'
    return 'PENDING'
  } catch {
    return 'PENDING'
  }
}

/**
 * 여러 강의의 리뷰 상태를 병렬로 조회
 */
export async function getReviewStatuses(
  lectures: CompletedLecture[],
): Promise<Map<number, ReviewStatus>> {
  const targetLectures = lectures.filter(l => !l.canWriteReview)
  if (targetLectures.length === 0) return new Map()

  const results = await Promise.all(
    targetLectures.map(async l => ({
      lectureId: l.lectureId,
      status: await getReviewStatus(l.lectureId),
    })),
  )

  return new Map(results.map(r => [r.lectureId, r.status]))
}
