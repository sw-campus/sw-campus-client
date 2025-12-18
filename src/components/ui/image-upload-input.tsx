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
  previewSize = 40,
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
    return /(\.png|\.jpg|\.jpeg|\.gif|\.webp|\.bmp|\.svg)$/i.test(url)
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
            className="h-10 w-10 rounded border object-cover"
            unoptimized
          />
        ) : currentUrl && isImageUrl(currentUrl) ? (
          <Image
            src={currentUrl}
            alt="미리보기"
            width={previewSize}
            height={previewSize}
            className="h-10 w-10 rounded border object-cover"
            unoptimized
          />
        ) : (
          <div className="h-10 w-10 rounded border bg-gray-50" />
        )}
        <span className="text-muted-foreground text-sm">{hasPreview ? '미리보기' : '선택된 파일 없음'}</span>
      </div>
    </div>
  )
}
