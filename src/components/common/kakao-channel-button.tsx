'use client'

import { useEffect, useState } from 'react'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

import { useFloatingBarStore } from '@/store/floating-bar.store'
import { useMediaQuery } from '@/hooks/use-media-query'

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void
      isInitialized: () => boolean
      Channel: {
        createChatButton: (options: { container: string; channelPublicId: string }) => void
      }
    }
  }
}

const KAKAO_JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY
const KAKAO_CHANNEL_ID = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_ID

export default function KakaoChannelButton() {
  const pathname = usePathname()
  const isFloatingBarOpen = useFloatingBarStore((state) => state.isOpen)
  const isDesktop = useMediaQuery('(min-width: 1280px)')
  const [pcLeftPosition, setPcLeftPosition] = useState<number | null>(null)

  // 로그인/회원가입 페이지에서는 숨김
  if (pathname === '/login' || pathname?.startsWith('/signup')) {
    return null
  }

  const handleKakaoLoad = () => {
    if (window.Kakao && !window.Kakao.isInitialized() && KAKAO_JAVASCRIPT_KEY) {
      window.Kakao.init(KAKAO_JAVASCRIPT_KEY)
    }

    // SDK 초기화 후 채팅 버튼 생성
    if (window.Kakao?.isInitialized() && KAKAO_CHANNEL_ID) {
      window.Kakao.Channel.createChatButton({
        container: '#kakao-chat-channel-button',
        channelPublicId: KAKAO_CHANNEL_ID,
      })
    }
  }

  // PC 버전 동적 위치 계산 (본문 컨테이너 오른쪽 끝 기준 - 위로가기 버튼과 동일)
  useEffect(() => {
    const updatePosition = () => {
      const mainContent = document.querySelector('[data-main-content]') as HTMLElement
      if (mainContent) {
        const rect = mainContent.getBoundingClientRect()
        setPcLeftPosition(rect.right + 12)
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)

    const observer = new MutationObserver(updatePosition)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('resize', updatePosition)
      observer.disconnect()
    }
  }, [])

  // 위치 스타일 계산
  const getPositionStyle = (): React.CSSProperties => {
    if (isDesktop && pcLeftPosition) {
      // PC: 위로가기 버튼과 같은 가로 위치
      return { left: pcLeftPosition, bottom: 40 }
    }
    // 모바일: 오른쪽 고정
    return { right: 16, bottom: isFloatingBarOpen ? 195 : 60 }
  }

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.7/kakao.min.js"
        integrity="sha384-tJkjbtDbvoxO+diRuDtwRO9JXR7pjWnfjfRn5ePUpl7e7RJCxKCwwnfqUAdXh53p"
        crossOrigin="anonymous"
        onLoad={handleKakaoLoad}
        strategy="lazyOnload"
      />
      <div
        id="kakao-chat-channel-button"
        className="fixed z-50 transition-all duration-300"
        style={getPositionStyle()}
      />
    </>
  )
}
