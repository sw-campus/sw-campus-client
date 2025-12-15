import * as React from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface Option {
    label: string
    value: string
}

interface MultiSelectProps {
    options: Option[]
    selected: string[]
    onChange: (selected: string[]) => void
    placeholder?: string
    className?: string
    disabled?: boolean
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = 'Select options',
    className,
    disabled = false,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)

    const handleSelect = (value: string) => {
        const newSelected = selected.includes(value)
            ? selected.filter(item => item !== value)
            : [...selected, value]
        onChange(newSelected)
    }

    const handleClear = () => {
        onChange([])
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('justify-between border-input bg-background', className)}
                    disabled={disabled}
                >
                    <div className="flex gap-1 truncate">
                        {selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
                        {selected.length > 0 && <span className="truncate">{selected.length} selected</span>}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0" align="start">
                <div className="flex flex-col gap-1 p-1">
                    {options.length === 0 ? (
                        <p className="p-2 text-sm text-muted-foreground">No options found.</p>
                    ) : (
                        <div className="max-h-[300px] overflow-auto">
                            {options.map(option => (
                                <div
                                    key={option.value}
                                    className="flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                    onClick={() => handleSelect(option.value)}
                                >
                                    <Checkbox
                                        id={option.value}
                                        checked={selected.includes(option.value)}
                                        onCheckedChange={() => handleSelect(option.value)}
                                    />
                                    <label
                                        htmlFor={option.value}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                        onClick={e => e.preventDefault()} // Prevent double toggle due to label click
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {selected.length > 0 && (
                    <>
                        <Separator />
                        <div className="p-1">
                            <Button variant="ghost" className="w-full justify-center text-xs h-8" onClick={handleClear}>
                                Clear filters
                            </Button>
                        </div>
                    </>
                )}
            </PopoverContent>
        </Popover>
    )
}
