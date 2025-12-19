'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatDate, formatTimeRange } from '@/lib/date'
import { cn } from '@/lib/utils'

import { useLectureDetailQuery } from '../../hooks/useLectures'
import {
  CURRICULUM_LEVEL_LABEL,
  LECTURE_AUTH_STATUS_COLOR,
  LECTURE_AUTH_STATUS_LABEL,
  type LectureAuthStatus,
  type LectureSummary,
  type MutationOptions,
} from '../../types/lecture.type'

interface LectureDetailModalProps {
  lecture: LectureSummary | null
  isOpen: boolean
  onClose: () => void
  onApprove: (lectureId: number, options?: MutationOptions) => void
  onReject: (lectureId: number, options?: MutationOptions) => void
  isApproving: boolean
  isRejecting: boolean
}

function StatusBadge({ status }: { status: LectureAuthStatus }) {
  return (
    <Badge variant="secondary" className={cn('font-medium', LECTURE_AUTH_STATUS_COLOR[status])}>
      {LECTURE_AUTH_STATUS_LABEL[status]}
    </Badge>
  )
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="flex gap-4 py-2">
      <span className="text-muted-foreground w-28 shrink-0">{label}</span>
      <span className="text-foreground">{value ?? '-'}</span>
    </div>
  )
}

export function LectureDetailModal({
  lecture,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: LectureDetailModalProps) {
  const { data: detail, isLoading } = useLectureDetailQuery(lecture?.lectureId ?? 0)

  if (!lecture) return null

  const handleApprove = () => {
    onApprove(lecture.lectureId, { onSuccess: onClose })
  }

  const handleReject = () => {
    onReject(lecture.lectureId, { onSuccess: onClose })
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            강의 상세 정보
            <StatusBadge status={lecture.lectureAuthStatus} />
          </DialogTitle>
          <DialogDescription>강의 정보를 확인하고 승인/반려를 결정하세요.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <span className="text-muted-foreground">로딩 중...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="border-border rounded-lg border p-4">
              <h3 className="text-foreground mb-3 font-semibold">기본 정보</h3>
              <div className="divide-border divide-y">
                <DetailRow label="강의명" value={detail?.lectureName ?? lecture.lectureName} />
                <DetailRow label="기관명" value={detail?.orgName ?? lecture.orgName} />
                <DetailRow label="카테고리" value={detail?.categoryName} />
                <DetailRow label="내배카 필요" value={detail?.recruitType === 'GENERAL' ? 'X' : 'O'} />
                <DetailRow label="수업 장소" value={detail?.lectureLoc} />
                <DetailRow label="주소" value={detail?.location} />
              </div>
            </div>

            {/* 교육 일정 */}
            <div className="border-border rounded-lg border p-4">
              <h3 className="text-foreground mb-3 font-semibold">교육 일정</h3>
              <div className="divide-border divide-y">
                <DetailRow label="교육 시작일" value={formatDate(detail?.startAt)} />
                <DetailRow label="교육 종료일" value={formatDate(detail?.endAt)} />
                <DetailRow label="모집 마감일" value={formatDate(detail?.deadline)} />
                <DetailRow
                  label="수업 시간"
                  value={formatTimeRange(detail?.startTime, detail?.endTime)}
                />
                <DetailRow label="총 교육일수" value={detail?.totalDays ? `${detail.totalDays}일` : null} />
                <DetailRow label="총 교육시간" value={detail?.totalTimes ? `${detail.totalTimes}시간` : null} />
              </div>
            </div>

            {/* 비용 정보 */}
            <div className="border-border rounded-lg border p-4">
              <h3 className="text-foreground mb-3 font-semibold">비용 정보</h3>
              <div className="divide-border divide-y">
                <DetailRow
                  label="정부 지원금"
                  value={detail?.subsidy ? `${detail.subsidy.toLocaleString()}원` : null}
                />
                <DetailRow
                  label="자기부담금"
                  value={detail?.lectureFee ? `${detail.lectureFee.toLocaleString()}원` : null}
                />
                <DetailRow
                  label="교육지원금"
                  value={detail?.eduSubsidy ? `${detail.eduSubsidy.toLocaleString()}원` : null}
                />
              </div>
            </div>

            {/* 기타 정보 */}
            <div className="border-border rounded-lg border p-4">
              <h3 className="text-foreground mb-3 font-semibold">기타 정보</h3>
              <div className="divide-border divide-y">
                <DetailRow label="최대 수강 인원" value={detail?.maxCapacity ? `${detail.maxCapacity}명` : null} />
                <DetailRow label="장비 제공" value={detail?.equipPc} />
                <DetailRow label="교재 제공" value={detail?.books ? '있음' : '없음'} />
                <DetailRow label="이력서 지원" value={detail?.resume ? '있음' : '없음'} />
                <DetailRow label="모의 면접" value={detail?.mockInterview ? '있음' : '없음'} />
                <DetailRow label="취업 연계" value={detail?.employmentHelp ? '있음' : '없음'} />
              </div>
            </div>

            {/* 커리큘럼 정보 */}
            {detail?.curriculums && detail.curriculums.length > 0 && (
              <div className="border-border rounded-lg border p-4">
                <h3 className="text-foreground mb-3 font-semibold">커리큘럼</h3>
                <div className="space-y-2">
                  {detail.curriculums.map((curriculum, index) => (
                    <div
                      key={curriculum.curriculumId}
                      className="bg-muted flex items-center justify-between rounded-md px-3 py-2"
                    >
                      <span className="text-foreground font-medium">
                        {index + 1}. {curriculum.curriculumName}
                      </span>
                      <Badge variant="secondary">{CURRICULUM_LEVEL_LABEL[curriculum.level] ?? curriculum.level}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {lecture.lectureAuthStatus === 'PENDING' && (
            <>
              <Button variant="outline" onClick={onClose}>
                닫기
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={isRejecting}>
                {isRejecting ? '처리 중...' : '반려'}
              </Button>
              <Button onClick={handleApprove} disabled={isApproving} className="bg-emerald-400 hover:bg-emerald-500">
                {isApproving ? '처리 중...' : '승인'}
              </Button>
            </>
          )}
          {lecture.lectureAuthStatus !== 'PENDING' && (
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
