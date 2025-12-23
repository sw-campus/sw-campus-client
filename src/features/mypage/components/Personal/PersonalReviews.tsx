'use client'

import { useEffect, useState } from 'react'

import { Star } from 'lucide-react'
import Image from 'next/image'
import { LuCheck, LuClock, LuList, LuPencil } from 'react-icons/lu'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatCard } from '@/features/admin/components/StatCard'
import { CATEGORY_LABELS, type ReviewCategory } from '@/features/lecture/api/reviewApi.types'
import { ReviewForm } from '@/features/mypage/components/review/ReviewForm'
import { api } from '@/lib/axios'

type CompletedLecture = {
  certificateId: number
  lectureId: number
  lectureName: string
  lectureImageUrl?: string
  organizationName: string
  certifiedAt: string
  canWriteReview: boolean
  reviewId?: number
}

function StatusBadge({ canWriteReview }: { canWriteReview: boolean }) {
  return (
    <Badge
      variant="secondary"
      className={
        canWriteReview ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }
    >
      {canWriteReview ? '작성 가능' : '작성 완료'}
    </Badge>
  )
}

export default function PersonalReviews() {
  const [lectures, setLectures] = useState<CompletedLecture[] | null>(null)
  const [lecturesLoading, setLecturesLoading] = useState(false)
  const [lecturesError, setLecturesError] = useState<string | null>(null)

  // LectureId별 승인(버튼 라벨 전환용)
  const [approvedLectureIds, setApprovedLectureIds] = useState<Set<number>>(new Set())

  // 리뷰 수정 모달 상태
  const [editOpen, setEditOpen] = useState(false)
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null)
  const [selectedLectureId, setSelectedLectureId] = useState<number | null>(null)
  const [selectedReviewReadOnly, setSelectedReviewReadOnly] = useState(false)

  // 후기 작성 모달 상태
  const [createOpen, setCreateOpen] = useState(false)
  const [createLectureId, setCreateLectureId] = useState<number | null>(null)
  const [createLectureName, setCreateLectureName] = useState<string>('')
  const [createSaving, setCreateSaving] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [createScore, setCreateScore] = useState<number>(0)
  const [createComment, setCreateComment] = useState<string>('')
  const [createDetails, setCreateDetails] = useState<
    Array<{ category: ReviewCategory; score: number; comment?: string }>
  >([])

  const defaultReviewDetails = (
    initialScore = 0,
  ): Array<{ category: ReviewCategory; score: number; comment?: string }> => {
    const categories = Object.keys(CATEGORY_LABELS) as ReviewCategory[]
    return categories.map(category => ({ category, score: initialScore, comment: '' }))
  }

  const fetchLectures = async () => {
    try {
      setLecturesLoading(true)
      setLecturesError(null)
      const { data } = await api.get<CompletedLecture[]>('/mypage/completed-lectures')
      setLectures(Array.isArray(data) ? data : [])
    } catch {
      setLecturesError('강의 목록을 불러오지 못했습니다.')
    } finally {
      setLecturesLoading(false)
    }
  }

  useEffect(() => {
    fetchLectures()
  }, [])

  useEffect(() => {
    if (!lectures || lectures.length === 0) return

    let cancelled = false

    const parseApproved = (data: unknown): boolean => {
      const approvalStatus = (data as { approvalStatus?: unknown })?.approvalStatus
      if (typeof approvalStatus === 'string') {
        return approvalStatus.toUpperCase() === 'APPROVED'
      }

      const status =
        (data as { status?: unknown; reviewStatus?: unknown })?.status ??
        (data as { reviewStatus?: unknown })?.reviewStatus
      const statusStr = typeof status === 'string' ? status : ''

      const isApprovedBool =
        (data as { isApproved?: unknown })?.isApproved === true || (data as { approved?: unknown })?.approved === true

      return isApprovedBool || statusStr.toUpperCase() === 'APPROVED'
    }

    const hydrateApproved = async () => {
      const targetLectures = lectures.filter(l => !l.canWriteReview)
      if (targetLectures.length === 0) return

      try {
        const results = await Promise.all(
          targetLectures.map(async l => {
            try {
              const { data } = await api.get<unknown>(`/mypage/completed-lectures/${l.lectureId}/review`)
              const rid = (data as { reviewId?: unknown })?.reviewId
              return {
                lectureId: l.lectureId,
                reviewId: typeof rid === 'number' ? rid : Number(rid),
                approved: parseApproved(data),
              }
            } catch {
              return { lectureId: l.lectureId, reviewId: NaN, approved: false }
            }
          }),
        )

        if (cancelled) return
        setApprovedLectureIds(prev => {
          const next = new Set(prev)
          for (const r of results) {
            if (r.approved) next.add(r.lectureId)
            else next.delete(r.lectureId)
          }
          return next
        })
      } catch {
        // ignore
      }
    }

    hydrateApproved()
    return () => {
      cancelled = true
    }
  }, [lectures])

  const formatDate = (iso?: string) => {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      return d.toLocaleDateString()
    } catch {
      return iso
    }
  }

  // Stats
  const totalCount = lectures?.length ?? 0
  const writtenCount = lectures?.filter(l => !l.canWriteReview).length ?? 0
  const writeableCount = lectures?.filter(l => l.canWriteReview).length ?? 0

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <h1 className="text-foreground text-2xl font-bold">내 후기</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="수료한 강의" value={totalCount} icon={LuList} />
        <StatCard title="작성한 후기" value={writtenCount} icon={LuCheck} />
        <StatCard title="작성 가능" value={writeableCount} icon={LuClock} />
      </div>

      {/* List Card */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">수료 강의 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {lecturesLoading && <p className="text-muted-foreground">불러오는 중...</p>}
          {lecturesError && !lecturesLoading && (
            <div className="text-destructive-foreground flex flex-col items-center gap-3">
              <p>{lecturesError}</p>
              <Button size="sm" variant="secondary" onClick={() => void fetchLectures()}>
                다시 시도
              </Button>
            </div>
          )}
          {!lecturesLoading && !lecturesError && (lectures?.length ?? 0) === 0 && (
            <div className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">등록된 강의가 없습니다.</p>
            </div>
          )}
          {!lecturesLoading && !lecturesError && (lectures?.length ?? 0) > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">NO</TableHead>
                  <TableHead>강의 정보</TableHead>
                  <TableHead className="w-[120px]">수료일</TableHead>
                  <TableHead className="w-[100px]">상태</TableHead>
                  <TableHead className="w-[100px] text-center">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lectures!.map((l, index) => (
                  <TableRow key={l.certificateId}>
                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                          {l.lectureImageUrl ? (
                            <Image
                              src={l.lectureImageUrl}
                              alt={l.lectureName}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-400">
                              {l.lectureName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-foreground font-medium">{l.lectureName}</p>
                          <p className="text-muted-foreground text-xs">{l.organizationName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(l.certifiedAt)}</TableCell>
                    <TableCell>
                      <StatusBadge canWriteReview={l.canWriteReview} />
                    </TableCell>
                    <TableCell className="text-center">
                      {l.canWriteReview ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setCreateError(null)
                            setCreateLectureId(l.lectureId)
                            setCreateLectureName(l.lectureName)
                            setCreateScore(0)
                            setCreateComment('')
                            setCreateDetails(defaultReviewDetails(0))
                            setCreateOpen(true)
                          }}
                        >
                          <LuPencil className="h-4 w-4" />
                          <span className="sr-only">후기 작성</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedReviewId(l.reviewId ?? null)
                            setSelectedLectureId(l.lectureId)
                            setSelectedReviewReadOnly(Boolean(approvedLectureIds.has(l.lectureId)))
                            setEditOpen(true)
                          }}
                        >
                          <LuPencil className="h-4 w-4" />
                          <span className="sr-only">리뷰 수정/조회</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 리뷰 수정 모달 */}
      <Dialog open={editOpen} onOpenChange={open => setEditOpen(open)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-2xl font-bold">
              {selectedReviewReadOnly ? '리뷰 조회' : '리뷰 수정'}
            </DialogTitle>
          </DialogHeader>
          {selectedLectureId ? (
            <ReviewForm
              embedded
              reviewId={selectedReviewId ?? undefined}
              lectureId={selectedLectureId}
              readOnly={selectedReviewReadOnly}
              onClose={() => setEditOpen(false)}
            />
          ) : (
            <p className="text-muted-foreground text-sm">리뷰 정보를 찾을 수 없습니다.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* 후기 작성 모달 */}
      <Dialog open={createOpen} onOpenChange={open => setCreateOpen(open)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-2xl font-bold">후기 작성</DialogTitle>
          </DialogHeader>
          {createError && <p className="text-destructive-foreground text-sm">{createError}</p>}

          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-xs">강의</p>
                <p className="text-foreground text-sm font-semibold">{createLectureName}</p>
                {createLectureId && <p className="text-muted-foreground text-xs">강의 ID: {createLectureId}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.5}
                  value={createScore}
                  onChange={e => setCreateScore(Number(e.target.value))}
                  className="w-20 rounded-md border border-gray-200 bg-white px-2 py-1 text-right text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">한줄 후기</label>
              <textarea
                value={createComment}
                onChange={e => setCreateComment(e.target.value)}
                rows={3}
                className="text-foreground w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400"
                placeholder="후기를 입력하세요"
              />
            </div>

            {createDetails && createDetails.length > 0 && (
              <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                {createDetails.map((d, idx) => (
                  <div key={`${d.category}-${idx}`} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">{CATEGORY_LABELS[d.category]}</span>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <input
                          type="number"
                          min={0}
                          max={5}
                          step={0.5}
                          value={d.score}
                          onChange={e => {
                            const v = Number(e.target.value)
                            setCreateDetails(prev => prev.map((x, i) => (i === idx ? { ...x, score: v } : x)))
                          }}
                          className="w-16 rounded-md border border-gray-200 bg-white px-2 py-1 text-right text-sm"
                        />
                      </div>
                    </div>
                    <textarea
                      value={d.comment ?? ''}
                      onChange={e =>
                        setCreateDetails(prev =>
                          prev.map((x, i) => (i === idx ? { ...x, comment: e.target.value } : x)),
                        )
                      }
                      rows={2}
                      className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                      placeholder="세부 의견을 입력하세요"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" className="rounded-full" variant="secondary" onClick={() => setCreateOpen(false)}>
                닫기
              </Button>
              <Button
                size="sm"
                className="rounded-full"
                disabled={createSaving || !createLectureId}
                onClick={async () => {
                  if (!createLectureId) return
                  try {
                    setCreateSaving(true)
                    setCreateError(null)
                    await api.post('/reviews', {
                      lectureId: createLectureId,
                      comment: createComment,
                      detailScores: createDetails.map(d => ({
                        category: d.category,
                        score: d.score,
                        comment: d.comment,
                      })),
                    })

                    setCreateOpen(false)
                    void fetchLectures() // Refresh list
                  } catch {
                    setCreateError('후기 저장에 실패했습니다.')
                  } finally {
                    setCreateSaving(false)
                  }
                }}
              >
                저장
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
