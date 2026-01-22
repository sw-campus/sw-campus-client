'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/date'
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
}

function StatusBadge({ status }: { status: LectureAuthStatus }) {
  return (
    <Badge variant="secondary" className={cn('font-medium', LECTURE_AUTH_STATUS_COLOR[status])}>
      {LECTURE_AUTH_STATUS_LABEL[status]}
    </Badge>
  )
}

export function LectureTable({ lectures, isLoading, currentPage, pageSize, onViewDetail }: LectureTableProps) {
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
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-foreground text-base sm:text-lg">강의 목록</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
        <div className="-mx-3 overflow-x-auto sm:mx-0">
          <Table className="min-w-[500px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] text-xs sm:w-[60px] sm:text-sm">NO</TableHead>
                <TableHead className="w-[100px] text-xs sm:w-[200px] sm:text-sm">기관명</TableHead>
                <TableHead className="min-w-[120px] text-xs sm:text-sm">강의명</TableHead>
                <TableHead className="w-[70px] text-xs sm:w-[110px] sm:text-sm">상태</TableHead>
                <TableHead className="w-[80px] text-xs sm:w-[120px] sm:text-sm">신청일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lectures.map((lecture, index) => (
                <TableRow
                  key={lecture.lectureId}
                  onClick={() => onViewDetail(lecture)}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <TableCell className="text-muted-foreground text-xs sm:text-sm">{getRowNumber(index)}</TableCell>
                  <TableCell
                    className="text-muted-foreground max-w-[100px] truncate text-xs sm:max-w-[200px] sm:text-sm"
                    title={lecture.orgName}
                  >
                    {lecture.orgName}
                  </TableCell>
                  <TableCell
                    className="text-foreground max-w-[120px] truncate text-xs font-medium sm:max-w-[300px] sm:text-sm"
                    title={lecture.lectureName}
                  >
                    {lecture.lectureName}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={lecture.lectureAuthStatus} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap sm:text-sm">
                    {formatDate(lecture.lastUpdatedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
