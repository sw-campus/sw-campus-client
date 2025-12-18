'use client'

import { useEffect, useState } from 'react'

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
      } catch (e) {
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
  if (isOrgPasswordOpen) {
    return (
      <main className="flex flex-1 flex-col gap-6 rounded-3xl bg-neutral-600/80 p-6 shadow-black/40">
        <header>
          <h3 className="text-2xl font-semibold text-white">비밀번호 확인</h3>
          <p className="mt-1 text-sm text-white/70">기업 정보 수정을 위해 비밀번호를 입력해주세요.</p>
        </header>

        <div className="max-w-sm">
          <input
            type="password"
            placeholder="비밀번호 입력"
            className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none"
          />
          <Button className="mt-4 w-full" onClick={openInfoModal}>
            확인
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-6 rounded-3xl bg-neutral-600/80 p-6 shadow-black/40">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80">조직 전용 교육과정 공간</p>
          <h3 className="text-2xl font-semibold text-white">교육과정 관리</h3>
        </div>
        <Button onClick={onOpenProductModal}>교육과정 등록</Button>
      </header>
      {/* Stats cards */}
      <section className="rounded-2xl bg-white/10 p-5 text-white/80">
        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-xl bg-white/5 p-4">
            <p className="text-xs text-white/60 uppercase">총 강의</p>
            <p className="text-2xl font-semibold">{totalCount}</p>
          </article>
          <article className="rounded-xl bg-white/5 p-4">
            <p className="text-xs text-white/60 uppercase">승인됨</p>
            <p className="text-2xl font-semibold">{approvedCount}</p>
          </article>
          <article className="rounded-xl bg-white/5 p-4">
            <p className="text-xs text-white/60 uppercase">반려됨</p>
            <p className="text-2xl font-semibold">{rejectedCount}</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl bg-white/10 p-5 text-white/80">
        <header className="mb-3">
          <h4 className="text-lg font-semibold text-white">내 강의 목록</h4>
        </header>
        {loading && <p className="text-white/70">불러오는 중...</p>}
        {error && !loading && (
          <div className="flex items-center gap-3 text-red-300">
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
                } catch (e) {
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
          <p className="text-white/70">등록된 강의가 없습니다.</p>
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
                <li key={l.lectureId} className="rounded-xl bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-white/60">코스</p>
                      <p className="text-base font-semibold text-white">{l.lectureName}</p>
                      <p className="mt-1 text-xs text-white/60">상태: {l.status}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
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
