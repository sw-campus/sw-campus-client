'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useReviewDetailQuery } from '@/features/admin/hooks/useReviews'
import {
  REVIEW_AUTH_STATUS_COLOR,
  REVIEW_AUTH_STATUS_LABEL,
  type MutationOptions,
  type ReviewAuthStatus,
  type ReviewSummary,
} from '@/features/admin/types/review.type'
import { formatDate } from '@/lib/date'
import { cn } from '@/lib/utils'

interface ReviewDetailModalProps {
  review: ReviewSummary | null
  isOpen: boolean
  onClose: () => void
  onApprove: (reviewId: number, options?: MutationOptions) => void
  onReject: (reviewId: number, options?: MutationOptions) => void
  isApproving: boolean
  isRejecting: boolean
}

function StatusBadge({ status }: { status: ReviewAuthStatus }) {
  return (
    <Badge variant="secondary" className={cn('font-medium', REVIEW_AUTH_STATUS_COLOR[status])}>
      {REVIEW_AUTH_STATUS_LABEL[status]}
    </Badge>
  )
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="flex gap-4 py-2">
      <span className="text-muted-foreground w-28 shrink-0">{label}</span>
      <span className="text-foreground">{value ?? '-'}</span>
    </div>
  )
}

export function ReviewDetailModal({
  review,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: ReviewDetailModalProps) {
  const { data: detail, isLoading } = useReviewDetailQuery(review?.reviewId ?? 0)

  if (!review) return null

  const handleApprove = () => {
    onApprove(review.reviewId, { onSuccess: onClose })
  }

  const handleReject = () => {
    onReject(review.reviewId, { onSuccess: onClose })
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            리뷰 상세 정보
            <StatusBadge status={review.reviewApprovalStatus} />
          </DialogTitle>
          <DialogDescription>리뷰 내용을 확인하고 승인/반려를 결정하세요.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <span className="text-muted-foreground">로딩 중...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="border-border rounded-lg border p-4">
              <h3 className="text-foreground mb-3 font-semibold">리뷰 정보</h3>
              <div className="divide-border divide-y">
                <DetailRow label="강의명" value={detail?.lectureName ?? review.lectureName} />
                <DetailRow label="작성자(이름)" value={detail?.userName ?? review.userName} />
                <DetailRow label="작성자(닉네임)" value={detail?.nickname ?? review.nickname} />
                <DetailRow label="평점" value={detail?.score ? `${detail.score}점` : `${review.score}점`} />
                <DetailRow
                  label="수료증 상태"
                  value={detail?.certificateApprovalStatus ?? review.certificateApprovalStatus}
                />
                <DetailRow label="작성일" value={formatDate(detail?.createdAt ?? review.createdAt)} />
              </div>
            </div>

            {/* 리뷰 내용 */}
            <div className="border-border rounded-lg border p-4">
              <h3 className="text-foreground mb-3 font-semibold">리뷰 내용</h3>
              <div className="bg-muted min-h-[100px] rounded-md p-3 text-sm whitespace-pre-wrap">
                {detail?.content || '내용이 없습니다.'}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {review.reviewApprovalStatus === 'PENDING' && (
            <>
              <Button variant="outline" onClick={onClose}>
                닫기
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={isRejecting}>
                {isRejecting ? '처리 중...' : '반려'}
              </Button>
              <Button onClick={handleApprove} disabled={isApproving} className="bg-emerald-400 hover:bg-emerald-500">
                {isApproving ? '처리 중...' : '승인'}
              </Button>
            </>
          )}
          {review.reviewApprovalStatus !== 'PENDING' && (
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
