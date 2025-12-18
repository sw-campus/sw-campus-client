'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface AiCommentRowProps {
  section: string
  comment: string
  advantage: 'left' | 'right' | 'equal'
  leftTitle?: string
  rightTitle?: string
}

export function AiCommentRow({
  section,
  comment,
  advantage,
  leftTitle = '왼쪽 강의',
  rightTitle = '오른쪽 강의',
}: AiCommentRowProps) {
  return (
    <TableRow className="border-y border-orange-300 !bg-orange-100">
      <TableCell colSpan={4} className="px-6 py-4">
        <div className="flex items-start gap-4">
          {/* AI 아이콘 */}
          <div className="flex-shrink-0">
            <div className="flex size-8 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white shadow-md">
              AI
            </div>
          </div>

          {/* 코멘트 내용 */}
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-bold text-orange-700">{section} 분석</span>
              <AdvantageIndicator advantage={advantage} leftTitle={leftTitle} rightTitle={rightTitle} />
            </div>
            <p className="text-base leading-relaxed font-medium text-gray-900">{comment}</p>
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
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-300 px-2.5 py-1 text-xs font-bold text-gray-800">
        비슷함
      </span>
    )
  }

  const isLeft = advantage === 'left'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold',
        isLeft ? 'bg-blue-200 text-blue-900' : 'bg-emerald-200 text-emerald-900',
      )}
    >
      {isLeft ? leftTitle : rightTitle} 유리
    </span>
  )
}
