/**
 * 배너 타입 정의
 * 백엔드 BannerType enum과 동일
 */
export type BannerType = 'BIG' | 'MIDDLE' | 'SMALL' | 'EVENT'

/**
 * 모집 유형
 * 백엔드 RecruitType enum과 동일
 */
export type RecruitType = 'CARD_REQUIRED' | 'GENERAL'

/**
 * 배너 응답 인터페이스
 * 백엔드 BannerResponse record와 매핑
 * EVENT 타입 배너는 lectureId 및 강의 관련 필드가 null일 수 있음
 */
export interface Banner {
  id: number
  lectureId: number | null
  type: BannerType
  url: string | null
  imageUrl: string | null
  backgroundColor: string | null
  startDate: string
  endDate: string
  isActive: boolean
  lectureName: string | null
  lectureStartAt: string | null
  lectureDeadline: string | null
  recruitType: RecruitType | null
  orgName: string | null
}
