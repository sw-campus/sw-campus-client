'use client'

import { CertificateDetailModal } from '@/features/admin/components/certificate/CertificateDetailModal'
import { CertificateTable } from '@/features/admin/components/certificate/CertificateTable'
import { ApprovalPage } from '@/features/admin/components/common'
import {
  useApproveCertificateMutation,
  useRejectCertificateMutation,
  useReviewsQuery,
} from '@/features/admin/hooks/useReviews'
import type { ReviewSummary } from '@/features/admin/types/review.type'

export function CertificateApprovalPage() {
  return (
    <ApprovalPage<ReviewSummary>
      title="수료증 승인 관리"
      useDataQuery={useReviewsQuery}
      useApproveMutation={useApproveCertificateMutation}
      useRejectMutation={useRejectCertificateMutation}
      renderTable={({ items, isLoading, currentPage, pageSize, onViewDetail }) => (
        <CertificateTable
          items={items}
          isLoading={isLoading}
          currentPage={currentPage}
          pageSize={pageSize}
          onViewDetail={onViewDetail}
        />
      )}
      renderModal={({ item, isOpen, onClose, onApprove, onReject, isApproving, isRejecting }) => (
        <CertificateDetailModal
          review={item}
          isOpen={isOpen}
          onClose={onClose}
          onApprove={onApprove}
          onReject={onReject}
          isApproving={isApproving}
          isRejecting={isRejecting}
        />
      )}
    />
  )
}
