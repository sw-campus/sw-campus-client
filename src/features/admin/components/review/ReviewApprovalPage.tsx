'use client'

import { ApprovalPage } from '@/features/admin/components/common'
import { ReviewDetailModal } from '@/features/admin/components/review'
import { ReviewTable } from '@/features/admin/components/review'
import { useApproveReviewMutation, useReviewsQuery, useRejectReviewMutation } from '@/features/admin/hooks/useReviews'
import type { ReviewSummary } from '@/features/admin/types/review.type'

export function ReviewApprovalPage() {
  return (
    <ApprovalPage<ReviewSummary>
      title="리뷰 승인 관리"
      searchPlaceholder="리뷰 검색..."
      useDataQuery={useReviewsQuery}
      useApproveMutation={useApproveReviewMutation}
      useRejectMutation={useRejectReviewMutation}
      renderTable={({ items, isLoading, currentPage, pageSize, onViewDetail, onApprove, onReject }) => (
        <ReviewTable
          reviews={items}
          isLoading={isLoading}
          currentPage={currentPage}
          pageSize={pageSize}
          onViewDetail={onViewDetail}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}
      renderModal={({ item, isOpen, onClose, onApprove, onReject, isApproving, isRejecting }) => (
        <ReviewDetailModal
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
