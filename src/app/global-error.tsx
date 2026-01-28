'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="ko">
      <body className="bg-gray-900">
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="text-center">
            {/* 500 Number */}
            <h1 className="bg-linear-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-7xl font-black text-transparent md:text-9xl">
              500
            </h1>

            {/* Message */}
            <h2 className="mt-4 text-xl font-bold text-white md:text-3xl">애플리케이션 오류가 발생했습니다</h2>
            <p className="mt-2 text-sm text-gray-400 md:text-base">
              죄송합니다. 예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center justify-center gap-2 md:mt-10 md:gap-4">
              <button
                onClick={reset}
                className="h-10 rounded-lg bg-linear-to-r from-orange-500 to-red-500 px-4 text-xs font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 md:h-14 md:px-10 md:text-base"
              >
                다시 시도
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="h-10 rounded-lg bg-gray-800/50 px-4 text-xs font-semibold text-gray-200 transition-all hover:bg-gray-700/50 hover:text-white md:h-14 md:px-10 md:text-base"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
