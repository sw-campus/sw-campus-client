'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/date'
import { cn } from '@/lib/utils'

import type { AdminQuestionSet, QuestionSetStatus } from '../../types/survey.type'
import { QUESTION_SET_STATUS_COLOR, QUESTION_SET_STATUS_LABEL } from '../../types/survey.type'

interface QuestionSetTableProps {
  questionSets: AdminQuestionSet[]
  isLoading: boolean
  onViewDetail: (questionSet: AdminQuestionSet) => void
}

function StatusBadge({ status }: { status: QuestionSetStatus }) {
  return (
    <Badge variant="secondary" className={cn('font-medium', QUESTION_SET_STATUS_COLOR[status])}>
      {QUESTION_SET_STATUS_LABEL[status]}
    </Badge>
  )
}

export function QuestionSetTable({ questionSets, isLoading, onViewDetail }: QuestionSetTableProps) {
  if (isLoading) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">문항 세트 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">로딩 중...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (questionSets.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">문항 세트 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">문항 세트가 없습니다. 새로 등록해주세요.</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-foreground text-base sm:text-lg">문항 세트 목록</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
        <div className="-mx-3 overflow-x-auto sm:mx-0">
          <Table className="min-w-[500px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] text-xs sm:w-[60px] sm:text-sm">NO</TableHead>
                <TableHead className="min-w-[120px] text-xs sm:text-sm">세트명</TableHead>
                <TableHead className="w-[60px] text-center text-xs sm:w-[80px] sm:text-sm">버전</TableHead>
                <TableHead className="w-[70px] text-center text-xs sm:w-[90px] sm:text-sm">상태</TableHead>
                <TableHead className="w-[60px] text-center text-xs sm:w-[80px] sm:text-sm">문항 수</TableHead>
                <TableHead className="w-[100px] text-xs sm:w-[120px] sm:text-sm">생성일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questionSets.map((questionSet, index) => (
                <TableRow
                  key={questionSet.questionSetId}
                  onClick={() => onViewDetail(questionSet)}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <TableCell className="text-muted-foreground text-xs sm:text-sm">{index + 1}</TableCell>
                  <TableCell
                    className="text-foreground max-w-[150px] truncate text-xs font-medium sm:max-w-none sm:text-sm"
                    title={questionSet.name}
                  >
                    {questionSet.name}
                  </TableCell>
                  <TableCell className="text-center text-xs sm:text-sm">v{questionSet.version}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={questionSet.status} />
                  </TableCell>
                  <TableCell className="text-center text-xs sm:text-sm">{questionSet.questionCount}</TableCell>
                  <TableCell className="text-muted-foreground text-xs sm:text-sm">
                    {formatDate(questionSet.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
