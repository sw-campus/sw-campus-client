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
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="text-foreground text-base md:text-lg">강의 목록</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
        <div className="-mx-3 overflow-x-auto md:mx-0">
          <Table className="min-w-[500px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] text-xs md:w-[60px] md:text-sm">NO</TableHead>
                <TableHead className="w-[100px] text-xs md:w-[200px] md:text-sm">기관명</TableHead>
                <TableHead className="min-w-[120px] text-xs md:text-sm">강의명</TableHead>
                <TableHead className="w-[70px] text-xs md:w-[110px] md:text-sm">상태</TableHead>
                <TableHead className="w-[80px] text-xs md:w-[120px] md:text-sm">신청일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lectures.map((lecture, index) => (
                <TableRow
                  key={lecture.lectureId}
                  onClick={() => onViewDetail(lecture)}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <TableCell className="text-muted-foreground text-xs md:text-sm">{getRowNumber(index)}</TableCell>
                  <TableCell
                    className="text-muted-foreground max-w-[100px] truncate text-xs md:max-w-[200px] md:text-sm"
                    title={lecture.orgName}
                  >
                    {lecture.orgName}
                  </TableCell>
                  <TableCell
                    className="text-foreground max-w-[120px] truncate text-xs font-medium md:max-w-[300px] md:text-sm"
                    title={lecture.lectureName}
                  >
                    {lecture.lectureName}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={lecture.lectureAuthStatus} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap md:text-sm">
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
