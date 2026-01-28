'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <>
      {/* 카카오톡 채널 버튼 숨김 */}
      <style>{`#kakao-chat-channel-button { display: none !important; }`}</style>

      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          {/* 404 Number */}
          <h1 className="bg-linear-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-7xl font-black text-transparent md:text-9xl">
            404
          </h1>

          {/* Message */}
          <h2 className="mt-4 text-xl font-bold text-gray-900 md:text-3xl">페이지를 찾을 수 없습니다</h2>
          <p className="mt-2 text-sm text-gray-400 md:text-base">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-center gap-2 md:mt-10 md:gap-4">
            <Button
              asChild
              className="h-10 bg-linear-to-r from-purple-500 to-pink-500 px-4 text-xs font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/40 md:h-14 md:px-10 md:text-base"
            >
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
            <Button
              variant="ghost"
              className="h-10 bg-gray-100 px-4 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-200 hover:text-gray-900 md:h-14 md:px-10 md:text-base"
              onClick={() => window.history.back()}
            >
              이전 페이지로
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
