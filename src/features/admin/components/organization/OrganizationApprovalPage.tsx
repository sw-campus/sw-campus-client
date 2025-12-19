'use client'

import {
  useApproveOrganizationMutation,
  useOrganizationsQuery,
  useRejectOrganizationMutation,
} from '../../hooks/useOrganizations'
import type { OrganizationSummary } from '../../types/organization.type'
import { ApprovalPage } from '../common'
import { OrganizationDetailModal } from './OrganizationDetailModal'
import { OrganizationTable } from './OrganizationTable'

export function OrganizationApprovalPage() {
  return (
    <ApprovalPage<OrganizationSummary>
      title="기관 회원 승인"
      searchPlaceholder="기관명 검색..."
      useDataQuery={useOrganizationsQuery}
      useApproveMutation={useApproveOrganizationMutation}
      useRejectMutation={useRejectOrganizationMutation}
      renderTable={({ items, isLoading, currentPage, pageSize, onViewDetail, onApprove, onReject }) => (
        <OrganizationTable
          organizations={items}
          isLoading={isLoading}
          currentPage={currentPage}
          pageSize={pageSize}
          onViewDetail={onViewDetail}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}
      renderModal={({ item, isOpen, onClose, onApprove, onReject, isApproving, isRejecting }) => (
        <OrganizationDetailModal
          organization={item}
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
