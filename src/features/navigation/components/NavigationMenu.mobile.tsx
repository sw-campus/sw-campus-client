'use client'

import { useState } from 'react'

import Link from 'next/link'
import { FiChevronDown, FiChevronRight, FiX } from 'react-icons/fi'

import type { MobileNavTabs } from '@/features/navigation/components/navigation-menu.model'
import type { MobileNavGroup, NavLinkItem } from '@/features/navigation/types/navigation-menu.types'

type Props = {
  open: boolean
  onClose: () => void
  items: MobileNavTabs
}

// 중분류 아이템 (소분류가 있으면 펼칠 수 있음)
function SubAccordionItem({
  item,
  onClose,
}: {
  item: { title: string; href: string; items: NavLinkItem[] }
  onClose: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.items && item.items.length > 0

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className="block py-1.5 text-gray-600 hover:text-orange-500"
        onClick={onClose}
      >
        {item.title}
      </Link>
    )
  }

  return (
    <div>
      <button
        className="flex w-full items-center justify-between py-1.5 text-gray-600 hover:text-orange-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{item.title}</span>
        <FiChevronRight
          className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}
          size={16}
        />
      </button>
      {isOpen && (
        <div className="ml-2 flex flex-col gap-1 border-l border-gray-200 pl-3 pb-1">
          {item.items.map(subItem => (
            <Link
              key={subItem.title}
              href={subItem.href}
              className="block py-1 text-sm text-gray-500 hover:text-orange-500"
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
  const hasChildren = group.items && group.items.length > 0

  if (!hasChildren) {
    return (
      <Link
        href={group.href || '#'}
        className="block py-3 font-semibold text-gray-900 hover:text-orange-500"
        onClick={onClose}
      >
        {group.title}
      </Link>
    )
  }

  return (
    <div>
      <button
        className="flex w-full items-center justify-between py-3 font-semibold text-gray-900"
        onClick={onToggle}
      >
        <span>{group.title}</span>
        <FiChevronDown
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>
      {isOpen && (
        <div className="ml-2 flex flex-col gap-1 border-l border-gray-200 pl-4 pb-2">
          {group.items.map(child => (
            <SubAccordionItem key={child.title} item={child} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  )
}

export function NavigationMenuMobileOverlay({ open, onClose, items }: Props) {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)

  if (!open) return null

  // 강의 카테고리들(부트캠프 등) + 훈련기관 + 커뮤니티 항목들을 하나로 합침
  const allMenuItems: MobileNavGroup[] = [
    ...items.lectures,
    { title: '훈련기관', href: '/organizations', items: [] },
    ...items.community,
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden" onClick={onClose}>
      <div
        className="absolute top-0 left-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <span className="text-lg font-bold text-gray-900">메뉴</span>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
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
      </div>
    </div>
  )
}
