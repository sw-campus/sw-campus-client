'use client'

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

  // 데스크탑: 고정 위치
  // 모바일: 플로팅 바 바로 위 (위로가기 버튼 아래)
  const getBottomPosition = () => {
    if (isDesktop) return 40 // 데스크탑: 아래쪽
    return isFloatingBarOpen ? 195 : 60
  }

  const getRightPosition = () => {
    if (isDesktop) return 32 // xl:right-8 = 32px
    return 16 // right-4 = 16px
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
        style={{ bottom: getBottomPosition(), right: getRightPosition() }}
      />
    </>
  )
}
