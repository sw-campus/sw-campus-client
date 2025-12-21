'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  REVIEW_AUTH_STATUS_COLOR,
  REVIEW_AUTH_STATUS_LABEL,
  type MutationOptions,
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
  onApprove: (id: number, options?: MutationOptions) => void
  onReject: (id: number, options?: MutationOptions) => void
}

function StatusBadge({ status }: { status: ReviewAuthStatus }) {
  return (
    <Badge variant="secondary" className={cn('font-medium', REVIEW_AUTH_STATUS_COLOR[status])}>
      {REVIEW_AUTH_STATUS_LABEL[status]}
    </Badge>
  )
}

export function CertificateTable({
  items,
  isLoading,
  currentPage,
  pageSize,
  onViewDetail,
  onApprove,
  onReject,
}: CertificateTableProps) {
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
      <CardHeader>
        <CardTitle className="text-foreground">수료증 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">NO</TableHead>
              <TableHead className="w-[30%]">강의명</TableHead>
              <TableHead className="w-[15%]">작성자</TableHead>
              <TableHead className="w-[120px]">수료증 상태</TableHead>
              <TableHead className="w-[120px]">신청일</TableHead>
              <TableHead className="w-[200px] text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.reviewId}>
                <TableCell className="text-muted-foreground">{getRowNumber(index)}</TableCell>
                <TableCell className="text-foreground max-w-0 truncate font-medium" title={item.lectureName}>
                  {item.lectureName}
                </TableCell>
                <TableCell className="text-muted-foreground max-w-0 truncate" title={item.nickname}>
                  {item.nickname} ({item.userName})
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.certificateApprovalStatus} />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(item.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onViewDetail(item)}>
                      수료증 확인
                    </Button>
                    {item.certificateApprovalStatus === 'PENDING' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onApprove(item.certificateId)}
                          className="bg-emerald-400 hover:bg-emerald-500"
                        >
                          승인
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onReject(item.certificateId)}>
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
