'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'

import { useLogout } from '@/features/auth/hooks/use-logout'
import { useCategoryTree } from '@/features/category'
import { type BoardCategory } from '@/features/community'
import { useBoardCategories } from '@/features/community/hooks'
import { Navigation } from '@/features/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useDesktopNavigationStore } from '@/store/navigation.store'
import type { NavCategoryItem } from '@/components/layout/header/header'

export function MypageHeaderSection() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { isLoggedIn, nickname, userType } = useAuthStore()
  const { logout, isPending: isLoggingOut } = useLogout()

  const mypageHref =
    userType === 'ADMIN' ? '/mypage/admin' : userType === 'ORGANIZATION' ? '/mypage/organization' : '/mypage/personal'

  const handleLogout = async () => {
    try {
      await logout()
      setOpen(false)
      router.push('/')
    } catch (e) {
      console.error(e)
    }
  }

  const { data: categoryTree } = useCategoryTree()
  const { data: boardCategories } = useBoardCategories()
  const hideDesktopNav = useDesktopNavigationStore(state => state.hideDesktopNav)

  const mapBoardToNav = (category: BoardCategory): NavCategoryItem => ({
    categoryId: category.id,
    categoryName: category.name,
    sort: 999,
    children: category.children.map(mapBoardToNav),
    type: 'BOARD' as const,
    link: category.children.length === 0
      ? `/community?categoryId=${category.id}`
      : '/community',
  })

  const mergedCategories: NavCategoryItem[] = [
    ...(categoryTree || []).map(c => ({ ...c, type: 'LECTURE' as const })),
    ...(boardCategories || []).map(mapBoardToNav),
  ]

  return (
    <>
      {/* 모바일 전용 헤더 - 햄버거 + 로고만 */}
      <header className="md:hidden bg-[#262626] flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          className="text-white"
          onClick={() => setOpen(true)}
          aria-label="메뉴 열기"
        >
          <Menu size={28} />
        </button>
        <Link href={userType === 'ADMIN' ? '/admin' : '/'}>
          <Image
            src="/images/logo.png"
            alt="SOFTWARE CAMPUS 로고"
            width={36}
            height={36}
            className="size-9 object-contain brightness-0 invert"
            priority
          />
        </Link>
      </header>

      <Navigation
        open={open}
        onClose={() => {
          setOpen(false)
          hideDesktopNav()
        }}
        onDesktopEnter={undefined}
        onDesktopLeave={() => hideDesktopNav()}
        categories={mergedCategories}
        isLoggedIn={isLoggedIn}
        nickname={nickname}
        mypageHref={mypageHref}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        isHome={false}
      />
    </>
  )
}
