'use client'

import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { AiCommentRow } from '@/features/cart/components/AiCommentRow'
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
import type { LectureDetail } from '@/features/lecture/api/lectureApi.types'

function sectionRow(label: string, rowKey: string) {
  return (
    <TableRow key={rowKey}>
      <TableCell colSpan={4} className="bg-accent/10 text-accent-foreground px-6 py-3 text-sm font-semibold">
        {label}
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
      <Badge variant="curriculumBasic" className="px-3 py-1 text-sm">
        {label}
      </Badge>
    )
  }

  if (normalized === 'ADVANCED') {
    return (
      <Badge variant="curriculumAdvanced" className="px-3 py-1 text-sm">
        {label}
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="px-3 py-1 text-sm">
      {label}
    </Badge>
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

  return (
    <div className="border-border rounded-md border">
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

          {sectionRow('커리큘럼', 'curriculum-title')}
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
          {/* 커리큘럼 AI 코멘트 */}
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
  )
}
