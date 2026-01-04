'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Number */}
        <h1 className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-9xl font-black text-transparent">
          404
        </h1>

        {/* Message */}
        <h2 className="mt-4 text-2xl font-bold text-white md:text-3xl">페이지를 찾을 수 없습니다</h2>
        <p className="mt-2 text-gray-300">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full border-white/20 text-white hover:bg-white/10 sm:w-auto"
            onClick={() => window.history.back()}
          >
            이전 페이지로
          </Button>
        </div>
      </div>
    </div>
  )
}
