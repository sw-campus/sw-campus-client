'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import type { MemberSummary } from '../../types/member.type'

interface MemberTableProps {
  members: MemberSummary[]
  isLoading: boolean
  currentPage: number
  pageSize: number
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
            <TableRow>
              <TableHead className="w-[60px]">NO</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>닉네임</TableHead>
              <TableHead>전화번호</TableHead>
              <TableHead className="w-[100px]">역할</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member, index) => (
              <TableRow key={member.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="text-muted-foreground">{getRowNumber(index)}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.nickname}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      member.role === 'ADMIN' ? 'destructive' : member.role === 'ORGANIZATION' ? 'default' : 'secondary'
                    }
                  >
                    {member.role}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
