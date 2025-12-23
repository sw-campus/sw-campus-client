'use client'

import { LuBuilding, LuShield, LuUser } from 'react-icons/lu'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

import type { MemberRole, MemberSummary } from '../../types/member.type'

interface MemberTableProps {
  members: MemberSummary[]
  isLoading: boolean
  currentPage: number
  pageSize: number
}

// 역할별 스타일 및 라벨 정의 (통계 카드와 동일한 색상 체계)
const ROLE_CONFIG: Record<MemberRole, { label: string; icon: React.ElementType; className: string }> = {
  USER: {
    label: '일반회원',
    icon: LuUser,
    className: 'bg-blue-500 text-white',
  },
  ORGANIZATION: {
    label: '기관회원',
    icon: LuBuilding,
    className: 'bg-emerald-500 text-white',
  },
  ADMIN: {
    label: '관리자',
    icon: LuShield,
    className: 'bg-amber-500 text-white',
  },
}

function RoleBadge({ role }: { role: MemberRole }) {
  const config = ROLE_CONFIG[role]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm',
        config.className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  )
}

export function MemberTable({ members, isLoading, currentPage, pageSize }: MemberTableProps) {
  const getRowNumber = (index: number) => currentPage * pageSize + index + 1

  if (isLoading) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">회원 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">로딩 중...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (members.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">회원 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">회원이 없습니다.</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">회원 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b-2">
              <TableHead className="w-[60px] font-semibold">NO</TableHead>
              <TableHead className="font-semibold">이메일</TableHead>
              <TableHead className="font-semibold">이름</TableHead>
              <TableHead className="font-semibold">닉네임</TableHead>
              <TableHead className="font-semibold">전화번호</TableHead>
              <TableHead className="w-[120px] text-center font-semibold">역할</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member, index) => (
              <TableRow key={member.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="text-muted-foreground font-medium">{getRowNumber(index)}</TableCell>
                <TableCell className="font-medium">{member.email}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell className="text-muted-foreground">{member.nickname}</TableCell>
                <TableCell className="text-muted-foreground">{member.phone || '-'}</TableCell>
                <TableCell className="text-center">
                  <RoleBadge role={member.role} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
