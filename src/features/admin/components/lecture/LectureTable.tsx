'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

import {
  LECTURE_AUTH_STATUS_COLOR,
  LECTURE_AUTH_STATUS_LABEL,
  type LectureAuthStatus,
  type LectureSummary,
} from '../../types/lecture.type'

interface LectureTableProps {
  lectures: LectureSummary[]
  isLoading: boolean
  currentPage: number
  pageSize: number
  onViewDetail: (lecture: LectureSummary) => void
  onApprove: (lectureId: number) => void
  onReject: (lectureId: number) => void
}

function StatusBadge({ status }: { status: LectureAuthStatus }) {
  return (
    <Badge variant="secondary" className={cn('font-medium', LECTURE_AUTH_STATUS_COLOR[status])}>
      {LECTURE_AUTH_STATUS_LABEL[status]}
    </Badge>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function LectureTable({
  lectures,
  isLoading,
  currentPage,
  pageSize,
  onViewDetail,
  onApprove,
  onReject,
}: LectureTableProps) {
  // 페이지 기반 NO 계산
  const getRowNumber = (index: number) => currentPage * pageSize + index + 1

  if (isLoading) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">강의 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">로딩 중...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (lectures.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">강의 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">해당 조건의 강의가 없습니다.</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">강의 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">NO</TableHead>
              <TableHead className="w-[35%]">강의명</TableHead>
              <TableHead className="w-[15%]">기관명</TableHead>
              <TableHead className="w-[80px]">상태</TableHead>
              <TableHead className="w-[90px]">신청일</TableHead>
              <TableHead className="w-[220px] text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lectures.map((lecture, index) => (
              <TableRow key={lecture.lectureId}>
                <TableCell className="text-muted-foreground">{getRowNumber(index)}</TableCell>
                <TableCell className="text-foreground max-w-0 truncate font-medium" title={lecture.lectureName}>
                  {lecture.lectureName}
                </TableCell>
                <TableCell className="text-muted-foreground max-w-0 truncate" title={lecture.orgName}>
                  {lecture.orgName}
                </TableCell>
                <TableCell>
                  <StatusBadge status={lecture.lectureAuthStatus} />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(lecture.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onViewDetail(lecture)}>
                      상세보기
                    </Button>
                    {lecture.lectureAuthStatus === 'PENDING' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onApprove(lecture.lectureId)}
                          className="bg-emerald-400 hover:bg-emerald-500"
                        >
                          승인
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onReject(lecture.lectureId)}>
                          반려
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
