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
import { useCertificateDetailQuery } from '@/features/admin/hooks/useReviews'
import {
  REVIEW_AUTH_STATUS_COLOR,
  REVIEW_AUTH_STATUS_LABEL,
  type MutationOptions,
  type ReviewAuthStatus,
  type ReviewSummary,
} from '@/features/admin/types/review.type'
import { S3Image } from '@/features/storage'
import { formatDate } from '@/lib/date'
import { cn } from '@/lib/utils'

interface CertificateDetailModalProps {
  review: ReviewSummary | null
  isOpen: boolean
  onClose: () => void
  onApprove: (certificateId: number, options?: MutationOptions) => void
  onReject: (certificateId: number, options?: MutationOptions) => void
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

export function CertificateDetailModal({
  review,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: CertificateDetailModalProps) {
  const { data: detail, isLoading } = useCertificateDetailQuery(review?.certificateId ?? 0)

  if (!review) return null

  const handleApprove = () => {
    onApprove(review.certificateId, { onSuccess: onClose })
  }

  const handleReject = () => {
    onReject(review.certificateId, { onSuccess: onClose })
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            수료증 상세 정보
            <StatusBadge status={detail?.approvalStatus ?? review.certificateApprovalStatus} />
          </DialogTitle>
          <DialogDescription>수료증 이미지를 확인하고 승인/반려를 결정하세요.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <span className="text-muted-foreground">로딩 중...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 수료증 이미지 */}
            <div className="border-border overflow-hidden rounded-lg border bg-gray-50">
              <div className="flex justify-center p-2">
                <span className="text-muted-foreground text-xs font-medium">CERTIFICATE IMAGE</span>
              </div>
              <div className="relative aspect-[1.414/1] w-full bg-white">
                <S3Image
                  s3Key={detail?.imageUrl}
                  alt="Certificate"
                  fill
                  className="object-contain"
                  fallback={
                    <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                      이미지를 불러올 수 없습니다.
                    </div>
                  }
                />
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="border-border rounded-lg border p-4">
              <h3 className="text-foreground mb-3 font-semibold">신청 정보</h3>
              <div className="divide-border divide-y text-sm">
                <DetailRow label="강의명" value={detail?.lectureName ?? review.lectureName} />
                <DetailRow label="작성자(이름)" value={review.userName} />
                <DetailRow label="작성자(닉네임)" value={review.nickname} />
                <DetailRow label="신청일" value={formatDate(detail?.certifiedAt ?? review.createdAt)} />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {(detail?.approvalStatus ?? review.certificateApprovalStatus) === 'PENDING' && (
            <>
              <Button
                onClick={handleApprove}
                disabled={isApproving}
                className="bg-emerald-400 text-white hover:bg-emerald-500"
              >
                {isApproving ? '처리 중...' : '승인'}
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={isRejecting}>
                {isRejecting ? '처리 중...' : '반려'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
