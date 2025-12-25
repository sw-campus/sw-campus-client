import type { LectureCreateRequest, LectureCreateResponse } from '@/features/lecture/types/lecture-request.type'
import type { LectureResponseDto, PageResponse } from '@/features/lecture/types/lecture-response.type'
import { api } from '@/lib/axios'

export type CreateLectureParams = {
  payload: LectureCreateRequest
  lectureImageFile?: File | null
  teacherImageFiles?: File[]
}

export const createLecture = async ({
  payload,
  lectureImageFile,
  teacherImageFiles,
}: CreateLectureParams): Promise<LectureCreateResponse> => {
  const formData = new FormData()
  const payloadJson = JSON.stringify(payload)
  formData.append('request', new Blob([payloadJson], { type: 'application/json' }))
  formData.append('lecture', new Blob([payloadJson], { type: 'application/json' }))

  if (lectureImageFile) {
    formData.append('image', lectureImageFile)
  }

  if (teacherImageFiles && teacherImageFiles.length > 0) {
    teacherImageFiles.forEach(file => {
      formData.append('teacherImages', file)
    })
  }

  const res = await api.post('/lectures', formData)
  return res.data
}

export type UpdateLectureParams = {
  lectureId: number
  payload: LectureCreateRequest
  lectureImageFile?: File | null
  teacherImageFiles?: File[]
}

export const updateLecture = async ({
  lectureId,
  payload,
  lectureImageFile,
  teacherImageFiles,
}: UpdateLectureParams): Promise<LectureCreateResponse> => {
  const formData = new FormData()
  const payloadJson = JSON.stringify(payload)
  formData.append('lecture', new Blob([payloadJson], { type: 'application/json' }))

  if (lectureImageFile) {
    formData.append('image', lectureImageFile)
  }

  if (teacherImageFiles && teacherImageFiles.length > 0) {
    teacherImageFiles.forEach(file => {
      formData.append('teacherImages', file)
    })
  }

  const res = await api.put(`/lectures/${lectureId}`, formData)
  return res.data
}

export const getLectureSearch = async (queryString: string): Promise<PageResponse<LectureResponseDto>> => {
  const path = queryString ? `/lectures/search?${queryString}` : '/lectures/search'
  const res = await api.get(path)

  const payload = res.data

  // Spring Data Page 응답 구조 확인 (page 객체가 중첩됨)
  if (payload && typeof payload === 'object' && 'content' in payload && 'page' in payload) {
    return payload as PageResponse<LectureResponseDto>
  }

  // Fallback: 배열 응답인 경우 Page 구조로 변환
  if (Array.isArray(payload)) {
    return {
      content: payload,
      page: {
        size: payload.length,
        number: 0,
        totalElements: payload.length,
        totalPages: 1,
      },
    }
  }

  // 기타 래핑된 응답 처리
  const wrappedCandidates = [payload?.data, payload?.items, payload?.lectures]
  for (const candidate of wrappedCandidates) {
    if (Array.isArray(candidate)) {
      return {
        content: candidate,
        page: {
          size: candidate.length,
          number: 0,
          totalElements: candidate.length,
          totalPages: 1,
        },
      }
    }
  }

  throw new Error('Unexpected /lectures/search response shape')
}

/**
 * 카테고리별 평점 높은 강의 조회 API
 * @param categoryId - 카테고리 ID
 */
export const getTopRatedLecturesByCategory = async (categoryId: number): Promise<LectureResponseDto[]> => {
  const res = await api.get(`/lectures/category/${categoryId}/top-rated`)
  return res.data
}
