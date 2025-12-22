'use client'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, Loader2, Star } from 'lucide-react'
import { toast } from 'sonner'

import Modal from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import { getLectureReviews } from '../../api/reviewApi.client'
import { CATEGORY_LABELS, type Review } from '../../api/reviewApi.types'
import { formatDate, Section, StarRating } from './DetailShared'

interface Props {
  lectureId: string
}

function ReviewCard({ review }: { review: Review }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="bg-card/40 border-0 p-5 shadow-sm backdrop-blur-xl transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
            {review.nickname.charAt(0)}
          </div>
          <div>
            <p className="text-foreground text-sm font-semibold">{review.nickname}</p>
            <p className="text-muted-foreground text-xs">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating score={review.score} showScore />
      </div>

      {/* Comment */}
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{review.comment}</p>

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-medium transition-colors"
      >
        {isExpanded ? (
          <>
            상세 점수 접기 <ChevronUp className="h-4 w-4" />
          </>
        ) : (
          <>
            상세 점수 보기 <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Detail Scores */}
      {isExpanded && (
        <div className="mt-4 space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {review.detailScores.map(detail => (
            <div key={detail.category} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">
                  {CATEGORY_LABELS[detail.category] || detail.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="min-w-8 text-right text-sm font-bold text-yellow-500">
                    {detail.score.toFixed(1)}
                  </span>
                </div>
              </div>
              {detail.comment && (
                <p className="rounded-md bg-gray-50 px-3 py-2 text-sm leading-relaxed text-gray-600">
                  {detail.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default function LectureReviews({ lectureId }: Props) {
  const [openVerify, setOpenVerify] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [verifyStep, setVerifyStep] = useState<'select' | 'processing'>('select')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['lectureReviews', lectureId],
    queryFn: () => getLectureReviews(lectureId),
    staleTime: 1000 * 60,
  })

  const actionButton = (
    <Button
      className="rounded-full border-gray-200 bg-gray-50 text-gray-700 shadow-sm hover:bg-gray-100"
      size="sm"
      onClick={() => {
        setError(null)
        setFile(null)
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        setVerifyStep('select')
        setOpenVerify(true)
      }}
    >
      후기 작성
    </Button>
  )

  const verifyModal = (
    <Modal isOpen={openVerify} onClose={() => setOpenVerify(false)} title="수료증 인증" maxWidthClass="max-w-lg">
      {verifyStep === 'select' ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">수료증 이미지를 업로드하여 인증해 주세요.</p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">강의 ID</label>
            <input
              type="text"
              readOnly
              value={lectureId}
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">수료증 이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const f = e.target.files?.[0] ?? null
                setFile(f)
                if (previewUrl) URL.revokeObjectURL(previewUrl)
                setPreviewUrl(f ? URL.createObjectURL(f) : null)
              }}
              className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800"
            />
            {file && <p className="text-xs text-gray-500">선택됨: {file.name}</p>}
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              className="rounded-full"
              onClick={() => setOpenVerify(false)}
              disabled={uploading}
            >
              취소
            </Button>
            <Button
              className="rounded-full"
              disabled={uploading}
              onClick={async () => {
                try {
                  if (!file) {
                    setError('이미지를 선택해 주세요.')
                    return
                  }
                  setError(null)
                  setVerifyStep('processing')
                  setUploading(true)
                  const fd = new FormData()
                  fd.append('lectureId', lectureId)
                  fd.append('image', file)
                  const { api } = await import('@/lib/axios')
                  await api.post('/certificates/verify', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                  })
                  toast.success('수료증 인증이 완료되었습니다.')
                  setOpenVerify(false)
                } catch (e) {
                  setError('업로드/인증에 실패했습니다. 다시 시도해 주세요.')
                  setVerifyStep('select')
                } finally {
                  setUploading(false)
                }
              }}
            >
              업로드
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="mb-2 text-sm font-semibold text-gray-800">수료증 등록</p>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">수료증의 정보를 읽어오는 중입니다.</h2>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              {previewUrl ? (
                <img src={previewUrl} alt="업로드한 수료증" className="mx-auto max-h-[60vh] w-auto rounded-md" />
              ) : (
                <div className="flex h-48 items-center justify-center text-sm text-gray-500">
                  이미지를 불러오는 중...
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>분석 중...</span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )

  if (isLoading) {
    return (
      <>
        <Section title="후기" action={actionButton}>
          <div className="text-muted-foreground py-8 text-center text-sm">후기를 불러오는 중...</div>
        </Section>
        {verifyModal}
      </>
    )
  }

  if (isError) {
    return (
      <>
        <Section title="후기" action={actionButton}>
          <div className="text-destructive py-8 text-center text-sm">후기를 불러오지 못했습니다.</div>
        </Section>
        {verifyModal}
      </>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <>
        <Section title="후기" action={actionButton}>
          <Card className="bg-card/40 flex h-40 flex-col items-center justify-center border-0 text-center shadow-sm backdrop-blur-xl">
            <div className="mb-2 text-3xl">💬</div>
            <p className="text-foreground text-sm font-medium">아직 작성된 후기가 없습니다.</p>
            <p className="text-muted-foreground mt-1 text-xs">첫 번째 후기를 남겨보세요!</p>
          </Card>
        </Section>
        {verifyModal}
      </>
    )
  }

  return (
    <>
      <Section title="후기" action={actionButton}>
        <div className="space-y-4">
          {reviews.map(review => (
            <ReviewCard key={review.reviewId} review={review} />
          ))}
        </div>
      </Section>
      {verifyModal}
    </>
  )
}
