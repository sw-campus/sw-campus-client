'use client'

import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  COMPARE_SECTIONS,
  dataRow,
  getCurriculumNames,
  getStepTypes,
  hasStep,
  renderRow,
  valueOrUnselected,
} from '@/features/cart/types/table.defs'
import type { LectureDetail } from '@/features/lecture/api/lectureApi.types'
import { cn } from '@/lib/utils'

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
}: {
  leftTitle?: string | null
  rightTitle?: string | null
  leftDetail?: LectureDetail | null
  rightDetail?: LectureDetail | null
  labelColClassName?: string
}) {
  const curriculumNames = getCurriculumNames(leftDetail, rightDetail)
  const stepTypes = getStepTypes(leftDetail, rightDetail)
  const isLeftSelected = Boolean(leftDetail)
  const isRightSelected = Boolean(rightDetail)

  return (
    <div className="border-border rounded-md border">
      <Table className="table-fixed break-keep">
        <colgroup>
          <col className={labelColClassName} />
          <col />
          <col className="w-px" />
          <col />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead className={cn('px-6 py-4 text-base', labelColClassName)}>비교항목</TableHead>
            <TableHead className="[display:-webkit-box] overflow-hidden px-6 py-4 align-top text-base break-keep whitespace-normal [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
              {leftTitle ?? <span className="sr-only">A과정(미선택)</span>}
            </TableHead>
            <TableHead className="w-px px-0">
              <div className="bg-border h-7 w-px" />
            </TableHead>
            <TableHead className="[display:-webkit-box] overflow-hidden px-6 py-4 align-top text-base break-keep whitespace-normal [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
              {rightTitle ?? <span className="sr-only">B과정(미선택)</span>}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="[&_tr:nth-child(even)]:bg-muted/20 [&_td]:leading-relaxed">
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
          ])}

          {sectionRow('선발절차', 'steps-title')}
          {stepTypes.length === 0
            ? dataRow({
                rowKey: 'steps-empty',
                label: '절차',
                leftValue: '-',
                rightValue: '-',
                labelColClassName,
                isLeftSelected,
                isRightSelected,
              })
            : stepTypes.map(stepType =>
                dataRow({
                  rowKey: `steps-${stepType}`,
                  label: stepType,
                  leftValue: valueOrUnselected(leftDetail, hasStep(leftDetail, stepType) ? '있음' : '없음'),
                  rightValue: valueOrUnselected(rightDetail, hasStep(rightDetail, stepType) ? '있음' : '없음'),
                  labelColClassName,
                  isLeftSelected,
                  isRightSelected,
                }),
              )}

          {sectionRow('커리큘럼', 'curriculum-title')}
          {curriculumNames.length === 0
            ? dataRow({
                rowKey: 'curriculum-empty',
                label: '커리큘럼',
                leftValue: '-',
                rightValue: '-',
                labelColClassName,
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
                  isLeftSelected,
                  isRightSelected,
                }),
              )}
        </TableBody>
      </Table>
    </div>
  )
}
