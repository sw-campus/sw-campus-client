'use client'

interface LectureFilterTabsProps {
  categories: string[]
  selected: string
  onSelect: (value: string) => void
}

export function LectureFilterTabs({ categories, selected, onSelect }: LectureFilterTabsProps) {
  return (
    <div className="no-scrollbar mb-6 flex gap-3 whitespace-nowrap">
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
  )
}
