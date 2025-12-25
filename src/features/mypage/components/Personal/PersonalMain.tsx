'use client'

import { useEffect, useState } from 'react'

import { isAxiosError } from 'axios'
import { LuStar, LuPencil } from 'react-icons/lu'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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

  // Create review modal state (ReviewForm 재사용)
  const [createOpen, setCreateOpen] = useState(false)
  const [createLectureId, setCreateLectureId] = useState<number | null>(null)
  const [createLectureName, setCreateLectureName] = useState<string>('')

  // 설문 존재 여부 상태 (surveyId가 null이 아니면 1, null이면 0)
  const [surveyExists, setSurveyExists] = useState<boolean | null>(null)
  const [surveyLoading, setSurveyLoading] = useState(false)
  const [surveyError, setSurveyError] = useState<string | null>(null)

  // 설문 저장 이벤트 수신 시 즉시 메인 상태 반영
  useEffect(() => {
    const handleSurveySaved = () => {
      setSurveyExists(true)
      setSurveyError(null)
      setSurveyLoading(false)
    }
    window.addEventListener('survey:saved', handleSurveySaved)
    return () => {
      window.removeEventListener('survey:saved', handleSurveySaved)
    }
  }, [])

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

        {/* 단일 카드: 등록된 설문이 있는지 여부만 표시 (OrganizationMain 스타일과 정렬) */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">설문 현황</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
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

      {/* List Card (OrganizationMain 스타일과 정렬) */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">내 강의 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {lecturesLoading ? (
            <div className="flex h-32 items-center justify-center">
              <span className="text-muted-foreground">로딩 중...</span>
            </div>
          ) : lecturesError ? (
            <div className="flex h-32 flex-col items-center justify-center gap-3">
              <span className="text-destructive">강의 목록을 불러오지 못했습니다.</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
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
          ) : (lectures?.length ?? 0) === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <span className="text-muted-foreground">등록된 강의가 없습니다.</span>
            </div>
          ) : (
            <TooltipProvider>
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w- 16 sm :table - cell hidden"> 아니요 </TableHead>
                    <TableHead>강의명</TableHead>
                    <TableHead className="hidden w-27.5 sm:table-cell">상태</TableHead>
                    <TableHead className="w- [7.5rem] hidden md:table-cell"> 수료일 </TableHead>
                    <TableHead className="hidden w-25 text-center sm:table-cell">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lectures!.map((l, index) => (
                    <TableRow key={l.certificateId} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="text-muted-foreground hidden sm:table-cell">{index + 1}</TableCell>
                      <TableCell className="text-foreground truncate font-medium" title={l.lectureName}>
                        {l.lectureName}
                        {/* 모바일 추가 정보 및 액션 */}
                        <div className="mt-1 flex items-center justify-between sm:hidden">
                          <div className="flex items-center gap-2">
                            {l.canWriteReview ? (
                              <Badge className="rounded-full border-gray-200 bg-white text-gray-700" variant="outline">
                                작성 가능
                              </Badge>
                            ) : (
                              <Badge className="rounded-full border-gray-200 bg-white text-gray-700" variant="outline">
                                {approvedLectureIds.has(l.lectureId) ? '승인됨' : '작성완료'}
                              </Badge>
                            )}
                            <span className="text-muted-foreground text-xs">{formatDate(l.certifiedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {l.canWriteReview ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="후기 작성"
                                onClick={() => {
                                  setCreateLectureId(l.lectureId)
                                  setCreateLectureName(l.lectureName)
                                  setCreateOpen(true)
                                }}
                              >
                                <LuStar className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label={approvedLectureIds.has(l.lectureId) ? '리뷰 조회' : '리뷰 수정'}
                                onClick={() => {
                                  setSelectedReviewId(l.reviewId ?? null)
                                  setSelectedLectureId(l.lectureId)
                                  setSelectedReviewReadOnly(Boolean(approvedLectureIds.has(l.lectureId)))
                                  setEditOpen(true)
                                }}
                              >
                                <LuPencil className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {l.canWriteReview ? (
                          <Badge className="rounded-full border-gray-200 bg-white text-gray-700" variant="outline">
                            작성 가능
                          </Badge>
                        ) : (
                          <Badge className="rounded-full border-gray-200 bg-white text-gray-700" variant="outline">
                            {approvedLectureIds.has(l.lectureId) ? '승인됨' : '작성완료'}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {formatDate(l.certifiedAt)}
                      </TableCell>
                      <TableCell className="hidden text-center sm:table-cell">
                        <div className="flex justify-center gap-1">
                          {l.canWriteReview ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setCreateLectureId(l.lectureId)
                                    setCreateLectureName(l.lectureName)
                                    setCreateOpen(true)
                                  }}
                                >
                                  <LuStar className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>후기 작성</TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setSelectedReviewId(l.reviewId ?? null)
                                    setSelectedLectureId(l.lectureId)
                                    setSelectedReviewReadOnly(Boolean(approvedLectureIds.has(l.lectureId)))
                                    setEditOpen(true)
                                  }}
                                >
                                  <LuPencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {approvedLectureIds.has(l.lectureId) ? '리뷰 조회' : '리뷰 수정'}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>

      {/* 리뷰 수정 모달 - ReviewForm 임베드 */}
      <Dialog open={editOpen} onOpenChange={open => setEditOpen(open)}>
        <DialogContent className="max-h-[70vh] max-w-lg overflow-y-auto">
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

      {/* 후기 작성 모달 - ReviewForm 재사용 */}
      <Dialog open={createOpen} onOpenChange={open => setCreateOpen(open)}>
        <DialogContent className="max-h-[70vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground text-2xl font-bold">후기 작성</DialogTitle>
          </DialogHeader>
          {createLectureId ? (
            <ReviewForm
              embedded
              isCreateMode
              lectureId={createLectureId}
              lectureName={createLectureName}
              onClose={() => setCreateOpen(false)}
              onSaveSuccess={async () => {
                // 목록 갱신
                try {
                  setLecturesLoading(true)
                  const { data } = await api.get<CompletedLecture[]>('/mypage/completed-lectures')
                  setLectures(Array.isArray(data) ? data : [])
                } finally {
                  setLecturesLoading(false)
                }
              }}
            />
          ) : (
            <p className="text-muted-foreground text-sm">강의 정보를 찾을 수 없습니다.</p>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
