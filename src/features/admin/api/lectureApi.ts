import { api } from '@/lib/axios'
import type { PageResponse } from '@/types/api.type'

import type { LectureAuthStatus, LectureDetail, LectureSummary } from '../types/lecture.type'

/**
 * Lecture 목록 조회 API (페이징)
 * @param status - 승인 상태 필터 (undefined면 전체)
 * @param keyword - 검색 키워드 (강의명)
 * @param page - 페이지 번호 (0-indexed)
 * @param size - 페이지 크기
 */
export async function fetchLectures(
  status?: LectureAuthStatus,
  keyword?: string,
  page: number = 0,
  size: number = 10,
): Promise<PageResponse<LectureSummary>> {
  const { data } = await api.get<PageResponse<LectureSummary>>('/admin/lectures', {
    params: {
      ...(status && { status }),
      ...(keyword && { keyword }),
      page,
      size,
    },
  })
  return data
}

/**
 * Lecture 상세 조회 API
 * @param lectureId - Lecture ID
 */
export async function fetchLectureDetail(lectureId: number): Promise<LectureDetail> {
  const { data } = await api.get<LectureDetail>(`/admin/lectures/${lectureId}`)
  return data
}

/**
 * Lecture 승인 API
 * @param lectureId - Lecture ID
 */
export async function approveLecture(lectureId: number): Promise<void> {
  await api.patch(`/admin/lectures/${lectureId}/approve`)
}

/**
 * Lecture 반려 API
 * @param lectureId - Lecture ID
 */
export async function rejectLecture(lectureId: number): Promise<void> {
  await api.patch(`/admin/lectures/${lectureId}/reject`)
}
