'use client'

import { useEffect, useState } from 'react'

import { isAxiosError } from 'axios'
import { Star } from 'lucide-react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CATEGORY_LABELS, type ReviewCategory } from '@/features/lecture/api/reviewApi.types'
import { ReviewForm } from '@/features/mypage/components/review/ReviewForm'
import { api } from '@/lib/axios'

type PersonalMainProps = {
  activeSection: 'password' | 'survey' | 'reviews'
  openInfoModal: () => void
  onOpenProductModal: () => void
}

// 설문조사 단건 존재 여부 응답(스크린샷 기준)
type MySurveyResponse = {
  surveyId: number | null
  exists?: boolean | null
  [key: string]: unknown
}

export default function PersonalMain({ activeSection, openInfoModal, onOpenProductModal }: PersonalMainProps) {
  // (개인 후기 목록 상태는 현재 사용하지 않음)

  // 비밀번호 검증
  const [passwordInput, setPasswordInput] = useState<string>('')
  const [passwordVerifying, setPasswordVerifying] = useState(false)
  const [passwordVerifyError, setPasswordVerifyError] = useState<string | null>(null)

  useEffect(() => {
    if (activeSection !== 'password') return
    setPasswordInput('')
    setPasswordVerifyError(null)
    setPasswordVerifying(false)
  }, [activeSection])

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
  const [selectedLectureId, setSelectedLectureId] = useState<number | null>(null)
  const [selectedReviewReadOnly, setSelectedReviewReadOnly] = useState(false)

  // lectureId별 승인(버튼 라벨 전환용)
  const [approvedLectureIds, setApprovedLectureIds] = useState<Set<number>>(new Set())

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

  const defaultReviewDetails = (
    initialScore = 0,
  ): Array<{ category: ReviewCategory; score: number; comment?: string }> => {
    const categories = Object.keys(CATEGORY_LABELS) as ReviewCategory[]
    return categories.map(category => ({ category, score: initialScore, comment: '' }))
  }

  // 설문 존재 여부 상태 (surveyId가 null이 아니면 1, null이면 0)
  const [surveyExists, setSurveyExists] = useState<boolean | null>(null)
  const [surveyLoading, setSurveyLoading] = useState(false)
  const [surveyError, setSurveyError] = useState<string | null>(null)

  useEffect(() => {
    if (activeSection !== 'survey') return
    let cancelled = false
    const fetchMySurvey = async () => {
      try {
        setSurveyLoading(true)
        setSurveyError(null)
        // 스펙: GET /api/v1/mypage/survey
        // 프런트 베이스 URL에 /api/v1가 포함되어 있으므로 상대 경로 사용
        const { data } = await api.get<MySurveyResponse>('/mypage/survey')
        const id = (data as MySurveyResponse)?.surveyId
        const exists = Boolean((data as MySurveyResponse)?.exists) || (id !== null && id !== undefined)
        if (!cancelled) setSurveyExists(exists)
      } catch {
        if (!cancelled) setSurveyError('설문 정보를 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setSurveyLoading(false)
      }
    }
    fetchMySurvey()
    return () => {
      cancelled = true
    }
  }, [activeSection])

  useEffect(() => {
    if (activeSection !== 'reviews') return
    let cancelled = false
    const fetchLectures = async () => {
      try {
        setLecturesLoading(true)
        setLecturesError(null)
        // 스펙: GET /api/v1/mypage/completed_lectures
        // 프런트 베이스 URL에 /api/v1가 포함되어 있으므로 상대 경로 사용
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

  useEffect(() => {
    if (activeSection !== 'reviews') return
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
  }, [activeSection, lectures])

  const formatDate = (iso?: string) => {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      return d.toLocaleDateString()
    } catch {
      return iso
    }
  }

  const verifyPasswordAndOpen = async () => {
    try {
      setPasswordVerifying(true)
      setPasswordVerifyError(null)

      const password = passwordInput.trim()

      if (process.env.NODE_ENV !== 'production') {
        console.warn('[mypage.verify-password] request', {
          hasPassword: password.length > 0,
          passwordLength: password.length,
        })
      }

      const { data } = await api.post<unknown>('/mypage/verify-password', {
        password,
      })

      if (process.env.NODE_ENV !== 'production') {
        console.warn('[mypage.verify-password] response', data)
      }

      const verified =
        typeof data === 'boolean'
          ? data
          : typeof (data as { verified?: unknown })?.verified === 'boolean'
            ? Boolean((data as { verified?: unknown }).verified)
            : typeof (data as { isValid?: unknown })?.isValid === 'boolean'
              ? Boolean((data as { isValid?: unknown }).isValid)
              : typeof (data as { success?: unknown })?.success === 'boolean'
                ? Boolean((data as { success?: unknown }).success)
                : typeof (data as { result?: unknown })?.result === 'boolean'
                  ? Boolean((data as { result?: unknown }).result)
                  : false

      if (process.env.NODE_ENV !== 'production') {
        console.warn('[mypage.verify-password] parsed', { verified })
      }

      if (!verified) {
        setPasswordVerifyError('비밀번호가 일치하지 않습니다.')
        return
      }

      openInfoModal()
    } catch (err: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        if (isAxiosError(err)) {
          console.error('[mypage.verify-password] error', {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message,
          })
        } else {
          console.error('[mypage.verify-password] error', err)
        }
      }
      setPasswordVerifyError('비밀번호 검증에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setPasswordInput('')
      setPasswordVerifying(false)
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
            value={passwordInput}
            onChange={e => {
              setPasswordInput(e.target.value)
              if (passwordVerifyError) setPasswordVerifyError(null)
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                void verifyPasswordAndOpen()
              }
            }}
          />
          {passwordVerifyError && <p className="mt-2 text-sm text-red-600">{passwordVerifyError}</p>}
          <Button
            className="mt-4 w-full rounded-full border-gray-200 bg-gray-50 text-gray-700 shadow-sm hover:bg-gray-100"
            onClick={() => void verifyPasswordAndOpen()}
            disabled={passwordVerifying || passwordInput.trim().length === 0}
          >
            {passwordVerifying ? '확인 중...' : '확인'}
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
              {surveyExists ? '설문 수정' : '설문 작성'}
            </Button>
          </div>
        </header>

        {/* 단일 카드: 등록된 설문이 있는지 여부만 표시 */}
        <section className="rounded-2xl bg-white/70 p-5 text-gray-700 ring-1 ring-white/30 backdrop-blur-xl">
          {surveyLoading && <p className="text-sm text-gray-500">불러오는 중...</p>}
          {surveyError && !surveyLoading && <p className="text-sm text-red-600">{surveyError}</p>}
          {!surveyLoading && !surveyError && (
            <div className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm ring-1 ring-black/5">
                <p className="text-xs text-gray-500 uppercase">등록된 설문</p>
                <p className="text-2xl font-semibold text-gray-900">{(surveyExists ? 1 : 0).toLocaleString()}개</p>
                <p className="mt-1 text-sm text-gray-500">
                  {surveyExists ? '작성됨 · 수정 가능' : '아직 작성되지 않음'}
                </p>
              </article>
            </div>
          )}
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
                          // 스펙: POST /api/v1/reviews 는 detailScores를 받으므로 기본 항목을 준비
                          setCreateDetails(defaultReviewDetails(0))
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
                          setSelectedLectureId(l.lectureId)
                          setSelectedReviewReadOnly(Boolean(approvedLectureIds.has(l.lectureId)))
                          setEditOpen(true)
                        }}
                      >
                        {approvedLectureIds.has(l.lectureId) ? '리뷰 조회' : '리뷰 수정'}
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
                    // 스펙: POST /api/v1/reviews
                    // 프런트 베이스 URL에 /api/v1가 포함되어 있으므로 상대 경로 사용
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
