'use client'

import { useRef } from 'react'

import { Loader2, UploadCloud } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { useImageUpload } from '@/features/storage/hooks/useImageUpload'
import { StorageCategory } from '@/features/storage/types/storage.type'

interface S3ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  category: StorageCategory
  label?: string
  description?: string
  disabled?: boolean
  className?: string
}

export const S3ImageUpload = ({
  value,
  onChange,
  category,
  label = '이미지 업로드',
  description,
  disabled,
  className,
}: S3ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { uploadImage, isUploading, progress } = useImageUpload()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await uploadImage(file, category)
    if (result) {
      onChange(result.url)
    }

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const isPrivate = category === 'certificates'
  const sizeText = isPrivate ? '25MB' : '10MB'

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <div
        className="group border-muted-foreground/25 hover:bg-muted/50 hover:border-primary/50 relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 transition-all"
        onClick={() => !isUploading && !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading || disabled}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="text-primary h-10 w-10 animate-spin" />
            <div className="text-sm font-medium">{progress}% 업로드 중...</div>
            <div className="bg-muted mt-2 h-1 w-48 overflow-hidden rounded-full">
              <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : value ? (
          <div className="relative aspect-video max-h-[300px] w-full overflow-hidden rounded-lg border">
            <Image src={value} alt="Uploaded image" fill className="bg-muted object-contain" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Button type="button" variant="secondary" size="sm">
                변경하기
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-primary/10 text-primary rounded-full p-4 transition-transform group-hover:scale-110">
              <UploadCloud className="h-8 w-8" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">클릭하거나 이미지를 드래그하여 업로드</p>
              <p className="text-muted-foreground mt-1 text-xs">JPG, PNG, WebP, GIF (최대 {sizeText})</p>
            </div>
          </>
        )}
      </div>

      {description && <p className="text-muted-foreground text-[0.8rem]">{description}</p>}
    </div>
  )
}
