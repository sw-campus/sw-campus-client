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
        chat: (options: { channelPublicId: string }) => void
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
  const [isReady, setIsReady] = useState(false)

  // 로그인/회원가입 페이지에서는 숨김
  const isHiddenPage = pathname === '/login' || pathname?.startsWith('/signup')

  const handleKakaoLoad = () => {
    if (window.Kakao && !window.Kakao.isInitialized() && KAKAO_JAVASCRIPT_KEY) {
      window.Kakao.init(KAKAO_JAVASCRIPT_KEY)
    }
    if (window.Kakao?.isInitialized()) {
      setIsReady(true)
    }
  }

  const handleClick = () => {
    if (window.Kakao?.isInitialized() && KAKAO_CHANNEL_ID) {
      window.Kakao.Channel.chat({ channelPublicId: KAKAO_CHANNEL_ID })
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

  if (isHiddenPage) {
    return null
  }

  // 위치 스타일 계산
  const getPositionStyle = (): React.CSSProperties => {
    if (isDesktop) {
      // PC: 동적 위치 또는 오른쪽 고정
      return pcLeftPosition
        ? { left: pcLeftPosition, bottom: 40 }
        : { right: 40, bottom: 40 }
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
      {isReady && (
        <button
          type="button"
          onClick={handleClick}
          className="fixed z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
          style={{ ...getPositionStyle(), backgroundColor: '#FEE500' }}
          aria-label="카카오톡 상담"
          title="카카오톡 상담"
        >
          {/* 카카오톡 말풍선 아이콘 */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3C6.48 3 2 6.58 2 11C2 13.77 3.8 16.19 6.5 17.59L5.5 21L9.5 18.5C10.3 18.67 11.14 18.76 12 18.76C17.52 18.76 22 15.18 22 10.76C22 6.34 17.52 3 12 3Z"
              fill="#3C1E1E"
            />
          </svg>
        </button>
      )}
    </>
  )
}
