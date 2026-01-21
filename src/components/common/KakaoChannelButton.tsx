'use client'

import Script from 'next/script'

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

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.7/kakao.min.js"
        integrity="sha384-tJkjbtDbvoxO+diRuDtwRO9JXR7pjWnfjfRn5ePUpl7e7RJCxKCwwnfqUAdXh53p"
        crossOrigin="anonymous"
        onLoad={handleKakaoLoad}
        strategy="afterInteractive"
      />
      <div id="kakao-chat-channel-button" className="fixed right-4 bottom-20 z-50 md:right-32 md:bottom-12" />
    </>
  )
}
