import type { ReactNode } from 'react'

import { TableCell, TableRow } from '@/components/ui/table'
import {
  formatBoolean,
  formatCourseTime,
  formatDateRangeWithTotalDays,
  formatLectureLoc,
  formatList,
  formatMoney,
  formatRecruitType,
  formatStatus,
  formatText,
} from '@/features/cart/utils/cartCompareFormatters'
import type { LectureDetail } from '@/features/lecture/api/lectureApi.types'
import { cn } from '@/lib/utils'

export type Detail = LectureDetail | null | undefined

export type RowDef = {
  key: string
  label: string
  value: (detail: Detail) => ReactNode
}

export function valueOrUnselected(detail: Detail, value: ReactNode) {
  return detail ? value : '미선택'
}

export function dividerCell() {
  return (
    <TableCell className="w-px px-0">
      <div className="bg-border h-full w-px" />
    </TableCell>
  )
}

export function dataRow({
  rowKey,
  label,
  leftValue,
  rightValue,
  labelColClassName,
  isLeftSelected,
  isRightSelected,
}: {
  rowKey: string
  label: string
  leftValue: ReactNode
  rightValue: ReactNode
  labelColClassName: string
  isLeftSelected: boolean
  isRightSelected: boolean
}) {
  return (
    <TableRow key={rowKey}>
      <TableCell
        className={cn('bg-muted/10 px-6 py-4 align-top text-base font-semibold whitespace-normal', labelColClassName)}
      >
        {label}
      </TableCell>
      <TableCell
        className={cn('px-6 py-4 align-top text-base whitespace-normal', !isLeftSelected && 'text-muted-foreground')}
      >
        {leftValue}
      </TableCell>
      {dividerCell()}
      <TableCell
        className={cn('px-6 py-4 align-top text-base whitespace-normal', !isRightSelected && 'text-muted-foreground')}
      >
        {rightValue}
      </TableCell>
    </TableRow>
  )
}

export function renderRow({
  rowKey,
  row,
  leftDetail,
  rightDetail,
  labelColClassName,
  isLeftSelected,
  isRightSelected,
}: {
  rowKey: string
  row: RowDef
  leftDetail: Detail
  rightDetail: Detail
  labelColClassName: string
  isLeftSelected: boolean
  isRightSelected: boolean
}) {
  return dataRow({
    rowKey,
    label: row.label,
    leftValue: valueOrUnselected(leftDetail, row.value(leftDetail)),
    rightValue: valueOrUnselected(rightDetail, row.value(rightDetail)),
    labelColClassName,
    isLeftSelected,
    isRightSelected,
  })
}

export function hasStep(detail: Detail, stepType: string) {
  return Boolean(detail?.steps?.some(s => s === stepType))
}

export function getCurriculumNames(leftDetail: Detail, rightDetail: Detail) {
  const names = new Set<string>()
  leftDetail?.curriculum?.forEach(c => c?.name && names.add(c.name))
  rightDetail?.curriculum?.forEach(c => c?.name && names.add(c.name))
  return Array.from(names)
}

export function getStepTypes(leftDetail: Detail, rightDetail: Detail) {
  const names = new Set<string>()
  leftDetail?.steps?.forEach(stepType => stepType && names.add(stepType))
  rightDetail?.steps?.forEach(stepType => stepType && names.add(stepType))
  return Array.from(names)
}

export const COMPARE_SECTIONS: Array<{ key: string; title: string; rows: RowDef[] }> = [
  {
    key: 'education',
    title: '교육정보',
    rows: [
      {
        key: 'coursePeriod',
        label: '교육기간',
        value: d =>
          formatDateRangeWithTotalDays(
            d?.schedule?.coursePeriod?.start,
            d?.schedule?.coursePeriod?.end,
            d?.schedule?.totalDays,
          ),
      },
      {
        key: 'courseTime',
        label: '교육시간',
        value: d =>
          formatCourseTime(d?.schedule?.days, d?.schedule?.time, d?.schedule?.totalHours, d?.schedule?.totalDays),
      },
      {
        key: 'teachers',
        label: '강사명',
        value: d => formatList(d?.teachers?.map(t => t.name)),
      },
      {
        key: 'location',
        label: '교육장소',
        value: d => `${formatLectureLoc(d?.lectureLoc)}${d?.location ? ` (${d.location})` : ''}`,
      },
    ],
  },
  {
    key: 'recruit',
    title: '모집정보',
    rows: [
      { key: 'status', label: '모집상태', value: d => formatStatus(d?.recruitStatus) },
      { key: 'recruitType', label: '모집유형', value: d => formatRecruitType(d?.recruitType) },
      { key: 'tuition', label: '자기부담금', value: d => formatMoney(d?.support?.tuition) },
      { key: 'stipend', label: '훈련장려금', value: d => formatText(d?.support?.stipend) },
      { key: 'extraSupport', label: '훈련비 지원', value: d => formatText(d?.support?.extraSupport) },
    ],
  },
  {
    key: 'goal',
    title: '훈련목표',
    rows: [{ key: 'goal', label: '훈련목표', value: d => d?.goal ?? '-' }],
  },
  {
    key: 'quals',
    title: '지원자격',
    rows: [
      {
        key: 'required',
        label: '필수',
        value: d => formatList(d?.quals?.filter(q => q.type === 'REQUIRED').map(q => q.text)),
      },
      {
        key: 'preferred',
        label: '우대',
        value: d => formatList(d?.quals?.filter(q => q.type === 'PREFERRED').map(q => q.text)),
      },
    ],
  },
  {
    key: 'equipment',
    title: '훈련시설 및 장비',
    rows: [
      { key: 'pc', label: '장비', value: d => d?.equipment?.pc ?? '-' },
      { key: 'books', label: '교재지원 유무', value: d => formatBoolean(d?.services?.books) },
      { key: 'merit', label: '훈련시설 장점', value: d => d?.equipment?.merit ?? '-' },
    ],
  },
  {
    key: 'project',
    title: '프로젝트',
    rows: [
      {
        key: 'num',
        label: '개수(회)',
        value: d => (d?.project?.num !== null && d?.project?.num !== undefined ? String(d.project.num) : '-'),
      },
      {
        key: 'time',
        label: '기간(시간)',
        value: d => (d?.project?.time !== null && d?.project?.time !== undefined ? String(d.project.time) : '-'),
      },
      { key: 'team', label: '팀 구성 방식', value: d => d?.project?.team ?? '-' },
      { key: 'tool', label: '협업툴', value: d => d?.project?.tool ?? '-' },
      { key: 'mentor', label: '멘토링/코드리뷰', value: d => formatBoolean(d?.project?.mentor) },
    ],
  },
  {
    key: 'job',
    title: '취업 지원 서비스',
    rows: [
      { key: 'resume', label: '이력서/자소서 첨삭', value: d => formatBoolean(d?.services?.resume) },
      { key: 'mock', label: '모의 면접', value: d => formatBoolean(d?.services?.mockInterview) },
      { key: 'help', label: '취업 지원', value: d => formatBoolean(d?.services?.employmentHelp) },
      {
        key: 'after',
        label: '수료 후 사후관리',
        value: d =>
          d?.services?.afterCompletion !== null && d?.services?.afterCompletion !== undefined
            ? String(d.services.afterCompletion)
            : '-',
      },
    ],
  },
]
