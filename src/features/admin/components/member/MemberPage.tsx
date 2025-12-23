'use client'

import { useState } from 'react'

import { LuBuilding, LuList, LuShield, LuUser } from 'react-icons/lu'

import { useMembersQuery, useMemberStatsQuery } from '../../hooks/useMembers'
import type { MemberRole, MemberRoleFilter } from '../../types/member.type'
import { ApprovalPagination } from '../common/ApprovalPagination'
import { ColorfulStatCard } from '../common/ColorfulStatCard'
import { MemberFilter } from './MemberFilter'
import { MemberTable } from './MemberTable'

const PAGE_SIZE = 10

// 통계 카드 설정
const STAT_CARDS = [
  {
    key: 'total' as const,
    title: '전체 회원',
    icon: LuList,
    bgColor: 'bg-gradient-to-br from-gray-500 to-gray-600',
  },
  {
    key: 'user' as const,
    title: '일반 회원',
    icon: LuUser,
    bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
  },
  {
    key: 'organization' as const,
    title: '기관 회원',
    icon: LuBuilding,
    bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
  },
  {
    key: 'admin' as const,
    title: '관리자',
    icon: LuShield,
    bgColor: 'bg-gradient-to-br from-amber-500 to-amber-600',
  },
]

export function MemberPage() {
  const [roleFilter, setRoleFilter] = useState<MemberRoleFilter>('ALL')
  const [keyword, setKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  // Role을 API 파라미터로 변환
  const apiRole: MemberRole | undefined = roleFilter === 'ALL' ? undefined : roleFilter

  // 서버 사이드 필터링 및 페이지네이션
  const { data: pageData, isLoading } = useMembersQuery(apiRole, keyword, currentPage, PAGE_SIZE)

  // 서버 API로 통계 조회
  const { data: statsData } = useMemberStatsQuery()

  const totalPages = pageData?.page?.totalPages ?? 0

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

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STAT_CARDS.map(card => (
          <ColorfulStatCard
            key={card.key}
            title={card.title}
            value={statsData?.[card.key] ?? 0}
            icon={card.icon}
            bgColor={card.bgColor}
          />
        ))}
      </div>

      <MemberFilter
        currentRole={roleFilter}
        keyword={keyword}
        onRoleChange={handleRoleChange}
        onKeywordChange={handleKeywordChange}
        searchPlaceholder="이름, 닉네임, 이메일 검색..."
      />

      <MemberTable
        members={pageData?.content ?? []}
        isLoading={isLoading}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
      />

      <ApprovalPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}
