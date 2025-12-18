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

  // 섹션 키 → AI 코멘트 섹션 이름 매핑
  const sectionKeyToAiSection: Record<string, string> = {
    education: '교육정보',
    cost: '모집정보',
    benefits: '지원혜택',
    goal: '훈련목표',
    quals: '지원자격',
    equipment: '훈련시설',
    project: '프로젝트',
    job: '취업지원',
  }

  // AI 코멘트 찾기
  const getAiComment = (sectionKey: string) => {
    if (!aiResult) return null
    const aiSectionName = sectionKeyToAiSection[sectionKey]
    if (!aiSectionName) return null
    return aiResult.sectionComments.find(c => c.section === aiSectionName)
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
            // AI 코멘트 렌더링
            getAiComment(section.key) && (
              <AiCommentRow
                key={`${section.key}-ai-comment`}
                section={getAiComment(section.key)!.section}
                comment={getAiComment(section.key)!.comment}
                advantage={getAiComment(section.key)!.advantage}
                leftTitle={leftTitle ?? '왼쪽 강의'}
                rightTitle={rightTitle ?? '오른쪽 강의'}
              />
            ),
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
          {aiResult?.sectionComments.find(c => c.section === '선발절차') && (
            <AiCommentRow
              section="선발절차"
              comment={aiResult.sectionComments.find(c => c.section === '선발절차')!.comment}
              advantage={aiResult.sectionComments.find(c => c.section === '선발절차')!.advantage}
              leftTitle={leftTitle ?? '왼쪽 강의'}
              rightTitle={rightTitle ?? '오른쪽 강의'}
            />
          )}

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
          {aiResult?.sectionComments.find(c => c.section === '커리큘럼') && (
            <AiCommentRow
              section="커리큘럼"
              comment={aiResult.sectionComments.find(c => c.section === '커리큘럼')!.comment}
              advantage={aiResult.sectionComments.find(c => c.section === '커리큘럼')!.advantage}
              leftTitle={leftTitle ?? '왼쪽 강의'}
              rightTitle={rightTitle ?? '오른쪽 강의'}
            />
          )}
        </TableBody>
      </Table>
    </div>
  )
}
