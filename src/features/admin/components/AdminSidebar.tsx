'use client'

import { SidebarMenuItem } from '..'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const menuItems: SidebarMenuItem[] = [
  { label: '대시보드', href: '/admin' },
  { label: '회원관리', href: '/admin/members' },
  { label: '기관 회원 관리', href: '/admin/organization-members' },
  { label: '강의관리', href: '/admin/lectures' },
  { label: '배너관리', href: '/admin/banners' },
  { label: '수료증관리', href: '/admin/certificates' },
  { label: '리뷰관리', href: '/admin/reviews' },
  { label: '테스트 데이터', href: '/admin/test-data' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="border-border bg-card flex w-64 shrink-0 flex-col rounded-lg border">
      <div className="border-border border-b p-6">
        <h1 className="text-foreground text-lg font-bold">관리자 페이지</h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {menuItems.map(item => {
          const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
