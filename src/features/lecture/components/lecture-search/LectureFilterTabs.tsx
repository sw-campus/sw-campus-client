'use client'

interface LectureFilterTabsProps {
  categories: string[]
  selected: string
  onSelect: (value: string) => void
}

export function LectureFilterTabs({ categories, selected, onSelect }: LectureFilterTabsProps) {
  return (
    <div className="mb-4 -mx-4 px-4 overflow-x-auto scrollbar-hide sm:mx-0 sm:px-0 sm:mb-6">
      <div className="flex gap-2 whitespace-nowrap sm:gap-3">
      {categories.map(c => {
        const active = c === selected
        return (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              active ? 'bg-black/70 font-semibold text-orange-300' : 'bg-black/20 text-gray-300 hover:bg-black/40'
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
