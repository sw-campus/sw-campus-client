'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiBell, FiCheckCircle, FiMessageSquare, FiCornerDownRight, FiInbox, FiChevronDown } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import type { Notification, NotificationType } from '../api/notification.api'
import {
  useNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from '../hooks/use-notifications-query'
import { useSSE } from '../hooks/use-sse'

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'COMMENT':
      return FiMessageSquare
    case 'REPLY':
      return FiCornerDownRight
    default:
      return FiMessageSquare
  }
}

function getNotificationMessage(type: NotificationType, senderNickname: string): string {
  switch (type) {
    case 'COMMENT':
      return `${senderNickname}님이 댓글을 달았습니다.`
    case 'REPLY':
      return `${senderNickname}님이 답글을 달았습니다.`
    default:
      return '새 알림이 있습니다.'
  }
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / (1000 * 60))
  const diffHour = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMin < 1) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay < 7) return `${diffDay}일 전`
  return date.toLocaleDateString('ko-KR')
}

function NotificationItem({
  notification,
  onMarkAsRead,
}: {
  notification: Notification
  onMarkAsRead: (id: number) => void
}) {
  const router = useRouter()
  const icon = getNotificationIcon(notification.type)

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }
    // postId가 있으면 해당 댓글로, 없으면 게시글로 이동
    if (notification.postId) {
      const targetUrl = `/community/${notification.postId}#comment-${notification.targetId}`
      const currentPath = window.location.pathname

      // 이미 같은 게시글 페이지에 있으면 직접 스크롤 (해시 변경 없이)
      if (currentPath === `/community/${notification.postId}`) {
        setTimeout(() => {
          const element = document.getElementById(`comment-${notification.targetId}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            element.classList.add('animate-highlight')
            setTimeout(() => {
              element.classList.remove('animate-highlight')
            }, 2500)
          }
        }, 150)
      } else {
        router.push(targetUrl, { scroll: false })
      }
    } else {
      router.push(`/community/${notification.targetId}`)
    }
  }

  return (
    <DropdownMenuItem
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors',
        !notification.read
          ? 'bg-primary/5 hover:bg-primary/10'
          : 'hover:bg-muted/50'
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full',
          !notification.read
            ? 'bg-primary/10 text-primary'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {icon({ className: 'size-4' })}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'line-clamp-2 text-sm leading-snug',
              !notification.read ? 'font-medium text-foreground' : 'text-muted-foreground'
            )}
          >
            {getNotificationMessage(notification.type, notification.senderNickname)}
          </p>
          {!notification.read && (
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <span className="mt-1 block text-xs text-muted-foreground">
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>
    </DropdownMenuItem>
  )
}

const NOTIFICATIONS_PER_PAGE = 10

export function NotificationDropdown() {
  // SSE 연결
  useSSE()

  const [displayCount, setDisplayCount] = useState(NOTIFICATIONS_PER_PAGE)
  const { data, isLoading } = useNotificationsQuery()
  const { mutate: markAsRead } = useMarkAsReadMutation()
  const { mutate: markAllAsRead } = useMarkAllAsReadMutation()

  const notifications = data?.notifications ?? []
  const unreadCount = data?.unreadCount ?? 0
  const displayedNotifications = notifications.slice(0, displayCount)
  const hasMore = notifications.length > displayCount

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDisplayCount(NOTIFICATIONS_PER_PAGE)
    }
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative rounded-full p-1.5 transition-colors hover:bg-muted"
              aria-label="알림"
            >
              <FiBell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white ring-2 ring-background">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">알림</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold">알림</span>
            {unreadCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => markAllAsRead()}
            >
              <FiCheckCircle className="mr-1 size-3" />
              모두 읽음
            </Button>
          )}
        </DropdownMenuLabel>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <div className="size-5 animate-spin rounded-full border-2 border-muted border-t-primary" />
              <span className="text-sm text-muted-foreground">불러오는 중...</span>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <FiInbox className="size-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">알림이 없습니다</p>
              <p className="mt-0.5 text-xs text-muted-foreground/70">
                새로운 알림이 오면 여기에 표시됩니다
              </p>
            </div>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto p-1">
            {displayedNotifications.map((notification, index) => (
              <div key={notification.id}>
                <NotificationItem
                  notification={notification}
                  onMarkAsRead={(id) => markAsRead(id)}
                />
                {index < displayedNotifications.length - 1 && (
                  <DropdownMenuSeparator className="mx-3 my-1" />
                )}
              </div>
            ))}
            {hasMore && (
              <button
                type="button"
                className="flex w-full items-center justify-center gap-1 border-t py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                onClick={() => setDisplayCount((prev) => prev + NOTIFICATIONS_PER_PAGE)}
              >
                <FiChevronDown className="size-4" />
                더보기 ({notifications.length - displayCount}개 남음)
              </button>
            )}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
