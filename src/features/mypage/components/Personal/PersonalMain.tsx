'use client'

import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  type Review = {
    reviewId: number
    lectureId: number
    lectureName: string
    score: number
    content: string
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | string
    createdAt: string
    updatedAt: string
    canEdit: boolean
  }

  const [reviews, setReviews] = useState<Review[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Lectures for survey tab
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
  const [lecturesLoading, setLecturesLoading] = useState(false)
  const [lecturesError, setLecturesError] = useState<string | null>(null)
  const [openedLecture, setOpenedLecture] = useState<Lecture | null>(null)

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
        const { data } = await api.get<Lecture[]>('/mypage/lectures')
        if (!cancelled) setLectures(Array.isArray(data) ? data : [])
      } catch (e) {
        if (!cancelled) setLecturesError('강의 목록을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLecturesLoading(false)
      }
    }
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
      <main className="flex flex-1 flex-col gap-6 rounded-3xl bg-neutral-600/80 p-6 shadow-black/40">
        <header>
          <h3 className="text-2xl font-semibold text-white">비밀번호 확인</h3>
          <p className="mt-1 text-sm text-white/70">개인 정보 수정을 위해 비밀번호를 입력해주세요.</p>
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

  if (activeSection === 'survey') {
    return (
      <main className="flex flex-1 flex-col gap-6 rounded-3xl bg-neutral-600/80 p-6 shadow-black/40">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80">조직 전용 교육과정 공간</p>
            <h3 className="text-2xl font-semibold text-white">설문 조사</h3>
          </div>
          <Button onClick={onOpenProductModal}>설문조사</Button>
        </header>

        <section className="rounded-2xl bg-white/10 p-5 text-white/80">
          <div className="grid gap-4 sm:grid-cols-3">
            {dashboardStats.map(stat => (
              <article key={stat.label} className="rounded-xl bg-white/5 p-4">
                <p className="text-xs text-white/60 uppercase">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-sm text-white/60">{stat.note}</p>
              </article>
            ))}
          </div>
        </section>

      </main>
    )
  }

  // reviews
  return (
    <main className="flex flex-1 flex-col gap-6 rounded-3xl bg-neutral-600/80 p-6 shadow-black/40">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80">나의 활동</p>
          <h3 className="text-2xl font-semibold text-white">내 후기</h3>
        </div>
      </header>

      <section className="rounded-2xl bg-white/10 p-5 text-white/80">
        <header className="mb-3">
          <h4 className="text-lg font-semibold text-white">내 강의 목록</h4>
        </header>
        {lecturesLoading && <p className="text-white/70">불러오는 중...</p>}
        {lecturesError && !lecturesLoading && (
          <div className="flex items-center gap-3 text-red-300">
            <p>{lecturesError}</p>
            <Button size="sm" variant="secondary" onClick={() => {
              // simple retry
              (async () => {
                try {
                  setLecturesLoading(true)
                  setLecturesError(null)
                  const { data } = await api.get<Lecture[]>('/mypage/lectures')
                  setLectures(Array.isArray(data) ? data : [])
                } catch (e) {
                  setLecturesError('강의 목록을 불러오지 못했습니다.')
                } finally {
                  setLecturesLoading(false)
                }
              })()
            }}>다시 시도</Button>
          </div>
        )}
        {!lecturesLoading && !lecturesError && (lectures?.length ?? 0) === 0 && (
          <p className="text-white/70">등록된 강의가 없습니다.</p>
        )}
        {!lecturesLoading && !lecturesError && (lectures?.length ?? 0) > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lectures!.map(l => (
              <li
                key={l.lectureId}
                className="group cursor-pointer rounded-xl bg-white/5 p-4 transition hover:bg-white/10"
                onClick={() => setOpenedLecture(l)}
              >
                <div className="flex items-center justify-between gap-3">
                  <h5 className="truncate font-medium text-white">{l.lectureName}</h5>
                  <Badge
                    variant={
                      l.lectureAuthStatus === 'APPROVED'
                        ? 'default'
                        : l.lectureAuthStatus === 'PENDING'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {l.lectureAuthStatus === 'APPROVED'
                      ? '승인'
                      : l.lectureAuthStatus === 'PENDING'
                        ? '승인 대기'
                        : '반려'}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-white/60">상태: {l.status}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog open={!!openedLecture} onOpenChange={open => !open && setOpenedLecture(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{openedLecture?.lectureName}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            <p>강의 ID: {openedLecture?.lectureId}</p>
            <p className="mt-1">상태: {openedLecture?.status}</p>
            <p className="mt-1">등록일: {openedLecture ? new Date(openedLecture.createdAt).toLocaleString() : ''}</p>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
