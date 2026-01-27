'use client'

import { useState } from 'react'

import { ChevronDown, ChevronUp, ChevronRight, User } from 'lucide-react'
import Link from 'next/link'

import { Card } from '@/components/ui/card'
import { CATEGORY_LABELS, type Review } from '@/features/lecture/api/review-api.types'

import { StarRatingDisplay } from './shared/star-rating-display'

interface OrganizationReviewCardProps {
  review: Review
}

export function OrganizationReviewCard({ review }: OrganizationReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="bg-card rounded-xl border-0 p-4 shadow-[4px_4px_15px_0px_rgba(161,161,170,0.25)]">
      {/* Header: User Info + Rating + Lecture Link */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
            <User className="text-muted-foreground h-5 w-5" />
          </div>
          {/* User Info */}
          <div>
            <p className="text-foreground text-sm font-medium">ID : {review.nickname}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-medium text-amber-500">{review.score.toFixed(1)}</span>
              <StarRatingDisplay score={review.score} />
            </div>
          </div>
        </div>
        {/* Lecture Link */}
        <Link
          href={`/lectures/${review.lectureId}#review`}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
        >
          강의 보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Content: Comment */}
      <p className="text-foreground mb-4 text-sm leading-relaxed">{review.comment}</p>

      {/* Detail Scores Toggle */}
      {review.detailScores && review.detailScores.length > 0 && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
        >
          상세 점수 보기
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      )}

      {/* Detail Scores Expanded */}
      {isExpanded && review.detailScores && review.detailScores.length > 0 && (
        <div className="bg-muted mt-4 space-y-3 rounded-lg p-4">
          {review.detailScores.map(detail => (
            <div key={detail.category} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-foreground text-sm font-medium">
                  {CATEGORY_LABELS[detail.category] || detail.category}
                </span>
                <div className="flex items-center gap-2">
                  <StarRatingDisplay score={detail.score} size="sm" />
                  <span className="text-sm font-medium text-amber-500">{detail.score.toFixed(1)}</span>
                </div>
              </div>
              {detail.comment && <p className="text-muted-foreground text-sm leading-relaxed">{detail.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
