export interface CourseTag {
  id: number
  name: string // "웹개발", "데이터·AI" 등
}

export interface Course {
  id: number
  title: string // 교육명
  organization: string // 주관 기관
  periodStart: string // YYYY-MM-DD
  periodEnd: string // YYYY-MM-DD
  tags: CourseTag[] // 태그(제작자/온라인/멘토링 등)
  imageUrl?: string // 섬네일 이미지
}

export interface CourseListResponse {
  items: Course[]
  total: number
}
