'use client'

import { useEffect, useMemo, useState } from 'react'

import { Star } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CATEGORY_LABELS, type ReviewCategory } from '@/features/lecture/api/reviewApi.types'
import { api } from '@/lib/axios'

type ReviewDetail = {
  reviewId: number
  lectureId: number
  nickname?: string
  comment: string
  score: number
  detailScores?: Array<{
    category: ReviewCategory
    score: number
    comment?: string
  }>
}

export default function ReviewEditPage() {
  const params = useParams<{ reviewId: string }>()
  const router = useRouter()
  const reviewId = useMemo(() => Number(params?.reviewId), [params])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [data, setData] = useState<ReviewDetail | null>(null)
  const [score, setScore] = useState<number>(0)
  const [comment, setComment] = useState<string>('')
  const [detailScores, setDetailScores] = useState<
    Array<{ category: ReviewCategory; score: number; comment?: string }>
  >([])

  useEffect(() => {
    if (!reviewId || Number.isNaN(reviewId)) return
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const { data } = await api.get<ReviewDetail>(`/reviews/${reviewId}`)
        if (cancelled) return
        setData(data)
        setScore(data.score ?? 0)
        setComment(data.comment ?? '')
        setDetailScores(
          (data.detailScores ?? []).map(d => ({ category: d.category, score: d.score, comment: d.comment })),
        )
      } catch {
        if (!cancelled) setError('리뷰 정보를 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [reviewId])

  const handleSave = async () => {
    if (!data) return
    try {
      setSaving(true)
      const payload = { score, comment, detailScores }
      try {
        await api.put(`/reviews/${data.reviewId}`, payload)
      } catch {
        await api.patch(`/reviews/${data.reviewId}`, payload)
      }
      router.back()
    } catch {
      setError('리뷰 저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <header className="mb-4">
        <h1 className="text-foreground text-2xl font-bold">리뷰 수정</h1>
        {data && (
          <p className="text-muted-foreground mt-1 text-sm">
            리뷰 ID {data.reviewId} · 강의 ID {data.lectureId}
          </p>
        )}
      </header>

      <Card className="bg-card/40 border-0 p-5 shadow-sm backdrop-blur-xl">
        {loading && <p className="text-muted-foreground text-sm">불러오는 중...</p>}
        {error && !loading && <p className="text-destructive-foreground text-sm">{error}</p>}

        {!loading && !error && data && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground text-sm font-semibold">{data.nickname ?? '나'}</p>
                <p className="text-muted-foreground text-xs">강의 ID: {data.lectureId}</p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.5}
                  value={score}
                  onChange={e => setScore(Number(e.target.value))}
                  className="w-20 rounded-md border border-gray-200 bg-white px-2 py-1 text-right text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">한줄 후기</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
                className="text-foreground w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400"
                placeholder="후기를 입력하세요"
              />
            </div>

            {detailScores.length > 0 && (
              <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                {detailScores.map((d, idx) => (
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
                            setDetailScores(prev => prev.map((x, i) => (i === idx ? { ...x, score: v } : x)))
                          }}
                          className="w-16 rounded-md border border-gray-200 bg-white px-2 py-1 text-right text-sm"
                        />
                      </div>
                    </div>
                    <textarea
                      value={d.comment ?? ''}
                      onChange={e =>
                        setDetailScores(prev => prev.map((x, i) => (i === idx ? { ...x, comment: e.target.value } : x)))
                      }
                      rows={2}
                      className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                      placeholder="세부 의견을 입력하세요"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="secondary" className="rounded-full" onClick={() => router.back()}>
                취소
              </Button>
              <Button className="rounded-full" disabled={saving} onClick={handleSave}>
                저장
              </Button>
            </div>
          </div>
        )}
      </Card>
    </main>
  )
}
