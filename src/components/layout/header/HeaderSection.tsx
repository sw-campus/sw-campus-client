'use client'

import { useState } from 'react'

import { usePathname } from 'next/navigation'

import Header, { NavCategoryItem } from '@/components/layout/header/Header'
import { useCategoryTree } from '@/features/category'
import { type BoardCategory } from '@/features/community'
import { useBoardCategories } from '@/features/community/hooks'
import { Navigation } from '@/features/navigation'
import { useDesktopNavigationStore } from '@/store/navigation.store'

export default function HeaderSection() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const { data: categoryTree } = useCategoryTree()
  const { data: boardCategories } = useBoardCategories()
  const setActiveMenu = useDesktopNavigationStore(state => state.setActiveMenu)
  const hideDesktopNav = useDesktopNavigationStore(state => state.hideDesktopNav)

  // 로그인/회원가입 페이지에서는 헤더 숨김
  if (pathname === '/login' || pathname.startsWith('/signup')) return null

  // 게시판 카테고리를 네비게이션 아이템으로 변환하는 재귀 함수
  const mapBoardToNav = (category: BoardCategory): NavCategoryItem => ({
    categoryId: category.id,
    categoryName: category.name,
    sort: 999,
    children: category.children.map(mapBoardToNav),
    type: 'BOARD' as const,
    // 각 카테고리별 링크로 분리 (자식이 없으면 해당 카테고리로, 있으면 전체 커뮤니티로)
    link: category.children.length === 0 
      ? `/community?categoryId=${category.id}` 
      : '/community',
  })

  // 카테고리 병합
  const mergedCategories: NavCategoryItem[] = [
    ...(categoryTree || []).map(c => ({ ...c, type: 'LECTURE' as const })),
    ...(boardCategories || []).map(mapBoardToNav),
  ]

  const handleCategoryEnter = (categoryId: number) => {
    setActiveMenu(categoryId)
  }

  const handleOtherNavEnter = () => {
    setActiveMenu(null)
  }

  const handleDesktopLeave = () => {
    hideDesktopNav()
  }

  return (
    <div className="relative">
      <Header
        categories={mergedCategories}
        onOpenNav={() => setOpen(true)}
        onCategoryEnter={handleCategoryEnter}
        onOtherNavEnter={handleOtherNavEnter}
      />
      <Navigation
        open={open}
        onClose={() => {
          setOpen(false)
          hideDesktopNav()
        }}
        onDesktopEnter={undefined}
        onDesktopLeave={handleDesktopLeave}
        categories={mergedCategories}
      />
    </div>
  )
}
