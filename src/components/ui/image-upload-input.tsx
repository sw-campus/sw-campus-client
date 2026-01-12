'use client'

import { useRef } from 'react'

import Image from 'next/image'

import { Button } from '@/components/ui/button'

export function ImageUploadInput({
  currentUrl,
  file,
  onFileChange,
  buttonText = '업로드',
  accept = 'image/*',
  previewSize = 80,
  disabled,
}: {
  currentUrl?: string
  file: File | null
  onFileChange: (file: File | null) => void
  buttonText?: string
  accept?: string
  previewSize?: number
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const hasPreview = !!file || !!currentUrl

  const isImageUrl = (url: string | undefined | null) => {
    if (!url) return false
    if (url.startsWith('blob:')) return true
    // S3 등 쿼리 파라미터가 붙은 URL에서 확장자 체크를 위해 쿼리 제거
    const urlWithoutQuery = url.split('?')[0]
    if (/(\.png|\.jpg|\.jpeg|\.gif|\.webp|\.bmp|\.svg)$/i.test(urlWithoutQuery)) return true
    // 확장자가 없는 경우 S3/CloudFront 등 신뢰할 수 있는 이미지 호스팅 도메인만 허용
    const trustedImageHosts = ['s3.amazonaws.com', 's3.ap-northeast-2.amazonaws.com', 'cloudfront.net']
    if (trustedImageHosts.some(host => url.includes(host))) return true
    return false
  }

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0] ?? null
          onFileChange(f)
        }}
        disabled={disabled}
      />
      <Button type="button" onClick={() => inputRef.current?.click()} disabled={disabled}>
        {buttonText}
      </Button>
      <div className="flex items-center gap-2">
        {file ? (
          <Image
            src={URL.createObjectURL(file)}
            alt="미리보기"
            width={previewSize}
            height={previewSize}
            className="rounded border object-cover"
            style={{ width: previewSize, height: previewSize }}
            unoptimized
          />
        ) : currentUrl && isImageUrl(currentUrl) ? (
          <Image
            src={currentUrl}
            alt="미리보기"
            width={previewSize}
            height={previewSize}
            className="rounded border object-cover"
            style={{ width: previewSize, height: previewSize }}
            unoptimized
          />
        ) : (
          <div className="rounded border bg-gray-50" style={{ width: previewSize, height: previewSize }} />
        )}
        <span className="text-muted-foreground text-sm">{hasPreview ? '미리보기' : '선택된 파일 없음'}</span>
      </div>
    </div>
  )
}
