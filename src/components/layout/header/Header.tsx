'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BsCart4 } from 'react-icons/bs'
import { FiLogIn, FiUser, FiHeart, FiMenu, FiLogOut } from 'react-icons/fi'

import { HeaderIconAction } from '@/components/layout/header/HeaderIconAction'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useLogout } from '@/features/auth/hooks/useLogout'
import type { CategoryTreeNode } from '@/features/category'
import { useAuthStore } from '@/store/authStore'

export default function Header({
  categories,
  onOpenNav,
  onCategoryEnter,
  onOtherNavEnter,
}: {
  categories: CategoryTreeNode[]
  onOpenNav: () => void
  onCategoryEnter: (id: number) => void
  onOtherNavEnter: () => void
}) {
  const router = useRouter()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const { isLoggedIn, userName, userType } = useAuthStore()
  const { logout, isPending } = useLogout()

  const mypageHref = userType === 'ORGANIZATION' ? '/mypage/organization' : '/mypage/personal'

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logout() // 서버에서 쿠키 삭제 + 클라이언트 상태 초기화
      router.push('/') // 홈으로 이동 (프로그램적으로 네비게이션)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <header className="sticky top-0 z-50 mx-auto mt-6 flex w-full max-w-7xl items-center justify-between rounded-full border border-white/15 bg-white/10 px-10 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-8">
        {/* 햄버거 버튼 */}
        <button type="button" className="text-white md:hidden" onClick={onOpenNav}>
          <FiMenu size={22} />
        </button>

        {/* 로고 */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="SOFTWARE CAMPUS 로고"
            width={48}
            height={48}
            className="shrink-0 object-contain"
            priority
          />

          <div className="flex h-12 translate-y-px flex-col justify-center leading-none font-extrabold tracking-tight text-white">
            <span>SOFTWARE</span>
            <span>CAMPUS</span>
          </div>
        </Link>
      </div>

      <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-8 font-semibold text-white md:flex">
        {categories.map(category => (
          <Link
            key={category.categoryId}
            href={`/lectures/search?categoryIds=${category.categoryId}`}
            onMouseEnter={() => onCategoryEnter(category.categoryId)}
            onFocus={() => onCategoryEnter(category.categoryId)}
            onClick={() => onCategoryEnter(category.categoryId)}
          >
            {category.categoryName}
          </Link>
        ))}
        <Link href="/organizations" onMouseEnter={onOtherNavEnter} onFocus={onOtherNavEnter}>
          훈련 기관
        </Link>
      </nav>

      {/* 아이콘 */}
      <div className="flex items-center gap-6 text-xl text-white">
        {/* 로그인 여부에 따라 UI 변경 */}
        {isLoggedIn ? (
          <>
            {/* 로그인된 경우 */}
            <span className="text-base font-medium">{userName ?? '사용자'} 님</span>

            <HeaderIconAction
              kind="button"
              ariaLabel="로그아웃"
              tooltip="로그아웃"
              onClick={() => setLogoutOpen(true)}
              disabled={isPending}
            >
              <FiLogOut />
            </HeaderIconAction>

            <HeaderIconAction kind="link" ariaLabel="마이페이지" tooltip="마이페이지" href={mypageHref}>
              <FiUser />
            </HeaderIconAction>

            <HeaderIconAction kind="link" ariaLabel="위시리스트" tooltip="장바구니" href="/">
              <BsCart4 />
            </HeaderIconAction>
          </>
        ) : (
          <>
            {/* 로그인 안된 경우 */}
            <HeaderIconAction kind="link" ariaLabel="로그인" tooltip="로그인" href="/login">
              <FiLogIn />
            </HeaderIconAction>
            <HeaderIconAction kind="link" ariaLabel="마이페이지" tooltip="마이페이지" href="/login">
              <FiUser />
            </HeaderIconAction>
            <HeaderIconAction kind="link" ariaLabel="위시리스트" tooltip="장바구니" href="/login">
              <BsCart4 />
            </HeaderIconAction>
          </>
        )}
      </div>

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent>
          <DialogHeader className="gap-5">
            <DialogTitle>로그아웃</DialogTitle>
            <DialogDescription>장바구니에 있는 항목은 7일간 유지됩니다.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setLogoutOpen(false)}>
              취소
            </Button>
            <Button
              type="button"
              onClick={async () => {
                await handleLogout()
                setLogoutOpen(false)
              }}
              disabled={isPending}
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}
