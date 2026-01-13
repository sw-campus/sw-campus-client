'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { LuImage, LuPencil, LuStar, LuUpload } from 'react-icons/lu'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ReviewForm } from '@/features/mypage/components/review/ReviewForm'
import { api } from '@/lib/axios'

type CertificateStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

type CompletedLecture = {
  certificateId: number
  lectureId: number
  lectureName: string
  lectureImageUrl?: string
  organizationName: string
  certifiedAt: string
  canWriteReview: boolean
  reviewId?: number
  certificateImageUrl?: string
  certificateStatus?: CertificateStatus
}

type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export function ReviewManagementSection() {
  // Reviews state
  const [lectures, setLectures] = useState<CompletedLecture[] | null>(null)
  const [lecturesLoading, setLecturesLoading] = useState(true)
  const [reviewStatuses, setReviewStatuses] = useState<Map<number, ReviewStatus>>(new Map())

  // Edit review modal
  const [editOpen, setEditOpen] = useState(false)
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null)
  const [selectedLectureId, setSelectedLectureId] = useState<number | null>(null)
  const [selectedReviewReadOnly, setSelectedReviewReadOnly] = useState(false)

  // Create review modal
  const [createOpen, setCreateOpen] = useState(false)
  const [createLectureId, setCreateLectureId] = useState<number | null>(null)
  const [createLectureName, setCreateLectureName] = useState<string>('')

  // Certificate image modal
  const [certImageOpen, setCertImageOpen] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<CompletedLecture | null>(null)
  const [certImageUploading, setCertImageUploading] = useState(false)
  const [certImageError, setCertImageError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null)

  // Load lectures on mount
  useEffect(() => {
    let cancelled = false

    const fetchLectures = async () => {
      try {
        setLecturesLoading(true)
        const { data } = await api.get<CompletedLecture[]>('/mypage/completed-lectures')
        if (!cancelled) setLectures(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) toast.error('강의 목록을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLecturesLoading(false)
      }
    }

    fetchLectures()
    return () => {
      cancelled = true
    }
  }, [])

  // Hydrate review statuses
  useEffect(() => {
    if (!lectures || lectures.length === 0) return

    let cancelled = false

    const hydrateStatuses = async () => {
      const targetLectures = lectures.filter(l => !l.canWriteReview)
      if (targetLectures.length === 0) return

      try {
        const results = await Promise.all(
          targetLectures.map(async l => {
            try {
              const { data } = await api.get<{ approvalStatus?: string }>(
                `/mypage/completed-lectures/${l.lectureId}/review`,
              )
              const statusStr = String(data?.approvalStatus ?? '').toUpperCase()
              let status: ReviewStatus = 'PENDING'
              if (statusStr === 'APPROVED') status = 'APPROVED'
              else if (statusStr === 'REJECTED') status = 'REJECTED'
              return { lectureId: l.lectureId, status }
            } catch {
              return { lectureId: l.lectureId, status: 'PENDING' as ReviewStatus }
            }
          }),
        )

        if (cancelled) return
        setReviewStatuses(prev => {
          const next = new Map(prev)
          for (const r of results) {
            next.set(r.lectureId, r.status)
          }
          return next
        })
      } catch {
        // ignore
      }
    }

    hydrateStatuses()
    return () => {
      cancelled = true
    }
  }, [lectures])

  const formatDate = (iso?: string) => {
    if (!iso) return ''
    try {
      return new Date(iso).toLocaleDateString()
    } catch {
      return iso
    }
  }

  const getStatusLabel = (lectureId: number, canWriteReview: boolean): string => {
    if (canWriteReview) return '작성 가능'
    const status = reviewStatuses.get(lectureId)
    if (status === 'APPROVED') return '승인됨'
    if (status === 'REJECTED') return '반려됨'
    return '대기중'
  }

  const getStatusBadgeClass = (lectureId: number, canWriteReview: boolean): string => {
    if (canWriteReview) return 'bg-gray-400 text-white'
    const status = reviewStatuses.get(lectureId)
    if (status === 'APPROVED') return 'bg-emerald-500 text-white'
    if (status === 'REJECTED') return 'bg-rose-500 text-white'
    return 'bg-amber-500 text-white' // PENDING
  }

  const isReadOnly = (lectureId: number): boolean => {
    const status = reviewStatuses.get(lectureId)
    return status === 'APPROVED' || status === 'REJECTED'
  }

  // Certificate status helpers
  const getCertStatusLabel = (status?: CertificateStatus) => {
    switch (status) {
      case 'APPROVED':
        return '승인됨'
      case 'REJECTED':
        return '반려됨'
      case 'PENDING':
      default:
        return '대기중'
    }
  }

  const getCertStatusBadgeClass = (status?: CertificateStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-500 text-white'
      case 'REJECTED':
        return 'bg-rose-500 text-white'
      case 'PENDING':
      default:
        return 'bg-amber-500 text-white'
    }
  }

  const canEditCertificate = (status?: CertificateStatus) => {
    return status !== 'APPROVED'
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setCertImageError(null)
    // 미리보기 URL 생성
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleCancelFileSelect = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setCertImageError(null)
  }

  const handleCertImageUpload = async () => {
    if (!selectedCertificate || !selectedFile) return

    try {
      setCertImageUploading(true)
      setCertImageError(null)

      const { updateCertificateImage } = await import('@/features/certificate/api/certificate.api')
      await updateCertificateImage(selectedCertificate.certificateId, selectedFile)

      // 목록 갱신
      await refreshLectures()
      setCertImageOpen(false)
      setSelectedCertificate(null)
      handleCancelFileSelect()
      toast.success('수료증 이미지가 수정되었습니다.')
    } catch {
      setCertImageError('수료증 이미지 수정에 실패했습니다.')
    } finally {
      setCertImageUploading(false)
    }
  }

  const refreshLectures = async () => {
    try {
      setLecturesLoading(true)
      const { data } = await api.get<CompletedLecture[]>('/mypage/completed-lectures')
      setLectures(Array.isArray(data) ? data : [])
    } finally {
      setLecturesLoading(false)
    }
  }

  return (
    <Card className="bg-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground text-lg">내 후기 관리</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {lecturesLoading ? (
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground text-sm">불러오는 중...</span>
          </div>
        ) : (lectures?.length ?? 0) === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground text-sm">수료한 강의가 없습니다.</span>
          </div>
        ) : (
          <TooltipProvider>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>강의명</TableHead>
                    <TableHead className="hidden w-20 sm:table-cell">수료증</TableHead>
                    <TableHead className="hidden w-20 sm:table-cell">후기</TableHead>
                    <TableHead className="w-20 text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lectures!.map((l, idx) => (
                    <TableRow key={l.certificateId} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="text-muted-foreground text-center">{idx + 1}</TableCell>
                      <TableCell className="text-foreground max-w-[200px] truncate font-medium" title={l.lectureName}>
                        {l.lectureName}
                        {/* Mobile info */}
                        <div className="mt-1 flex items-center gap-2 sm:hidden">
                          <Badge variant="secondary" className={`text-xs ${getCertStatusBadgeClass(l.certificateStatus)}`}>
                            {getCertStatusLabel(l.certificateStatus)}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getStatusBadgeClass(l.lectureId, l.canWriteReview)}`}
                          >
                            {getStatusLabel(l.lectureId, l.canWriteReview)}
                          </Badge>
                        </div>
                      </TableCell>
                      {/* 수료증 상태 */}
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="secondary" className={`text-xs ${getCertStatusBadgeClass(l.certificateStatus)}`}>
                          {getCertStatusLabel(l.certificateStatus)}
                        </Badge>
                      </TableCell>
                      {/* 후기 상태 */}
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getStatusBadgeClass(l.lectureId, l.canWriteReview)}`}
                        >
                          {getStatusLabel(l.lectureId, l.canWriteReview)}
                        </Badge>
                      </TableCell>
                      {/* 관리 버튼: 수료증 + 후기 */}
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          {/* 수료증 버튼 */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setSelectedCertificate(l)
                                  setCertImageError(null)
                                  setCertImageOpen(true)
                                }}
                              >
                                <LuImage className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {canEditCertificate(l.certificateStatus) ? '수료증 확인/수정' : '수료증 확인'}
                            </TooltipContent>
                          </Tooltip>
                          {/* 후기 버튼 */}
                          {l.canWriteReview ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setCreateLectureId(l.lectureId)
                                    setCreateLectureName(l.lectureName)
                                    setCreateOpen(true)
                                  }}
                                >
                                  <LuStar className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>후기 작성</TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setSelectedReviewId(l.reviewId ?? null)
                                    setSelectedLectureId(l.lectureId)
                                    setSelectedReviewReadOnly(isReadOnly(l.lectureId))
                                    setEditOpen(true)
                                  }}
                                >
                                  <LuPencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{isReadOnly(l.lectureId) ? '리뷰 조회' : '리뷰 수정'}</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TooltipProvider>
        )}
      </CardContent>

      {/* Edit review modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[70vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl font-bold">
              {selectedReviewReadOnly ? '리뷰 조회' : '리뷰 수정'}
            </DialogTitle>
          </DialogHeader>
          {selectedLectureId ? (
            <ReviewForm
              embedded
              reviewId={selectedReviewId ?? undefined}
              lectureId={selectedLectureId}
              readOnly={selectedReviewReadOnly}
              onClose={() => setEditOpen(false)}
            />
          ) : (
            <p className="text-muted-foreground text-sm">리뷰 정보를 찾을 수 없습니다.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Create review modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[70vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl font-bold">후기 작성</DialogTitle>
          </DialogHeader>
          {createLectureId ? (
            <ReviewForm
              embedded
              isCreateMode
              lectureId={createLectureId}
              lectureName={createLectureName}
              onClose={() => setCreateOpen(false)}
              onSaveSuccess={refreshLectures}
            />
          ) : (
            <p className="text-muted-foreground text-sm">강의 정보를 찾을 수 없습니다.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Certificate image modal */}
      <Dialog
        open={certImageOpen}
        onOpenChange={open => {
          setCertImageOpen(open)
          if (!open) {
            setSelectedCertificate(null)
            setCertImageError(null)
            handleCancelFileSelect()
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl font-bold">
              {selectedCertificate && canEditCertificate(selectedCertificate.certificateStatus)
                ? '수료증 확인/수정'
                : '수료증 확인'}
            </DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-4">
              {/* 강의 정보 */}
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600">강의명</p>
                <p className="font-medium text-gray-900">{selectedCertificate.lectureName}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">수료증 상태:</span>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getCertStatusBadgeClass(selectedCertificate.certificateStatus)}`}
                  >
                    {getCertStatusLabel(selectedCertificate.certificateStatus)}
                  </Badge>
                </div>
              </div>

              {/* 이미지 표시: 새 이미지 미리보기 또는 현재 이미지 */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  {previewUrl ? '새 수료증 이미지 (미리보기)' : '수료증 이미지'}
                </p>
                {previewUrl ? (
                  <div
                    className="relative cursor-pointer overflow-hidden rounded-lg border-2 border-blue-300 bg-blue-50 transition hover:opacity-90"
                    onClick={() => setFullImageUrl(previewUrl)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="새 수료증 미리보기"
                      className="h-auto max-h-64 w-full object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition hover:bg-black/10">
                      <span className="rounded bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
                        클릭하여 원본 보기
                      </span>
                    </div>
                  </div>
                ) : selectedCertificate.certificateImageUrl ? (
                  <div
                    className="relative cursor-pointer overflow-hidden rounded-lg border bg-gray-100 transition hover:opacity-90"
                    onClick={() => setFullImageUrl(selectedCertificate.certificateImageUrl!)}
                  >
                    <Image
                      src={selectedCertificate.certificateImageUrl}
                      alt="수료증 이미지"
                      width={500}
                      height={300}
                      className="h-auto max-h-64 w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg border bg-gray-50 text-sm text-gray-400">
                    이미지 없음
                  </div>
                )}
                {previewUrl && <p className="text-xs text-gray-600">{selectedFile?.name}</p>}
                <p className="text-xs text-gray-400">이미지를 클릭하면 원본 크기로 볼 수 있습니다</p>
              </div>

              {/* 수정 불가 안내 (APPROVED) */}
              {!canEditCertificate(selectedCertificate.certificateStatus) && (
                <p className="text-sm text-gray-500">승인된 수료증은 수정할 수 없습니다.</p>
              )}

              {/* 이미지 수정 폼 (PENDING/REJECTED만) */}
              {canEditCertificate(selectedCertificate.certificateStatus) && (
                <div className="space-y-3">
                  {/* 파일 선택 버튼 (파일 미선택 시) */}
                  {!previewUrl && (
                    <div className="flex items-center gap-3">
                      <label
                        htmlFor="cert-image-input"
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 transition hover:border-gray-400 hover:bg-gray-100"
                      >
                        <LuUpload className="h-4 w-4" />
                        <span>이미지 변경</span>
                      </label>
                      <input
                        id="cert-image-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={certImageUploading}
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileSelect(file)
                          }
                          e.target.value = ''
                        }}
                      />
                    </div>
                  )}

                  {/* 업로드/취소 버튼 (파일 선택 후) */}
                  {previewUrl && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        disabled={certImageUploading}
                        onClick={handleCancelFileSelect}
                      >
                        취소
                      </Button>
                      <Button
                        type="button"
                        className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
                        disabled={certImageUploading}
                        onClick={() => void handleCertImageUpload()}
                      >
                        {certImageUploading ? '업로드 중...' : '업로드'}
                      </Button>
                    </div>
                  )}

                  {certImageError && <p className="text-sm text-red-600">{certImageError}</p>}
                  <p className="text-xs text-gray-500">* 이미지를 수정하면 관리자 재승인이 필요합니다.</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 원본 이미지 보기 모달 */}
      <Dialog open={!!fullImageUrl} onOpenChange={open => !open && setFullImageUrl(null)}>
        <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-auto p-2">
          {fullImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fullImageUrl}
              alt="수료증 원본 이미지"
              className="h-auto w-full object-contain"
              onClick={() => setFullImageUrl(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
