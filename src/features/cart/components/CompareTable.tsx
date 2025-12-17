'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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

function sectionRow(label: string, rowKey: string) {
  return (
    <TableRow key={rowKey}>
      <TableCell colSpan={4} className="bg-accent/10 text-accent-foreground px-6 py-3 text-sm font-semibold">
        {label}
      </TableCell>
    </TableRow>
  )
}

function dividerCell() {
  return (
    <TableCell className="w-0 px-0">
      <div className="bg-border h-full w-px" />
    </TableCell>
  )
}

function valueOrUnselected(detail: LectureDetail | null | undefined, value: string) {
  return detail ? value : '미선택'
}

function curriculumLevel(detail: LectureDetail | null | undefined, name: string) {
  const found = detail?.curriculum?.find(c => c?.name === name)
  if (!found) return '-'
  return found.level ? String(found.level) : '-'
}

function hasStep(detail: LectureDetail | null | undefined, stepType: string) {
  return Boolean(detail?.steps?.some(s => s === stepType))
}

type Detail = LectureDetail | null | undefined

type RowDef = {
  key: string
  label: string
  value: (detail: Detail) => string
}

export function CompareTable({
  leftTitle,
  rightTitle,
  leftDetail,
  rightDetail,
  labelColClassName = 'w-40',
}: {
  leftTitle?: string | null
  rightTitle?: string | null
  leftDetail?: LectureDetail | null
  rightDetail?: LectureDetail | null
  labelColClassName?: string
}) {
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

  const dataRow = (rowKey: string, label: string, leftValue: string, rightValue: string) => (
    <TableRow key={rowKey}>
      <TableCell
        className={cn('bg-muted/10 px-6 py-4 align-top text-base font-semibold whitespace-normal', labelColClassName)}
      >
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

  const renderRow = (rowKey: string, row: RowDef) =>
    dataRow(
      rowKey,
      row.label,
      valueOrUnselected(leftDetail, row.value(leftDetail)),
      valueOrUnselected(rightDetail, row.value(rightDetail)),
    )

  const sections: Array<{ key: string; title: string; rows: RowDef[] }> = [
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

  return (
    <div className="border-border rounded-md border">
      <Table className="break-keep">
        <TableHeader>
          <TableRow>
            <TableHead className={cn('px-6 py-4 text-base', labelColClassName)}>비교항목</TableHead>
            <TableHead className="[display:-webkit-box] overflow-hidden px-6 py-4 align-top text-base break-keep whitespace-normal [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
              {leftTitle ?? 'A과정(미선택)'}
            </TableHead>
            <TableHead className="w-0 px-0">
              <div className="bg-border h-7 w-px" />
            </TableHead>
            <TableHead className="[display:-webkit-box] overflow-hidden px-6 py-4 align-top text-base break-keep whitespace-normal [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
              {rightTitle ?? 'B과정(미선택)'}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="[&_tr:nth-child(even)]:bg-muted/20 [&_td]:leading-relaxed">
          {sections.flatMap(section => [
            sectionRow(section.title, `${section.key}-title`),
            ...section.rows.map(row => renderRow(`${section.key}-${row.key}`, row)),
          ])}

          {sectionRow('선발절차', 'steps-title')}
          {stepTypes.length === 0
            ? dataRow('steps-empty', '절차', '-', '-')
            : stepTypes.map(stepType =>
                dataRow(
                  `steps-${stepType}`,
                  stepType,
                  valueOrUnselected(leftDetail, hasStep(leftDetail, stepType) ? '있음' : '없음'),
                  valueOrUnselected(rightDetail, hasStep(rightDetail, stepType) ? '있음' : '없음'),
                ),
              )}

          {sectionRow('커리큘럼', 'curriculum-title')}
          {curriculumNames.length === 0
            ? dataRow('curriculum-empty', '커리큘럼', '-', '-')
            : curriculumNames.map(name =>
                dataRow(
                  `curriculum-${name}`,
                  name,
                  valueOrUnselected(leftDetail, curriculumLevel(leftDetail, name)),
                  valueOrUnselected(rightDetail, curriculumLevel(rightDetail, name)),
                ),
              )}
        </TableBody>
      </Table>
    </div>
  )
}
