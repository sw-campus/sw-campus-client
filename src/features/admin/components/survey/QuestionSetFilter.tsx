'use client'

import { LuSearch } from 'react-icons/lu'

import { Input } from '@/components/ui/Input'

interface QuestionSetFilterProps {
  keyword: string
  onKeywordChange: (keyword: string) => void
}

export function QuestionSetFilter({ keyword, onKeywordChange }: QuestionSetFilterProps) {
  return (
    <div className="flex items-center justify-end">
      <div className="relative w-full sm:w-64">
        <LuSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="세트명 검색..."
          value={keyword}
          onChange={e => onKeywordChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  )
}
