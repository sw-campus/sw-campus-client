'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  ),
)
Avatar.displayName = 'Avatar'

const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, alt = '', ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false)

    if (hasError) return null

    return (
      // 외부 프로필 이미지 URL을 지원하기 위해 img 태그 사용
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={ref}
        alt={alt}
        onError={() => setHasError(true)}
        className={cn('aspect-square h-full w-full object-cover', className)}
        {...props}
      />
    )
  },
)
AvatarImage.displayName = 'AvatarImage'

const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('bg-muted flex h-full w-full items-center justify-center rounded-full', className)}
      {...props}
    />
  ),
)
AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarImage, AvatarFallback }
