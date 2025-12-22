'use client'

import { ImgHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { usePresignedUrl } from '../hooks/usePresignedUrl'

interface S3ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  s3Key: string | undefined | null
  fallback?: ReactNode
  /**
   * next/image의 fill 속성과 유사하게 동작
   * true이면 absolute positioning으로 부모를 채움
   */
  fill?: boolean
}

/**
 * s3Key가 URL인지 S3 key인지 판별
 * 기존 데이터가 URL로 저장된 경우 호환성 유지
 */
function isUrl(value: string): boolean {
  return value.startsWith('http://') || value.startsWith('https://')
}

export function S3Image({ s3Key, fallback, alt, className, fill, style, ...props }: S3ImageProps) {
  // s3Key가 이미 URL인 경우 presigned URL 발급 불필요
  const shouldFetchPresignedUrl = s3Key && !isUrl(s3Key)
  const { data, isLoading, isError } = usePresignedUrl(shouldFetchPresignedUrl ? s3Key : undefined)

  if (!s3Key) {
    return <>{fallback}</>
  }

  // 기존 URL 데이터인 경우 직접 사용
  if (isUrl(s3Key)) {
    return (
      <img
        src={s3Key}
        alt={alt}
        className={className}
        style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', ...style } : style}
        {...props}
      />
    )
  }

  if (isLoading) {
    return <div className={cn('animate-pulse bg-gray-200', className)} />
  }

  if (isError || !data?.url) {
    return <>{fallback}</>
  }

  return (
    <img
      src={data.url}
      alt={alt}
      className={className}
      style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', ...style } : style}
      {...props}
    />
  )
}
