'use client'

interface LectureFilterTabsProps {
  categories: string[]
  selected: string
  onSelect: (value: string) => void
}

export function LectureFilterTabs({ categories, selected, onSelect }: LectureFilterTabsProps) {
  return (
    <div className="scrollbar-hide -mx-4 mb-4 overflow-x-auto px-4 sm:mx-0 sm:mb-6 sm:px-0">
      <div className="flex gap-2 whitespace-nowrap sm:gap-3">
        {categories.map(c => {
          const active = c === selected
          return (
            <button
              key={c}
              onClick={() => onSelect(c)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                active
                  ? 'bg-primary font-semibold text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {c}
            </button>
          )
        })}
      </div>
    </div>
  )
}
