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
  lectureName?: string // 생성 모드에서 강의명 표시용
  isCreateMode?: boolean // true면 새 리뷰 생성, false면 기존 리뷰 수정
  readOnly?: boolean
  onClose?: () => void
  onSaveSuccess?: () => void // 저장 성공 시 콜백 (목록 갱신 등)
}

const reviewSchema = z.object({
  comment: z.string().max(500, '총평은 최대 500자입니다').optional().or(z.literal('')),
})

const allowedCategories = ['TEACHER', 'CURRICULUM', 'MANAGEMENT', 'FACILITY', 'PROJECT'] as const
type AllowedCategory = (typeof allowedCategories)[number]

const CATEGORY_LABELS: Record<AllowedCategory, string> = {
  TEACHER: '강사',
  CURRICULUM: '커리큘럼',
  MANAGEMENT: '운영',
  FACILITY: '시설',
  PROJECT: '프로젝트',
}

const detailScoreSchema = z.object({
  category: z
    .string()
    .transform(v => v.trim().toUpperCase())
    .refine((v): v is AllowedCategory => (allowedCategories as readonly string[]).includes(v), {
      message: '카테고리 값이 올바르지 않습니다.',
    }),
  score: z.number().int().min(1, '점수는 1점 이상이어야 합니다').max(5, '점수는 5점 이하여야 합니다'),
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

// 생성 모드용 빈 상세 점수 초기화
const createEmptyDetailScores = () => allowedCategories.map(category => ({ category, score: 0, comment: '' }))

export function ReviewForm({
  embedded = false,
  reviewId,
  lectureId,
  lectureName,
  isCreateMode = false,
  readOnly = false,
  onClose,
  onSaveSuccess,
}: ReviewFormProps) {
  // 생성 모드면 로딩 불필요, 수정 모드면 기존 데이터 로드
  const [loading, setLoading] = useState<boolean>(!isCreateMode && (!!reviewId || !!lectureId))
  const [resolvedReviewId, setResolvedReviewId] = useState<number | null>(reviewId ?? null)
  const [comment, setComment] = useState<string>('')
  const [detailScores, setDetailScores] = useState<Array<{ category: string; score: number; comment?: string }>>(
    isCreateMode ? createEmptyDetailScores() : [],
  )
  const [serverApproved, setServerApproved] = useState(false)

  const effectiveReadOnly = readOnly || serverApproved

  useEffect(() => {
    // 생성 모드면 기존 데이터 로드 불필요
    if (isCreateMode) return
    if (!reviewId && !lectureId) return
    let mounted = true

    const load = async () => {
      setLoading(true)
      try {
        if (lectureId) {
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
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [reviewId, lectureId, isCreateMode])

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
        const issues = parsed.error.issues
        const detailedMessage = issues
          .map(issue => {
            const path = issue.path && issue.path.length > 0 ? issue.path.join('.') : ''
            return path ? `${path}: ${issue.message}` : issue.message
          })
          .join('\n')
        throw new Error(detailedMessage || '입력값을 확인해주세요')
      }

      const payload = {
        comment: parsed.data.comment ?? '',
        detailScores: parsed.data.detailScores.map(d => ({
          category: d.category,
          score: d.score,
          comment: d.comment,
        })),
      }

      // 생성 모드면 POST, 수정 모드면 PUT
      if (isCreateMode && lectureId) {
        await api.post('/reviews', {
          lectureId,
          ...payload,
        })
        return
      }

      const targetReviewId = resolvedReviewId ?? reviewId ?? null
      if (targetReviewId) {
        await api.put(`/reviews/${targetReviewId}`, payload)
        return
      }

      throw new Error('리뷰 ID를 찾을 수 없습니다.')
    },
  })

  const onSave = async () => {
    if (effectiveReadOnly) return
    try {
      await saveMutation.mutateAsync()
      toast.success(isCreateMode ? '리뷰가 등록되었습니다.' : '리뷰가 수정되었습니다.')
      onSaveSuccess?.()
      onClose?.()
    } catch (e) {
      const message = e instanceof Error ? e.message : '리뷰 저장에 실패했습니다.'
      toast.error(message)
    }
  }

  const content = (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* 생성 모드일 때 강의명 표시 */}
      {isCreateMode && lectureName && (
        <div className="mb-2">
          <p className="text-muted-foreground text-xs">강의</p>
          <p className="text-foreground text-sm font-semibold">{lectureName}</p>
        </div>
      )}

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
                <span className="text-sm font-semibold text-gray-900">
                  {CATEGORY_LABELS[d.category as AllowedCategory] || d.category}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => {
                    const selected = d.score >= i + 1
                    return (
                      <button
                        key={i}
                        type="button"
                        aria-label={`${d.category} ${i + 1}점 선택`}
                        onClick={() => {
                          if (effectiveReadOnly || loading || saveMutation.isPending) return
                          const v = i + 1
                          setDetailScores(prev => prev.map((x, j) => (j === idx ? { ...x, score: v } : x)))
                        }}
                        className="p-0.5 text-yellow-500 disabled:opacity-50"
                        disabled={effectiveReadOnly || loading || saveMutation.isPending}
                      >
                        <Star className={`h-4 w-4 ${selected ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      </button>
                    )
                  })}
                  <span className="ml-2 min-w-6 text-right text-sm font-bold text-yellow-600">{d.score || 0}</span>
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
