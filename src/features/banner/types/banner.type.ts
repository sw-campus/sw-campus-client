/**
 * 배너 타입 정의
 * 백엔드 BannerType enum과 동일
 */
export type BannerType = 'BIG' | 'SMALL' | 'TEXT'

/**
 * 모집 유형
 * 백엔드 RecruitType enum과 동일
 */
export type RecruitType = 'CARD_REQUIRED' | 'GENERAL'

/**
 * 배너 응답 인터페이스
 * 백엔드 BannerResponse record와 매핑
 */
export interface Banner {
  id: number
  lectureId: number
  type: BannerType
  content: string
  imageUrl: string | null
  startDate: string
  endDate: string
  isActive: boolean
  lectureName: string
  lectureStartAt: string
  lectureDeadline: string
  recruitType: RecruitType
  orgName: string | null
}
