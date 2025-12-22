'use client'

import { useEffect, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/axios'

type ReviewFormProps = {
  embedded?: boolean
  reviewId?: number
  lectureId?: number
  readOnly?: boolean
  onClose?: () => void
}

const reviewSchema = z.object({
  comment: z.string().max(500, '총평은 최대 500자입니다').optional().or(z.literal('')),
})

const allowedCategories = ['TEACHER', 'CURRICULUM', 'MANAGEMENT', 'FACILITY', 'PROJECT'] as const
type AllowedCategory = (typeof allowedCategories)[number]

const detailScoreSchema = z.object({
  category: z
    .string()
    .transform(v => v.trim().toUpperCase())
    .refine((v): v is AllowedCategory => (allowedCategories as readonly string[]).includes(v), {
      message: '카테고리 값이 올바르지 않습니다.',
    }),
  score: z.number().min(1, '점수는 1.0 이상이어야 합니다').max(5, '점수는 5.0 이하여야 합니다'),
  comment: z.string().trim().min(20, '세부 의견은 20자 이상이어야 합니다').max(500, '세부 의견은 최대 500자입니다'),
})

const updateReviewSchema = z.object({
  comment: reviewSchema.shape.comment,
  detailScores: z.array(detailScoreSchema).length(5, '상세 점수는 5개 카테고리 모두 필요합니다'),
})

type ReviewResponse = {
  reviewId: number
  comment: string | null
  detailScores?: Array<{ category: string; score: number; comment?: string | null }> | null
  status?: string | null
  reviewStatus?: string | null
  approvalStatus?: string | null
}

type CompletedLectureReviewResponse = {
  reviewId: number
  lectureId: number
  memberId?: number
  nickname?: string
  comment: string | null
  score?: number
  detailScores?: Array<{ category: string; score: number; comment?: string | null }> | null
  approvalStatus?: string | null
}

export function ReviewForm({ embedded = false, reviewId, lectureId, readOnly = false, onClose }: ReviewFormProps) {
  const [loading, setLoading] = useState<boolean>(!!reviewId || !!lectureId)
  const [resolvedReviewId, setResolvedReviewId] = useState<number | null>(reviewId ?? null)
  const [comment, setComment] = useState<string>('')
  const [detailScores, setDetailScores] = useState<Array<{ category: string; score: number; comment?: string }>>([])
  const [serverApproved, setServerApproved] = useState(false)

  const effectiveReadOnly = readOnly || serverApproved

  useEffect(() => {
    if (!reviewId && !lectureId) return
    let mounted = true

    const load = async () => {
      setLoading(true)
      try {
        // 스웨거(첨부 이미지) 기준: lectureId 기반으로 상세 조회
        // - 개인 마이페이지에서 "리뷰 수정" 클릭 시 lectureId가 항상 있으므로 이 경로를 우선 사용
        if (lectureId) {
          // 스웨거(첨부 이미지): GET /api/v1/mypage/completed-lectures/{lectureId}/review
          const res = await api.get<CompletedLectureReviewResponse>(`/mypage/completed-lectures/${lectureId}/review`)
          if (!mounted) return
          setResolvedReviewId(res.data?.reviewId ?? null)
          setComment(res.data?.comment ?? '')
          setServerApproved(String(res.data?.approvalStatus ?? '').toUpperCase() === 'APPROVED')

          const details = Array.isArray(res.data?.detailScores) ? res.data.detailScores : []
          setDetailScores(
            details.map(d => ({
              category: String(d.category),
              score: typeof d.score === 'number' ? d.score : Number(d.score) || 0,
              comment: d.comment ?? '',
            })),
          )
          return
        }

        if (reviewId) {
          const res = await api.get<ReviewResponse>(`/reviews/${reviewId}`)
          if (!mounted) return
          setResolvedReviewId(res.data?.reviewId ?? reviewId)
          setComment(res.data?.comment ?? '')
          setServerApproved(String(res.data?.approvalStatus ?? '').toUpperCase() === 'APPROVED')

          const details = Array.isArray(res.data?.detailScores) ? res.data.detailScores : []
          setDetailScores(
            details.map(d => ({
              category: String(d.category),
              score: typeof d.score === 'number' ? d.score : Number(d.score) || 0,
              comment: d.comment ?? '',
            })),
          )
        }
      } catch {
        // 조회 실패 시에도 수정 UI는 열리게 둠
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [reviewId, lectureId])

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (effectiveReadOnly) return

      const parsed = updateReviewSchema.safeParse({
        comment,
        detailScores: detailScores.map(d => ({
          category: d.category,
          score: d.score,
          comment: d.comment ?? '',
        })),
      })

      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? '입력값을 확인해주세요')
      }

      const payload = {
        comment: parsed.data.comment ?? '',
        detailScores: parsed.data.detailScores.map(d => ({
          category: d.category,
          score: d.score,
          comment: d.comment,
        })),
      }

      const targetReviewId = resolvedReviewId ?? reviewId ?? null

      // lectureId가 있으면 마이페이지 수정 엔드포인트로 업데이트, 없으면 기존 리뷰 엔드포인트 사용
      if (lectureId) {
        await api.put(`/mypage/completed-lectures/${lectureId}/review`, payload)
        return
      }

      if (targetReviewId) {
        await api.put(`/reviews/${targetReviewId}`, payload)
        return
      }

      // 생성은 이 폼에서 사용하지 않음(생성은 상위에서 lectureId/detailScores 포함해 처리)
      throw new Error('리뷰 ID를 찾을 수 없습니다.')
    },
  })

  const onSave = async () => {
    if (effectiveReadOnly) return
    try {
      await saveMutation.mutateAsync()
      toast.success((resolvedReviewId ?? reviewId) ? '리뷰가 수정되었습니다.' : '리뷰가 저장되었습니다.')
      // 저장 성공 시 모달 닫기
      onClose?.()
    } catch (e) {
      const message = e instanceof Error ? e.message : '리뷰 저장에 실패했습니다.'
      toast.error(message)
    }
  }

  const content = (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* 총평: 버블 스타일 */}
      <div className="space-y-1.5">
        <label className="mb-1 block text-sm font-semibold text-gray-900">총평</label>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-2">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={2}
            className="w-full resize-y rounded-md border border-transparent bg-transparent px-1 py-1 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 focus:outline-none"
            placeholder="후기를 입력하세요"
            disabled={effectiveReadOnly || loading || saveMutation.isPending}
          />
        </div>
      </div>

      {/* 카테고리 카드 */}
      {detailScores.length > 0 && (
        <div className="space-y-2.5">
          {detailScores.map((d, idx) => (
            <div key={`${d.category}-${idx}`} className="rounded-xl border border-gray-100 bg-white p-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">{d.category}</span>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" aria-hidden="true" />
                  <input
                    type="number"
                    min={1}
                    max={5}
                    step={0.5}
                    value={d.score}
                    onChange={e => {
                      const v = Number(e.target.value)
                      setDetailScores(prev => prev.map((x, i) => (i === idx ? { ...x, score: v } : x)))
                    }}
                    aria-label={`${d.category} 점수 입력`}
                    className="w-14 rounded-md border border-gray-200 bg-white px-2 py-1 text-right text-sm focus:border-amber-300 focus:ring-amber-200 disabled:bg-gray-100"
                    disabled={effectiveReadOnly || loading || saveMutation.isPending}
                  />
                </div>
              </div>
              <div className="mt-1.5 rounded-xl border border-gray-100 bg-gray-50 p-2">
                <textarea
                  value={d.comment ?? ''}
                  onChange={e =>
                    setDetailScores(prev => prev.map((x, i) => (i === idx ? { ...x, comment: e.target.value } : x)))
                  }
                  rows={2}
                  className="w-full resize-y rounded-md border border-transparent bg-transparent px-1 py-1 text-sm text-gray-800 placeholder:text-gray-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                  placeholder="세부 의견을 입력하세요"
                  disabled={effectiveReadOnly || loading || saveMutation.isPending}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        onClick={() => {
          if (effectiveReadOnly) {
            onClose?.()
            return
          }
          void onSave()
        }}
        disabled={loading || (!effectiveReadOnly && saveMutation.isPending)}
        className="h-11 w-full rounded-md bg-gray-900 px-6 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
      >
        {loading ? '불러오는 중...' : effectiveReadOnly ? '닫기' : saveMutation.isPending ? '저장 중...' : '저장'}
      </Button>

      {!reviewId && <p className="text-xs text-gray-500"></p>}
    </div>
  )

  if (embedded) return <div className="w-full">{content}</div>
  return <div className="mx-auto w-full max-w-2xl">{content}</div>
}
