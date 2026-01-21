import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateLecture, type UpdateLectureParams } from '@/features/lecture/api/lecture.api'
import type { LectureCreateResponse } from '@/features/lecture/types/lecture-request.type'

export const useUpdateLectureMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<LectureCreateResponse, unknown, UpdateLectureParams>({
    mutationFn: updateLecture,
    onSuccess: (_data, variables) => {
      // 강의 상세 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['lectureDetail', String(variables.lectureId)] })
      // 마이페이지 강의 목록 무효화
      queryClient.invalidateQueries({ queryKey: ['mypage', 'lectures'] })
    },
  })
}
