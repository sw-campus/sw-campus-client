'use client'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, Star } from 'lucide-react'

import { Card } from '@/components/ui/card'

import { getLectureReviews } from '../../api/reviewApi.client'
import { CATEGORY_LABELS, type Review } from '../../api/reviewApi.types'
import { formatDate, Section, StarRating } from './DetailShared'

interface Props {
  lectureId: string
}

function ReviewCard({ review }: { review: Review }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="bg-card/40 border-0 p-5 shadow-sm backdrop-blur-xl transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
            {review.nickname.charAt(0)}
          </div>
          <div>
            <p className="text-foreground text-sm font-semibold">{review.nickname}</p>
            <p className="text-muted-foreground text-xs">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating score={review.score} showScore />
      </div>

      {/* Comment */}
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{review.comment}</p>

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-medium transition-colors"
      >
        {isExpanded ? (
          <>
            상세 점수 접기 <ChevronUp className="h-4 w-4" />
          </>
        ) : (
          <>
            상세 점수 보기 <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Detail Scores */}
      {isExpanded && (
        <div className="mt-4 space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {review.detailScores.map(detail => (
            <div key={detail.category} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">
                  {CATEGORY_LABELS[detail.category] || detail.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="min-w-8 text-right text-sm font-bold text-yellow-500">
                    {detail.score.toFixed(1)}
                  </span>
                </div>
              </div>
              {detail.comment && (
                <p className="rounded-md bg-gray-50 px-3 py-2 text-sm leading-relaxed text-gray-600">
                  {detail.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default function LectureReviews({ lectureId }: Props) {
  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['lectureReviews', lectureId],
    queryFn: () => getLectureReviews(lectureId),
    staleTime: 1000 * 60,
  })

  if (isLoading) {
    return (
      <Section title="후기">
        <div className="text-muted-foreground py-8 text-center text-sm">후기를 불러오는 중...</div>
      </Section>
    )
  }

  if (isError) {
    return (
      <Section title="후기">
        <div className="text-destructive py-8 text-center text-sm">후기를 불러오지 못했습니다.</div>
      </Section>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Section title="후기">
        <Card className="bg-card/40 flex h-40 flex-col items-center justify-center border-0 text-center shadow-sm backdrop-blur-xl">
          <div className="mb-2 text-3xl">💬</div>
          <p className="text-foreground text-sm font-medium">아직 작성된 후기가 없습니다.</p>
          <p className="text-muted-foreground mt-1 text-xs">첫 번째 후기를 남겨보세요!</p>
        </Card>
      </Section>
    )
  }

  return (
    <Section title="후기">
      <div className="space-y-4">
        {reviews.map(review => (
          <ReviewCard key={review.reviewId} review={review} />
        ))}
      </div>
    </Section>
  )
}
