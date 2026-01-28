'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiBell, FiCheckCircle, FiMessageSquare, FiCornerDownRight, FiInbox, FiChevronDown, FiTrash2 } from 'react-icons/fi'
import { toast } from 'sonner'

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
import { formatRelativeTime } from '@/lib/format-relative-time'
import { cn } from '@/lib/utils'

import type { Notification, NotificationType } from '../api/notification.api'
import {
  useNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from '../hooks/use-notifications-query'
import { useSSE } from '../hooks/use-sse'

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

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification
  onMarkAsRead: (id: number) => void
  onDelete: (id: number) => void
}) {
  const router = useRouter()

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }
    if (notification.postId) {
      const targetUrl = `/community/${notification.postId}#comment-${notification.targetId}`
      const currentPath = window.location.pathname

      if (currentPath === `/community/${notification.postId}`) {
        setTimeout(() => {
          // 게시글이 삭제되어 에러 페이지가 표시된 경우 토스트 생략
          const postArticle = document.querySelector('article')
          if (!postArticle) return

          const element = document.getElementById(`comment-${notification.targetId}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            element.classList.add('animate-highlight')
            setTimeout(() => {
              element.classList.remove('animate-highlight')
            }, 2500)
          } else {
            toast.info('삭제된 댓글입니다.')
          }
        }, 150)
      } else {
        router.push(targetUrl, { scroll: false })
      }
    } else {
      router.push(`/community/${notification.targetId}`)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(notification.id)
  }

  return (
    <DropdownMenuItem
      className={cn(
        'group flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors',
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
        {notification.type === 'REPLY' ? (
          <FiCornerDownRight className="size-4" />
        ) : (
          <FiMessageSquare className="size-4" />
        )}
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
          <div className="flex shrink-0 items-center gap-1">
            {!notification.read && (
              <span className="mt-1.5 size-2 rounded-full bg-primary" />
            )}
            <button
              type="button"
              onClick={handleDelete}
              className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
              aria-label="알림 삭제"
            >
              <FiTrash2 className="size-3.5" />
            </button>
          </div>
        </div>
        <span className="mt-1 block text-xs text-muted-foreground">
          {formatRelativeTime(new Date(notification.createdAt))}
        </span>
      </div>
    </DropdownMenuItem>
  )
}

const NOTIFICATIONS_PER_PAGE = 10

interface NotificationDropdownProps {
  isMobile?: boolean
}

export function NotificationDropdown({ isMobile = false }: NotificationDropdownProps) {
  useSSE()

  const [displayCount, setDisplayCount] = useState(NOTIFICATIONS_PER_PAGE)
  const { data, isLoading } = useNotificationsQuery()
  const { mutate: markAsRead } = useMarkAsReadMutation()
  const { mutate: markAllAsRead } = useMarkAllAsReadMutation()
  const { mutate: deleteNotification } = useDeleteNotificationMutation()

  const notifications = data?.notifications ?? []
  const unreadCount = data?.unreadCount ?? 0
  const displayedNotifications = notifications.slice(0, displayCount)
  const hasMore = notifications.length > displayCount

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDisplayCount(NOTIFICATIONS_PER_PAGE)
    }
  }

  const triggerButton = (
    <button
      type="button"
      className={cn(
        'relative rounded-full p-1.5 transition hover:opacity-80'
      )}
      aria-label="알림"
    >
      <FiBell className="size-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white ring-2 ring-background">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  )

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      {isMobile ? (
        <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-semibold">알림</p>
          </TooltipContent>
        </Tooltip>
      )}

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
                  onDelete={(id) => deleteNotification(id)}
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
