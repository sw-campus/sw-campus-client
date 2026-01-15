'use client'

import { useEffect, useState } from 'react'

import { usePathname } from 'next/navigation'
import { RiKakaoTalkFill } from 'react-icons/ri'

import { useCartLecturesQuery } from '@/features/cart/hooks/useCartLecturesQuery'
import { useAuthStore } from '@/store/authStore'

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
const KAKAO_CHANNEL_ID = '_aGLgn'

export default function KakaoChannelButton() {
  const [isKakaoReady, setIsKakaoReady] = useState(false)
  const pathname = usePathname()

  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const { data: cartItems } = useCartLecturesQuery()
  const hasCartItems = isLoggedIn && cartItems && cartItems.length > 0

  // AI 비교 페이지에서는 버튼 위치를 위로 올림
  const isComparePage = pathname?.includes('/cart/compare')

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.7/kakao.min.js'
    script.async = true
    script.integrity = 'sha384-tJkjbtDbvoxO+diRuDtwRO9JXR7pjWnfjfRn5ePUpl7e7RJCxKCwwnfqUAdXh53p'
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized() && KAKAO_JAVASCRIPT_KEY) {
        window.Kakao.init(KAKAO_JAVASCRIPT_KEY)
        setIsKakaoReady(true)
      }
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const handleOpenChat = () => {
    if (isKakaoReady && window.Kakao) {
      window.Kakao.Channel.chat({
        channelPublicId: KAKAO_CHANNEL_ID,
      })
    } else {
      // SDK 로드 실패 시 직접 URL로 이동
      window.open(`https://pf.kakao.com/${KAKAO_CHANNEL_ID}/chat`, '_blank')
    }
  }

  // AI 버튼과 같은 높이에 왼쪽에 배치 (AI: bottom-10, 90px 버튼)
  // 모바일: bottom-36 (AI와 같은 위치), 카트 있으면 위로
  // PC: bottom-12 (AI bottom-10 + 약간 정렬)

  return (
    <button
      onClick={handleOpenChat}
      className="fixed right-4 bottom-20 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl md:right-32 md:bottom-12"
      aria-label="카카오톡 상담하기"
      title="카카오톡으로 상담하기"
    >
      <RiKakaoTalkFill className="text-[#391B1B]" size={32} />
    </button>
  )
}
