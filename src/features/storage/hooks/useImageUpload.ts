import { useState } from 'react'

import { toast } from 'sonner'

import { storageApi } from '@/features/storage/api/storageApi'
import { MULTIPART_THRESHOLD, useFileValidation } from '@/features/storage/hooks/useFileValidation'
import { FileUploadResult, StorageCategory } from '@/features/storage/types/storage.type'

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { validateImage } = useFileValidation()

  const uploadImage = async (file: File, category: StorageCategory): Promise<FileUploadResult | null> => {
    // 1. 검증 (certificates는 프라이빗으로 간주)
    const isPrivate = category === 'certificates'
    if (!validateImage(file, isPrivate)) return null

    setIsUploading(true)
    setProgress(0)

    try {
      if (file.size <= MULTIPART_THRESHOLD) {
        // 단일 업로드
        const { presignedUrl, key, url } = await storageApi.getPresignedUrl({
          fileName: file.name,
          contentType: file.type,
          category,
        })

        await storageApi.uploadToS3(presignedUrl, file, file.type, p => setProgress(p))

        return { key, url, fileName: file.name }
      } else {
        // 멀티파트 업로드
        const { uploadId, key } = await storageApi.initMultipartUpload({
          fileName: file.name,
          contentType: file.type,
          category,
        })

        const partSize = 5 * 1024 * 1024 // 5MB 파트 크기
        const totalParts = Math.ceil(file.size / partSize)
        const partNumbers = Array.from({ length: totalParts }, (_, i) => i + 1)

        const { presignedUrls } = await storageApi.getMultipartParts({
          uploadId,
          key,
          partNumbers,
        })

        const completedParts = []
        let uploadedBytes = 0

        // 파트별 순차 또는 병렬 업로드
        for (const { partNumber, presignedUrl } of presignedUrls) {
          const start = (partNumber - 1) * partSize
          const end = Math.min(start + partSize, file.size)
          const blob = file.slice(start, end)

          const eTag = await storageApi.uploadToS3(presignedUrl, blob, file.type, p => {
            const currentUploaded = uploadedBytes + (blob.size * p) / 100
            setProgress(Math.round((currentUploaded / file.size) * 100))
          })

          completedParts.push({ partNumber, eTag })
          uploadedBytes += blob.size
        }

        const { url } = await storageApi.completeMultipartUpload({
          uploadId,
          key,
          parts: completedParts,
        })

        return { key, url, fileName: file.name }
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('파일 업로드 중 오류가 발생했습니다.')
      return null
    } finally {
      setIsUploading(false)
      setProgress(0)
    }
  }

  return { uploadImage, isUploading, progress }
}
