import { api } from '@/lib/axios'

/**
 * 수료증 이미지 수정 응답 타입
 */
export interface CertificateImageUpdateResponse {
  certificateId: number
  imageKey: string
  approvalStatus: string
  message: string
}

/**
 * 수료증 이미지 수정 API
 * - PENDING/REJECTED 상태만 수정 가능
 * - APPROVED 상태는 수정 불가 (403)
 * @param certificateId 수료증 ID
 * @param image 새 수료증 이미지 파일
 * @returns 수정 결과
 */
export async function updateCertificateImage(
  certificateId: number,
  image: File,
): Promise<CertificateImageUpdateResponse> {
  const formData = new FormData()
  formData.append('image', image)

  const { data } = await api.patch<CertificateImageUpdateResponse>(
    `/certificates/${certificateId}/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return data
}
