'use client'

import { useState } from 'react'

import { Check, ChevronsUpDown } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useOrganizationsQuery } from '@/features/organization/hooks/useOrganizations'
import { cn } from '@/lib/utils'

export function OrganizationSearchInput() {
  const { control, setValue, watch } = useFormContext()
  const [open, setOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [selectedOrgName, setSelectedOrgName] = useState('')

  // Use public API hook which returns OrganizationSummary[] directly
  const { data: orgData, isLoading } = useOrganizationsQuery(keyword)
  const orgId = watch('orgId')

  return (
    <Field>
      <FieldLabel>기관 선택</FieldLabel>
      <FieldContent>
        <Controller
          control={control}
          name="orgId"
          render={({ field, fieldState }) => (
            <>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                  >
                    {selectedOrgName || (field.value ? '기관 ID: ' + field.value : '기관을 검색해 주세요')}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <div className="flex flex-col">
                    <div className="flex items-center border-b px-3">
                      <Input
                        placeholder="기관명 검색..."
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        className="border-0 focus-visible:ring-0"
                      />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-1">
                      {isLoading && (
                        <div className="py-6 text-center text-sm">
                          <div className="text-muted-foreground">검색 중...</div>
                        </div>
                      )}
                      {!isLoading && orgData?.length === 0 && (
                        <div className="py-6 text-center text-sm">
                          <div className="text-muted-foreground">검색 결과가 없습니다.</div>
                        </div>
                      )}
                      {orgData?.map(org => (
                        <div
                          key={org.id}
                          className={cn(
                            'hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none',
                            field.value === org.id && 'bg-accent/50',
                          )}
                          onClick={() => {
                            setValue('orgId', org.id)
                            setSelectedOrgName(org.name)
                            setOpen(false)
                          }}
                        >
                          <Check className={cn('mr-2 h-4 w-4', field.value === org.id ? 'opacity-100' : 'opacity-0')} />
                          <div className="flex flex-col">
                            <span>{org.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {fieldState.error && (
                <FieldDescription className="text-red-600">{fieldState.error.message}</FieldDescription>
              )}
            </>
          )}
        />
      </FieldContent>
    </Field>
  )
}
