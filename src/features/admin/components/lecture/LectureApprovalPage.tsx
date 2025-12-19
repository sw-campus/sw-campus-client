'use client'

import { useState } from 'react'

import { LuCheck, LuChevronLeft, LuChevronRight, LuClock, LuList, LuX } from 'react-icons/lu'

import { Button } from '@/components/ui/button'

import { useApproveLectureMutation, useLecturesQuery, useRejectLectureMutation } from '../../hooks/useLectures'
import type { LectureAuthStatus, LectureAuthStatusFilter, LectureSummary } from '../../types/lecture.type'
import { StatCard } from '../StatCard'
import { LectureDetailModal } from './LectureDetailModal'
import { LectureFilter } from './LectureFilter'
import { LectureTable } from './LectureTable'

const PAGE_SIZE = 10

export function LectureApprovalPage() {
  const [statusFilter, setStatusFilter] = useState<LectureAuthStatusFilter>('ALL')
  const [keyword, setKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedLecture, setSelectedLecture] = useState<LectureSummary | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 필터 상태를 API 호출용으로 변환 (ALL -> undefined)
  const apiStatus: LectureAuthStatus | undefined = statusFilter === 'ALL' ? undefined : statusFilter

  const { data: pageData, isLoading } = useLecturesQuery(apiStatus, keyword, currentPage)
  const approveMutation = useApproveLectureMutation()
  const rejectMutation = useRejectLectureMutation()

  // 상태별 통계 - 각 상태별 데이터 조회
  const { data: allData } = useLecturesQuery(undefined, '')
  const { data: pendingData } = useLecturesQuery('PENDING', '')
  const { data: approvedData } = useLecturesQuery('APPROVED', '')
  const { data: rejectedData } = useLecturesQuery('REJECTED', '')

  const stats = [
    { title: '전체', value: allData?.page?.totalElements ?? 0, icon: LuList },
    { title: '승인 대기', value: pendingData?.page?.totalElements ?? 0, icon: LuClock },
    { title: '승인 완료', value: approvedData?.page?.totalElements ?? 0, icon: LuCheck },
    { title: '반려', value: rejectedData?.page?.totalElements ?? 0, icon: LuX },
  ]

  const handleViewDetail = (lecture: LectureSummary) => {
    setSelectedLecture(lecture)
    setIsModalOpen(true)
  }

  const handleApprove = (lectureId: number) => {
    approveMutation.mutate(lectureId)
  }

  const handleReject = (lectureId: number) => {
    rejectMutation.mutate(lectureId)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedLecture(null)
  }

  const handleStatusChange = (status: LectureAuthStatusFilter) => {
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
      <h1 className="text-foreground text-2xl font-bold">강의 승인</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(stat => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Filter */}
      <LectureFilter
        currentStatus={statusFilter}
        keyword={keyword}
        onStatusChange={handleStatusChange}
        onKeywordChange={handleKeywordChange}
      />

      {/* Table */}
      <LectureTable
        lectures={pageData?.content ?? []}
        isLoading={isLoading}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        onViewDetail={handleViewDetail}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            <LuChevronLeft className="h-4 w-4" />
            이전
          </Button>
          {(() => {
            const pages: (number | 'ellipsis')[] = []
            const maxVisible = 5

            if (totalPages <= maxVisible + 2) {
              // 페이지가 적으면 모두 표시
              for (let i = 0; i < totalPages; i++) pages.push(i)
            } else {
              // 첫 페이지
              pages.push(0)

              // 현재 페이지 주변 (앞뒤로 2개씩)
              let start = Math.max(1, currentPage - 2)
              let end = Math.min(totalPages - 2, currentPage + 2)

              // 처음에 가까우면 더 많이 보여주기
              if (currentPage < 3) {
                end = Math.min(4, totalPages - 2)
              }
              // 끝에 가까우면 더 많이 보여주기
              if (currentPage > totalPages - 4) {
                start = Math.max(1, totalPages - 5)
              }

              // 시작 부분 생략
              if (start > 1) pages.push('ellipsis')

              // 중간 페이지들
              for (let i = start; i <= end; i++) pages.push(i)

              // 끝 부분 생략
              if (end < totalPages - 2) pages.push('ellipsis')

              // 마지막 페이지
              pages.push(totalPages - 1)
            }

            return pages.map((page, idx) =>
              page === 'ellipsis' ? (
                <span key={`ellipsis-${idx}`} className="text-muted-foreground px-2">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="min-w-[36px]"
                >
                  {page + 1}
                </Button>
              ),
            )
          })()}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            다음
            <LuChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Detail Modal */}
      <LectureDetailModal
        lecture={selectedLecture}
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
