'use client'

import { Star, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { LectureSummary } from '@/features/lecture/types/lecture.type'

interface LectureCardProps {
  lecture: LectureSummary
  isHighlighted?: boolean
  isInCart?: boolean
  onAddToCart: () => void
  onRemoveFromCart: () => void
  onCompare: () => void
  isPending?: boolean
  variant?: 'mobile' | 'desktop'
}

export function LectureCard({
  lecture,
  isHighlighted = false,
  isInCart = false,
  onAddToCart,
  onRemoveFromCart,
  onCompare,
  isPending = false,
  variant = 'mobile',
}: LectureCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/lectures/${lecture.id}`)
  }
  const isRecruiting = lecture.status === 'RECRUITING'

  const formatPeriod = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')} ~ ${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`
  }

  if (variant === 'desktop') {
    return (
      <div
        onClick={handleCardClick}
        className={`
          w-full h-[372px] p-6 bg-white rounded-xl overflow-hidden flex flex-col justify-between
          transition-shadow duration-200 cursor-pointer
          ${isHighlighted
            ? 'shadow-[4px_4px_20px_rgba(254,183,6,0.25)] border border-[#FEB706]'
            : 'shadow-[4px_4px_20px_rgba(161,161,170,0.25)] hover:shadow-[4px_4px_20px_rgba(254,183,6,0.4)]'
          }
        `}
      >
        {/* Content */}
        <div className="flex flex-col gap-6">
          {/* Header: Tag + Rating + Status */}
          <div className="w-full flex items-center justify-between">
            <span className="text-sm text-[#555555]">
              {lecture.tags?.[0]?.name || '풀스텍 개발'}
            </span>
            <div className="flex items-center gap-1">
              {/* Rating */}
              {lecture.averageScore !== undefined && (
                <div className="flex items-center gap-2">
                  <Star className="w-[18px] h-[18px] fill-[#FEB706] text-[#FEB706]" />
                  <div className="flex items-center gap-1">
                    <span className="text-base text-[#020202]">
                      {lecture.averageScore.toFixed(1)}
                    </span>
                    {lecture.reviewCount !== undefined && (
                      <span className="text-xs text-[#555555]">({lecture.reviewCount})</span>
                    )}
                  </div>
                </div>
              )}
              {/* Status Badge - 모집중/모집마감 */}
              <div className={`h-[22px] px-2 py-1 rounded-full flex items-center justify-center gap-1 ${
                isRecruiting ? 'bg-emerald-100' : 'bg-gray-100'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  isRecruiting ? 'bg-emerald-500' : 'bg-gray-400'
                }`} />
                <span className={`text-[10px] font-medium ${
                  isRecruiting ? 'text-emerald-600' : 'text-gray-500'
                }`}>
                  {isRecruiting ? '모집중' : '모집마감'}
                </span>
              </div>
            </div>
          </div>

          {/* Title + Organization */}
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-bold text-[#020202] line-clamp-2 leading-tight h-[57px]">
              {lecture.title}
            </h3>
            <span className="text-base text-[#555555]">{lecture.organization}</span>
          </div>

          {/* Period */}
          {lecture.periodStart && lecture.periodEnd && (
            <span className="text-xs text-[#888888]">
              {formatPeriod(lecture.periodStart, lecture.periodEnd)}
            </span>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 bg-[#FFFCF4] rounded-full text-[10px] text-[#020202]">#내배카 필요 O</span>
            <span className="px-2 py-1 bg-[#FFFCF4] rounded-full text-[10px] text-[#020202]">#오프라인</span>
            <span className="px-2 py-1 bg-[#FFFCF4] rounded-full text-[10px] text-[#020202]">#125일 과정</span>
          </div>
        </div>

        {/* Actions - 48px height buttons */}
        <div className="w-full flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (isInCart) {
                onRemoveFromCart()
              } else {
                onAddToCart()
              }
            }}
            disabled={isPending}
            className={`
              flex-1 h-12 rounded-lg flex items-center justify-center gap-1.5 transition-colors
              ${isInCart
                ? 'bg-[#262626] text-[#FEB706]'
                : 'bg-[#FFFCF4] text-[#020202]'
              }
              ${isPending ? 'opacity-50' : ''}
            `}
          >
            {isInCart && <Check className="w-4 h-4 text-[#FEB706]" />}
            <span className="text-base">
              {isInCart ? '관심등록됨' : '관심등록'}
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCompare()
            }}
            className="flex-1 h-12 bg-[#FEB706] rounded-lg flex items-center justify-center transition-colors"
          >
            <span className="text-base text-[#404040]">비교하기</span>
          </button>
        </div>
      </div>
    )
  }

  // Mobile variant (original design)
  return (
    <div
      onClick={handleCardClick}
      className={`
        w-full max-w-[328px] p-4 bg-white rounded-xl overflow-hidden flex flex-col gap-4
        transition-shadow duration-200 cursor-pointer
        ${isHighlighted
          ? 'shadow-[4px_4px_10px_rgba(254,183,6,0.25)] outline outline-1 outline-[#FEB706]'
          : 'shadow-[4px_4px_10px_rgba(161,161,170,0.25)] hover:shadow-[4px_4px_10px_rgba(254,183,6,0.4)]'
        }
      `}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <span className="text-sm text-[#555555]">
          {lecture.tags?.[0]?.name || '부트캠프'}
        </span>
        <div className="flex items-center gap-1">
          {/* Rating */}
          {lecture.averageScore !== undefined && (
            <div className="flex items-center gap-2">
              <Star className="w-[18px] h-[18px] fill-[#FEB706] text-[#FEB706]" />
              <div className="flex items-center gap-1">
                <span className="text-base text-[#020202]">
                  {lecture.averageScore.toFixed(1)}
                </span>
                {lecture.reviewCount !== undefined && (
                  <span className="text-xs text-[#555555]">({lecture.reviewCount})</span>
                )}
              </div>
            </div>
          )}
          {/* Status Badge - 모집중/모집마감 */}
          <div className={`h-5 px-2 rounded-full flex-shrink-0 flex items-center justify-center gap-1 ${
            isRecruiting ? 'bg-emerald-100' : 'bg-gray-100'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              isRecruiting ? 'bg-emerald-500' : 'bg-gray-400'
            }`} />
            <span className={`text-[10px] font-medium whitespace-nowrap leading-none ${
              isRecruiting ? 'text-emerald-600' : 'text-gray-500'
            }`}>
              {isRecruiting ? '모집중' : '모집마감'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-[#020202] line-clamp-2">{lecture.title}</h3>
          <span className="text-sm text-[#555555]">{lecture.organization}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex items-start gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (isInCart) {
              onRemoveFromCart()
            } else {
              onAddToCart()
            }
          }}
          disabled={isPending}
          className={`
            flex-1 h-10 rounded-lg flex items-center justify-center gap-1
            ${isInCart ? 'bg-[#262626]' : 'bg-[#FFFCF4]'}
            ${isPending ? 'opacity-50' : ''}
          `}
        >
          {isInCart && <Check className="w-3 h-3 text-[#FEB706]" />}
          <span className={`text-xs font-medium ${isInCart ? 'text-[#FEB706]' : 'text-[#020202]'}`}>
            {isInCart ? '관심등록됨' : '관심등록'}
          </span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onCompare()
          }}
          className="flex-1 h-10 bg-[#FEB706] rounded-lg flex items-center justify-center"
        >
          <span className="text-xs text-[#404040] font-medium">비교하기</span>
        </button>
      </div>
    </div>
  )
}
