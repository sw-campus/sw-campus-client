'use client'

import { ApprovalPage } from '@/features/admin/components/common'
import {
  useApproveCertificateMutation,
  useRejectCertificateMutation,
  useReviewsQuery,
} from '@/features/admin/hooks/useReviews'
import type { ReviewSummary } from '@/features/admin/types/review.type'

import { CertificateDetailModal } from './CertificateDetailModal'
import { CertificateTable } from './CertificateTable'

export function CertificateApprovalPage() {
  return (
    <ApprovalPage<ReviewSummary>
      title="수료증 승인 관리"
      searchPlaceholder="수료증 검색 (강의명)..."
      useDataQuery={useReviewsQuery}
      useApproveMutation={useApproveCertificateMutation}
      useRejectMutation={useRejectCertificateMutation}
      renderTable={({ items, isLoading, currentPage, pageSize, onViewDetail, onApprove, onReject }) => (
        <CertificateTable
          items={items}
          isLoading={isLoading}
          currentPage={currentPage}
          pageSize={pageSize}
          onViewDetail={onViewDetail}
          onApprove={onApprove}
          onReject={onReject}
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
