'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { env } from '@/lib/env'
import { useAuthStore } from '@/store/auth-store'

import type { Notification } from '../api/notification.api'

const MAX_RETRY_COUNT = 3
const RETRY_DELAY = 5000

export function useSSE() {
  const { isLoggedIn } = useAuthStore()
  const queryClient = useQueryClient()
  const eventSourceRef = useRef<EventSource | null>(null)
  const isCleaningUpRef = useRef(false)
  const retryCountRef = useRef(0)

  useEffect(() => {
    if (!isLoggedIn) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      return
    }

    isCleaningUpRef.current = false
    retryCountRef.current = 0

    const connect = () => {
      if (isCleaningUpRef.current) return

      const url = `${env.NEXT_PUBLIC_API_URL}/notifications/stream`
      const eventSource = new EventSource(url, { withCredentials: true })
      eventSourceRef.current = eventSource

      eventSource.addEventListener('connect', () => {
        // 연결 성공 시 재시도 횟수 초기화
        retryCountRef.current = 0
      })

      eventSource.addEventListener('notification', (event) => {
        try {
          const notification: Notification = JSON.parse(event.data)

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

          queryClient.setQueryData<number>(['notifications', 'unreadCount'], (old) => (old ?? 0) + 1)
        } catch (e) {
          console.error('Failed to parse notification:', e)
        }
      })

      eventSource.onerror = () => {
        eventSource.close()

        // cleanup 중이면 재연결하지 않음
        if (isCleaningUpRef.current) return

        retryCountRef.current += 1

        // 최대 재시도 횟수 초과 시에만 에러 출력
        if (retryCountRef.current >= MAX_RETRY_COUNT) {
          console.error('SSE connection failed after multiple retries')
          return
        }

        // 재연결 시도
        setTimeout(connect, RETRY_DELAY)
      }
    }

    connect()

    return () => {
      isCleaningUpRef.current = true
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [isLoggedIn, queryClient])
}
