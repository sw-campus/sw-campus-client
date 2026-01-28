'use client'

import { useState } from 'react'

import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import { useOrganizationsQuery } from '../hooks/use-organizations'
import { OrganizationCard } from './organization-card'

export function OrganizationList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [showRecruitingOnly, setShowRecruitingOnly] = useState(false)

  // API에서 기관 목록 조회 (서버 사이드 필터링)
  const { data: organizations = [], isLoading } = useOrganizationsQuery(searchTerm || undefined)

  // 모집 중인 기관만 필터링
  const filteredOrganizations = showRecruitingOnly
    ? organizations.filter(org => org.recruitingLectureCount > 0)
    : organizations

  const handleSearch = () => {
    setSearchTerm(inputValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="w-full pb-20">
        {/* Search Section */}
        <div className="mb-6 space-y-4 md:space-y-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-foreground text-base font-medium md:text-lg">
              {filteredOrganizations.length}곳의 훈련기관을 찾았어요.
            </p>

            {/* Desktop: 체크박스 + 검색창 inline */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-2">
              {/* Checkbox - 모집 중인 기관만 보기 */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="recruiting-only"
                  checked={showRecruitingOnly}
                  onCheckedChange={checked => setShowRecruitingOnly(checked === true)}
                />
                <label htmlFor="recruiting-only" className="text-foreground cursor-pointer text-sm">
                  모집 중인 기관만 보기
                </label>
              </div>

              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="검색어를 입력해주세요."
                    aria-label="훈련기관 검색"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary h-10 w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:outline-none md:h-10 md:w-[363px]"
                  />
                </div>
                <Button onClick={handleSearch} className="h-10 w-20">
                  검색
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20" role="status" aria-label="훈련기관 목록 로딩 중">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
            <span className="sr-only">로딩 중...</span>
          </div>
        )}

        {/* Organization List */}
        {!isLoading &&
          (filteredOrganizations.length > 0 ? (
            <div className="space-y-3">
              {filteredOrganizations.map(org => (
                <OrganizationCard key={org.id} organization={org} />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-20 text-center">
              <p className="text-lg">
                {searchTerm ? `"${searchTerm}"에 대한 검색 결과가 없습니다.` : '등록된 훈련기관이 없습니다.'}
              </p>
              {searchTerm && <p className="mt-2 text-sm">다른 검색어로 시도해보세요.</p>}
            </div>
          ))}
    </div>
  )
}
