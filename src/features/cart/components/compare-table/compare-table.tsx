'use client'

import { PiRobotDuotone } from 'react-icons/pi'

import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  COMPARE_SECTIONS,
  getCurriculumNames,
  getStepTypes,
  hasStep,
  valueOrUnselected,
} from '@/features/cart/types/table.defs'
import type { ComparisonResult } from '@/features/lecture/actions/gemini'
import type { LectureDetail } from '@/features/lecture/api/lecture-api.types'


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
  aiResult,
}: {
  leftTitle?: string | null
  rightTitle?: string | null
  leftDetail?: LectureDetail | null
  rightDetail?: LectureDetail | null
  aiResult?: ComparisonResult | null
}) {
  const curriculumNames = getCurriculumNames(leftDetail, rightDetail)
  const stepTypes = getStepTypes(leftDetail, rightDetail)
  const leftSpecialCurriculums = getSortedSpecialCurriculums(leftDetail)
  const rightSpecialCurriculums = getSortedSpecialCurriculums(rightDetail)

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

  // 섹션 헤더 렌더링 (통합: 모바일 + 데스크톱)
  const sectionHeader = (title: string, key: string) => (
    <div key={`${key}-header`} className="flex items-center justify-center bg-brand-gold-light p-3 md:p-4">
      <span className="text-xs font-semibold text-foreground md:text-sm">{title}</span>
    </div>
  )

  // 데이터 행 렌더링 (통합: 모바일 + 데스크톱)
  const dataRow = (
    key: string,
    label: string,
    leftValue: React.ReactNode,
    rightValue: React.ReactNode,
  ) => (
    <div key={key} className="bg-white px-4 py-2 md:px-6 md:py-3">
      <div className="flex w-full flex-col shadow-sm">
        {/* 라벨 헤더 */}
        <div className="flex h-8 items-center justify-center rounded-t-[8px] bg-muted px-3 md:h-10 md:px-4">
          <span className="text-xs font-semibold text-foreground md:text-sm">{label}</span>
        </div>
        {/* 값 영역 */}
        <div className="flex overflow-hidden rounded-b-[8px]">
          <div className="min-w-0 flex-1 break-words border-r border-border bg-white p-3 text-center text-[10px] text-foreground md:p-4 md:text-sm">
            {leftValue}
          </div>
          <div className="min-w-0 flex-1 break-words bg-white p-3 text-center text-[10px] text-foreground md:p-4 md:text-sm">
            {rightValue}
          </div>
        </div>
      </div>
    </div>
  )

  // AI 코멘트 렌더링 (통합: 모바일 + 데스크톱)
  const aiCommentRow = (
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
      <div key={`${sectionKey}-ai`} className="border-y border-yellow-200 bg-yellow-50/80 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-start gap-3 md:gap-4">
          {/* AI 아이콘 */}
          <div className="shrink-0">
            <div className="flex size-7 items-center justify-center rounded-full bg-yellow-400 md:size-8">
              <PiRobotDuotone className="size-4 text-yellow-900 md:size-5" />
            </div>
          </div>
          {/* 코멘트 내용 */}
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-yellow-900 md:text-sm">{sectionTitle} 분석</span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${getAdvantageStyle()}`}>
                {getAdvantageLabel()}
              </span>
            </div>
            <p className="break-words text-sm font-medium leading-relaxed text-gray-800 md:text-base">
              {aiComment.comment}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[12px] bg-white shadow-[4px_4px_20px_0px_rgba(161,161,170,0.25)]">
      {COMPARE_SECTIONS.flatMap(section => [
        sectionHeader(section.title, section.key),
        ...section.rows.map(row =>
          dataRow(
            `${section.key}-${row.key}`,
            row.label,
            valueOrUnselected(leftDetail, row.value(leftDetail)),
            valueOrUnselected(rightDetail, row.value(rightDetail)),
          ),
        ),
        // 섹션별 AI 코멘트 추가
        aiCommentRow(section.key, section.title),
      ])}

      {/* 선발절차 */}
      {sectionHeader('선발절차', 'steps')}
      {stepTypes.length === 0
        ? dataRow('steps-empty', '절차', '-', '-')
        : stepTypes.map(stepType =>
            dataRow(
              `steps-${stepType}`,
              stepType,
              valueOrUnselected(leftDetail, hasStep(leftDetail, stepType) ? 'O' : 'X'),
              valueOrUnselected(rightDetail, hasStep(rightDetail, stepType) ? 'O' : 'X'),
            ),
          )}
      {/* 선발절차 AI 코멘트 */}
      {aiCommentRow('steps', '선발절차')}

      {/* 메인 커리큘럼 */}
      {sectionHeader('메인 커리큘럼', 'curriculum')}
      {curriculumNames.length === 0
        ? dataRow('curriculum-empty', '커리큘럼', '-', '-')
        : curriculumNames.map(name =>
            dataRow(
              `curriculum-${name}`,
              name,
              valueOrUnselected(leftDetail, renderCurriculumLevel(curriculumLevel(leftDetail, name))),
              valueOrUnselected(rightDetail, renderCurriculumLevel(curriculumLevel(rightDetail, name))),
            ),
          )}

      {/* 특화 커리큘럼 */}
      {sectionHeader('특화 커리큘럼', 'special-curriculum')}
      {dataRow(
        'special-curriculum-content',
        '내용',
        valueOrUnselected(leftDetail, renderSpecialCurriculumList(leftSpecialCurriculums)),
        valueOrUnselected(rightDetail, renderSpecialCurriculumList(rightSpecialCurriculums)),
      )}
      {/* 커리큘럼 AI 코멘트 (메인 + 특화 통합) */}
      {aiCommentRow('curriculum', '커리큘럼')}
    </div>
  )
}
