'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="text-foreground text-base md:text-lg">수료증 목록</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
        <div className="-mx-3 overflow-x-auto md:mx-0">
          <Table className="min-w-[450px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] text-xs md:w-[60px] md:text-sm">NO</TableHead>
                <TableHead className="w-[100px] text-xs md:w-[200px] md:text-sm">작성자</TableHead>
                <TableHead className="min-w-[100px] text-xs md:text-sm">강의명</TableHead>
                <TableHead className="w-[70px] text-xs md:w-[110px] md:text-sm">상태</TableHead>
                <TableHead className="w-[80px] text-xs md:w-[120px] md:text-sm">작성일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow
                  key={item.reviewId}
                  onClick={() => onViewDetail(item)}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <TableCell className="text-muted-foreground text-xs md:text-sm">{getRowNumber(index)}</TableCell>
                  <TableCell className="text-foreground max-w-[100px] truncate text-xs font-medium md:max-w-[200px] md:text-sm" title={item.nickname}>
                    {item.nickname}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[100px] truncate text-xs md:max-w-none md:text-sm" title={item.lectureName}>
                    {item.lectureName}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.certificateApprovalStatus} />
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap text-xs md:text-sm">{formatDate(item.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
