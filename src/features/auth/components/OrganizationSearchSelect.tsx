'use client'

import { useEffect, useState } from 'react'

import { Check, Search } from 'lucide-react'

import { useOrganizationsQuery } from '@/features/organization/hooks/useOrganizations'
import { cn } from '@/lib/utils'

const INPUT_BASE_CLASS =
  'h-10 rounded-md border border-white/15 bg-white/10 px-3 text-white placeholder:text-white/45 outline-none focus:border-white/35 focus:bg-white/15'

type OrganizationSearchSelectProps = {
  organizationId: number | null
  organizationName: string
  onSelectExisting: (orgId: number, orgName: string) => void
  onInputNew: (orgName: string) => void
  className?: string
}

export default function OrganizationSearchSelect({
  organizationId,
  organizationName,
  onSelectExisting,
  onInputNew,
  className,
}: OrganizationSearchSelectProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [keyword, setKeyword] = useState(organizationName)

  const { data: orgData, isLoading } = useOrganizationsQuery(keyword)

  // organizationName이 외부에서 변경되면 keyword도 동기화
  useEffect(() => {
    setKeyword(organizationName)
  }, [organizationName])

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!isFocused) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-org-search-select]')) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isFocused])

  const handleInputChange = (value: string) => {
    setKeyword(value)
    // 직접 입력 시 기존 기관 선택 해제하고 새 기관명으로 설정
    onInputNew(value)
  }

  const handleSelectOrg = (orgId: number, orgName: string) => {
    setKeyword(orgName)
    onSelectExisting(orgId, orgName)
    setIsFocused(false)
  }

  const showDropdown = isFocused && keyword.length > 0

  return (
    <div data-org-search-select className={cn('relative mb-4', className)}>
      <label className="mb-1 block text-white/75">기관명</label>

      {/* 입력 필드 */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/50" />
        <input
          type="text"
          placeholder="기관명을 검색하거나 입력해주세요"
          value={keyword}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className={cn(INPUT_BASE_CLASS, 'w-full pl-9')}
        />
      </div>

      {/* 선택된 기관 표시 */}
      {organizationId && <p className="mt-1 text-xs text-green-400">✓ 기존 기관 선택됨: {organizationName}</p>}
      {!organizationId && keyword.trim() && (
        <p className="mt-1 text-xs text-yellow-400">새 기관으로 등록됩니다: {keyword}</p>
      )}

      {/* 검색 결과 드롭다운 */}
      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-white/20 bg-gray-900/95 shadow-lg backdrop-blur-xl">
          <div className="max-h-[200px] overflow-y-auto p-1">
            {isLoading && <div className="py-3 text-center text-sm text-white/50">검색 중...</div>}

            {!isLoading && (!orgData || orgData.length === 0) && (
              <div className="py-3 text-center text-sm text-white/50">
                검색 결과가 없습니다. 새 기관으로 등록됩니다.
              </div>
            )}

            {orgData?.map(org => (
              <div
                key={org.id}
                className={cn(
                  'flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-white transition hover:bg-white/10',
                  organizationId === org.id && 'bg-white/20',
                )}
                onClick={() => handleSelectOrg(org.id, org.name)}
              >
                <Check className={cn('mr-2 h-4 w-4', organizationId === org.id ? 'opacity-100' : 'opacity-0')} />
                <span>{org.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
