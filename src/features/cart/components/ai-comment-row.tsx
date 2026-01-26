'use client'

import { PiRobotDuotone } from 'react-icons/pi'

import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface AiCommentRowProps {
  sectionTitle: string
  comment: string
  advantage: 'left' | 'right' | 'equal'
  leftTitle?: string
  rightTitle?: string
}

export function AiCommentRow({
  sectionTitle,
  comment,
  advantage,
  leftTitle = '왼쪽 강의',
  rightTitle = '오른쪽 강의',
}: AiCommentRowProps) {
  return (
    <TableRow className="border-y border-yellow-200 !bg-yellow-50/80">
      <TableCell colSpan={4} className="px-3 py-3 md:px-6 md:py-4">
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
              <AdvantageIndicator advantage={advantage} leftTitle={leftTitle} rightTitle={rightTitle} />
            </div>
            <p className="text-sm font-medium leading-relaxed break-words whitespace-normal text-gray-800 md:text-base">
              {comment}
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}

function AdvantageIndicator({
  advantage,
  leftTitle,
  rightTitle,
}: {
  advantage: 'left' | 'right' | 'equal'
  leftTitle: string
  rightTitle: string
}) {
  if (advantage === 'equal') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700">
        비슷함
      </span>
    )
  }

  const isLeft = advantage === 'left'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
        isLeft ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800',
      )}
    >
      {isLeft ? leftTitle : rightTitle} 유리
    </span>
  )
}
