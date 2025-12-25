/**
 * Spring Data Page 응답 - PageInfo
 */
export interface PageInfo {
  size: number
  number: number // 현재 페이지 (0-indexed)
  totalElements: number
  totalPages: number
}

/**
 * 페이지네이션 응답
 */
export interface PageResponse<T> {
  content: T[]
  page: PageInfo
}
