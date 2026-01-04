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
              placeholder="리뷰를 써 주세요. (20자 이상)"
              value={detailScores[cat].comment}
              onChange={e => onDetailCommentChange(cat, e.target.value)}
              className="h-24 w-full resize-y rounded-md border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
        ))}

        <div className="space-y-2">
          <span className="text-sm font-semibold text-gray-800">총평</span>
          <textarea
            placeholder="리뷰를 써 주세요. (20자 이상)"
            value={overallComment}
            onChange={e => onOverallCommentChange(e.target.value)}
            className="h-24 w-full resize-y rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" className="rounded-full" onClick={onClose}>
            취소
          </Button>
          <Button className="rounded-full" onClick={onSubmit}>
            입력
          </Button>
        </div>
      </div>
    </Modal>
  )
}
