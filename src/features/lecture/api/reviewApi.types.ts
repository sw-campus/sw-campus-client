/**
 * 카테고리별 점수 응답 타입
 */
export interface DetailScore {
  category: string // TEACHER, CURRICULUM, MANAGEMENT, FACILITY, PROJECT
  score: number
  comment: string
}

/**
 * 후기 응답 타입
 */
export interface Review {
  reviewId: number
  lectureId: number
  memberId: number
  nickname: string
  comment: string
  score: number
  detailScores: DetailScore[]
  approvalStatus: string
  blurred: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 카테고리 한국어 라벨 매핑
 */
export const CATEGORY_LABELS: Record<string, string> = {
  TEACHER: '강사',
  CURRICULUM: '커리큘럼',
  MANAGEMENT: '취업지원',
  FACILITY: '운영 및 학습환경',
  PROJECT: '프로젝트 및 학습지원',
}
