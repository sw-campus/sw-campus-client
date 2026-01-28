'use client'

import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  COMPARE_SECTIONS,
  getCurriculumNames,
  getStepTypes,
  hasStep,
  valueOrUnselected,
} from '@/features/cart/types/table.defs'
import type { ComparisonResult, SectionComment } from '@/features/lecture/actions/gemini'
import type { LectureDetail } from '@/features/lecture/api/lecture-api.types'

const AI_BADGE_GRADIENT = 'linear-gradient(135deg, #FFEEBF 0%, #FEB706 100%)'

function AiCommentRow({
  sectionTitle,
  aiComment,
  leftTitle,
  rightTitle,
}: {
  sectionTitle: string
  aiComment: SectionComment
  leftTitle?: string | null
  rightTitle?: string | null
}) {
  const [isOpen, setIsOpen] = useState(true)

  const getAdvantageLabel = () => {
    if (aiComment.advantage === 'equal') return '비슷함'
    if (aiComment.advantage === 'left') return `${leftTitle ?? '왼쪽 강의'} 유리`
    return `${rightTitle ?? '오른쪽 강의'} 유리`
  }

  return (
    <div
      onClick={() => setIsOpen(prev => !prev)}
      className="cursor-pointer bg-brand-gold-light p-3"
    >
      <div className="flex items-start gap-2">
        {/* AI 그라디언트 뱃지 */}
        <div
          className="flex size-6 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundImage: AI_BADGE_GRADIENT }}
        >
          <span className="text-xs text-white">AI</span>
        </div>
        {/* 코멘트 내용 (제목 + 코멘트 텍스트) */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-brand-gold">{sectionTitle} 분석</span>
            <span className="inline-flex items-center justify-center rounded border-[0.5px] border-foreground bg-[#f9f9f9] px-3 py-1 text-xs leading-none text-foreground">
              {getAdvantageLabel()}
            </span>
          </div>
          {isOpen && (
            <p className="whitespace-pre-wrap break-words text-xs text-foreground md:text-sm">
              {aiComment.comment}
            </p>
          )}
        </div>
        {/* chevron 아이콘 */}
        <FiChevronDown
          className={`size-5 shrink-0 text-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>
    </div>
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
  const sectionHeader = (title: string, key: string, isFirst: boolean) => (
    <div
      key={`${key}-header`}
      className={cn(
        'grid bg-brand-gold-light p-3 md:bg-[#f0f0f0] md:p-4',
        isFirst ? 'md:grid-cols-3' : 'md:grid-cols-1',
      )}
    >
      {isFirst && (
        <span className="hidden text-center text-sm font-semibold text-foreground md:block">
          첫 번째 선택 강의
        </span>
      )}
      <span className={cn(
        'text-center text-xs font-semibold text-foreground md:text-sm',
        !isFirst && 'md:col-span-1',
      )}>
        {title}
      </span>
      {isFirst && (
        <span className="hidden text-center text-sm font-semibold text-foreground md:block">
          두 번째 선택 강의
        </span>
      )}
    </div>
  )

  // 데이터 행 렌더링 (통합: 모바일 + 데스크톱)
  const dataRow = (
    key: string,
    label: string,
    leftValue: React.ReactNode,
    rightValue: React.ReactNode,
  ) => (
    <div key={key} className="bg-white px-4 py-2 md:px-0 md:py-0">
      <div className="grid grid-cols-2 overflow-hidden rounded-[8px] shadow-[2px_2px_10px_0px_rgba(161,161,170,0.25)] md:grid-cols-3 md:rounded-none md:border-b md:border-[#eee] md:shadow-none">
        {/* 라벨 */}
        <div className="order-first col-span-2 flex h-8 items-center justify-center bg-[#f9f9f9] px-3 md:order-none md:col-span-1 md:h-auto md:border-x md:border-[#eee] md:px-4 md:py-5">
          <span className="text-xs font-semibold text-foreground md:text-sm">{label}</span>
        </div>
        {/* 왼쪽값 */}
        <div className="min-w-0 break-words border-r-[0.5px] border-[#eee] bg-white p-3 text-center text-[10px] text-foreground md:order-first md:border-r-0 md:p-5 md:text-base">
          {leftValue}
        </div>
        {/* 오른쪽값 */}
        <div className="min-w-0 break-words bg-white p-3 text-center text-[10px] text-foreground md:p-5 md:text-base">
          {rightValue}
        </div>
      </div>
    </div>
  )

  // AI 코멘트 렌더링은 AiCommentRow 컴포넌트로 분리 (아코디언 토글용 독립 state 필요)
  const renderAiCommentRow = (sectionKey: string, sectionTitle: string) => {
    if (!hasSectionData(sectionKey)) return null
    const aiComment = getAiComment(sectionKey)
    if (!aiComment) return null

    return (
      <AiCommentRow
        key={`${sectionKey}-ai`}
        sectionTitle={sectionTitle}
        aiComment={aiComment}
        leftTitle={leftTitle}
        rightTitle={rightTitle}
      />
    )
  }

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[12px] bg-white shadow-[4px_4px_20px_0px_rgba(161,161,170,0.25)] md:rounded-none md:shadow-none">
      {COMPARE_SECTIONS.flatMap((section, index) => [
        sectionHeader(section.title, section.key, index === 0),
        ...section.rows.map(row =>
          dataRow(
            `${section.key}-${row.key}`,
            row.label,
            valueOrUnselected(leftDetail, row.value(leftDetail)),
            valueOrUnselected(rightDetail, row.value(rightDetail)),
          ),
        ),
        // 섹션별 AI 코멘트 추가
        renderAiCommentRow(section.key, section.title),
      ])}

      {/* 선발절차 */}
      {sectionHeader('선발절차', 'steps', false)}
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
      {renderAiCommentRow('steps', '선발절차')}

      {/* 메인 커리큘럼 */}
      {sectionHeader('메인 커리큘럼', 'curriculum', false)}
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
      {sectionHeader('특화 커리큘럼', 'special-curriculum', false)}
      {dataRow(
        'special-curriculum-content',
        '내용',
        valueOrUnselected(leftDetail, renderSpecialCurriculumList(leftSpecialCurriculums)),
        valueOrUnselected(rightDetail, renderSpecialCurriculumList(rightSpecialCurriculums)),
      )}
      {/* 커리큘럼 AI 코멘트 (메인 + 특화 통합) */}
      {renderAiCommentRow('curriculum', '커리큘럼')}
    </div>
  )
}
