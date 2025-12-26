'use client'

import { useEffect, useState } from 'react'

import { Star } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getLectureReviews } from '@/features/lecture/api/reviewApi.client'
import { CATEGORY_LABELS, type Review } from '@/features/lecture/api/reviewApi.types'
import { formatDate, StarRating } from '@/features/lecture/components/detail/DetailShared'

type ReviewListModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  lectureId: number | null
  lectureName?: string
}

export default function ReviewListModal({ open, onOpenChange, lectureId, lectureName }: ReviewListModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reviews, setReviews] = useState<Review[] | null>(null)

  useEffect(() => {
    if (!open || !lectureId) return
    let cancelled = false
    const run = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getLectureReviews(lectureId)
        if (!cancelled) setReviews(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setError('후기 목록을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [open, lectureId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[70vh] max-w-lg overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{lectureName ? `${lectureName}` : '후기 관리'}</DialogTitle>
        </DialogHeader>

        {loading && <p className="text-muted-foreground text-sm">불러오는 중...</p>}
        {error && !loading && <p className="text-destructive-foreground text-sm">{error}</p>}

        {!loading && !error && (reviews?.length ?? 0) === 0 && (
          <Card className="bg-card/40 text-muted-foreground flex h-40 items-center justify-center border-0 text-sm shadow-sm backdrop-blur-xl">
            등록된 후기가 없습니다.
          </Card>
        )}

        {!loading && !error && (reviews?.length ?? 0) > 0 && (
          <ul className="space-y-4">
            {reviews!.map(r => (
              <li key={r.reviewId}>
                <ReviewCard review={r} />
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const [showDetail, setShowDetail] = useState(false)
  const hasDetails = review.detailScores && review.detailScores.length > 0

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
        <div className="flex items-center gap-2">
          <StarRating score={review.score} />
          <span className="text-sm font-bold text-yellow-500">{review.score.toFixed(1)}</span>
        </div>
      </div>

      {/* Comment */}
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{review.comment}</p>

      {/* Detail Toggle Button */}
      {hasDetails && (
        <button
          type="button"
          onClick={() => setShowDetail(!showDetail)}
          className="flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
        >
          {showDetail ? (
            <>
              <span>상세 리뷰 접기</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              <span>상세 리뷰 보기</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      )}

      {/* Detail Scores (Collapsible) */}
      {hasDetails && showDetail && (
        <div className="mt-4 space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {review.detailScores!.map(detail => (
            <div key={detail.category} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">{CATEGORY_LABELS[detail.category]}</span>
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
