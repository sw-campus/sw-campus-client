'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { env } from '@/lib/env'
import { useAuthStore } from '@/store/auth-store'

import type { Notification } from '../api/notification.api'

export function useSSE() {
  const { isLoggedIn } = useAuthStore()
  const queryClient = useQueryClient()
  const eventSourceRef = useRef<EventSource | null>(null)
  const isCleaningUpRef = useRef(false)

  useEffect(() => {
    isCleaningUpRef.current = false

    if (!isLoggedIn) {
      // 로그아웃 시 연결 종료
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      return
    }

    // SSE 연결
    const url = `${env.NEXT_PUBLIC_API_URL}/notifications/stream`
    const eventSource = new EventSource(url, { withCredentials: true })
    eventSourceRef.current = eventSource

    eventSource.addEventListener('connect', () => {
      // SSE 연결 성공
    })

    eventSource.addEventListener('notification', (event) => {
      try {
        const notification: Notification = JSON.parse(event.data)

        // React Query 캐시 업데이트
        queryClient.setQueryData<{ notifications: Notification[]; unreadCount: number }>(
          ['notifications'],
          (old) => {
            if (!old) return { notifications: [notification], unreadCount: 1 }
            return {
              notifications: [notification, ...old.notifications],
              unreadCount: old.unreadCount + 1,
            }
          }
        )

        // unreadCount 캐시도 업데이트
        queryClient.setQueryData<number>(['notifications', 'unreadCount'], (old) => (old ?? 0) + 1)
      } catch (e) {
        console.error('Failed to parse notification:', e)
      }
    })

    eventSource.onerror = () => {
      // cleanup으로 인한 종료는 에러 로그 출력하지 않음
      if (isCleaningUpRef.current) return

      console.error('SSE connection error, reconnecting...')
      eventSource.close()

      // 5초 후 재연결 시도
      setTimeout(() => {
        if (isLoggedIn && eventSourceRef.current === eventSource) {
          eventSourceRef.current = null
        }
      }, 5000)
    }

    return () => {
      isCleaningUpRef.current = true
      eventSource.close()
      eventSourceRef.current = null
    }
  }, [isLoggedIn, queryClient])
}
