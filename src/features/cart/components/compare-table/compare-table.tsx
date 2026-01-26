'use client'

import { useRef, useState, useEffect } from 'react'

import { PiRobotDuotone } from 'react-icons/pi'

import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { AiCommentRow } from '@/features/cart/components/ai-comment-row'
import { SectionLabelTag } from '@/features/cart/components/compare-table/section-label-tag'
import {
  COMPARE_SECTIONS,
  dataRow,
  getCurriculumNames,
  getStepTypes,
  hasStep,
  renderRow,
  valueOrUnselected,
} from '@/features/cart/types/table.defs'
import type { ComparisonResult } from '@/features/lecture/actions/gemini'
import type { LectureDetail } from '@/features/lecture/api/lecture-api.types'

// 데스크톱 전용 섹션 헤더 (모바일은 div로 렌더링)
function sectionRow(label: string, rowKey: string) {
  return (
    <TableRow key={rowKey}>
      <TableCell colSpan={4} className="bg-muted/5 px-6 py-3">
        <div className="flex justify-start">
          <SectionLabelTag>{label}</SectionLabelTag>
        </div>
      </TableCell>
    </TableRow>
  )
}


function curriculumLevel(detail: LectureDetail | null | undefined, name: string) {
  const found = detail?.curriculum?.find(c => c?.name === name)
  if (!found) return '-'
  return found.level ? String(found.level) : '-'
}

function renderCurriculumLevel(level: string) {
  if (!level || level === '-') return '-'

  const normalized = level.toUpperCase()
  if (normalized === 'NONE') return ''
  const label = normalized === 'BASIC' ? '기본' : normalized === 'ADVANCED' ? '심화' : level

  if (normalized === 'BASIC') {
    return (
      <Badge variant="curriculumBasic" className="px-2 py-0.5 text-xs md:px-3 md:py-1 md:text-sm">
        {label}
      </Badge>
    )
  }

  if (normalized === 'ADVANCED') {
    return (
      <Badge variant="curriculumAdvanced" className="px-2 py-0.5 text-xs md:px-3 md:py-1 md:text-sm">
        {label}
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="px-2 py-0.5 text-xs md:px-3 md:py-1 md:text-sm">
      {label}
    </Badge>
  )
}

// 특화 커리큘럼을 sortOrder로 정렬해서 반환
function getSortedSpecialCurriculums(detail: LectureDetail | null | undefined) {
  const items = detail?.specialCurriculums ?? []
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder)
}

const DISPLAY_MAX_LENGTH = 20

// 특화 커리큘럼 전체 목록 렌더링 (하나의 셀에 모두 표시)
function renderSpecialCurriculumList(items: { title: string }[]) {
  if (items.length === 0) return '-'

  return (
    <div className="space-y-1 text-center">
      {items.map((item, idx) => {
        const isOverLimit = item.title.length > DISPLAY_MAX_LENGTH
        const displayTitle = isOverLimit
          ? `${item.title.slice(0, DISPLAY_MAX_LENGTH)}...`
          : item.title

        if (isOverLimit) {
          return (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <span className="block cursor-default text-xs text-foreground md:text-base">
                  {displayTitle}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-52 break-words">{item.title}</p>
              </TooltipContent>
            </Tooltip>
          )
        }

        return (
          <span key={idx} className="block text-xs text-foreground md:text-base">
            {displayTitle}
          </span>
        )
      })}
    </div>
  )
}

