import { useMutation } from '@tanstack/react-query'

import { createLecture } from '@/features/lecture/api/lecture.api'
import type { LectureCreateRequest, LectureCreateResponse } from '@/features/lecture/types/lecture-request.type'

export const useCreateLectureMutation = () => {
  return useMutation<LectureCreateResponse, unknown, LectureCreateRequest>({
    mutationFn: createLecture,
  })
}
