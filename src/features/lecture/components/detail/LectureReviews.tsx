'use client'

import { useMemo, useState } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, Star } from 'lucide-react'
import { FaUser } from 'react-icons/fa'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import { checkReviewEligibility, createReview, getLectureReviews } from '../../api/reviewApi.client'
import { CATEGORY_LABELS, type Review, type ReviewCategory } from '../../api/reviewApi.types'
import { CertificateVerifyModal } from './CertificateVerifyModal'
import { formatDate, Section, StarRating } from './DetailShared'
import { ReviewCompleteModal } from './ReviewCompleteModal'
import { ReviewWriteModal } from './ReviewWriteModal'

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
          <FaUser />
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
  const queryClient = useQueryClient()

  // 모달 상태
  const [openVerify, setOpenVerify] = useState(false)
  const [openWrite, setOpenWrite] = useState(false)
  const [openComplete, setOpenComplete] = useState(false)

  // 수료증 인증 상태
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [verifyStep, setVerifyStep] = useState<'select' | 'processing'>('select')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // 리뷰 작성 상태
  const categories: ReviewCategory[] = useMemo(() => ['TEACHER', 'CURRICULUM', 'MANAGEMENT', 'FACILITY', 'PROJECT'], [])
  const [detailScores, setDetailScores] = useState<Record<ReviewCategory, { score: number; comment: string }>>({
    TEACHER: { score: 0, comment: '' },
    PROJECT: { score: 0, comment: '' },
    CURRICULUM: { score: 0, comment: '' },
    FACILITY: { score: 0, comment: '' },
    MANAGEMENT: { score: 0, comment: '' },
  })
  const [overallComment, setOverallComment] = useState('')

  // 리뷰 목록 조회
  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['lectureReviews', lectureId],
    queryFn: () => getLectureReviews(lectureId),
    staleTime: 1000 * 60,
  })

  // 후기 작성 버튼 클릭
  const handleWriteClick = async () => {
    const eligibility = await checkReviewEligibility(lectureId)

    if (!eligibility.canWrite) {
      toast.error('이미 리뷰를 작성했습니다.')
      return
    }

    if (eligibility.hasCertificate) {
      setOpenWrite(true)
      return
    }

    // 수료증 인증 모달 열기
    setError(null)
    setFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setVerifyStep('select')
    setOpenVerify(true)
  }

  // 수료증 파일 변경
  const handleFileChange = (newFile: File | null, newPreviewUrl: string | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(newFile)
    setPreviewUrl(newPreviewUrl)
  }

  // 수료증 업로드
  const handleUpload = async () => {
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
        timeout: 60_000, // OCR 분석 시간 고려하여 60초로 설정
      })

      toast.success('수료증 인증이 완료되었습니다.')
      setOpenVerify(false)
      setOpenWrite(true)
    } catch {
      setError('업로드/인증에 실패했습니다. 다시 시도해 주세요.')
      setVerifyStep('select')
      setOpenVerify(false)
    } finally {
      setUploading(false)
    }
  }

  // 리뷰 제출
  const handleSubmit = async () => {
    try {
      for (const cat of categories) {
        const s = detailScores[cat].score
        const c = (detailScores[cat].comment || '').trim()
        const label = CATEGORY_LABELS[cat] ?? cat

        if (s < 1 || s > 5) {
          toast.error(`${label} 점수를 선택해 주세요.`)
          return
        }

        if (c.length < 20) {
          toast.error(`${label} 의견을 20자 이상 작성해 주세요.`)
          return
        }
      }

      const payload = {
        comment: overallComment.trim(),
        detail_scores: categories.map(cat => ({
          category: cat,
          score: detailScores[cat].score,
          comment: detailScores[cat].comment.trim(),
        })),
      }

      await createReview(lectureId, payload)
      toast.success('리뷰가 등록되었습니다.')
      queryClient.invalidateQueries({ queryKey: ['lectureReviews', lectureId] })
      setOpenWrite(false)
      setOpenComplete(true)
    } catch {
      toast.error('리뷰 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    }
  }

  const actionButton = (
    <Button
      className="rounded-full border-gray-200 bg-gray-50 text-gray-700 shadow-sm hover:bg-gray-100"
      size="sm"
      onClick={handleWriteClick}
    >
      후기 작성
    </Button>
  )

  // 렌더링
  const renderContent = () => {
    if (isLoading) {
      return <div className="text-muted-foreground py-8 text-center text-sm">후기를 불러오는 중...</div>
    }

    if (isError) {
      return <div className="text-destructive py-8 text-center text-sm">후기를 불러오지 못했습니다.</div>
    }

    if (!reviews || reviews.length === 0) {
      return (
        <Card className="bg-card/40 flex h-40 flex-col items-center justify-center border-0 text-center shadow-sm backdrop-blur-xl">
          <div className="mb-2 text-3xl">💬</div>
          <p className="text-foreground text-sm font-medium">아직 작성된 후기가 없습니다.</p>
          <p className="text-muted-foreground mt-1 text-xs">첫 번째 후기를 남겨보세요!</p>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {reviews.map(review => (
          <ReviewCard key={review.reviewId} review={review} />
        ))}
      </div>
    )
  }

  return (
    <>
      <Section title="후기" action={actionButton}>
        {renderContent()}
      </Section>

      {/* 모달들 */}
      <CertificateVerifyModal
        isOpen={openVerify}
        onClose={() => setOpenVerify(false)}
        lectureId={lectureId}
        verifyStep={verifyStep}
        file={file}
        previewUrl={previewUrl}
        error={error}
        uploading={uploading}
        onFileChange={handleFileChange}
        onUpload={handleUpload}
      />

      <ReviewWriteModal
        isOpen={openWrite}
        onClose={() => setOpenWrite(false)}
        categories={categories}
        detailScores={detailScores}
        overallComment={overallComment}
        onDetailScoreChange={(cat, score) => setDetailScores(prev => ({ ...prev, [cat]: { ...prev[cat], score } }))}
        onDetailCommentChange={(cat, comment) =>
          setDetailScores(prev => ({ ...prev, [cat]: { ...prev[cat], comment } }))
        }
        onOverallCommentChange={setOverallComment}
        onSubmit={handleSubmit}
      />

      <ReviewCompleteModal isOpen={openComplete} onClose={() => setOpenComplete(false)} />
    </>
  )
}
