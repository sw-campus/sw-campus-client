'use client'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { LuCheck, LuClock, LuList, LuPencil, LuStar, LuX } from 'react-icons/lu'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { StatCard } from '@/features/admin/components/StatCard'
import { ApprovalFilter } from '@/features/admin/components/common/ApprovalFilter'
import { ApprovalPagination } from '@/features/admin/components/common/ApprovalPagination'
import { APPROVAL_STATUS_COLOR, APPROVAL_STATUS_LABEL } from '@/features/admin/types/approval.type'
import type { ApprovalStatus, ApprovalStatusFilter } from '@/features/admin/types/approval.type'
import LectureEditModal from '@/features/mypage/components/Organization/LectureEditModal'
import { OrganizationCard } from '@/features/mypage/components/Organization/OrganizationCard'
import ReviewListModal from '@/features/mypage/components/Organization/ReviewListModal'
import { PersonalInfoForm } from '@/features/mypage/components/Personal/PersonalForm'
import { ProfileCard } from '@/features/mypage/components/ProfileCard'
import { api } from '@/lib/axios'
import { formatDate } from '@/lib/date'
import { cn } from '@/lib/utils'

type OrganizationMainProps = {
  activeTab: 'orgInfo' | 'lectureManage' | 'myInfo'
  openInfoModal: () => void
  onOpenProductModal: () => void
}

type Lecture = {
  lectureId: number
  lectureName: string
  lectureImageUrl?: string
  lectureAuthStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  status: string
  createdAt: string
  updatedAt: string
  canEdit: boolean
}

const PAGE_SIZE = 10

function StatusBadge({ status }: { status: ApprovalStatus }) {
  return (
    <Badge variant="secondary" className={cn('font-medium', APPROVAL_STATUS_COLOR[status])}>
      {APPROVAL_STATUS_LABEL[status]}
    </Badge>
  )
}

