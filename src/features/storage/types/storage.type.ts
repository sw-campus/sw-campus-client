export type StorageCategory =
  | 'lectures'
  | 'teachers'
  | 'organizations'
  | 'banners'
  | 'thumbnails'
  | 'certificates'
  | 'members'

export interface PresignedUrlRequest {
  fileName: string
  contentType: string
  category: StorageCategory
}

export interface PresignedUrlResponse {
  presignedUrl: string
  key: string
  url: string
}

export interface MultipartInitRequest {
  fileName: string
  contentType: string
  category: StorageCategory
}

export interface MultipartInitResponse {
  uploadId: string
  key: string
}

export interface MultipartPartRequest {
  uploadId: string
  key: string
  partNumbers: number[]
}

export interface MultipartPartResponse {
  presignedUrls: {
    partNumber: number
    presignedUrl: string
  }[]
}

export interface MultipartCompleteRequest {
  uploadId: string
  key: string
  parts: {
    partNumber: number
    eTag: string
  }[]
}

export interface MultipartCompleteResponse {
  key: string
  url: string
}

export interface FileUploadResult {
  key: string
  url: string
  fileName: string
}

// Presigned GET URL 타입
export interface PresignedGetUrlResponse {
  url: string
  expiresIn: number
}

export interface PresignedGetUrlBatchRequest {
  keys: string[]
}

export type PresignedGetUrlBatchResponse = Record<string, string | null>
