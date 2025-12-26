'use client'

import { useMemo, useState } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, Loader2, Star } from 'lucide-react'
import Image from 'next/image'
import { FaUser } from 'react-icons/fa'
import { toast } from 'sonner'

import Modal from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import { checkReviewEligibility, createReview, getLectureReviews } from '../../api/reviewApi.client'
import { CATEGORY_LABELS, type Review, type ReviewCategory } from '../../api/reviewApi.types'
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
          {/* <Image
            src={'/images/common/default_user.jpeg'}
            alt={`${review.nickname} 프로필 이미지`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            priority={false}
          /> */}
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
  const [openVerify, setOpenVerify] = useState(false)
  const [openWrite, setOpenWrite] = useState(false)
  const [openComplete, setOpenComplete] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [verifyStep, setVerifyStep] = useState<'select' | 'processing'>('select')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const categories: ReviewCategory[] = useMemo(() => ['TEACHER', 'CURRICULUM', 'MANAGEMENT', 'FACILITY', 'PROJECT'], [])
  const [detailScores, setDetailScores] = useState<Record<ReviewCategory, { score: number; comment: string }>>({
    TEACHER: { score: 0, comment: '' },
    PROJECT: { score: 0, comment: '' },
    CURRICULUM: { score: 0, comment: '' },
    FACILITY: { score: 0, comment: '' },
    MANAGEMENT: { score: 0, comment: '' },
  })
  const [overallComment, setOverallComment] = useState('')

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
      onClick={async () => {
        // eligibility API로 리뷰 작성 가능 여부 확인
        const eligibility = await checkReviewEligibility(lectureId)

        // 이미 리뷰를 작성한 경우
        if (!eligibility.canWrite) {
          toast.error('이미 리뷰를 작성했습니다.')
          return
        }

        // 수료증이 이미 인증된 경우 바로 리뷰 작성 모달 열기
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
                  // 인증 성공 시: 인증 모달 닫고 리뷰 작성 모달 오픈
                  setOpenVerify(false)
                  setOpenWrite(true)
                } catch {
                  setError('업로드/인증에 실패했습니다. 다시 시도해 주세요.')
                  setVerifyStep('select')
                  // 인증 실패 시: 모달 닫기
                  setOpenVerify(false)
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

            {/* 스캔 애니메이션 컨테이너 */}
            <div className="relative overflow-hidden rounded-xl border-2 border-blue-400 bg-gray-900 p-3">
              {/* 코너 프레임 */}
              <div className="pointer-events-none absolute top-2 left-2 h-6 w-6 border-t-2 border-l-2 border-cyan-400" />
              <div className="pointer-events-none absolute top-2 right-2 h-6 w-6 border-t-2 border-r-2 border-cyan-400" />
              <div className="pointer-events-none absolute bottom-2 left-2 h-6 w-6 border-b-2 border-l-2 border-cyan-400" />
              <div className="pointer-events-none absolute right-2 bottom-2 h-6 w-6 border-r-2 border-b-2 border-cyan-400" />

              {previewUrl ? (
                <div className="relative">
                  <Image
                    src={previewUrl}
                    alt="업로드한 수료증"
                    width={800}
                    height={600}
                    className="mx-auto h-auto max-h-[50vh] w-auto rounded-md opacity-90"
                    unoptimized
                  />

                  {/* 스캔 라인 애니메이션 */}
                  <div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    style={{
                      animation: 'scanLine 2s ease-in-out infinite',
                      boxShadow: '0 0 20px 5px rgba(34, 211, 238, 0.6)',
                    }}
                  />

                  {/* 오버레이 그리드 효과 */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(34, 211, 238, 0.3) 25%, rgba(34, 211, 238, 0.3) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, 0.3) 75%, rgba(34, 211, 238, 0.3) 76%, transparent 77%, transparent),
                        linear-gradient(90deg, transparent 24%, rgba(34, 211, 238, 0.3) 25%, rgba(34, 211, 238, 0.3) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, 0.3) 75%, rgba(34, 211, 238, 0.3) 76%, transparent 77%, transparent)`,
                      backgroundSize: '50px 50px',
                    }}
                  />
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center text-sm text-gray-400">
                  이미지를 불러오는 중...
                </div>
              )}
            </div>

            {/* 진행 상태 표시 */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-cyan-600">
                <div className="relative flex h-5 w-5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500">
                    <Loader2 className="h-3 w-3 animate-spin text-white" />
                  </span>
                </div>
                <span>문서 스캔 중...</span>
              </div>

              {/* 프로그레스 바 */}
              <div className="mx-auto w-48 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  style={{
                    animation: 'progressBar 2s ease-in-out infinite',
                  }}
                />
              </div>
            </div>
          </div>

          {/* CSS 애니메이션 정의 */}
          <style jsx>{`
            @keyframes scanLine {
              0%,
              100% {
                top: 0%;
              }
              50% {
                top: calc(100% - 4px);
              }
            }
            @keyframes progressBar {
              0% {
                width: 0%;
              }
              50% {
                width: 100%;
              }
              100% {
                width: 0%;
              }
            }
          `}</style>
        </div>
      )}
    </Modal>
  )

  // 리뷰 작성 모달
  const writeModal = (
    <Modal isOpen={openWrite} onClose={() => setOpenWrite(false)} title="리뷰 작성" maxWidthClass="max-w-lg">
      <div className="space-y-5">
        {categories.map(cat => (
          <div key={cat} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">
                {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${i + 1}점 선택`}
                    onClick={() => setDetailScores(prev => ({ ...prev, [cat]: { ...prev[cat], score: i + 1 } }))}
                    className="text-yellow-500"
                  >
                    <Star
                      className={`h-4 w-4 ${detailScores[cat].score >= i + 1 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
                <span className="ml-2 min-w-8 text-right text-sm font-bold text-yellow-600">
                  {detailScores[cat].score || 0}
                </span>
              </div>
            </div>
            <textarea
              placeholder="리뷰를 써 주세요. (20자 이상)"
              value={detailScores[cat].comment}
              onChange={e => setDetailScores(prev => ({ ...prev, [cat]: { ...prev[cat], comment: e.target.value } }))}
              className="h-24 w-full resize-y rounded-md border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
        ))}

        <div className="space-y-2">
          <span className="text-sm font-semibold text-gray-800">총평</span>
          <textarea
            placeholder="리뷰를 써 주세요. (20자 이상)"
            value={overallComment}
            onChange={e => setOverallComment(e.target.value)}
            className="h-24 w-full resize-y rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" className="rounded-full" onClick={() => setOpenWrite(false)}>
            취소
          </Button>
          <Button
            className="rounded-full"
            onClick={async () => {
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
                }
              } catch (error) {
                toast.error('리뷰 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.')
              }
            }}
          >
            입력
          </Button>
        </div>
      </div>
    </Modal>
  )

  // 리뷰 완료 모달
  const completeModal = (
    <Modal isOpen={openComplete} onClose={() => setOpenComplete(false)} title="리뷰 등록 완료" maxWidthClass="max-w-lg">
      <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <div className="space-y-3">
          <div className="mx-auto h-16 w-16 rounded-full border border-gray-200 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-full w-full text-green-600"
            >
              <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-lg font-semibold">리뷰가 정상적으로 등록되었습니다.</p>
          <p className="text-muted-foreground text-sm">관리자 확인 후 게시될 예정입니다.</p>
          <div className="pt-2">
            <Button className="rounded-full" onClick={() => setOpenComplete(false)}>
              닫기
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )

  if (isLoading) {
    return (
      <>
        <Section title="후기" action={actionButton}>
          <div className="text-muted-foreground py-8 text-center text-sm">후기를 불러오는 중...</div>
        </Section>
        {verifyModal}
        {writeModal}
        {completeModal}
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
        {writeModal}
        {completeModal}
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
        {writeModal}
        {completeModal}
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
      {writeModal}
      {completeModal}
    </>
  )
}
