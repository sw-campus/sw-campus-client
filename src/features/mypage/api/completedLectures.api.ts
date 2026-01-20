import { type ApprovalStatus } from '@/features/admin/types/approval.type'
import { api } from '@/lib/axios'

export type CertificateStatus = ApprovalStatus
export type ReviewStatus = ApprovalStatus

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
  reviewStatus?: ReviewStatus
}

/**
 * 수료 강의 목록 조회
 * 응답에 reviewStatus가 포함되어 있어 별도 API 호출 불필요
 */
export async function getCompletedLectures(): Promise<CompletedLecture[]> {
  const { data } = await api.get<CompletedLecture[]>('/mypage/completed-lectures')
  return Array.isArray(data) ? data : []
}
