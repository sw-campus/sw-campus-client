'use client'

import { useState } from 'react'

import { Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CATEGORY_LABELS, type ReviewCategory } from '@/features/lecture/api/review-api.types'
import { useReviewDetailQuery, useUpdateReviewMutation } from '@/features/lecture/hooks/use-review-query'

interface ReviewEditClientProps {
  reviewId: number
}

export function ReviewEditClient({ reviewId }: ReviewEditClientProps) {
  const router = useRouter()

  const { data, isLoading, error } = useReviewDetailQuery(reviewId)
  const { mutate: updateReview, isPending: isSaving } = useUpdateReviewMutation(reviewId)

  // 폼 수정 여부 추적
  const [formEdited, setFormEdited] = useState(false)
  const [editedScore, setEditedScore] = useState<number | null>(null)
  const [editedComment, setEditedComment] = useState<string | null>(null)
  const [editedDetailScores, setEditedDetailScores] = useState<
    Array<{ category: ReviewCategory; score: number; comment?: string }> | null
  >(null)

  // 현재 표시할 값 (수정된 값이 있으면 수정된 값, 없으면 서버 데이터)
  const score = editedScore ?? data?.score ?? 0
  const comment = editedComment ?? data?.comment ?? ''
  const detailScores =
    editedDetailScores ??
    data?.detailScores?.map(d => ({ category: d.category, score: d.score, comment: d.comment })) ??
    []

  const handleScoreChange = (value: number) => {
    setEditedScore(value)
    setFormEdited(true)
  }

  const handleCommentChange = (value: string) => {
    setEditedComment(value)
    setFormEdited(true)
  }

  const handleDetailScoreChange = (idx: number, field: 'score' | 'comment', value: number | string) => {
    const newScores = [...detailScores]
    if (field === 'score') {
      newScores[idx] = { ...newScores[idx], score: value as number }
    } else {
      newScores[idx] = { ...newScores[idx], comment: value as string }
    }
    setEditedDetailScores(newScores)
    setFormEdited(true)
  }

  const handleSave = () => {
    updateReview(
      { score, comment, detailScores },
      {
        onSuccess: () => {
          router.back()
        },
      },
    )
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
        {isLoading && <p className="text-muted-foreground text-sm">불러오는 중...</p>}
        {error && !isLoading && (
          <p className="text-destructive-foreground text-sm">리뷰 정보를 불러오지 못했습니다.</p>
        )}

        {!isLoading && !error && data && (
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
                  onChange={e => handleScoreChange(Number(e.target.value))}
                  className="w-20 rounded-md border border-gray-200 bg-white px-2 py-1 text-right text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">한줄 후기</label>
              <textarea
                value={comment}
                onChange={e => handleCommentChange(e.target.value)}
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
                          onChange={e => handleDetailScoreChange(idx, 'score', Number(e.target.value))}
                          className="w-16 rounded-md border border-gray-200 bg-white px-2 py-1 text-right text-sm"
                        />
                      </div>
                    </div>
                    <textarea
                      value={d.comment ?? ''}
                      onChange={e => handleDetailScoreChange(idx, 'comment', e.target.value)}
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
              <Button className="rounded-full" disabled={isSaving || !formEdited} onClick={handleSave}>
                {isSaving ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </main>
  )
}
