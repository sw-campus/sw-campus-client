import { useQuery } from '@tanstack/react-query'

import { storageApi } from '../api/storageApi'
import type { PresignedGetUrlBatchResponse, PresignedGetUrlResponse } from '../types/storage.type'

/**
 * 단일 S3 key에 대한 Presigned GET URL 조회 Hook
 * @param key S3 객체 key (예: "lectures/2024/01/01/uuid.jpg")
 */
export function usePresignedUrl(key: string | undefined) {
  return useQuery<PresignedGetUrlResponse>({
    queryKey: ['presignedUrl', key],
    queryFn: () => storageApi.getPresignedGetUrl(key!),
    enabled: !!key,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}

/**
 * 여러 S3 key에 대한 Presigned GET URL 일괄 조회 Hook
 * @param keys S3 객체 key 배열
 */
export function usePresignedUrls(keys: string[]) {
  return useQuery<PresignedGetUrlBatchResponse>({
    queryKey: ['presignedUrls', ...keys],
    queryFn: () => storageApi.getPresignedGetUrls(keys),
    enabled: keys.length > 0,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}
