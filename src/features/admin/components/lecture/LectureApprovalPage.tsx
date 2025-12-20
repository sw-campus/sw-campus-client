'use client'

import { useApproveLectureMutation, useLecturesQuery, useRejectLectureMutation } from '../../hooks/useLectures'
import type { LectureSummary } from '../../types/lecture.type'
import { ApprovalPage } from '../common'
import { LectureDetailModal } from './LectureDetailModal'
import { LectureTable } from './LectureTable'

export function LectureApprovalPage() {
  return (
    <ApprovalPage<LectureSummary>
      title="강의 승인"
      searchPlaceholder="강의명 검색..."
      useDataQuery={useLecturesQuery}
      useApproveMutation={useApproveLectureMutation}
      useRejectMutation={useRejectLectureMutation}
      renderTable={({ items, isLoading, currentPage, pageSize, onViewDetail, onApprove, onReject }) => (
        <LectureTable
          lectures={items}
          isLoading={isLoading}
          currentPage={currentPage}
          pageSize={pageSize}
          onViewDetail={onViewDetail}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}
      renderModal={({ item, isOpen, onClose, onApprove, onReject, isApproving, isRejecting }) => (
        <LectureDetailModal
          lecture={item}
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
