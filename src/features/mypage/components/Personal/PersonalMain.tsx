'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

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
  }

  const [lectures, setLectures] = useState<CompletedLecture[] | null>(null)
  const [lecturesLoading, setLecturesLoading] = useState(false)
  const [lecturesError, setLecturesError] = useState<string | null>(null)
  const [openedLecture, setOpenedLecture] = useState<CompletedLecture | null>(null)

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

      {/* List Card */}
      <section className="rounded-2xl bg-white/70 p-5 text-gray-700 ring-1 ring-white/30 backdrop-blur-xl">
        <header className="mb-3">
          <h4 className="text-lg font-semibold text-gray-900">내 강의 목록</h4>
        </header>
        {lecturesLoading && <p className="text-gray-600">불러오는 중...</p>}
        {lecturesError && !lecturesLoading && (
          <div className="flex items-center gap-3 text-red-600">
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
          <p className="text-gray-600">등록된 강의가 없습니다.</p>
        )}
        {!lecturesLoading && !lecturesError && (lectures?.length ?? 0) > 0 && (
          <ul className="space-y-3">
            {lectures!.map(l => (
              <li
                key={l.certificateId}
                className="cursor-pointer rounded-2xl border border-white/10 bg-white/90 p-4 text-neutral-900 shadow-sm ring-1 ring-black/5 transition hover:ring-black/10 sm:p-5"
                onClick={() => setOpenedLecture(l)}
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
                      <p className="mt-0.5 text-xs text-gray-500">기관: {l.organizationName}</p>
                    </div>
                  </div>
                  <Badge className="rounded-full border-gray-200 bg-white text-gray-700" variant="outline">
                    {l.canWriteReview ? '후기 작성 가능' : '작성 완료'}
                  </Badge>
                </div>
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
          <div className="text-muted-foreground text-sm">
            <p>강의 ID: {openedLecture?.lectureId}</p>
            <p className="mt-1">교육기관: {openedLecture?.organizationName}</p>
            <p className="mt-1">수료일: {openedLecture ? formatDate(openedLecture.certifiedAt) : ''}</p>
            <p className="mt-1">후기 작성: {openedLecture?.canWriteReview ? '가능' : '완료됨'}</p>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
