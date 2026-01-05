'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import { SidebarMenuItem } from '..'

const menuItems: SidebarMenuItem[] = [
  { label: '대시보드', href: '/admin' },
  { label: '회원관리', href: '/admin/members' },
  { label: '기관 회원', href: '/admin/organization-members' },
  { label: '강의관리', href: '/admin/lectures' },
  { label: '배너관리', href: '/admin/banners' },
  { label: '수료증', href: '/admin/certificates' },
  { label: '리뷰관리', href: '/admin/reviews' },
  { label: '테스트 데이터', href: '/admin/test-data' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => (href === '/admin' ? pathname === href : pathname.startsWith(href))

  return (
    <>
      {/* Mobile: Horizontal Scrollable Tabs */}
      <div className="-mx-4 mb-4 overflow-x-auto px-4 scrollbar-hide lg:hidden">
        <nav className="flex gap-2 whitespace-nowrap">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop: Vertical Sidebar */}
      <aside className="border-border bg-card hidden w-56 shrink-0 flex-col rounded-lg border lg:flex xl:w-64">
        <div className="border-border border-b p-4 xl:p-6">
          <h1 className="text-foreground text-base font-bold xl:text-lg">관리자 페이지</h1>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3 xl:p-4">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors xl:px-4 xl:py-3',
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
