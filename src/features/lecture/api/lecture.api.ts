import type { LectureCreateRequest, LectureCreateResponse } from '@/features/lecture/types/lecture-request.type'
import { api } from '@/lib/axios'

export const createLecture = async (payload: LectureCreateRequest): Promise<LectureCreateResponse> => {
  const res = await api.post('/lectures', payload)
  return res.data
}
