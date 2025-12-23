'use client'

import { useState } from 'react'

import { LuCheck, LuClock, LuList, LuX } from 'react-icons/lu'

import { useOrganizationsQuery, useOrganizationStatsQuery } from '../../hooks/useOrganizations'
import { useApproveOrganizationMutation, useRejectOrganizationMutation } from '../../hooks/useOrganizations'
import type { ApprovalStatusFilter } from '../../types/approval.type'
import type { ApprovalStatus, OrganizationSummary } from '../../types/organization.type'
import { ApprovalFilter } from '../common/ApprovalFilter'
import { ApprovalPagination } from '../common/ApprovalPagination'
import { APPROVAL_STAT_COLORS, ColorfulStatCard } from '../common/ColorfulStatCard'
import { OrganizationDetailModal } from './OrganizationDetailModal'
import { OrganizationTable } from './OrganizationTable'

const PAGE_SIZE = 10

export function OrganizationApprovalPage() {
  const [statusFilter, setStatusFilter] = useState<ApprovalStatusFilter>('ALL')
  const [keyword, setKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedItem, setSelectedItem] = useState<OrganizationSummary | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 필터 상태를 API 호출용으로 변환
  const apiStatus: ApprovalStatus | undefined = statusFilter === 'ALL' ? undefined : statusFilter

  // 기관 목록 조회
  const { data: pageData, isLoading } = useOrganizationsQuery(apiStatus, keyword, currentPage)

  // 서버 API로 통계 조회
  const { data: statsData } = useOrganizationStatsQuery()

  const approveMutation = useApproveOrganizationMutation()
  const rejectMutation = useRejectOrganizationMutation()

  const stats = [
    { title: '전체', value: statsData?.total ?? 0, icon: LuList, bgColor: APPROVAL_STAT_COLORS.total },
    { title: '승인 대기', value: statsData?.pending ?? 0, icon: LuClock, bgColor: APPROVAL_STAT_COLORS.pending },
    { title: '승인 완료', value: statsData?.approved ?? 0, icon: LuCheck, bgColor: APPROVAL_STAT_COLORS.approved },
    { title: '반려', value: statsData?.rejected ?? 0, icon: LuX, bgColor: APPROVAL_STAT_COLORS.rejected },
  ]

  const handleViewDetail = (item: OrganizationSummary) => {
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
      <h1 className="text-foreground text-2xl font-bold">기관 승인 관리</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(stat => (
          <ColorfulStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      <ApprovalFilter
        currentStatus={statusFilter}
        keyword={keyword}
        onStatusChange={handleStatusChange}
        onKeywordChange={handleKeywordChange}
        searchPlaceholder="기관명 검색..."
      />

      <OrganizationTable
        organizations={pageData?.content ?? []}
        isLoading={isLoading}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        onViewDetail={handleViewDetail}
      />

      <ApprovalPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <OrganizationDetailModal
        organization={selectedItem}
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
