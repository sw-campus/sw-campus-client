'use client'

import { useState } from 'react'

import { LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiChevronDown, FiChevronRight, FiX } from 'react-icons/fi'

import type { MobileNavTabs } from '@/features/navigation/components/navigation-menu.model'
import type { MobileNavGroup, NavLinkItem } from '@/features/navigation/types/navigation-menu.types'

type Props = {
  open: boolean
  onClose: () => void
  items: MobileNavTabs
  isLoggedIn?: boolean
  nickname?: string | null
  mypageHref?: string
  onLogout?: () => void
  isLoggingOut?: boolean
}

// 중분류 아이템 (소분류가 있으면 펼칠 수 있음)
function SubAccordionItem({
  item,
  onClose,
}: {
  item: { title: string; href: string; items: NavLinkItem[] }
  onClose: () => void
}) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.items && item.items.length > 0
  const isActive = item.href ? pathname.startsWith(item.href.split('?')[0]) : false

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className={`block rounded py-1.5 ${isActive ? 'bg-gray-100 text-gray-700' : 'text-gray-600'}`}
        onClick={onClose}
      >
        {item.title}
      </Link>
    )
  }

  return (
    <div>
      <div
        className={`flex w-full items-center justify-between rounded py-1.5 ${isOpen || isActive ? 'bg-gray-100 text-gray-700' : 'text-gray-600'}`}
      >
        <Link href={item.href} className="flex-1" onClick={onClose}>
          {item.title}
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-200"
        >
          <FiChevronRight className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} size={16} />
        </button>
      </div>
      {isOpen && (
        <div className="ml-2 flex flex-col gap-1 border-l border-gray-200 pb-1 pl-3">
          {item.items.map(subItem => (
            <Link
              key={subItem.title}
              href={subItem.href}
              className="block py-1 text-sm text-gray-500"
              onClick={onClose}
            >
              {subItem.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function AccordionMenu({
  group,
  onClose,
  isOpen,
  onToggle,
}: {
  group: MobileNavGroup
  onClose: () => void
  isOpen: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()
  const hasChildren = group.items && group.items.length > 0
  const isActive = group.href ? pathname.startsWith(group.href.split('?')[0]) : false
  // 하위 항목 중 하나라도 현재 경로와 일치하면 활성화
  const hasActiveChild =
    hasChildren && group.items.some(child => (child.href ? pathname.startsWith(child.href.split('?')[0]) : false))

  if (!hasChildren) {
    return (
      <Link
        href={group.href || '#'}
        className={`block py-3 font-semibold ${isActive ? 'text-brand-gold' : 'text-gray-900'}`}
        onClick={onClose}
      >
        {group.title}
      </Link>
    )
  }

  return (
    <div>
      <div
        className={`flex w-full items-center justify-between py-3 font-semibold ${isOpen || hasActiveChild ? 'text-brand-gold' : 'text-gray-900'}`}
      >
        <Link href={group.href || '#'} className="flex-1" onClick={onClose}>
          {group.title}
        </Link>
        <button
          onClick={onToggle}
          className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
        >
          <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
        </button>
      </div>
      {isOpen && (
        <div className="ml-2 flex flex-col gap-1 border-l border-gray-200 pb-2 pl-4">
          {group.items.map(child => (
            <SubAccordionItem key={child.title} item={child} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  )
}

export function NavigationMenuMobileOverlay({
  open,
  onClose,
  items,
  isLoggedIn,
  nickname: _nickname,
  mypageHref,
  onLogout,
  isLoggingOut,
}: Props) {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)

  if (!open) return null

  // 강의 카테고리들(부트캠프 등) + 훈련기관 + 커뮤니티 항목들을 하나로 합침
  const allMenuItems: MobileNavGroup[] = [
    ...items.lectures,
    { title: '훈련기관', href: '/organizations', items: [] },
    { title: '부트캠프 비교', href: '/cart/compare', items: [] },
    ...items.community,
  ]

  return (
    <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm md:hidden" onClick={onClose}>
      <div
        className="absolute top-0 left-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <span className="text-lg font-bold text-gray-900">메뉴</span>
          <button onClick={onClose} className="rounded-full p-1">
            <FiX size={24} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <div className="divide-y divide-gray-100">
            {allMenuItems.map((group, idx) => (
              <AccordionMenu
                key={idx}
                group={group}
                onClose={onClose}
                isOpen={openMenuIndex === idx}
                onToggle={() => setOpenMenuIndex(openMenuIndex === idx ? null : idx)}
              />
            ))}
          </div>
        </div>

        {/* 푸터 - 마이페이지 | 로그아웃 */}
        <div className="border-t border-gray-100 px-6 py-4">
          {isLoggedIn ? (
            <div className="flex items-center justify-center gap-6">
              <Link
                href={mypageHref || '/mypage'}
                className="flex items-center gap-1 text-sm text-gray-500"
                onClick={onClose}
              >
                <User size={16} />
                마이페이지
              </Link>
              <div className="h-3 w-px bg-gray-300" />
              <button
                onClick={onLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-1 text-sm text-gray-500 disabled:opacity-50"
              >
                <LogOut size={16} />
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/login" className="block text-center text-sm text-gray-500" onClick={onClose}>
              로그인
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
