'use client'

import { useEffect, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/axios'

type ReviewFormProps = {
  embedded?: boolean
  reviewId?: number
}

const reviewSchema = z.object({
  comment: z.string().max(500, '총평은 최대 500자입니다').optional().or(z.literal('')),
})

type ReviewResponse = {
  reviewId: number
  comment: string | null
}

export function ReviewForm({ embedded = false, reviewId }: ReviewFormProps) {
  const [loading, setLoading] = useState<boolean>(!!reviewId)
  const [comment, setComment] = useState<string>('')

  useEffect(() => {
    if (!reviewId) return
    let mounted = true

    const load = async () => {
      setLoading(true)
      try {
        const res = await api.get<ReviewResponse>(`/reviews/${reviewId}`)
        if (!mounted) return
        setComment(res.data?.comment ?? '')
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
  }, [reviewId])

  const saveMutation = useMutation({
    mutationFn: async () => {
      const parsed = reviewSchema.safeParse({ comment })
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? '입력값을 확인해주세요')
      }

      const payload = { comment: parsed.data.comment ?? '' }

      if (reviewId) {
        await api.put(`/reviews/${reviewId}`, payload)
        return
      }

      // 생성은 보통 lectureId/detailScores 등이 필요할 수 있어, 현재 스펙 미확정이면 실패 처리
      await api.post(`/reviews`, payload)
    },
  })

  const onSave = async () => {
    try {
      await saveMutation.mutateAsync()
      toast.success(reviewId ? '리뷰가 수정되었습니다.' : '리뷰가 저장되었습니다.')
    } catch (e) {
      const message = e instanceof Error ? e.message : '리뷰 저장에 실패했습니다.'
      toast.error(message)
    }
  }

  const content = (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-800">총평</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 focus:outline-none"
          placeholder="후기를 입력하세요"
          disabled={loading || saveMutation.isPending}
        />
      </div>

      <Button
        type="button"
        onClick={onSave}
        disabled={loading || saveMutation.isPending}
        className="h-11 w-full rounded-md bg-gray-900 px-6 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
      >
        {loading ? '불러오는 중...' : saveMutation.isPending ? '저장 중...' : '저장'}
      </Button>

      {!reviewId && (
        <p className="text-xs text-gray-500">
          참고: 생성 API가 `lectureId`/`detailScores`를 필수로 요구하는 경우, 이 폼은 추후 스펙에 맞춰 확장해야 합니다.
        </p>
      )}
    </div>
  )

  if (embedded) return <div className="w-full">{content}</div>
  return <div className="mx-auto w-full max-w-2xl">{content}</div>
}
