'use client'

import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { ChevronDown, GraduationCap, Image as ImageIcon, Pencil, Star, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  getApprovalStatusLabel,
  getApprovalStatusColor,
  canEditByStatus,
} from '@/features/admin/types/approval.type'
import type { CompletedLecture } from '@/features/mypage/api/completed-lectures.api'
import { ReviewForm } from '@/features/mypage/components/review/review-form'
import { completedLecturesQueryKey, useCompletedLecturesQuery } from '@/features/mypage/hooks/use-completed-lectures-query'
type FilterStatus = 'all' | 'reviews'

interface ReviewManagementSectionProps {
  filterStatus?: FilterStatus
}

export function ReviewManagementSection({ filterStatus = 'all' }: ReviewManagementSectionProps) {
  const queryClient = useQueryClient()

  // React Query hooks - 캐싱으로 중복 호출 방지
  // reviewStatus가 응답에 포함되어 별도 API 호출 불필요
  const { data: allLectures, isLoading } = useCompletedLecturesQuery()

  // 탭에 따라 필터링된 강의 목록
  const lectures = allLectures?.filter(l => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'reviews') return !l.canWriteReview // 후기가 작성된 강의만
    return true
  })

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

  // Mobile accordion state
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null)

  const getStatusLabel = (lecture: CompletedLecture): string => {
    if (lecture.canWriteReview) return '작성 가능'
    return getApprovalStatusLabel(lecture.reviewStatus)
  }

  const getStatusBadgeClass = (lecture: CompletedLecture): string => {
    if (lecture.canWriteReview) return 'bg-gray-400 text-white'
    return getApprovalStatusColor(lecture.reviewStatus)
  }

  // 리뷰 읽기 전용 여부 (APPROVED만 읽기 전용, REJECTED/PENDING은 수정 가능)
  const isReadOnly = (lecture: CompletedLecture): boolean => {
    return !canEditByStatus(lecture.reviewStatus)
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

      // 캐시 무효화로 목록 갱신
      await queryClient.invalidateQueries({ queryKey: completedLecturesQueryKey })
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
    await queryClient.invalidateQueries({ queryKey: completedLecturesQueryKey })
  }

  // 모바일용 아코디언 아이템 렌더링
  const renderMobileAccordion = () => {
    if (isLoading) {
      return (
        <div className="flex h-32 items-center justify-center">
          <span className="text-sm text-[#888888]">불러오는 중...</span>
        </div>
      )
    }

    if ((lectures?.length ?? 0) === 0) {
      return (
        <div className="flex flex-col items-center gap-3 py-16">
          {filterStatus === 'all' ? (
            <GraduationCap className="w-12 h-12 text-gray-200" />
          ) : (
            <Star className="w-12 h-12 text-gray-200" />
          )}
          <span className="text-sm text-[#888888]">
            {filterStatus === 'all' ? '수료한 강의가 없습니다.' : '작성한 후기가 없습니다.'}
          </span>
          {/* 높이 맞춤용 빈 요소 (관심 등록 강의 탭과 동일한 높이 유지) */}
          <span className="text-sm invisible">placeholder</span>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {lectures!.map(l => {
          const isExpanded = expandedCardId === l.certificateId
          return (
            <div key={l.certificateId} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              {/* 헤더 */}
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 p-3 text-left"
                onClick={() => setExpandedCardId(isExpanded ? null : l.certificateId)}
              >
                <div className="w-0 flex-1">
                  <p className={`text-[#020202] font-medium text-sm ${isExpanded ? '' : 'truncate'}`}>
                    {l.lectureName}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="text-[#888888]">수료증</span>
                    <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${getApprovalStatusColor(l.certificateStatus)}`}>
                      {getApprovalStatusLabel(l.certificateStatus)}
                    </Badge>
                    <span className="text-[#888888]">후기</span>
                    <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${getStatusBadgeClass(l)}`}>
                      {getStatusLabel(l)}
                    </Badge>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#888888] shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* 펼쳐진 내용 */}
              {isExpanded && (
                <div className="border-t border-gray-200 px-3 py-3 bg-[#FFFCF4]">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 flex-1 gap-1 text-xs border-[#FEB706] text-[#020202] hover:bg-[#FEB706]/10"
                      onClick={() => {
                        setSelectedCertificate(l)
                        setCertImageError(null)
                        setCertImageOpen(true)
                      }}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      수료증 확인
                    </Button>
                    {l.canWriteReview ? (
                      <Button
                        size="sm"
                        className="h-8 flex-1 gap-1 text-xs bg-[#262626] text-[#FEB706] hover:bg-[#333333]"
                        onClick={() => {
                          setCreateLectureId(l.lectureId)
                          setCreateLectureName(l.lectureName)
                          setCreateOpen(true)
                        }}
                      >
                        <Star className="w-3.5 h-3.5" />
                        후기 작성
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 flex-1 gap-1 text-xs"
                        onClick={() => {
                          setSelectedReviewId(l.reviewId ?? null)
                          setSelectedLectureId(l.lectureId)
                          setSelectedReviewReadOnly(isReadOnly(l))
                          setEditOpen(true)
                        }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        {isReadOnly(l) ? '후기 보기' : '후기 수정'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      {/* 공통 레이아웃 */}
      <div>
        {/* Content - Mobile */}
        <div className="sm:hidden">
          {renderMobileAccordion()}
        </div>

        {/* Content - Desktop */}
        <div className="hidden sm:block">
          {isLoading ? (
            <div className="flex h-24 items-center justify-center">
              <span className="text-sm text-[#888888]">불러오는 중...</span>
            </div>
          ) : (lectures?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              {filterStatus === 'all' ? (
                <GraduationCap className="w-12 h-12 text-gray-200" />
              ) : (
                <Star className="w-12 h-12 text-gray-200" />
              )}
              <span className="text-sm text-[#888888]">
                {filterStatus === 'all' ? '수료한 강의가 없습니다.' : '작성한 후기가 없습니다.'}
              </span>
              {/* 높이 맞춤용 빈 요소 (관심 등록 강의 탭과 동일한 높이 유지) */}
              <span className="text-sm invisible">placeholder</span>
            </div>
          ) : (
            <TooltipProvider>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-100 bg-gray-50">
                      <TableHead className="w-12 text-center text-[#888888] text-xs font-medium">#</TableHead>
                      <TableHead className="text-[#888888] text-xs font-medium">강의명</TableHead>
                      <TableHead className="w-20 text-[#888888] text-xs font-medium">수료증</TableHead>
                      <TableHead className="w-20 text-[#888888] text-xs font-medium">후기</TableHead>
                      <TableHead className="w-20 text-center text-[#888888] text-xs font-medium">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lectures!.map((l, idx) => (
                      <TableRow key={l.certificateId} className="hover:bg-gray-50 transition-colors border-b border-gray-50">
                        <TableCell className="text-center text-[#888888] text-sm">{idx + 1}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm text-[#020202]" title={l.lectureName}>
                          {l.lectureName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`text-xs ${getApprovalStatusColor(l.certificateStatus)}`}>
                            {getApprovalStatusLabel(l.certificateStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`text-xs ${getStatusBadgeClass(l)}`}>
                            {getStatusLabel(l)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-0.5">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:bg-gray-100"
                                  onClick={() => {
                                    setSelectedCertificate(l)
                                    setCertImageError(null)
                                    setCertImageOpen(true)
                                  }}
                                >
                                  <ImageIcon className="w-3.5 h-3.5 text-[#555555]" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {canEditByStatus(l.certificateStatus) ? '수료증 확인/수정' : '수료증 확인'}
                              </TooltipContent>
                            </Tooltip>
                            {l.canWriteReview ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 hover:bg-[#FEB706]/10"
                                    onClick={() => {
                                      setCreateLectureId(l.lectureId)
                                      setCreateLectureName(l.lectureName)
                                      setCreateOpen(true)
                                    }}
                                  >
                                    <Star className="w-3.5 h-3.5 text-[#FEB706]" />
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
                                    className="h-7 w-7 hover:bg-gray-100"
                                    onClick={() => {
                                      setSelectedReviewId(l.reviewId ?? null)
                                      setSelectedLectureId(l.lectureId)
                                      setSelectedReviewReadOnly(isReadOnly(l))
                                      setEditOpen(true)
                                    }}
                                  >
                                    <Pencil className="w-3.5 h-3.5 text-[#555555]" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{isReadOnly(l) ? '리뷰 조회' : '리뷰 수정'}</TooltipContent>
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
        </div>
      </div>

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
              {selectedCertificate && canEditByStatus(selectedCertificate.certificateStatus)
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
                    className={`text-xs ${getApprovalStatusColor(selectedCertificate.certificateStatus)}`}
                  >
                    {getApprovalStatusLabel(selectedCertificate.certificateStatus)}
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedCertificate.certificateImageUrl}
                      alt="수료증 이미지"
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
              {!canEditByStatus(selectedCertificate.certificateStatus) && (
                <p className="text-sm text-gray-500">승인된 수료증은 수정할 수 없습니다.</p>
              )}

              {/* 이미지 수정 폼 (PENDING/REJECTED만) */}
              {canEditByStatus(selectedCertificate.certificateStatus) && (
                <div className="space-y-3">
                  {/* 파일 선택 버튼 (파일 미선택 시) */}
                  {!previewUrl && (
                    <div className="flex items-center gap-3">
                      <label
                        htmlFor="cert-image-input"
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 transition hover:border-gray-400 hover:bg-gray-100"
                      >
                        <Upload className="h-4 w-4" />
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
    </>
  )
}