export default function OrganizationMain({ activeTab, openInfoModal, onOpenProductModal }: OrganizationMainProps) {
  const router = useRouter()

  // 필터 및 페이지네이션 상태
  const [statusFilter, setStatusFilter] = useState<ApprovalStatusFilter>('ALL')
  const [currentPage, setCurrentPage] = useState(0)

  // 모달 상태
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewLectureId, setReviewLectureId] = useState<number | null>(null)
  const [reviewLectureName, setReviewLectureName] = useState<string | undefined>(undefined)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editLectureId, setEditLectureId] = useState<number | null>(null)

  const [myInfoEditOpen, setMyInfoEditOpen] = useState(false)

  // TanStack Query로 강의 목록 조회
  const {
    data: lectures = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['mypage', 'lectures'],
    queryFn: async () => {
      const { data } = await api.get<Lecture[]>('/mypage/lectures')
      return Array.isArray(data) ? data : []
    },
  })

  // 필터링된 강의 목록
  const filteredLectures = lectures.filter(lecture => {
    return statusFilter === 'ALL' || lecture.lectureAuthStatus === statusFilter
  })

  // 페이지네이션 적용
  const totalElements = filteredLectures.length
  const totalPages = Math.ceil(totalElements / PAGE_SIZE)
  const paginatedLectures = filteredLectures.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

  // 통계 계산
  const totalCount = lectures.length
  const approvedCount = lectures.filter(l => l.lectureAuthStatus === 'APPROVED').length
  const pendingCount = lectures.filter(l => l.lectureAuthStatus === 'PENDING').length
  const rejectedCount = lectures.filter(l => l.lectureAuthStatus === 'REJECTED').length

  const stats = [
    { title: '전체', value: totalCount, icon: LuList },
    { title: '승인 대기', value: pendingCount, icon: LuClock },
    { title: '승인 완료', value: approvedCount, icon: LuCheck },
    { title: '반려', value: rejectedCount, icon: LuX },
  ]

  const handleStatusChange = (status: ApprovalStatusFilter) => {
    setStatusFilter(status)
    setCurrentPage(0)
  }

  const handleRowClick = (lectureId: number) => {
    const lecture = lectures.find(l => l.lectureId === lectureId)
    if (!lecture) return

    if (lecture.lectureAuthStatus === 'PENDING' || lecture.lectureAuthStatus === 'REJECTED') {
      toast.info('승인된 강의만 상세 페이지를 확인할 수 있습니다.')
      return
    }

    router.push(`/lectures/${lectureId}`)
  }

  const getRowNumber = (index: number) => currentPage * PAGE_SIZE + index + 1

  // "기업정보 관리" 탭
  if (activeTab === 'orgInfo') {
    return (
      <div className="flex flex-1 flex-col gap-6">
        <OrganizationCard onEditClick={openInfoModal} />
      </div>
    )
  }

  // "내 정보 관리" 탭
  if (activeTab === 'myInfo') {
    return (
      <div className="flex flex-1 flex-col gap-6">
        <ProfileCard onEditClick={() => setMyInfoEditOpen(true)} />
        <Dialog open={myInfoEditOpen} onOpenChange={setMyInfoEditOpen}>
          <DialogContent className="sm:max-w-[calc(100%-2rem)] md:max-w-175">
            <DialogHeader>
              <DialogTitle>내 정보 수정</DialogTitle>
            </DialogHeader>
            <div className="max-h-[75vh] overflow-y-auto px-1 pt-4 pb-6">
              <PersonalInfoForm embedded onSuccess={() => setMyInfoEditOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // "강의 관리" 탭
  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-foreground text-2xl font-bold">교육과정 관리</h1>
        <Button onClick={onOpenProductModal}>교육과정 등록</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(stat => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Filter - 검색창 없이 상태 필터만 */}
      <ApprovalFilter
        currentStatus={statusFilter}
        keyword=""
        onStatusChange={handleStatusChange}
        onKeywordChange={() => {}}
      />

      {/* Table */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">강의 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <span className="text-muted-foreground">로딩 중...</span>
            </div>
          ) : error ? (
            <div className="flex h-32 flex-col items-center justify-center gap-3">
              <span className="text-destructive">강의 목록을 불러오지 못했습니다.</span>
              <Button variant="secondary" size="sm" onClick={() => void refetch()}>
                다시 시도
              </Button>
            </div>
          ) : paginatedLectures.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <span className="text-muted-foreground">
                {lectures.length === 0 ? '등록된 강의가 없습니다.' : '해당 조건의 강의가 없습니다.'}
              </span>
            </div>
          ) : (
            <TooltipProvider>
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-15">NO</TableHead>
                    <TableHead>강의명</TableHead>
                    <TableHead className="w-27.5">상태</TableHead>
                    <TableHead className="w-30">등록일</TableHead>
                    <TableHead className="w-25 text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLectures.map((lecture, index) => (
                    <TableRow
                      key={lecture.lectureId}
                      onClick={() => handleRowClick(lecture.lectureId)}
                      className="hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <TableCell className="text-muted-foreground">{getRowNumber(index)}</TableCell>
                      <TableCell className="text-foreground truncate font-medium" title={lecture.lectureName}>
                        {lecture.lectureName}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={lecture.lectureAuthStatus} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(lecture.createdAt)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1" onClick={e => e.stopPropagation()}>
                          {/* 리뷰 관리 */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                disabled={lecture.lectureAuthStatus !== 'APPROVED'}
                                onClick={() => {
                                  setReviewLectureId(lecture.lectureId)
                                  setReviewLectureName(lecture.lectureName)
                                  setReviewModalOpen(true)
                                }}
                              >
                                <LuStar className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {lecture.lectureAuthStatus === 'APPROVED' ? '리뷰 관리' : '승인 후 리뷰 관리 가능'}
                            </TooltipContent>
                          </Tooltip>

                          {/* 강의 수정 */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setEditLectureId(lecture.lectureId)
                                  setEditModalOpen(true)
                                }}
                              >
                                <LuPencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>강의 수정</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <ApprovalPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {/* Modals */}
      <ReviewListModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        lectureId={reviewLectureId}
        lectureName={reviewLectureName}
      />
      <LectureEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        lectureId={editLectureId}
        onSuccess={() => void refetch()}
      />
    </div>
  )
}
