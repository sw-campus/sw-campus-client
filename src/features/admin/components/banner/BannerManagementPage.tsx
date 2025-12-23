'use client'

import { useState } from 'react'

import { LuCalendar, LuCheck, LuCircleCheck, LuList } from 'react-icons/lu'

import {
  useBannersQuery,
  useBannerStatsQuery,
  useDeleteBannerMutation,
  useToggleBannerActiveMutation,
} from '../../hooks/useBanners'
import type { Banner, BannerPeriodStatus, BannerTypeFilter } from '../../types/banner.type'
import { ApprovalPagination } from '../common/ApprovalPagination'
import { BANNER_STAT_COLORS, ColorfulStatCard } from '../common/ColorfulStatCard'
import { BannerCreateModal } from './BannerCreateModal'
import { BannerDetailModal } from './BannerDetailModal'
import { BannerEditModal } from './BannerEditModal'
import { BannerFilter } from './BannerFilter'
import { BannerTable } from './BannerTable'

const PAGE_SIZE = 10

export function BannerManagementPage() {
  const [statusFilter, setStatusFilter] = useState<BannerPeriodStatus>('ALL')
  const [typeFilter, setTypeFilter] = useState<BannerTypeFilter>('ALL')
  const [keyword, setKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // API 호출 (페이징, 검색) - 큰 size로 가져와서 클라이언트에서 타입 필터링
  const { data: pageData, isLoading } = useBannersQuery({
    keyword: keyword || undefined,
    periodStatus: statusFilter,
    page: 0,
    size: 1000, // 클라이언트 필터링을 위해 충분한 크기
  })

  // 서버 API로 통계 조회
  const { data: statsData } = useBannerStatsQuery()

  const toggleMutation = useToggleBannerActiveMutation()
  const deleteMutation = useDeleteBannerMutation()

  // 클라이언트 사이드 타입 필터링 및 페이지네이션
  const banners = pageData?.content ?? []
  const filteredBanners = typeFilter === 'ALL' ? banners : banners.filter(banner => banner.type === typeFilter)

  const totalElements = filteredBanners.length
  const totalPages = Math.ceil(totalElements / PAGE_SIZE)
  const paginatedBanners = filteredBanners.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

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

  const handleTypeChange = (type: BannerTypeFilter) => {
    setTypeFilter(type)
    setCurrentPage(0)
  }

  const handleKeywordChange = (newKeyword: string) => {
    setKeyword(newKeyword)
    setCurrentPage(0)
  }

  // 통계 (서버 API 사용)
  const stats = [
    { title: '전체', value: statsData?.total ?? 0, icon: LuList, bgColor: BANNER_STAT_COLORS.total },
    { title: '예정', value: statsData?.scheduled ?? 0, icon: LuCalendar, bgColor: BANNER_STAT_COLORS.scheduled },
    { title: '진행중', value: statsData?.currentlyActive ?? 0, icon: LuCheck, bgColor: BANNER_STAT_COLORS.active },
    { title: '진행완료', value: statsData?.ended ?? 0, icon: LuCircleCheck, bgColor: BANNER_STAT_COLORS.ended },
  ]

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
          <ColorfulStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      {/* Filter */}
      <BannerFilter
        currentStatus={statusFilter}
        currentType={typeFilter}
        keyword={keyword}
        onStatusChange={handleStatusChange}
        onTypeChange={handleTypeChange}
        onKeywordChange={handleKeywordChange}
      />

      {/* Table */}
      <BannerTable
        banners={paginatedBanners}
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
