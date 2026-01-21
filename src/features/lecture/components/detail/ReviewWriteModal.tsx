'use client'

import { Star } from 'lucide-react'

import Modal from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'

import { CATEGORY_LABELS, type ReviewCategory } from '../../api/reviewApi.types'

interface ReviewWriteModalProps {
  isOpen: boolean
  onClose: () => void
  categories: ReviewCategory[]
  detailScores: Record<ReviewCategory, { score: number; comment: string }>
  overallComment: string
  onDetailScoreChange: (category: ReviewCategory, score: number) => void
  onDetailCommentChange: (category: ReviewCategory, comment: string) => void
  onOverallCommentChange: (comment: string) => void
  onSubmit: () => void
}

const MAX_COMMENT_LENGTH = 250
const MIN_DETAIL_COMMENT_LENGTH = 10

export function ReviewWriteModal({
  isOpen,
  onClose,
  categories,
  detailScores,
  overallComment,
  onDetailScoreChange,
  onDetailCommentChange,
  onOverallCommentChange,
  onSubmit,
}: ReviewWriteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="리뷰 작성" maxWidthClass="max-w-lg">
      <div className="space-y-5">
        {categories.map(cat => (
          <div key={cat} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">
                {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${i + 1}점 선택`}
                    onClick={() => onDetailScoreChange(cat, i + 1)}
                    className="text-yellow-500"
                  >
                    <Star
                      className={`h-4 w-4 ${detailScores[cat].score >= i + 1 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
                <span className="ml-2 min-w-8 text-right text-sm font-bold text-yellow-600">
                  {detailScores[cat].score || 0}
                </span>
              </div>
            </div>
            <textarea
              placeholder="리뷰를 써 주세요. (10자 이상)"
              value={detailScores[cat].comment}
              onChange={e => onDetailCommentChange(cat, e.target.value)}
              className={`h-24 w-full resize-y rounded-md border px-3 py-2 text-sm ${
                detailScores[cat].comment.length > MAX_COMMENT_LENGTH ||
                (detailScores[cat].comment.length > 0 && detailScores[cat].comment.length < MIN_DETAIL_COMMENT_LENGTH)
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                  : 'border-gray-200'
              }`}
            />
            <div className="mt-1 flex justify-end">
              <span
                className={`text-xs ${
                  detailScores[cat].comment.length > MAX_COMMENT_LENGTH
                    ? 'font-semibold text-red-500'
                    : detailScores[cat].comment.length > 0 &&
                        detailScores[cat].comment.length < MIN_DETAIL_COMMENT_LENGTH
                      ? 'text-red-500'
                      : detailScores[cat].comment.length > MAX_COMMENT_LENGTH * 0.8
                        ? 'text-amber-500'
                        : 'text-gray-400'
                }`}
              >
                {detailScores[cat].comment.length} / {MAX_COMMENT_LENGTH}자
                {detailScores[cat].comment.length > MAX_COMMENT_LENGTH && ' (초과)'}
                {detailScores[cat].comment.length > 0 &&
                  detailScores[cat].comment.length < MIN_DETAIL_COMMENT_LENGTH &&
                  ` (최소 ${MIN_DETAIL_COMMENT_LENGTH}자)`}
              </span>
            </div>
          </div>
        ))}

        <div className="space-y-2">
          <span className="text-sm font-semibold text-gray-800">총평 (선택)</span>
          <textarea
            placeholder="총평을 입력하세요. (선택사항)"
            value={overallComment}
            onChange={e => onOverallCommentChange(e.target.value)}
            className={`h-24 w-full resize-y rounded-md border px-3 py-2 text-sm ${
              overallComment.length > MAX_COMMENT_LENGTH
                ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                : 'border-gray-200'
            }`}
          />
          <div className="flex justify-end">
            <span
              className={`text-xs ${
                overallComment.length > MAX_COMMENT_LENGTH
                  ? 'font-semibold text-red-500'
                  : overallComment.length > MAX_COMMENT_LENGTH * 0.8
                    ? 'text-amber-500'
                    : 'text-gray-400'
              }`}
            >
              {overallComment.length} / {MAX_COMMENT_LENGTH}자{overallComment.length > MAX_COMMENT_LENGTH && ' (초과)'}
            </span>
          </div>
        </div>

        {(() => {
          const isOverallExceeded = overallComment.length > MAX_COMMENT_LENGTH
          const isDetailExceeded = Object.values(detailScores).some(d => d.comment.length > MAX_COMMENT_LENGTH)
          const isDetailTooShort = Object.values(detailScores).some(
            d => d.comment.length > 0 && d.comment.length < MIN_DETAIL_COMMENT_LENGTH,
          )
          const isInvalid = isOverallExceeded || isDetailExceeded || isDetailTooShort

          return (
            <div className="space-y-2 pt-2">
              {isOverallExceeded || isDetailExceeded ? (
                <p className="text-sm font-medium text-red-500">
                  글자수를 초과한 항목이 있습니다. 250자 이내로 작성해주세요.
                </p>
              ) : isDetailTooShort ? (
                <p className="text-sm font-medium text-red-500">세부 의견은 최소 10자 이상 작성해주세요.</p>
              ) : null}
              <div className="flex items-center justify-end gap-2">
                <Button variant="secondary" className="rounded-full" onClick={onClose}>
                  취소
                </Button>
                <Button className="rounded-full" onClick={onSubmit} disabled={isInvalid}>
                  입력
                </Button>
              </div>
            </div>
          )
        })()}
      </div>
    </Modal>
  )
}
