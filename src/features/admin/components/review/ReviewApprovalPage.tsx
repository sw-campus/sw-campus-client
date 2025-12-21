'use client'

import { ApprovalPage } from '@/features/admin/components/common'
import { ReviewDetailModal } from '@/features/admin/components/review/ReviewDetailModal'
import { ReviewTable } from '@/features/admin/components/review/ReviewTable'
import { useApproveReviewMutation, useReviewsQuery, useRejectReviewMutation } from '@/features/admin/hooks/useReviews'
import type { ReviewSummary } from '@/features/admin/types/review.type'

export function ReviewApprovalPage() {
  return (
    <ApprovalPage<ReviewSummary>
      title="리뷰 승인 관리"
      searchPlaceholder="강의 검색..."
      useDataQuery={useReviewsQuery}
      useApproveMutation={useApproveReviewMutation}
      useRejectMutation={useRejectReviewMutation}
      renderTable={({ items, isLoading, currentPage, pageSize, onViewDetail }) => (
        <ReviewTable
          reviews={items}
          isLoading={isLoading}
          currentPage={currentPage}
          pageSize={pageSize}
          onViewDetail={onViewDetail}
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
