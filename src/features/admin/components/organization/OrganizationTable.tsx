'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/date'
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
}

function StatusBadge({ status }: { status: ApprovalStatus }) {
  return (
    <Badge variant="secondary" className={cn('font-medium', APPROVAL_STATUS_COLOR[status])}>
      {APPROVAL_STATUS_LABEL[status]}
    </Badge>
  )
}

export function OrganizationTable({
  organizations,
  isLoading,
  currentPage,
  pageSize,
  onViewDetail,
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
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">NO</TableHead>
              <TableHead>기관명</TableHead>
              <TableHead className="w-[110px]">상태</TableHead>
              <TableHead className="w-[120px]">신청일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org, index) => (
              <TableRow
                key={org.id}
                onClick={() => onViewDetail(org)}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <TableCell className="text-muted-foreground">{getRowNumber(index)}</TableCell>
                <TableCell className="text-foreground truncate font-medium" title={org.name}>
                  {org.name}
                </TableCell>
                <TableCell>
                  <StatusBadge status={org.approvalStatus} />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(org.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
