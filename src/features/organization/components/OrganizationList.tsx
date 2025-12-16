'use client'

import { useState } from 'react'

import { FiSearch } from 'react-icons/fi'

import type { Organization } from '../types/organization.type'
import { OrganizationCard } from './OrganizationCard'

interface OrganizationListProps {
  organizations: Organization[]
}

export function OrganizationList({ organizations }: OrganizationListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // 검색어로 기관 필터링 (이름만)
  const filteredOrgs = organizations.filter(org => org.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="w-full pt-10 pb-20">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-foreground text-2xl font-bold">{filteredOrgs.length}곳의 훈련기관을 찾았어요.</h2>
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="검색"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border-border bg-card/50 text-foreground placeholder:text-muted-foreground focus:ring-primary/20 w-full rounded-full border px-4 py-3 pl-10 text-sm focus:ring-2 focus:outline-none"
            />
            <FiSearch className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-lg" />
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredOrgs.map(org => (
          <OrganizationCard key={org.id} organization={org} />
        ))}
      </div>

      {/* No Results */}
      {filteredOrgs.length === 0 && (
        <div className="text-muted-foreground py-20 text-center">
          <p className="text-lg">"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
          <p className="mt-2 text-sm">다른 검색어로 시도해보세요.</p>
        </div>
      )}
    </div>
  )
}
