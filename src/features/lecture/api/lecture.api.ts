import type { LectureCreateRequest, LectureCreateResponse } from '@/features/lecture/types/lecture-request.type'
import type { LectureResponseDto } from '@/features/lecture/types/lecture-response.type'
import { api } from '@/lib/axios'

export type CreateLectureParams = {
  payload: LectureCreateRequest
  lectureImageFile?: File | null
}

export const createLecture = async ({
  payload,
  lectureImageFile,
}: CreateLectureParams): Promise<LectureCreateResponse> => {
  const formData = new FormData()
  const payloadJson = JSON.stringify(payload)
  formData.append('request', new Blob([payloadJson], { type: 'application/json' }))
  formData.append('lecture', new Blob([payloadJson], { type: 'application/json' }))

  if (lectureImageFile) {
    formData.append('lectureImageFile', lectureImageFile)
  }

  const res = await api.post('/lectures', formData)
  return res.data
}

export const getLectureSearch = async (queryString: string): Promise<LectureResponseDto[]> => {
  const path = queryString ? `/lectures/search?${queryString}` : '/lectures/search'
  const res = await api.get(path)

  const payload = res.data
  if (Array.isArray(payload)) return payload

  const wrappedCandidates = [payload?.data, payload?.items, payload?.content, payload?.lectures]
  for (const candidate of wrappedCandidates) {
    if (Array.isArray(candidate)) return candidate
  }

  throw new Error('Unexpected /lectures/search response shape')
}
