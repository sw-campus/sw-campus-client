'use client'

import { useState } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PhotoSliderProps {
  photos: string[]
}

export default function PhotoSlider({ photos }: PhotoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (photos.length === 0) return null

  return (
    <div className="space-y-4">
      {/* 메인 이미지 */}
      <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <Image
          src={photos[currentIndex]}
          alt={`학습공간 ${currentIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />

        {/* 좌우 네비게이션 버튼 */}
        {photos.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute top-1/2 left-3 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-white/80 opacity-0 shadow-md backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-white"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute top-1/2 right-3 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-white/80 opacity-0 shadow-md backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-white"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </Button>
          </>
        )}

        {/* 슬라이드 카운터 */}
        <div className="absolute right-3 bottom-3 rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>

      {/* 썸네일 인디케이터 */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-2">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'relative h-14 w-20 overflow-hidden rounded-lg border-2 transition-all',
                currentIndex === index
                  ? 'border-orange-500 ring-2 ring-orange-200'
                  : 'border-transparent opacity-60 hover:opacity-100',
              )}
            >
              <Image src={photo} alt={`썸네일 ${index + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
