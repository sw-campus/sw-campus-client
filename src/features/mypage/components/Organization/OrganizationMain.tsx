'use client'

import { useEffect, useState } from 'react'

import { isAxiosError } from 'axios'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ReviewListModal from '@/features/mypage/components/Organization/ReviewListModal'
import { api } from '@/lib/axios'

type OrganizationMainProps = {
  isOrgPasswordOpen: boolean
  openInfoModal: () => void
  onOpenProductModal: () => void
}

export default function OrganizationMain({
  isOrgPasswordOpen,
  openInfoModal,
  onOpenProductModal,
}: OrganizationMainProps) {
  type Lecture = {
    lectureId: number
    lectureName: string
    lectureImageUrl?: string
    lectureAuthStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | string
    status: string
    createdAt: string
    updatedAt: string
    canEdit: boolean
  }

  const [lectures, setLectures] = useState<Lecture[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewLectureId, setReviewLectureId] = useState<number | null>(null)
  const [reviewLectureName, setReviewLectureName] = useState<string | undefined>(undefined)

  // 비밀번호 검증
  const [passwordInput, setPasswordInput] = useState<string>('')
  const [passwordVerifying, setPasswordVerifying] = useState(false)
  const [passwordVerifyError, setPasswordVerifyError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOrgPasswordOpen) return
    setPasswordInput('')
    setPasswordVerifyError(null)
    setPasswordVerifying(false)
  }, [isOrgPasswordOpen])

  const totalCount = lectures?.length ?? 0
  const approvedCount = lectures?.filter(l => l.lectureAuthStatus === 'APPROVED').length ?? 0
  const rejectedCount = lectures?.filter(l => l.lectureAuthStatus === 'REJECTED').length ?? 0

  useEffect(() => {
    let cancelled = false
    const fetchLectures = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data } = await api.get<Lecture[]>('/mypage/lectures')
        if (!cancelled) setLectures(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setError('강의 목록을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchLectures()
    return () => {
      cancelled = true
    }
  }, [])

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

      const { data } = await api.post<unknown>('/mypage/verify-password', { password })

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

  if (isOrgPasswordOpen) {
    return (
      <main className="flex flex-1 flex-col gap-6 rounded-3xl bg-white/60 p-6 shadow-black/40">
        {/* Header Card */}
        <header className="rounded-2xl bg-white/70 px-5 py-4 ring-1 ring-white/30 backdrop-blur-xl">
          <h3 className="text-2xl font-semibold text-gray-900">비밀번호 확인</h3>
          <p className="mt-1 text-sm text-gray-600">기업 정보 수정을 위해 비밀번호를 입력해주세요.</p>
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

  return (
    <main className="flex flex-1 flex-col gap-6 rounded-3xl bg-white/60 p-6 shadow-black/40">
      {/* Header Card */}
      <header className="rounded-2xl bg-white/70 px-5 py-4 ring-1 ring-white/30 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">조직 전용 교육과정 공간</p>
            <h3 className="text-2xl font-semibold text-gray-900">교육과정 관리</h3>
          </div>
          <Button
            className="rounded-full border-gray-200 bg-gray-50 text-gray-700 shadow-sm hover:bg-gray-100"
            onClick={onOpenProductModal}
          >
            교육과정 등록
          </Button>
        </div>
      </header>
      {/* Stats cards */}
      <section className="rounded-2xl bg-white/70 p-5 text-gray-700 ring-1 ring-white/30 backdrop-blur-xl">
        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm ring-1 ring-black/5">
            <p className="text-xs text-gray-500 uppercase">총 강의</p>
            <p className="text-2xl font-semibold text-gray-900">{totalCount}</p>
          </article>
          <article className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm ring-1 ring-black/5">
            <p className="text-xs text-gray-500 uppercase">승인됨</p>
            <p className="text-2xl font-semibold text-gray-900">{approvedCount}</p>
          </article>
          <article className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm ring-1 ring-black/5">
            <p className="text-xs text-gray-500 uppercase">반려됨</p>
            <p className="text-2xl font-semibold text-gray-900">{rejectedCount}</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl bg-white/70 p-5 text-gray-700 ring-1 ring-white/30 backdrop-blur-xl">
        <header className="mb-3">
          <h4 className="text-lg font-semibold text-gray-900">내 강의 목록</h4>
        </header>
        {loading && <p className="text-gray-600">불러오는 중...</p>}
        {error && !loading && (
          <div className="flex items-center gap-3 text-red-600">
            <p>{error}</p>
            <Button
              size="sm"
              variant="secondary"
              onClick={async () => {
                try {
                  setLoading(true)
                  setError(null)
                  const { data } = await api.get<Lecture[]>('/mypage/lectures')
                  setLectures(Array.isArray(data) ? data : [])
                } catch {
                  setError('강의 목록을 불러오지 못했습니다.')
                } finally {
                  setLoading(false)
                }
              }}
            >
              다시 시도
            </Button>
          </div>
        )}

        {!loading && !error && (lectures?.length ?? 0) === 0 && (
          <p className="text-gray-600">등록된 강의가 없습니다.</p>
        )}

        {!loading && !error && (lectures?.length ?? 0) > 0 && (
          <ul className="space-y-3">
            {lectures!.map(l => {
              const statusMap: Record<
                string,
                { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
              > = {
                APPROVED: { label: '승인 완료', variant: 'default' },
                PENDING: { label: '승인 대기', variant: 'secondary' },
                REJECTED: { label: '반려', variant: 'destructive' },
              }
              const status = statusMap[l.lectureAuthStatus] ?? {
                label: l.lectureAuthStatus,
                variant: 'outline' as const,
              }
              return (
                <li
                  key={l.lectureId}
                  className="rounded-2xl border border-white/10 bg-white/90 p-4 text-neutral-900 shadow-sm ring-1 ring-black/5 sm:p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-white">
                        {l.lectureImageUrl ? (
                          <Image src={l.lectureImageUrl} alt={l.lectureName} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-50 text-sm font-semibold text-gray-600">
                            {l.lectureName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">코스</p>
                        <p className="text-base font-semibold text-gray-900">{l.lectureName}</p>
                        <p className="mt-0.5 text-xs text-gray-500">상태: {l.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="rounded-full border-gray-200 bg-white text-gray-700" variant="outline">
                        {status.label}
                      </Badge>
                      {(() => {
                        const isRejected = l.lectureAuthStatus === 'REJECTED'
                        const isApproved = l.lectureAuthStatus === 'APPROVED'
                        const canEdit = isRejected && l.canEdit
                        const label = isRejected ? '강의 수정' : '리뷰 관리'
                        const enabled = (isApproved && true) || canEdit
                        return (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-gray-200 bg-gray-50 text-gray-700 shadow-sm hover:bg-gray-100 disabled:opacity-50"
                            disabled={!enabled}
                            onClick={() => {
                              if (!enabled) return
                              if (isApproved) {
                                setReviewLectureId(l.lectureId)
                                setReviewLectureName(l.lectureName)
                                setReviewModalOpen(true)
                                return
                              }
                            }}
                          >
                            {label}
                          </Button>
                        )
                      })()}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
      <ReviewListModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        lectureId={reviewLectureId}
        lectureName={reviewLectureName}
      />
    </main>
  )
}
