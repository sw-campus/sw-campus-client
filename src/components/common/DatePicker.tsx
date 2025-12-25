'use client'

import * as React from 'react'

import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function DatePicker({
  label,
  id,
  value,
  onSelect,
}: {
  label?: React.ReactNode
  id?: string
  value?: Date | undefined
  onSelect?: (date?: Date) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(undefined)
  const reactId = React.useId()
  const inputId = id ?? `date-${reactId}`
  const selectedDate = value ?? internalDate

  // 현재 연도 기준으로 앞뒤 10년 범위 설정
  const currentYear = new Date().getFullYear()
  const fromYear = currentYear - 5
  const toYear = currentYear + 10

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={inputId} className="text-muted-foreground">
        {label ?? '날짜 선택'}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={inputId}
            className="hover:bg-background hover:text-accent-foreground w-full justify-between font-normal"
          >
            {selectedDate ? selectedDate.toLocaleDateString() : '날짜 선택'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            fromYear={fromYear}
            toYear={toYear}
            onSelect={d => {
              if (onSelect) onSelect(d)
              else setInternalDate(d)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

