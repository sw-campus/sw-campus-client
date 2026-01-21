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
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-foreground text-base sm:text-lg">기관 회원 목록</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
        <div className="-mx-3 overflow-x-auto sm:mx-0">
          <Table className="min-w-[400px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-xs sm:w-[60px] sm:text-sm">NO</TableHead>
                <TableHead className="min-w-[120px] text-xs sm:text-sm">기관명</TableHead>
                <TableHead className="w-[80px] text-xs sm:w-[110px] sm:text-sm">상태</TableHead>
                <TableHead className="w-[90px] text-xs sm:w-[120px] sm:text-sm">신청일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org, index) => (
                <TableRow
                  key={org.id}
                  onClick={() => onViewDetail(org)}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <TableCell className="text-muted-foreground text-xs sm:text-sm">{getRowNumber(index)}</TableCell>
                  <TableCell className="text-foreground max-w-[150px] truncate text-xs font-medium sm:max-w-none sm:text-sm" title={org.name}>
                    {org.name}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={org.approvalStatus} />
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap text-xs sm:text-sm">{formatDate(org.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
