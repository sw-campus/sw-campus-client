'use client'

import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import {
  REVIEW_AUTH_STATUS_COLOR,
  REVIEW_AUTH_STATUS_LABEL,
  type ReviewAuthStatus,
  type ReviewSummary,
} from '@/features/admin/types/review.type'
import { formatDate } from '@/lib/date'
import { cn } from '@/lib/utils'

interface CertificateTableProps {
  items: ReviewSummary[]
  isLoading: boolean
  currentPage: number
  pageSize: number
  onViewDetail: (item: ReviewSummary) => void
}

function StatusBadge({ status }: { status: ReviewAuthStatus }) {
  return (
    <Badge variant="secondary" className={cn('font-medium', REVIEW_AUTH_STATUS_COLOR[status])}>
      {REVIEW_AUTH_STATUS_LABEL[status]}
    </Badge>
  )
}

export function CertificateTable({ items, isLoading, currentPage, pageSize, onViewDetail }: CertificateTableProps) {
  const getRowNumber = (index: number) => currentPage * pageSize + index + 1

  if (isLoading) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">수료증 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">로딩 중...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">수료증 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">해당 조건의 수료증이 없습니다.</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-foreground text-base sm:text-lg">수료증 목록</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
        <div className="-mx-3 overflow-x-auto sm:mx-0">
          <Table className="min-w-[450px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] text-xs sm:w-[60px] sm:text-sm">NO</TableHead>
                <TableHead className="w-[100px] text-xs sm:w-[200px] sm:text-sm">작성자</TableHead>
                <TableHead className="min-w-[100px] text-xs sm:text-sm">강의명</TableHead>
                <TableHead className="w-[70px] text-xs sm:w-[110px] sm:text-sm">상태</TableHead>
                <TableHead className="w-[80px] text-xs sm:w-[120px] sm:text-sm">작성일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow
                  key={item.reviewId}
                  onClick={() => onViewDetail(item)}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <TableCell className="text-muted-foreground text-xs sm:text-sm">{getRowNumber(index)}</TableCell>
                  <TableCell className="text-foreground max-w-[100px] truncate text-xs font-medium sm:max-w-[200px] sm:text-sm" title={item.nickname}>
                    {item.nickname}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[100px] truncate text-xs sm:max-w-none sm:text-sm" title={item.lectureName}>
                    {item.lectureName}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.certificateApprovalStatus} />
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap text-xs sm:text-sm">{formatDate(item.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
