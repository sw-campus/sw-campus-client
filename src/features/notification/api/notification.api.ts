import { api } from '@/lib/axios'

export type NotificationType = 'COMMENT' | 'REPLY'

export interface Notification {
  id: number
  type: NotificationType
  targetId: number // 댓글 ID
  postId: number // 게시글 ID
  senderId: number
  senderNickname: string
  read: boolean
  createdAt: string
}

export interface NotificationListResponse {
  notifications: Notification[]
  unreadCount: number
}

export async function getNotifications(): Promise<NotificationListResponse> {
  const { data } = await api.get<NotificationListResponse>('/notifications')
  return data
}

export async function getUnreadCount(): Promise<number> {
  const { data } = await api.get<number>('/notifications/unread-count')
  return data
}

export async function markAsRead(notificationId: number): Promise<void> {
  await api.patch(`/notifications/${notificationId}/read`)
}

export async function markAllAsRead(): Promise<void> {
  await api.patch('/notifications/read-all')
}
