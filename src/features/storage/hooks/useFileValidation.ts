import { toast } from 'sonner'

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const MAX_PUBLIC_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_PRIVATE_SIZE = 25 * 1024 * 1024 // 25MB
export const MULTIPART_THRESHOLD = 8 * 1024 * 1024 // 8MB

export const useFileValidation = () => {
  const validateImage = (file: File, isPrivate: boolean = false): boolean => {
    // 1. 타입 검증
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('허용되지 않는 파일 형식입니다. (jpg, png, webp, gif만 가능)')
      return false
    }

    // 2. 크기 검증
    const maxSize = isPrivate ? MAX_PRIVATE_SIZE : MAX_PUBLIC_SIZE
    if (file.size > maxSize) {
      const sizeText = isPrivate ? '25MB' : '10MB'
      toast.error(`파일 크기가 너무 큽니다. 최대 ${sizeText}까지 업로드 가능합니다.`)
      return false
    }

    return true
  }

  return { validateImage }
}
