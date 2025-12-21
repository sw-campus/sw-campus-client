'use client'

import { ReactNode, useState } from 'react'

import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { LuCheck, LuClock, LuList, LuX } from 'react-icons/lu'

import type { ApprovalStatus, ApprovalStatusFilter, MutationOptions, PageResponse } from '../../types/approval.type'
import { StatCard } from '../StatCard'
import { ApprovalFilter } from './ApprovalFilter'
import { ApprovalPagination } from './ApprovalPagination'

const PAGE_SIZE = 10

/**
 * 테이블 컴포넌트 Props 타입
 */
interface TableProps<TItem> {
  items: TItem[]
  isLoading: boolean
  currentPage: number
  pageSize: number
  onViewDetail: (item: TItem) => void
  onApprove: (id: number, options?: MutationOptions) => void
  onReject: (id: number, options?: MutationOptions) => void
}

/**
 * 모달 컴포넌트 Props 타입
 */
interface ModalProps<TItem> {
  item: TItem | null
  isOpen: boolean
  onClose: () => void
  onApprove: (id: number, options?: MutationOptions) => void
  onReject: (id: number, options?: MutationOptions) => void
  isApproving: boolean
  isRejecting: boolean
}

/**
 * 공통 ApprovalPage Props
 */
interface ApprovalPageProps<TItem> {
  /**
   * 페이지 제목
   */
  title: string

  /**
   * 검색 placeholder (생략 시 검색바 숨김)
   */
  searchPlaceholder?: string

  /**
   * 데이터 조회 훅
   */
  useDataQuery: (
    status: ApprovalStatus | undefined,
    keyword: string,
    page?: number,
  ) => UseQueryResult<PageResponse<TItem>>

  /**
   * 승인 mutation 훅
   */
  useApproveMutation: () => UseMutationResult<unknown, unknown, number, unknown>

  /**
   * 반려 mutation 훅
   */
  useRejectMutation: () => UseMutationResult<unknown, unknown, number, unknown>

  /**
   * 테이블 렌더 함수
   */
  renderTable: (props: TableProps<TItem>) => ReactNode

  /**
   * 모달 렌더 함수
   */
  renderModal: (props: ModalProps<TItem>) => ReactNode
}

export function ApprovalPage<TItem>({
  title,
  searchPlaceholder,
  useDataQuery,
  useApproveMutation,
  useRejectMutation,
  renderTable,
  renderModal,
}: ApprovalPageProps<TItem>) {
  const [statusFilter, setStatusFilter] = useState<ApprovalStatusFilter>('ALL')
  const [keyword, setKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 필터 상태를 API 호출용으로 변환 (ALL -> undefined)
  const apiStatus: ApprovalStatus | undefined = statusFilter === 'ALL' ? undefined : statusFilter

  const { data: pageData, isLoading } = useDataQuery(apiStatus, keyword, currentPage)
  const approveMutation = useApproveMutation()
  const rejectMutation = useRejectMutation()

  // 상태별 통계 - 각 상태별 데이터 조회
  const { data: allData } = useDataQuery(undefined, '')
  const { data: pendingData } = useDataQuery('PENDING', '')
  const { data: approvedData } = useDataQuery('APPROVED', '')
  const { data: rejectedData } = useDataQuery('REJECTED', '')

  const stats = [
    { title: '전체', value: allData?.page?.totalElements ?? 0, icon: LuList },
    { title: '승인 대기', value: pendingData?.page?.totalElements ?? 0, icon: LuClock },
    { title: '승인 완료', value: approvedData?.page?.totalElements ?? 0, icon: LuCheck },
    { title: '반려', value: rejectedData?.page?.totalElements ?? 0, icon: LuX },
  ]

  const handleViewDetail = (item: TItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleApprove = (id: number, options?: MutationOptions) => {
    approveMutation.mutate(id, options)
  }

  const handleReject = (id: number, options?: MutationOptions) => {
    rejectMutation.mutate(id, options)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  const handleStatusChange = (status: ApprovalStatusFilter) => {
    setStatusFilter(status)
    setCurrentPage(0) // 필터 변경 시 첫 페이지로
  }

  const handleKeywordChange = (newKeyword: string) => {
    setKeyword(newKeyword)
    setCurrentPage(0) // 검색어 변경 시 첫 페이지로
  }

  const totalPages = pageData?.page?.totalPages ?? 0

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <h1 className="text-foreground text-2xl font-bold">{title}</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(stat => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Filter */}
      <ApprovalFilter
        currentStatus={statusFilter}
        keyword={keyword}
        onStatusChange={handleStatusChange}
        onKeywordChange={handleKeywordChange}
        searchPlaceholder={searchPlaceholder}
      />

      {/* Table */}
      {renderTable({
        items: pageData?.content ?? [],
        isLoading,
        currentPage,
        pageSize: PAGE_SIZE,
        onViewDetail: handleViewDetail,
        onApprove: handleApprove,
        onReject: handleReject,
      })}

      {/* Pagination */}
      <ApprovalPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Detail Modal */}
      {renderModal({
        item: selectedItem,
        isOpen: isModalOpen,
        onClose: handleCloseModal,
        onApprove: handleApprove,
        onReject: handleReject,
        isApproving: approveMutation.isPending,
        isRejecting: rejectMutation.isPending,
      })}
    </div>
  )
}
