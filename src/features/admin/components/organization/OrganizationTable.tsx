'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

import {
  APPROVAL_STATUS_COLOR,
  APPROVAL_STATUS_LABEL,
  type ApprovalStatus,
  type OrganizationSummary,
} from '../../types/organization.type'

interface OrganizationTableProps {
  organizations: OrganizationSummary[]
  isLoading: boolean
  currentPage: number
  pageSize: number
  onViewDetail: (organization: OrganizationSummary) => void
  onApprove: (organizationId: number) => void
  onReject: (organizationId: number) => void
}

function StatusBadge({ status }: { status: ApprovalStatus }) {
  return (
    <Badge variant="secondary" className={cn('font-medium', APPROVAL_STATUS_COLOR[status])}>
      {APPROVAL_STATUS_LABEL[status]}
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

export function OrganizationTable({
  organizations,
  isLoading,
  currentPage,
  pageSize,
  onViewDetail,
  onApprove,
  onReject,
}: OrganizationTableProps) {
  // 페이지 기반 NO 계산
  const getRowNumber = (index: number) => currentPage * pageSize + index + 1

  if (isLoading) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">기관 회원 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">로딩 중...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (organizations.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">기관 회원 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">해당 조건의 기관 회원이 없습니다.</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">기관 회원 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">NO</TableHead>
              <TableHead>기관명</TableHead>
              <TableHead className="w-[100px]">상태</TableHead>
              <TableHead className="w-[120px]">신청일</TableHead>
              <TableHead className="w-[200px] text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org, index) => (
              <TableRow key={org.id}>
                <TableCell className="text-muted-foreground">{getRowNumber(index)}</TableCell>
                <TableCell className="text-foreground font-medium">{org.name}</TableCell>
                <TableCell>
                  <StatusBadge status={org.approvalStatus} />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(org.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onViewDetail(org)}>
                      상세보기
                    </Button>
                    {org.approvalStatus === 'PENDING' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onApprove(org.id)}
                          className="bg-emerald-400 hover:bg-emerald-500"
                        >
                          승인
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onReject(org.id)}>
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
