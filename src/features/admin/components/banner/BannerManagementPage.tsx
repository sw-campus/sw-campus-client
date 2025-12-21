'use client'

import { useMemo, useState } from 'react'

import { LuCheck, LuClock, LuList, LuX } from 'react-icons/lu'

import { useBannersQuery, useDeleteBannerMutation, useToggleBannerActiveMutation } from '../../hooks/useBanners'
import type { Banner, BannerPeriodStatus } from '../../types/banner.type'
import { StatCard } from '../StatCard'
import { ApprovalPagination } from '../common/ApprovalPagination'
import { BannerCreateModal } from './BannerCreateModal'
import { BannerDetailModal } from './BannerDetailModal'
import { BannerEditModal } from './BannerEditModal'
import { BannerFilter } from './BannerFilter'
import { BannerTable } from './BannerTable'

const PAGE_SIZE = 10

export function BannerManagementPage() {
  const [statusFilter, setStatusFilter] = useState<BannerPeriodStatus>('ALL')
  const [keyword, setKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // API 호출 (페이징, 검색)
  const { data: pageData, isLoading } = useBannersQuery({
    keyword: keyword || undefined,
    periodStatus: statusFilter,
    page: currentPage,
    size: PAGE_SIZE,
  })

  // 통계용 쿼리들 (전체/예정/진행중/진행완료)
  const { data: allData } = useBannersQuery({ size: 1 })
  const { data: scheduledData } = useBannersQuery({ periodStatus: 'SCHEDULED', size: 1 })
  const { data: activeData } = useBannersQuery({ periodStatus: 'ACTIVE', size: 1 })
  const { data: endedData } = useBannersQuery({ periodStatus: 'ENDED', size: 1 })

  const toggleMutation = useToggleBannerActiveMutation()
  const deleteMutation = useDeleteBannerMutation()

  const handleToggle = (id: number, isActive: boolean) => {
    toggleMutation.mutate({ id, isActive })
  }

  const handleViewDetail = (banner: Banner) => {
    setSelectedBanner(banner)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedBanner(null)
  }

  const handleEdit = (banner: Banner) => {
    setIsDetailModalOpen(false)
    setSelectedBanner(banner)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedBanner(null)
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setIsDetailModalOpen(false)
        setSelectedBanner(null)
      },
    })
  }

  const handleStatusChange = (status: BannerPeriodStatus) => {
    setStatusFilter(status)
    setCurrentPage(0)
  }

  const handleKeywordChange = (newKeyword: string) => {
    setKeyword(newKeyword)
    setCurrentPage(0)
  }

  // 통계 계산
  const stats = useMemo(
    () => [
      { title: '전체', value: allData?.page?.totalElements ?? 0, icon: LuList },
      { title: '예정', value: scheduledData?.page?.totalElements ?? 0, icon: LuClock },
      { title: '진행중', value: activeData?.page?.totalElements ?? 0, icon: LuCheck },
      { title: '진행완료', value: endedData?.page?.totalElements ?? 0, icon: LuX },
    ],
    [allData, scheduledData, activeData, endedData],
  )

  const totalPages = pageData?.page?.totalPages ?? 0

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-foreground text-2xl font-bold">배너 관리</h1>
        <BannerCreateModal />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(stat => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Filter */}
      <BannerFilter
        currentStatus={statusFilter}
        keyword={keyword}
        onStatusChange={handleStatusChange}
        onKeywordChange={handleKeywordChange}
      />

      {/* Table */}
      <BannerTable
        banners={pageData?.content ?? []}
        isLoading={isLoading}
        isToggling={toggleMutation.isPending}
        onViewDetail={handleViewDetail}
        onToggle={handleToggle}
      />

      {/* Pagination */}
      <ApprovalPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Detail Modal */}
      <BannerDetailModal
        banner={selectedBanner}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isToggling={toggleMutation.isPending}
        isDeleting={deleteMutation.isPending}
      />

      {/* Edit Modal */}
      <BannerEditModal banner={selectedBanner} isOpen={isEditModalOpen} onClose={handleCloseEditModal} />
    </div>
  )
}
