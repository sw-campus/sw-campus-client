'use client'

import { useState } from 'react'

import { LuCheck, LuClock, LuList, LuX } from 'react-icons/lu'

import {
  useReviewsQuery,
  useReviewStats,
  useApproveReviewMutation,
  useRejectReviewMutation,
} from '../../hooks/useReviews'
import type { ApprovalStatusFilter } from '../../types/approval.type'
import type { ReviewAuthStatus, ReviewSummary } from '../../types/review.type'
import { StatCard } from '../StatCard'
import { ApprovalFilter } from '../common/ApprovalFilter'
import { ApprovalPagination } from '../common/ApprovalPagination'
import { ReviewDetailModal } from './ReviewDetailModal'
import { ReviewTable } from './ReviewTable'

const PAGE_SIZE = 10

export function ReviewApprovalPage() {
  const [statusFilter, setStatusFilter] = useState<ApprovalStatusFilter>('ALL')
  const [keyword, setKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedItem, setSelectedItem] = useState<ReviewSummary | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 필터 상태를 API 호출용으로 변환
  const apiStatus: ReviewAuthStatus | undefined = statusFilter === 'ALL' ? undefined : statusFilter

  // 리뷰 목록 조회
  const { data: pageData, isLoading } = useReviewsQuery(apiStatus, keyword, currentPage)

  // 리뷰 통계 조회 (reviewApprovalStatus 기준)
  const { data: statsData } = useReviewStats()

  const approveMutation = useApproveReviewMutation()
  const rejectMutation = useRejectReviewMutation()

  const stats = [
    { title: '전체', value: statsData?.all ?? 0, icon: LuList },
    { title: '승인 대기', value: statsData?.pending ?? 0, icon: LuClock },
    { title: '승인 완료', value: statsData?.approved ?? 0, icon: LuCheck },
    { title: '반려', value: statsData?.rejected ?? 0, icon: LuX },
  ]

  const handleViewDetail = (item: ReviewSummary) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleApprove = (id: number, options?: { onSuccess?: () => void }) => {
    approveMutation.mutate(id, options)
  }

  const handleReject = (id: number, options?: { onSuccess?: () => void }) => {
    rejectMutation.mutate(id, options)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  const handleStatusChange = (status: ApprovalStatusFilter) => {
    setStatusFilter(status)
    setCurrentPage(0)
  }

  const handleKeywordChange = (newKeyword: string) => {
    setKeyword(newKeyword)
    setCurrentPage(0)
  }

  const totalPages = pageData?.page?.totalPages ?? 0

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-foreground text-2xl font-bold">리뷰 승인 관리</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(stat => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      <ApprovalFilter
        currentStatus={statusFilter}
        keyword={keyword}
        onStatusChange={handleStatusChange}
        onKeywordChange={handleKeywordChange}
        searchPlaceholder="강의 검색..."
      />

      <ReviewTable
        reviews={pageData?.content ?? []}
        isLoading={isLoading}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        onViewDetail={handleViewDetail}
      />

      <ApprovalPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <ReviewDetailModal
        review={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
        isApproving={approveMutation.isPending}
        isRejecting={rejectMutation.isPending}
      />
    </div>
  )
}
