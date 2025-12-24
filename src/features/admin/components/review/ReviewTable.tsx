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

interface ReviewTableProps {
  reviews: ReviewSummary[]
  isLoading: boolean
  currentPage: number
  pageSize: number
  onViewDetail: (review: ReviewSummary) => void
}

function StatusBadge({ status }: { status: ReviewAuthStatus }) {
  return (
    <Badge variant="secondary" className={cn('font-medium', REVIEW_AUTH_STATUS_COLOR[status])}>
      {REVIEW_AUTH_STATUS_LABEL[status]}
    </Badge>
  )
}

export function ReviewTable({ reviews, isLoading, currentPage, pageSize, onViewDetail }: ReviewTableProps) {
  // 수료증이 승인된 리뷰이거나, 이미 승인/반려 처리가 완료된 리뷰만 표시
  const visibleReviews = reviews.filter(
    review => review.reviewApprovalStatus !== 'PENDING' || review.certificateApprovalStatus === 'APPROVED',
  )

  const getRowNumber = (index: number) => currentPage * pageSize + index + 1

  if (isLoading) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">리뷰 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">로딩 중...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (visibleReviews.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">리뷰 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">해당 조건의 리뷰가 없습니다.</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">리뷰 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">NO</TableHead>
              <TableHead className="w-[200px]">작성자</TableHead>
              <TableHead>강의명</TableHead>
              <TableHead className="w-[80px]">평점</TableHead>
              <TableHead className="w-[110px]">상태</TableHead>
              <TableHead className="w-[120px]">작성일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleReviews.map((review, index) => (
              <TableRow
                key={review.reviewId}
                onClick={() => onViewDetail(review)}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <TableCell className="text-muted-foreground">{getRowNumber(index)}</TableCell>
                <TableCell className="text-foreground truncate font-medium" title={review.nickname}>
                  {review.nickname} ({review.userName})
                </TableCell>
                <TableCell className="text-muted-foreground truncate" title={review.lectureName}>
                  {review.lectureName}
                </TableCell>
                <TableCell className="text-muted-foreground">{review.score.toFixed(1)}점</TableCell>
                <TableCell>
                  <StatusBadge status={review.reviewApprovalStatus} />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(review.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