export function CompareTable({
  leftTitle,
  rightTitle,
  leftDetail,
  rightDetail,
  labelColClassName = 'w-[13.75rem]',
  aiResult,
}: {
  leftTitle?: string | null
  rightTitle?: string | null
  leftDetail?: LectureDetail | null
  rightDetail?: LectureDetail | null
  labelColClassName?: string
  aiResult?: ComparisonResult | null
}) {
  const curriculumNames = getCurriculumNames(leftDetail, rightDetail)
  const stepTypes = getStepTypes(leftDetail, rightDetail)
  const leftSpecialCurriculums = getSortedSpecialCurriculums(leftDetail)
  const rightSpecialCurriculums = getSortedSpecialCurriculums(rightDetail)
  const isLeftSelected = Boolean(leftDetail)
  const isRightSelected = Boolean(rightDetail)

  // AI 코멘트 찾기 - sectionKey로 직접 매칭 (매핑 테이블 불필요)
  const getAiComment = (sectionKey: string) => {
    if (!aiResult) return null
    return aiResult.sectionComments.find(c => c.sectionKey === sectionKey)
  }

  // 섹션에 비교할 데이터가 있는지 확인 (양쪽 모두 데이터가 없으면 AI 코멘트 숨김)
  const hasSectionData = (sectionKey: string): boolean => {
    switch (sectionKey) {
      case 'benefits':
        // 추가 혜택: 양쪽 중 하나라도 혜택이 있어야 함
        return (leftDetail?.benefits?.length ?? 0) > 0 || (rightDetail?.benefits?.length ?? 0) > 0
      case 'goal':
        // 훈련목표: 양쪽 중 하나라도 목표가 있어야 함
        return Boolean(leftDetail?.goal) || Boolean(rightDetail?.goal)
      case 'quals':
        // 지원자격: 양쪽 중 하나라도 자격이 있어야 함
        return (leftDetail?.quals?.length ?? 0) > 0 || (rightDetail?.quals?.length ?? 0) > 0
      default:
        return true // 기본적으로 AI 코멘트 표시
    }
  }

  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollHint, setShowScrollHint] = useState(true)

  // 스크롤 힐트 숨기기 - 스크롤 시
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      if (el.scrollLeft > 20) {
        setShowScrollHint(false)
      }
    }

    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  // 모바일용 섹션 헤더 렌더링 (Figma: bg-[#fffcf4], p-[12px], text-[12px])
  const mobileSectionHeader = (title: string, key: string) => (
    <div key={`${key}-mobile-header`} className="flex items-center justify-center bg-[#fffcf4] p-3">
      <span className="text-xs font-semibold text-[#020202]">{title}</span>
    </div>
  )

  // 모바일용 데이터 행 렌더링 (Figma 스타일 정확히 적용)
  const mobileDataRow = (
    key: string,
    label: string,
    leftValue: React.ReactNode,
    rightValue: React.ReactNode,
  ) => (
    <div key={`${key}-mobile`} className="bg-white px-4 py-2">
      <div className="flex w-full flex-col shadow-[2px_2px_10px_0px_rgba(161,161,170,0.25)]">
        {/* 라벨 헤더: h-[32px], bg-[#f9f9f9], px-[12px], rounded-t-[8px], text-[12px] */}
        <div className="flex h-8 items-center justify-center rounded-t-[8px] bg-[#f9f9f9] px-3">
          <span className="text-xs font-semibold text-[#020202]">{label}</span>
        </div>
        {/* 값 영역: rounded-b-[8px], p-[12px], text-[10px], border-[#eee] */}
        <div className="flex overflow-hidden rounded-b-[8px]">
          <div className="min-w-0 flex-1 break-words border-r border-[#eee] bg-white p-3 text-center text-[10px] text-[#020202]">
            {leftValue}
          </div>
          <div className="min-w-0 flex-1 break-words bg-white p-3 text-center text-[10px] text-[#020202]">
            {rightValue}
          </div>
        </div>
      </div>
    </div>
  )

  // 모바일용 AI 코멘트 렌더링
  const mobileAiComment = (
    sectionKey: string,
    sectionTitle: string,
  ) => {
    if (!hasSectionData(sectionKey)) return null
    const aiComment = getAiComment(sectionKey)
    if (!aiComment) return null

    const getAdvantageLabel = () => {
      if (aiComment.advantage === 'equal') return '비슷함'
      if (aiComment.advantage === 'left') return `${leftTitle ?? '왼쪽 강의'} 유리`
      return `${rightTitle ?? '오른쪽 강의'} 유리`
    }

    const getAdvantageStyle = () => {
      if (aiComment.advantage === 'equal') return 'bg-gray-200 text-gray-700'
      if (aiComment.advantage === 'left') return 'bg-blue-100 text-blue-800'
      return 'bg-emerald-100 text-emerald-800'
    }

    return (
      <div key={`${sectionKey}-mobile-ai`} className="border-y border-yellow-200 bg-yellow-50/80 px-4 py-3">
        <div className="flex items-start gap-3">
          {/* AI 아이콘 */}
          <div className="shrink-0">
            <div className="flex size-7 items-center justify-center rounded-full bg-yellow-400">
              <PiRobotDuotone className="size-4 text-yellow-900" />
            </div>
          </div>
          {/* 코멘트 내용 */}
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-yellow-900">{sectionTitle} 분석</span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${getAdvantageStyle()}`}>
                {getAdvantageLabel()}
              </span>
            </div>
            <p className="break-words text-sm font-medium leading-relaxed text-gray-800">
              {aiComment.comment}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* ========== 모바일: div 기반 레이아웃 (Figma 스타일) ========== */}
      <div className="flex w-full flex-col overflow-hidden rounded-[12px] bg-white shadow-[4px_4px_20px_0px_rgba(161,161,170,0.25)] md:hidden">
        {COMPARE_SECTIONS.flatMap(section => [
          mobileSectionHeader(section.title, section.key),
          ...section.rows.map(row =>
            mobileDataRow(
              `${section.key}-${row.key}`,
              row.label,
              valueOrUnselected(leftDetail, row.value(leftDetail)),
              valueOrUnselected(rightDetail, row.value(rightDetail)),
            ),
          ),
          // 섹션별 AI 코멘트 추가
          mobileAiComment(section.key, section.title),
        ])}

        {/* 선발절차 */}
        {mobileSectionHeader('선발절차', 'steps')}
        {stepTypes.length === 0
          ? mobileDataRow('steps-empty', '절차', '-', '-')
          : stepTypes.map(stepType =>
              mobileDataRow(
                `steps-${stepType}`,
                stepType,
                valueOrUnselected(leftDetail, hasStep(leftDetail, stepType) ? 'O' : 'X'),
                valueOrUnselected(rightDetail, hasStep(rightDetail, stepType) ? 'O' : 'X'),
              ),
            )}
        {/* 선발절차 AI 코멘트 */}
        {mobileAiComment('steps', '선발절차')}

        {/* 메인 커리큘럼 */}
        {mobileSectionHeader('메인 커리큘럼', 'curriculum')}
        {curriculumNames.length === 0
          ? mobileDataRow('curriculum-empty', '커리큘럼', '-', '-')
          : curriculumNames.map(name =>
              mobileDataRow(
                `curriculum-${name}`,
                name,
                valueOrUnselected(leftDetail, renderCurriculumLevel(curriculumLevel(leftDetail, name))),
                valueOrUnselected(rightDetail, renderCurriculumLevel(curriculumLevel(rightDetail, name))),
              ),
            )}

        {/* 특화 커리큘럼 */}
        {mobileSectionHeader('특화 커리큘럼', 'special-curriculum')}
        {mobileDataRow(
          'special-curriculum-content',
          '내용',
          valueOrUnselected(leftDetail, renderSpecialCurriculumList(leftSpecialCurriculums)),
          valueOrUnselected(rightDetail, renderSpecialCurriculumList(rightSpecialCurriculums)),
        )}
        {/* 커리큘럼 AI 코멘트 (메인 + 특화 통합) */}
        {mobileAiComment('curriculum', '커리큘럼')}
      </div>

      {/* ========== 데스크톱: Table 기반 레이아웃 ========== */}
      {/* 데스크톱 스크롤 힐트 */}
      {showScrollHint && (
        <div className="pointer-events-none absolute right-0 top-0 z-10 hidden h-full items-center md:flex">
          <div className="flex h-full w-8 items-center justify-center bg-gradient-to-l from-white/90 to-transparent">
            <span className="animate-pulse text-xs text-gray-400">←</span>
          </div>
        </div>
      )}
      <div
        ref={scrollRef}
        className="scrollbar-hide hidden overflow-x-auto rounded-md border border-border md:block"
      >
        <Table className="table-fixed break-keep">
        <colgroup>
          <col className={labelColClassName} />
          <col />
          <col className="w-px" />
          <col />
        </colgroup>
        <TableBody className="[&_tr:nth-child(even)]:bg-muted/30 [&_td]:leading-relaxed [&_tr:nth-child(odd)]:bg-white">
          {COMPARE_SECTIONS.flatMap(section => [
            sectionRow(section.title, `${section.key}-title`),
            ...section.rows.map(row =>
              renderRow({
                rowKey: `${section.key}-${row.key}`,
                row,
                leftDetail,
                rightDetail,
                labelColClassName,
                isLeftSelected,
                isRightSelected,
              }),
            ),
            // AI 코멘트 렌더링 (비교할 데이터가 있을 때만)
            (() => {
              if (!hasSectionData(section.key)) return null
              const aiComment = getAiComment(section.key)
              if (!aiComment) return null
              return (
                <AiCommentRow
                  key={`${section.key}-ai-comment`}
                  sectionTitle={section.title}
                  comment={aiComment.comment}
                  advantage={aiComment.advantage}
                  leftTitle={leftTitle ?? '왼쪽 강의'}
                  rightTitle={rightTitle ?? '오른쪽 강의'}
                />
              )
            })(),
          ])}

          {sectionRow('선발절차', 'steps-title')}
          {stepTypes.length === 0
            ? dataRow({
                rowKey: 'steps-empty',
                label: '절차',
                leftValue: '-',
                rightValue: '-',
                labelColClassName,
                valueAlign: 'center',
                isLeftSelected,
                isRightSelected,
              })
            : stepTypes.map(stepType =>
                dataRow({
                  rowKey: `steps-${stepType}`,
                  label: stepType,
                  leftValue: valueOrUnselected(leftDetail, hasStep(leftDetail, stepType) ? 'O' : 'X'),
                  rightValue: valueOrUnselected(rightDetail, hasStep(rightDetail, stepType) ? 'O' : 'X'),
                  labelColClassName,
                  valueAlign: 'center',
                  isLeftSelected,
                  isRightSelected,
                }),
              )}
          {/* 선발절차 AI 코멘트 */}
          {(() => {
            const aiComment = getAiComment('steps')
            if (!aiComment) return null
            return (
              <AiCommentRow
                sectionTitle="선발절차"
                comment={aiComment.comment}
                advantage={aiComment.advantage}
                leftTitle={leftTitle ?? '왼쪽 강의'}
                rightTitle={rightTitle ?? '오른쪽 강의'}
              />
            )
          })()}

          {sectionRow('메인 커리큘럼', 'curriculum-title')}
          {curriculumNames.length === 0
            ? dataRow({
                rowKey: 'curriculum-empty',
                label: '커리큘럼',
                leftValue: '-',
                rightValue: '-',
                labelColClassName,
                valueAlign: 'center',
                isLeftSelected,
                isRightSelected,
              })
            : curriculumNames.map(name =>
                dataRow({
                  rowKey: `curriculum-${name}`,
                  label: name,
                  leftValue: valueOrUnselected(leftDetail, renderCurriculumLevel(curriculumLevel(leftDetail, name))),
                  rightValue: valueOrUnselected(rightDetail, renderCurriculumLevel(curriculumLevel(rightDetail, name))),
                  labelColClassName,
                  valueAlign: 'center',
                  isLeftSelected,
                  isRightSelected,
                }),
              )}
          {/* 특화 커리큘럼 */}
          {sectionRow('특화 커리큘럼', 'special-curriculum-title')}
          {dataRow({
            rowKey: 'special-curriculum-content',
            label: '내용',
            leftValue: valueOrUnselected(leftDetail, renderSpecialCurriculumList(leftSpecialCurriculums)),
            rightValue: valueOrUnselected(rightDetail, renderSpecialCurriculumList(rightSpecialCurriculums)),
            labelColClassName,
            valueAlign: 'center',
            isLeftSelected,
            isRightSelected,
          })}
          {/* 커리큘럼 AI 코멘트 (메인 + 특화 통합) */}
          {(() => {
            const aiComment = getAiComment('curriculum')
            if (!aiComment) return null
            return (
              <AiCommentRow
                sectionTitle="커리큘럼"
                comment={aiComment.comment}
                advantage={aiComment.advantage}
                leftTitle={leftTitle ?? '왼쪽 강의'}
                rightTitle={rightTitle ?? '오른쪽 강의'}
              />
            )
          })()}
        </TableBody>
      </Table>
    </div>
  </div>
  )
}
