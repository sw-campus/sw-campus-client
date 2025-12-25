import { useMutation } from '@tanstack/react-query'

import { createLecture, type CreateLectureParams } from '@/features/lecture/api/lecture.api'
import type { LectureCreateResponse } from '@/features/lecture/types/lecture-request.type'

export const useCreateLectureMutation = () => {
  return useMutation<LectureCreateResponse, unknown, CreateLectureParams>({
    mutationFn: createLecture,
  })
}
