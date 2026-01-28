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
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* 500 Number */}
        <h1 className="bg-linear-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-9xl font-black text-transparent">
          500
        </h1>

        {/* Message */}
        <h2 className="mt-4 text-2xl font-bold text-white md:text-3xl">서버 오류가 발생했습니다</h2>
        <p className="mt-2 text-gray-300">일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 md:flex-row">
          <Button size="lg" className="w-full md:w-auto" onClick={reset}>
            다시 시도
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full border-white/20 text-white hover:bg-white/10 md:w-auto"
            onClick={() => (window.location.href = '/')}
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  )
}
