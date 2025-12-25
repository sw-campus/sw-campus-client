/**
 * 리뷰 카테고리 타입
 */
export type ReviewCategory = 'TEACHER' | 'CURRICULUM' | 'MANAGEMENT' | 'FACILITY' | 'PROJECT'

/**
 * 카테고리별 점수 응답 타입
 */
export interface DetailScore {
  category: ReviewCategory
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
export const CATEGORY_LABELS: Record<ReviewCategory, string> = {
  TEACHER: '강사',
  CURRICULUM: '커리큘럼',
  MANAGEMENT: '취업지원',
  FACILITY: '운영 및 학습환경',
  PROJECT: '프로젝트 및 학습지원',
}

/**
 * 후기 정렬 타입
 */
export type ReviewSortType = 'LATEST' | 'OLDEST' | 'SCORE_DESC' | 'SCORE_ASC'

/**
 * 정렬 옵션 라벨 매핑
 */
export const REVIEW_SORT_LABELS: Record<ReviewSortType, string> = {
  LATEST: '최신순',
  OLDEST: '오래된순',
  SCORE_DESC: '별점 높은순',
  SCORE_ASC: '별점 낮은순',
}

/**
 * 페이지 응답 타입 (Spring Data Page 호환)
 */
export interface ReviewPageResponse {
  content: Review[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}
