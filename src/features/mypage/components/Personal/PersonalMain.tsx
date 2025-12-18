'use client'

import { useEffect, useState } from 'react'

import { Star } from 'lucide-react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CATEGORY_LABELS, type ReviewCategory } from '@/features/lecture/api/reviewApi.types'
import { api } from '@/lib/axios'

type PersonalMainProps = {
  activeSection: 'password' | 'survey' | 'reviews'
  openInfoModal: () => void
  onOpenProductModal: () => void
}

const dashboardStats = [
  { label: '등록 대기', value: '1개', note: '내부 승인 대기중' },
  { label: '반려된 교육과정', value: '2개', note: '이번 분기 시작 예정' },
  { label: '승인된 교육과정', value: '5개', note: '평균 수강률 86%' },
]

export default function PersonalMain({ activeSection, openInfoModal, onOpenProductModal }: PersonalMainProps) {
  // (개인 후기 목록 상태는 현재 사용하지 않음)

  // Lectures for survey tab
  // 수료 인증된 강의 목록 (후기 작성 가능 여부 포함)
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

  const [lectures, setLectures] = useState<CompletedLecture[] | null>(null)
  const [lecturesLoading, setLecturesLoading] = useState(false)
  const [lecturesError, setLecturesError] = useState<string | null>(null)
  // 리뷰 수정 모달 상태
  const [editOpen, setEditOpen] = useState(false)
  // ReviewForm modal state
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null)

  // Create review modal state
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

  // useEffect(() => {
  //   if (activeSection !== 'reviews') return
  //   let cancelled = false
  //   const fetchReviews = async () => {
  //     try {
  //       setLoading(true)
  //       setError(null)
  //       const { data } = await api.get<Review[]>('/mypage/reviews')
  //       if (!cancelled) setReviews(Array.isArray(data) ? data : [])
  //     } catch (e) {
  //       if (!cancelled) setError('후기 데이터를 불러오지 못했습니다.')
  //     } finally {
  //       if (!cancelled) setLoading(false)
  //     }
  //   }
  //   fetchReviews()
  //   return () => {
  //     cancelled = true
  //   }
  // }, [activeSection])

  useEffect(() => {
    if (activeSection !== 'reviews') return
    let cancelled = false
    const fetchLectures = async () => {
      try {
        setLecturesLoading(true)
        setLecturesError(null)
        const { data } = await api.get<CompletedLecture[]>('/mypage/completed-lectures')
        if (!cancelled) setLectures(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setLecturesError('강의 목록을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLecturesLoading(false)
      }
    }
    // (이전 개인 후기 조회 useEffect는 사용하지 않아 정리)
    fetchLectures()
    return () => {
      cancelled = true
    }
  }, [activeSection])

  const formatDate = (iso?: string) => {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      return d.toLocaleDateString()
    } catch {
      return iso
    }
  }

  if (activeSection === 'password') {
    return (
      <main className="flex flex-1 flex-col gap-6 rounded-3xl bg-white/60 p-6 shadow-black/40">
        {/* Header Card */}
        <header className="rounded-2xl bg-white/70 px-5 py-4 ring-1 ring-white/30 backdrop-blur-xl">
          <h3 className="text-2xl font-semibold text-gray-900">비밀번호 확인</h3>
          <p className="mt-1 text-sm text-gray-600">개인 정보 수정을 위해 비밀번호를 입력해주세요.</p>
        </header>

        {/* Form Card */}
        <div className="mx-auto max-w-sm rounded-2xl bg-white/70 p-5 ring-1 ring-white/30 backdrop-blur-xl">
          <input
            type="password"
            placeholder="비밀번호 입력"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-100"
          />
          <Button
            className="mt-4 w-full rounded-full border-gray-200 bg-gray-50 text-gray-700 shadow-sm hover:bg-gray-100"
            onClick={openInfoModal}
          >
            확인
          </Button>
        </div>
      </main>
    )
  }

  if (activeSection === 'survey') {
    return (
      <main className="flex flex-1 flex-col gap-6 rounded-3xl bg-white/60 p-6 shadow-black/40">
        {/* Header Card */}
        <header className="rounded-2xl bg-white/70 px-5 py-4 ring-1 ring-white/30 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">나의 활동</p>
              <h3 className="text-2xl font-semibold text-gray-900">설문 조사</h3>
            </div>
            <Button
              className="rounded-full border-gray-200 bg-gray-50 text-gray-700 shadow-sm hover:bg-gray-100"
              onClick={onOpenProductModal}
            >
              설문조사
            </Button>
          </div>
        </header>

        {/* Stats cards */}
        <section className="rounded-2xl bg-white/70 p-5 text-gray-700 ring-1 ring-white/30 backdrop-blur-xl">
          <div className="grid gap-4 sm:grid-cols-3">
            {dashboardStats.map(stat => (
              <article
                key={stat.label}
                className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm ring-1 ring-black/5"
              >
                <p className="text-xs text-gray-500 uppercase">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.note}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    )
  }

  // reviews
  return (
    <main className="flex flex-1 flex-col gap-6 rounded-3xl bg-white/60 p-6 shadow-black/40">
      {/* Header Card */}
      <header className="rounded-2xl bg-white/70 px-5 py-4 ring-1 ring-white/30 backdrop-blur-xl">
        <div>
          <p className="text-sm text-gray-600">나의 활동</p>
          <h3 className="text-2xl font-semibold text-gray-900">내 후기</h3>
        </div>
      </header>

      {/* List Card (match ReviewListModal aesthetic) */}
      <section className="bg-card/40 text-foreground rounded-2xl p-5 backdrop-blur-xl">
        <header className="mb-3">
          <h4 className="text-foreground text-lg font-semibold">내 강의 목록</h4>
        </header>
        {lecturesLoading && <p className="text-muted-foreground">불러오는 중...</p>}
        {lecturesError && !lecturesLoading && (
          <div className="text-destructive-foreground flex items-center gap-3">
            <p>{lecturesError}</p>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                // simple retry
                ;(async () => {
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
                })()
              }}
            >
              다시 시도
            </Button>
          </div>
        )}
        {!lecturesLoading && !lecturesError && (lectures?.length ?? 0) === 0 && (
          <p className="text-muted-foreground">등록된 강의가 없습니다.</p>
        )}
        {!lecturesLoading && !lecturesError && (lectures?.length ?? 0) > 0 && (
          <ul className="space-y-3">
            {lectures!.map(l => (
              <li
                key={l.certificateId}
                className="bg-card/40 text-foreground rounded-2xl p-5 shadow-sm backdrop-blur-xl transition hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-white">
                      {l.lectureImageUrl ? (
                        <Image src={l.lectureImageUrl} alt={l.lectureName} fill className="object-cover" />
                      ) : (
                        <div className="text-muted-foreground flex h-full w-full items-center justify-center bg-gray-50 text-sm font-semibold">
                          {l.lectureName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">코스</p>
                      <p className="text-foreground text-base font-semibold">{l.lectureName}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">기관: {l.organizationName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {l.canWriteReview ? (
                      <Badge className="rounded-full border-gray-200 bg-white text-gray-700" variant="outline">
                        작성 가능
                      </Badge>
                    ) : (
                      <Badge className="rounded-full border-gray-200 bg-white text-gray-700" variant="outline">
                        작성완료
                      </Badge>
                    )}
                    {l.canWriteReview ? (
                      <Button
                        size="sm"
                        className="rounded-full border-gray-200 bg-gray-50 text-gray-700 shadow-sm hover:bg-gray-100"
                        onClick={() => {
                          setCreateError(null)
                          setCreateLectureId(l.lectureId)
                          setCreateLectureName(l.lectureName)
                          setCreateScore(0)
                          setCreateComment('')
                          setCreateDetails([])
                          setCreateOpen(true)
                        }}
                      >
                        후기 작성
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-gray-200 bg-gray-50 text-gray-700 shadow-sm hover:bg-gray-100"
                        onClick={() => {
                          // Always open modal; show fallback message inside when reviewId is missing
                          setSelectedReviewId(l.reviewId ?? null)
                          setEditOpen(true)
                        }}
                      >
                        리뷰 수정
                      </Button>
                    )}
                  </div>
                </div>

                {/* Inline details in horizontal layout */}
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <span className="text-muted-foreground">
                    강의 ID: <span className="text-foreground font-medium">{l.lectureId}</span>
                  </span>
                  <span className="text-muted-foreground">
                    교육기관: <span className="text-foreground font-medium">{l.organizationName}</span>
                  </span>
                  <span className="text-muted-foreground">
                    수료일: <span className="text-foreground font-medium">{formatDate(l.certifiedAt)}</span>
                  </span>
                  <span className="text-muted-foreground">
                    후기 작성:{' '}
                    <span className="text-foreground font-medium">{l.canWriteReview ? '가능' : '완료됨'}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 리뷰 수정 모달 - ReviewForm 임베드 */}
      <Dialog open={editOpen} onOpenChange={open => setEditOpen(open)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-2xl font-bold">리뷰 수정</DialogTitle>
          </DialogHeader>
          {selectedReviewId ? (
            <ReviewForm embedded reviewId={selectedReviewId} />
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
                    // Try several payload/endpoints to match backend
                    const payloadA = { score: createScore, comment: createComment, detailScores: createDetails }
                    const payloadB = { score: createScore, content: createComment, items: createDetails }
                    const payloadC = { lectureId: createLectureId, ...payloadA }
                    const payloadD = { lectureId: createLectureId, ...payloadB }

                    // Preferred: lecture-scoped endpoint
                    try {
                      await api.post(`/lectures/${createLectureId}/reviews`, payloadA)
                    } catch {
                      try {
                        await api.post(`/lectures/${createLectureId}/reviews`, payloadB)
                      } catch {
                        try {
                          await api.post(`/reviews`, payloadC)
                        } catch {
                          await api.post(`/reviews`, payloadD)
                        }
                      }
                    }
                    setCreateOpen(false)
                    // refresh list to reflect canWriteReview change
                    try {
                      setLecturesLoading(true)
                      const { data } = await api.get<CompletedLecture[]>(`/mypage/completed-lectures`)
                      setLectures(Array.isArray(data) ? data : [])
                    } finally {
                      setLecturesLoading(false)
                    }
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
    </main>
  )
}
