import axios from 'axios'

import {
  MultipartCompleteRequest,
  MultipartCompleteResponse,
  MultipartInitRequest,
  MultipartInitResponse,
  MultipartPartRequest,
  MultipartPartResponse,
  PresignedGetUrlBatchRequest,
  PresignedGetUrlBatchResponse,
  PresignedGetUrlResponse,
  PresignedUrlRequest,
  PresignedUrlResponse,
} from '@/features/storage/types/storage.type'
import { api } from '@/lib/axios'

export const storageApi = {
  // 단일 업로드를 위한 Presigned URL 발급
  getPresignedUrl: async (params: PresignedUrlRequest): Promise<PresignedUrlResponse> => {
    const { data } = await api.post<PresignedUrlResponse>('/api/storage/presigned/single', params)
    return data
  },

  // 멀티파트 업로드 시작 (Init)
  initMultipartUpload: async (params: MultipartInitRequest): Promise<MultipartInitResponse> => {
    const { data } = await api.post<MultipartInitResponse>('/api/storage/presigned/multipart/init', params)
    return data
  },

  // 멀티파트 파트별 Presigned URL 발급
  getMultipartParts: async (params: MultipartPartRequest): Promise<MultipartPartResponse> => {
    const { data } = await api.post<MultipartPartResponse>('/api/storage/presigned/multipart/parts', params)
    return data
  },

  // 멀티파트 업로드 완료
  completeMultipartUpload: async (params: MultipartCompleteRequest): Promise<MultipartCompleteResponse> => {
    const { data } = await api.post<MultipartCompleteResponse>('/api/storage/presigned/multipart/complete', params)
    return data
  },

  // 멀티파트 업로드 중단
  abortMultipartUpload: async (params: { uploadId: string; key: string }): Promise<void> => {
    await api.post('/api/storage/presigned/multipart/abort', params)
  },

  // S3에 직접 파일 업로드
  uploadToS3: async (url: string, file: File | Blob, contentType: string, onProgress?: (progress: number) => void) => {
    const response = await axios.put(url, file, {
      headers: {
        'Content-Type': contentType,
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentCompleted)
        }
      },
    })
    return response.headers.etag as string
  },

  // Presigned GET URL 발급 (단일)
  getPresignedGetUrl: async (key: string): Promise<PresignedGetUrlResponse> => {
    const { data } = await api.get<PresignedGetUrlResponse>('/storage/presigned-urls', {
      params: { key },
    })
    return data
  },

  // Presigned GET URL 발급 (배치)
  getPresignedGetUrls: async (keys: string[]): Promise<PresignedGetUrlBatchResponse> => {
    const request: PresignedGetUrlBatchRequest = { keys }
    const { data } = await api.post<PresignedGetUrlBatchResponse>('/storage/presigned-urls/batch', request)
    return data
  },
}
