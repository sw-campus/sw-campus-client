'use client'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { useCreateTestDataMutation, useDeleteTestDataMutation, useTestDataSummaryQuery } from '../../hooks/useTestData'

export function TestDataPage() {
  const { data: summary, isLoading } = useTestDataSummaryQuery()
  const createMutation = useCreateTestDataMutation()
  const deleteMutation = useDeleteTestDataMutation()

  const handleCreate = () => {
    if (summary?.exists) {
      toast.error('테스트 데이터가 이미 존재합니다. 먼저 삭제해주세요.')
      return
    }
    createMutation.mutate()
  }

  const handleDelete = () => {
    if (!summary?.exists) {
      toast.error('삭제할 테스트 데이터가 없습니다.')
      return
    }
    if (confirm('테스트 데이터를 삭제하시겠습니까?')) {
      deleteMutation.mutate()
    }
  }

  const isProcessing = createMutation.isPending || deleteMutation.isPending

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-foreground text-2xl font-bold">테스트 데이터 관리</h1>

      {/* 현황 카드 */}
      <div className="border-border bg-card rounded-lg border p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">현재 상태</h2>

        {isLoading ? (
          <p className="text-muted-foreground">로딩 중...</p>
        ) : summary?.exists ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-primary h-2 w-2 rounded-full" />
              <span className="text-foreground font-medium">테스트 데이터 존재</span>
            </div>
            <div className="text-muted-foreground grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
              <p>Batch ID: {summary.batchId}</p>
              <p>생성일: {summary.createdAt ? new Date(summary.createdAt).toLocaleString('ko-KR') : '-'}</p>
              <p>총 레코드: {summary.totalCount}건</p>
            </div>
            {summary.counts && (
              <div className="border-border mt-4 grid grid-cols-2 gap-3 border-t pt-4 sm:grid-cols-4 lg:grid-cols-8">
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-xs">기관</p>
                  <p className="text-foreground text-xl font-bold">{summary.counts.organizations}</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-xs">강의</p>
                  <p className="text-foreground text-xl font-bold">{summary.counts.lectures}</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-xs">선생님</p>
                  <p className="text-foreground text-xl font-bold">{summary.counts.teachers}</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-xs">회원</p>
                  <p className="text-foreground text-xl font-bold">{summary.counts.members}</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-xs">수료증</p>
                  <p className="text-foreground text-xl font-bold">{summary.counts.certificates}</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-xs">리뷰</p>
                  <p className="text-foreground text-xl font-bold">{summary.counts.reviews}</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-xs">설문조사</p>
                  <p className="text-foreground text-xl font-bold">{summary.counts.member_surveys}</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-muted-foreground text-xs">배너</p>
                  <p className="text-foreground text-xl font-bold">{summary.counts.banners}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="bg-muted-foreground h-2 w-2 rounded-full" />
            <span className="text-muted-foreground">테스트 데이터 없음</span>
          </div>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="border-border bg-card rounded-lg border p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">작업</h2>

        <div className="flex flex-wrap gap-4">
          <Button onClick={handleCreate} disabled={isProcessing || summary?.exists} className="min-w-[140px]">
            {createMutation.isPending ? '생성 중...' : '테스트 데이터 생성'}
          </Button>

          <Button
            onClick={handleDelete}
            disabled={isProcessing || !summary?.exists}
            variant="destructive"
            className="min-w-[140px]"
          >
            {deleteMutation.isPending ? '삭제 중...' : '테스트 데이터 삭제'}
          </Button>
        </div>

        <p className="text-muted-foreground mt-4 text-sm">
          * 테스트 데이터는 3개의 기관(승인 2 + 대기 1), 4개의 강의(승인 3 + 대기 1), 10명의 선생님, 18명의 회원(기관담당자
          3명 + 일반회원 15명), 60개의 수료증, 60개의 리뷰(승인 59 + 대기 1), 10개의 설문조사, 8개의 배너(대배너 3, 중배너
          2, 소배너 3)로 구성됩니다.
        </p>
      </div>
    </div>
  )
}
