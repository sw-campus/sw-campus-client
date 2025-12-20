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

interface ReviewTableProps {
  reviews: ReviewSummary[]
  isLoading: boolean
  currentPage: number
  pageSize: number
  onViewDetail: (review: ReviewSummary) => void
  onApprove: (reviewId: number, options?: MutationOptions) => void
  onReject: (reviewId: number, options?: MutationOptions) => void
}

function StatusBadge({ status }: { status: ReviewAuthStatus }) {
  return (
    <Badge variant="secondary" className={cn('font-medium', REVIEW_AUTH_STATUS_COLOR[status])}>
      {REVIEW_AUTH_STATUS_LABEL[status]}
    </Badge>
  )
}

export function ReviewTable({
  reviews,
  isLoading,
  currentPage,
  pageSize,
  onViewDetail,
  onApprove,
  onReject,
}: ReviewTableProps) {
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

  if (reviews.length === 0) {
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
              <TableHead className="w-[50px]">NO</TableHead>
              <TableHead className="w-[20%]">강의명</TableHead>
              <TableHead className="w-[15%]">작성자</TableHead>
              <TableHead className="w-[80px]">평점</TableHead>
              <TableHead className="w-[120px]">수료증 상태</TableHead>
              <TableHead className="w-[100px]">리뷰 상태</TableHead>
              <TableHead className="w-[120px]">작성일</TableHead>
              <TableHead className="w-[220px] text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review, index) => (
              <TableRow key={review.reviewId}>
                <TableCell className="text-muted-foreground">{getRowNumber(index)}</TableCell>
                <TableCell className="text-foreground max-w-0 truncate font-medium" title={review.lectureName}>
                  {review.lectureName}
                </TableCell>
                <TableCell className="text-muted-foreground truncate" title={`${review.userName} (${review.nickname})`}>
                  {review.nickname}
                </TableCell>
                <TableCell className="text-muted-foreground">{review.score}점</TableCell>
                <TableCell>
                  <StatusBadge status={review.certificateApprovalStatus} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={review.reviewApprovalStatus} />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(review.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onViewDetail(review)}>
                      상세보기
                    </Button>
                    {review.reviewApprovalStatus === 'PENDING' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onApprove(review.reviewId)}
                          className="bg-emerald-400 hover:bg-emerald-500"
                        >
                          승인
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onReject(review.reviewId)}>
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
