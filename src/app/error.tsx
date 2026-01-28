'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <>
      {/* 카카오톡 채널 버튼 숨김 */}
      <style>{`#kakao-chat-channel-button { display: none !important; }`}</style>

      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          {/* 500 Number */}
          <h1 className="bg-linear-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-7xl font-black text-transparent md:text-9xl">
            500
          </h1>

          {/* Message */}
          <h2 className="mt-4 text-xl font-bold text-gray-900 md:text-3xl">서버 오류가 발생했습니다</h2>
          <p className="mt-2 text-sm text-gray-400 md:text-base">일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-center gap-2 md:mt-10 md:gap-4">
            <Button
              className="h-10 bg-linear-to-r from-orange-500 to-red-500 px-4 text-xs font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 md:h-14 md:px-10 md:text-base"
              onClick={reset}
            >
              다시 시도
            </Button>
            <Button
              variant="ghost"
              className="h-10 bg-gray-100 px-4 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-200 hover:text-gray-900 md:h-14 md:px-10 md:text-base"
              onClick={() => (window.location.href = '/')}
            >
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
