import { cn } from '@/lib/utils'

interface CharacterCounterProps {
  /** 현재 글자 수 */
  current: number
  /** 최대 글자 수 */
  max: number
  /** 추가 클래스명 */
  className?: string
  /** 경고 표시 임계값 (기본값: max의 90%) */
  warningThreshold?: number
}

/**
 * 글자 수 카운터 컴포넌트
 *
 * @example
 * // 기본 사용법
 * <CharacterCounter current={text.length} max={120} />
 *
 * @example
 * // React Hook Form과 함께 사용
 * const { watch } = useFormContext()
 * const description = watch('description') ?? ''
 * <Textarea {...field} />
 * <CharacterCounter current={description.length} max={120} />
 *
 * @example
 * // 우측 정렬
 * <div className="relative">
 *   <Textarea {...field} />
 *   <CharacterCounter current={value.length} max={120} className="absolute bottom-2 right-2" />
 * </div>
 */
export function CharacterCounter({ current, max, className, warningThreshold }: CharacterCounterProps) {
  const threshold = warningThreshold ?? Math.floor(max * 0.9)
  const isOverLimit = current > max
  const isNearLimit = current >= threshold && current <= max

  return (
    <span
      className={cn(
        'text-xs tabular-nums transition-colors',
        isOverLimit && 'text-destructive font-medium',
        isNearLimit && !isOverLimit && 'text-amber-600 dark:text-amber-500',
        !isOverLimit && !isNearLimit && 'text-muted-foreground',
        className,
      )}
      aria-live="polite"
      aria-label={`${current}자 / ${max}자${isOverLimit ? ' (초과)' : ''}`}
    >
      {current}/{max}
    </span>
  )
}
