'use client'

import { useState } from 'react'

import { LuBuilding, LuList, LuShield, LuUser } from 'react-icons/lu'

import { useMembersQuery } from '../../hooks/useMembers'
import type { MemberRole, MemberRoleFilter } from '../../types/member.type'
import { StatCard } from '../StatCard'
import { ApprovalPagination } from '../common/ApprovalPagination'
import { MemberFilter } from './MemberFilter'
import { MemberTable } from './MemberTable'

const PAGE_SIZE = 10

// 'use client' is already at top

export function MemberPage() {
  const [roleFilter, setRoleFilter] = useState<MemberRoleFilter>('ALL')
  const [keyword, setKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  // 모든 회원 조회 (Client-side filtering을 위해 큰 size로 조회)
  const { data: pageData, isLoading } = useMembersQuery(keyword, 0, 1000)

  const allMembers = pageData?.content ?? []

  // Role 필터링
  const filteredMembers = roleFilter === 'ALL' ? allMembers : allMembers.filter(member => member.role === roleFilter)

  // Frontend Pagination
  const totalElements = filteredMembers.length
  const totalPages = Math.ceil(totalElements / PAGE_SIZE)
  const offset = currentPage * PAGE_SIZE
  const paginatedMembers = filteredMembers.slice(offset, offset + PAGE_SIZE)

  // 상태별 통계 계산
  const stats = {
    all: allMembers.length,
    user: allMembers.filter(m => m.role === 'USER').length,
    organization: allMembers.filter(m => m.role === 'ORGANIZATION').length,
    admin: allMembers.filter(m => m.role === 'ADMIN').length,
  }

  const handleRoleChange = (role: MemberRoleFilter) => {
    setRoleFilter(role)
    setCurrentPage(0)
  }

  const handleKeywordChange = (newKeyword: string) => {
    setKeyword(newKeyword)
    setCurrentPage(0)
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-foreground text-2xl font-bold">회원 관리</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard title="전체 회원" value={stats.all} icon={LuList} />
        <StatCard title="일반 회원" value={stats.user} icon={LuUser} />
        <StatCard title="기관 회원" value={stats.organization} icon={LuBuilding} />
        <StatCard title="관리자" value={stats.admin} icon={LuShield} />
      </div>

      <MemberFilter
        currentRole={roleFilter}
        keyword={keyword}
        onRoleChange={handleRoleChange}
        onKeywordChange={handleKeywordChange}
        searchPlaceholder="이름, 닉네임, 이메일 검색..."
      />

      <MemberTable members={paginatedMembers} isLoading={isLoading} currentPage={currentPage} pageSize={PAGE_SIZE} />

      <ApprovalPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}
