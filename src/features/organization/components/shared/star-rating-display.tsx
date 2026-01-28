import { Star } from 'lucide-react'

interface StarRatingDisplayProps {
  score: number
  size?: 'sm' | 'md'
}

export function StarRatingDisplay({ score, size = 'md' }: StarRatingDisplayProps) {
  const starSize = size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]'
  return (
    <div className="flex items-center gap-0">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`${starSize} ${i <= score ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
        />
      ))}
    </div>
  )
}
