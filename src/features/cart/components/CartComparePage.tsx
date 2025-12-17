'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LectureSummaryCard } from '@/features/cart/components/LectureSummaryCard'
import { useCartLecturesWithDetailQuery } from '@/features/cart/hooks/useCartLecturesWithDetailQuery'
import {
  formatBoolean,
  formatDateRange,
  formatLectureLoc,
  formatList,
  formatMoney,
  formatRecruitType,
  formatStatus,
  formatText,
} from '@/features/cart/utils/cartCompareFormatters'
import { useLectureDetailQuery } from '@/features/lecture'
import { cn } from '@/lib/utils'
import { useCartCompareStore } from '@/store/cartCompare.store'

type Side = 'left' | 'right'

const DND_MIME = 'application/x-sw-campus-lecture-id'

function setDragLectureId(e: React.DragEvent, lectureId: string) {
  e.dataTransfer.setData(DND_MIME, lectureId)
  e.dataTransfer.setData('text/plain', lectureId)
  e.dataTransfer.effectAllowed = 'copy'
}

function getDragLectureId(e: React.DragEvent) {
  return e.dataTransfer.getData(DND_MIME) || e.dataTransfer.getData('text/plain')
}

export default function CartComparePage() {
  const { data, isLoading, isError } = useCartLecturesWithDetailQuery()
  const items = data ?? []

  const { leftId, rightId, setLeftId, setRightId } = useCartCompareStore()
  const [isLeftOver, setIsLeftOver] = useState(false)
  const [isRightOver, setIsRightOver] = useState(false)

  useEffect(() => {
    if (leftId && !items.some(i => i.lectureId === leftId)) setLeftId(null)
    if (rightId && !items.some(i => i.lectureId === rightId)) setRightId(null)
  }, [items, leftId, rightId, setLeftId, setRightId])

  const left = items.find(i => i.lectureId === leftId) ?? null
  const right = items.find(i => i.lectureId === rightId) ?? null

  const { data: leftDetail } = useLectureDetailQuery(leftId)
  const { data: rightDetail } = useLectureDetailQuery(rightId)

  const curriculumNames = (() => {
    const names = new Set<string>()
    leftDetail?.curriculum?.forEach(c => c?.name && names.add(c.name))
    rightDetail?.curriculum?.forEach(c => c?.name && names.add(c.name))
    return Array.from(names)
  })()

  const stepTypes = (() => {
    const names = new Set<string>()
    leftDetail?.steps?.forEach(stepType => stepType && names.add(stepType))
    rightDetail?.steps?.forEach(stepType => stepType && names.add(stepType))
    return Array.from(names)
  })()

  const hasStep = (dto: typeof leftDetail, stepType: string) => {
    return Boolean(dto?.steps?.some(s => s === stepType))
  }

  const leftCategory = left?.categoryName ?? leftDetail?.categoryName
  const rightCategory = right?.categoryName ?? rightDetail?.categoryName
  const lockedCategory = leftCategory ?? rightCategory ?? null

  const canUseItem = (itemCategory: string | undefined) => {
    if (!lockedCategory) return true
    if (!itemCategory) return false
    return itemCategory === lockedCategory
  }

  const isAlreadySelected = (lectureId: string) => {
    return lectureId === leftId || lectureId === rightId
  }

  const curriculumLevel = (dto: typeof leftDetail, name: string) => {
    const found = dto?.curriculum?.find(c => c?.name === name)
    if (!found) return '-'
    return found.level ? String(found.level) : '-'
  }

  const sectionRow = (label: string) => (
    <TableRow>
      <TableCell colSpan={4} className="bg-accent/10 text-accent-foreground px-6 py-3 text-sm font-semibold">
        {label}
      </TableCell>
    </TableRow>
  )

  const dividerCell = () => (
    <TableCell className="w-0 px-0">
      <div className="bg-border h-full w-px" />
    </TableCell>
  )

  const dataRow = (label: string, leftValue: string, rightValue: string) => (
    <TableRow>
      <TableCell className="bg-muted/10 w-56 px-6 py-4 align-top text-base font-semibold whitespace-normal">
        {label}
      </TableCell>
      <TableCell
        className={cn('px-6 py-4 align-top text-base whitespace-normal', !leftDetail && 'text-muted-foreground')}
      >
        {leftValue}
      </TableCell>
      {dividerCell()}
      <TableCell
        className={cn('px-6 py-4 align-top text-base whitespace-normal', !rightDetail && 'text-muted-foreground')}
      >
        {rightValue}
      </TableCell>
    </TableRow>
  )

  const onDropLecture = (side: Side, lectureId: string) => {
    if (isAlreadySelected(lectureId)) return

    const dropped = items.find(i => i.lectureId === lectureId)
    const droppedCategory = dropped?.categoryName
    if (!canUseItem(droppedCategory)) return

    if (side === 'left') setLeftId(lectureId)
    else setRightId(lectureId)
  }

  return (
    <div className="mx-auto grid w-full gap-4 overflow-x-hidden py-6 md:grid-cols-[280px_1fr]">
      <aside className="space-y-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">장바구니</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <div className="text-muted-foreground text-sm">불러오는 중...</div>
            ) : isError ? (
              <div className="text-muted-foreground text-sm">장바구니 목록을 불러오지 못했습니다.</div>
            ) : items.length === 0 ? (
              <div className="text-muted-foreground text-sm">장바구니가 비어있습니다.</div>
            ) : (
              items.map(item => (
                <button
                  key={item.lectureId}
                  type="button"
                  disabled={!canUseItem(item.categoryName) || isAlreadySelected(item.lectureId)}
                  draggable={canUseItem(item.categoryName) && !isAlreadySelected(item.lectureId)}
                  onDragStart={e => {
                    if (isAlreadySelected(item.lectureId)) {
                      e.preventDefault()
                      return
                    }
                    if (!canUseItem(item.categoryName)) {
                      e.preventDefault()
                      return
                    }
                    setDragLectureId(e, item.lectureId)
                  }}
                  onClick={() => {
                    if (isAlreadySelected(item.lectureId)) return
                    if (!canUseItem(item.categoryName)) return
                    if (!leftId) setLeftId(item.lectureId)
                    else if (!rightId) setRightId(item.lectureId)
                    else setLeftId(item.lectureId)
                  }}
                  className="hover:bg-muted/50 border-border disabled:bg-muted/20 disabled:text-muted-foreground relative flex w-full items-center gap-3 overflow-hidden rounded-md border p-2 text-left disabled:cursor-not-allowed"
                >
                  {(!canUseItem(item.categoryName) || isAlreadySelected(item.lectureId)) && (
                    <span aria-hidden className="bg-foreground/10 absolute inset-0" />
                  )}
                  <div className="bg-muted relative z-10 h-10 w-10 overflow-hidden rounded-md">
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                        unoptimized={item.thumbnailUrl.startsWith('http')}
                      />
                    ) : null}
                  </div>
                  <div className="relative z-10 min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{item.title}</div>
                    <div className="text-muted-foreground truncate text-xs">{item.categoryName ?? '-'}</div>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </aside>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">과정비교 페이지</CardTitle>
          <div className="text-muted-foreground text-sm">
            사이드바에서 강의를 드래그해서 왼쪽/오른쪽 영역에 놓으면 비교표가 업데이트됩니다.
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="border-border grid grid-cols-1 overflow-hidden rounded-md border md:grid-cols-[1fr_1px_1fr]">
            <div
              className={cn(isLeftOver && 'bg-muted/20')}
              onDragEnter={e => {
                e.preventDefault()
                setIsLeftOver(true)
              }}
              onDragLeave={() => setIsLeftOver(false)}
              onDragOver={e => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'copy'
              }}
              onDrop={e => {
                e.preventDefault()
                setIsLeftOver(false)
                const lectureId = getDragLectureId(e)
                if (!lectureId) return
                onDropLecture('left', lectureId)
              }}
              aria-label="왼쪽 드롭 영역"
            >
              <LectureSummaryCard
                side="left"
                title={left?.title ?? ''}
                orgName={leftDetail?.orgName}
                thumbnailUrl={leftDetail?.thumbnailUrl}
                lectureId={leftId}
                onClear={() => setLeftId(null)}
              />
            </div>
            <div className="bg-border hidden w-px md:block" />
            <div
              className={cn(isRightOver && 'bg-muted/20')}
              onDragEnter={e => {
                e.preventDefault()
                setIsRightOver(true)
              }}
              onDragLeave={() => setIsRightOver(false)}
              onDragOver={e => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'copy'
              }}
              onDrop={e => {
                e.preventDefault()
                setIsRightOver(false)
                const lectureId = getDragLectureId(e)
                if (!lectureId) return
                onDropLecture('right', lectureId)
              }}
              aria-label="오른쪽 드롭 영역"
            >
              <LectureSummaryCard
                side="right"
                title={right?.title ?? ''}
                orgName={rightDetail?.orgName}
                thumbnailUrl={rightDetail?.thumbnailUrl}
                lectureId={rightId}
                onClear={() => setRightId(null)}
              />
            </div>
          </div>

          <div className="border-border rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-56 px-6 py-4 text-base">비교항목</TableHead>
                  <TableHead className="px-6 py-4 text-base wrap-break-word whitespace-normal">
                    {left?.title ?? 'A과정(미선택)'}
                  </TableHead>
                  <TableHead className="w-0 px-0">
                    <div className="bg-border h-7 w-px" />
                  </TableHead>
                  <TableHead className="px-6 py-4 text-base wrap-break-word whitespace-normal">
                    {right?.title ?? 'B과정(미선택)'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:nth-child(even)]:bg-muted/20 [&_td]:leading-relaxed">
                {sectionRow('교육정보')}
                {dataRow(
                  '교육기간',
                  leftDetail
                    ? formatDateRange(leftDetail.schedule?.coursePeriod?.start, leftDetail.schedule?.coursePeriod?.end)
                    : '미선택',
                  rightDetail
                    ? formatDateRange(
                        rightDetail.schedule?.coursePeriod?.start,
                        rightDetail.schedule?.coursePeriod?.end,
                      )
                    : '미선택',
                )}
                {dataRow(
                  '교육시간',
                  leftDetail ? `시간: ${formatText(leftDetail.schedule?.time)}` : '미선택',
                  rightDetail ? `시간: ${formatText(rightDetail.schedule?.time)}` : '미선택',
                )}
                {dataRow(
                  '교육장소',
                  leftDetail
                    ? `${formatLectureLoc(leftDetail.lectureLoc)}${leftDetail.location ? ` (${leftDetail.location})` : ''}`
                    : '미선택',
                  rightDetail
                    ? `${formatLectureLoc(rightDetail.lectureLoc)}${rightDetail.location ? ` (${rightDetail.location})` : ''}`
                    : '미선택',
                )}

                {sectionRow('모집정보')}
                {dataRow('모집상태', formatStatus(leftDetail?.recruitStatus), formatStatus(rightDetail?.recruitStatus))}
                {dataRow(
                  '모집유형',
                  formatRecruitType(leftDetail?.recruitType),
                  formatRecruitType(rightDetail?.recruitType),
                )}
                {dataRow(
                  '자기부담금',
                  formatMoney(leftDetail?.support?.tuition),
                  formatMoney(rightDetail?.support?.tuition),
                )}
                {dataRow(
                  '훈련장려금',
                  formatText(leftDetail?.support?.stipend),
                  formatText(rightDetail?.support?.stipend),
                )}
                {dataRow(
                  '훈련비 지원',
                  formatText(leftDetail?.support?.extraSupport),
                  formatText(rightDetail?.support?.extraSupport),
                )}

                {sectionRow('훈련목표')}
                {dataRow('훈련목표', leftDetail?.goal ?? '-', rightDetail?.goal ?? '-')}

                {sectionRow('지원자격')}
                {dataRow(
                  '필수',
                  formatList(leftDetail?.quals?.filter(q => q.type === 'REQUIRED').map(q => q.text)),
                  formatList(rightDetail?.quals?.filter(q => q.type === 'REQUIRED').map(q => q.text)),
                )}
                {dataRow(
                  '우대',
                  formatList(leftDetail?.quals?.filter(q => q.type === 'PREFERRED').map(q => q.text)),
                  formatList(rightDetail?.quals?.filter(q => q.type === 'PREFERRED').map(q => q.text)),
                )}

                {sectionRow('선발절차')}
                {stepTypes.length === 0
                  ? dataRow('절차', '-', '-')
                  : stepTypes.map(stepType =>
                      dataRow(
                        stepType,
                        leftDetail ? (hasStep(leftDetail, stepType) ? '있음' : '없음') : '미선택',
                        rightDetail ? (hasStep(rightDetail, stepType) ? '있음' : '없음') : '미선택',
                      ),
                    )}

                {sectionRow('훈련시설 및 장비')}
                {dataRow('장비', leftDetail?.equipment?.pc ?? '-', rightDetail?.equipment?.pc ?? '-')}
                {dataRow(
                  '교재지원 유무',
                  formatBoolean(leftDetail?.services?.books),
                  formatBoolean(rightDetail?.services?.books),
                )}
                {dataRow('훈련시설 장점', leftDetail?.equipment?.merit ?? '-', rightDetail?.equipment?.merit ?? '-')}

                {sectionRow('프로젝트')}
                {dataRow(
                  '개수(회)',
                  leftDetail?.project?.num !== null && leftDetail?.project?.num !== undefined
                    ? String(leftDetail.project.num)
                    : '-',
                  rightDetail?.project?.num !== null && rightDetail?.project?.num !== undefined
                    ? String(rightDetail.project.num)
                    : '-',
                )}
                {dataRow(
                  '기간(시간)',
                  leftDetail?.project?.time !== null && leftDetail?.project?.time !== undefined
                    ? String(leftDetail.project.time)
                    : '-',
                  rightDetail?.project?.time !== null && rightDetail?.project?.time !== undefined
                    ? String(rightDetail.project.time)
                    : '-',
                )}
                {dataRow('팀 구성 방식', leftDetail?.project?.team ?? '-', rightDetail?.project?.team ?? '-')}
                {dataRow('협업툴', leftDetail?.project?.tool ?? '-', rightDetail?.project?.tool ?? '-')}
                {dataRow(
                  '멘토링/코드리뷰',
                  leftDetail ? formatBoolean(leftDetail.project?.mentor) : '-',
                  rightDetail ? formatBoolean(rightDetail.project?.mentor) : '-',
                )}

                {sectionRow('취업 지원 서비스')}
                {dataRow(
                  '이력서/자소서 첨삭',
                  formatBoolean(leftDetail?.services?.resume),
                  formatBoolean(rightDetail?.services?.resume),
                )}
                {dataRow(
                  '모의 면접',
                  formatBoolean(leftDetail?.services?.mockInterview),
                  formatBoolean(rightDetail?.services?.mockInterview),
                )}
                {dataRow(
                  '취업 지원',
                  formatBoolean(leftDetail?.services?.employmentHelp),
                  formatBoolean(rightDetail?.services?.employmentHelp),
                )}
                {dataRow(
                  '수료 후 사후관리',
                  leftDetail?.services?.afterCompletion !== null && leftDetail?.services?.afterCompletion !== undefined
                    ? String(leftDetail.services.afterCompletion)
                    : '-',
                  rightDetail?.services?.afterCompletion !== null &&
                    rightDetail?.services?.afterCompletion !== undefined
                    ? String(rightDetail.services.afterCompletion)
                    : '-',
                )}

                {sectionRow('커리큘럼')}
                {curriculumNames.length === 0
                  ? dataRow('커리큘럼', '-', '-')
                  : curriculumNames.map(name =>
                      dataRow(
                        name,
                        leftDetail ? curriculumLevel(leftDetail, name) : '미선택',
                        rightDetail ? curriculumLevel(rightDetail, name) : '미선택',
                      ),
                    )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
