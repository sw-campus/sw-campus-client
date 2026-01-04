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
      <CardHeader>
        <CardTitle className="text-foreground">강의 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">NO</TableHead>
              <TableHead className="w-[200px]">기관명</TableHead>
              <TableHead>강의명</TableHead>
              <TableHead className="w-[110px]">상태</TableHead>
              <TableHead className="w-[120px]">신청일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lectures.map((lecture, index) => (
              <TableRow
                key={lecture.lectureId}
                onClick={() => onViewDetail(lecture)}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <TableCell className="text-muted-foreground">{getRowNumber(index)}</TableCell>
                <TableCell className="text-muted-foreground truncate" title={lecture.orgName}>
                  {lecture.orgName}
                </TableCell>
                <TableCell className="text-foreground truncate font-medium" title={lecture.lectureName}>
                  {lecture.lectureName}
                </TableCell>
                <TableCell>
                  <StatusBadge status={lecture.lectureAuthStatus} />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(lecture.lastUpdatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
