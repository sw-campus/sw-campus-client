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
import { S3Image } from '@/features/storage'
import { cn } from '@/lib/utils'

import { useOrganizationDetailQuery } from '../../hooks/useOrganizations'
import {
  APPROVAL_STATUS_COLOR,
  APPROVAL_STATUS_LABEL,
  type ApprovalStatus,
  type MutationOptions,
  type OrganizationSummary,
} from '../../types/organization.type'

interface OrganizationDetailModalProps {
  organization: OrganizationSummary | null
  isOpen: boolean
  onClose: () => void
  onApprove: (organizationId: number, options?: MutationOptions) => void
  onReject: (organizationId: number, options?: MutationOptions) => void
  isApproving: boolean
  isRejecting: boolean
}

function StatusBadge({ status }: { status: ApprovalStatus }) {
  return (
    <Badge variant="secondary" className={cn('font-medium', APPROVAL_STATUS_COLOR[status])}>
      {APPROVAL_STATUS_LABEL[status]}
    </Badge>
  )
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex gap-4 py-2">
      <span className="text-muted-foreground w-24 shrink-0">{label}</span>
      <span className="text-foreground">{value ?? '-'}</span>
    </div>
  )
}

export function OrganizationDetailModal({
  organization,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: OrganizationDetailModalProps) {
  const { data: detail, isLoading } = useOrganizationDetailQuery(organization?.id ?? 0)

  if (!organization) return null

  const handleApprove = () => {
    onApprove(organization.id, { onSuccess: onClose })
  }

  const handleReject = () => {
    onReject(organization.id, { onSuccess: onClose })
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            기관 상세 정보
            <StatusBadge status={organization.approvalStatus} />
          </DialogTitle>
          <DialogDescription>기관 정보와 재직증명서를 확인하고 승인/반려를 결정하세요.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <span className="text-muted-foreground">로딩 중...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 기관 정보 */}
            <div className="border-border rounded-lg border p-4">
              <h3 className="text-foreground mb-3 font-semibold">기관 정보</h3>
              <div className="divide-border divide-y">
                <DetailRow label="기관명" value={detail?.name ?? organization.name} />
                <DetailRow label="설명" value={detail?.description} />
                <DetailRow label="홈페이지" value={detail?.homepage} />
              </div>
            </div>

            {/* 재직증명서 */}
            <div className="border-border rounded-lg border p-4">
              <h3 className="text-foreground mb-3 font-semibold">재직증명서</h3>
              <div className="bg-muted relative aspect-4/3 w-full overflow-hidden rounded-lg">
                <S3Image
                  s3Key={detail?.certificateKey}
                  alt="재직증명서"
                  fill
                  className="object-contain"
                  fallback={
                    <div className="bg-muted flex h-40 items-center justify-center rounded-lg">
                      <span className="text-muted-foreground">재직증명서가 업로드되지 않았습니다.</span>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {organization.approvalStatus === 'PENDING' && (
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
