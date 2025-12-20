import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { approveLecture, fetchLectureDetail, fetchLectures, rejectLecture } from '../api/lectureApi'
import type { LectureAuthStatus } from '../types/lecture.type'

/**
 * Lecture 목록 조회 Query Hook
 * @param status - 승인 상태 필터 (undefined면 전체)
 * @param keyword - 검색 키워드 (강의명)
 * @param page - 페이지 번호 (0-indexed, 기본값: 0)
 */
export function useLecturesQuery(status?: LectureAuthStatus, keyword?: string, page: number = 0) {
  return useQuery({
    queryKey: ['admin', 'lectures', status ?? 'ALL', keyword ?? '', page],
    queryFn: () => fetchLectures(status, keyword, page),
    staleTime: 1000 * 60 * 5, // 5분간 fresh 유지
  })
}

/**
 * Lecture 상세 조회 Query Hook
 * @param lectureId - Lecture ID
 */
export function useLectureDetailQuery(lectureId: number) {
  return useQuery({
    queryKey: ['admin', 'lecture', lectureId],
    queryFn: () => fetchLectureDetail(lectureId),
    staleTime: 1000 * 60 * 5,
    enabled: !!lectureId,
  })
}

/**
 * Lecture 승인 Mutation Hook
 */
export function useApproveLectureMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveLecture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'lectures'] })
      toast.success('강의가 승인되었습니다.')
    },
  })
}

/**
 * Lecture 반려 Mutation Hook
 */
export function useRejectLectureMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectLecture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'lectures'] })
      toast.success('강의가 반려되었습니다.')
    },
  })
}
