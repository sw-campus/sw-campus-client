'use client'

import { useState } from 'react'

import Link from 'next/link'
import { FiX } from 'react-icons/fi'

import type { MobileNavTabs } from '@/features/navigation/components/navigation-menu.model'
import type { MobileNavGroup } from '@/features/navigation/types/navigation-menu.types'

type Props = {
  open: boolean
  onClose: () => void
  items: MobileNavTabs
}

function NavGroupList({ groups, onClose }: { groups: MobileNavGroup[]; onClose: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      {groups.map((item, idx) => (
        <div key={idx}>
          {item.href ? (
            <Link
              href={item.href}
              className="mb-2 block font-semibold text-gray-900 hover:text-orange-500"
              onClick={onClose}
            >
              {item.title}
            </Link>
          ) : (
            <div className="mb-2 font-semibold">{item.title}</div>
          )}
          <div className="ml-2 flex flex-col gap-2">
            {item.items.map(child => (
              <div key={child.title} className="flex flex-col gap-1">
                <Link
                  href={child.href}
                  className="font-medium text-gray-600 hover:text-orange-500"
                  onClick={onClose}
                >
                  {child.title}
                </Link>
                {child.items.length > 0 && (
                  <div className="ml-2 flex flex-col gap-1 border-l pl-2 text-sm text-gray-500">
                    {child.items.map(grandChild => (
                      <Link
                        key={grandChild.title}
                        href={grandChild.href}
                        className="hover:text-orange-500"
                        onClick={onClose}
                      >
                        {grandChild.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function NavigationMenuMobileOverlay({ open, onClose, items }: Props) {
  const [activeTab, setActiveTab] = useState<'lectures' | 'community'>('lectures')

  if (!open) return null

  const hasCommunity = items.community.length > 0

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

        {/* 탭 */}
        {hasCommunity && (
          <div className="flex border-b border-gray-100">
            <button
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'lectures'
                  ? 'border-b-2 border-orange-500 text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('lectures')}
            >
              강의
            </button>
            <button
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'community'
                  ? 'border-b-2 border-orange-500 text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('community')}
            >
              커뮤니티
            </button>
          </div>
        )}

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'lectures' ? (
            <>
              <NavGroupList groups={items.lectures} onClose={onClose} />
              {/* 훈련 기관 링크 */}
              <div className="mt-6 border-t border-gray-100 pt-6">
                <Link
                  href="/organizations"
                  className="font-semibold text-gray-800 hover:text-orange-500"
                  onClick={onClose}
                >
                  훈련 기관
                </Link>
              </div>
            </>
          ) : (
            <NavGroupList groups={items.community} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  )
}
