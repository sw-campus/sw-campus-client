'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth-store'

interface BlindOverlayProps {
  totalCount: number
  visibleCount: number
}

export function BlindOverlay({ totalCount, visibleCount }: BlindOverlayProps) {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const hiddenCount = totalCount - visibleCount

  if (hiddenCount <= 0) return null

  return (
    <div className="relative mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-6 text-center shadow-sm">
      {/* 블러 오버레이 효과 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white/90" />

      <div className="relative z-10">
        <div className="mb-3 text-4xl">🔒</div>
        <p className="text-foreground mb-1 text-sm font-semibold">{hiddenCount}개의 리뷰가 더 있습니다</p>
        <p className="text-muted-foreground mb-4 text-xs">
          {isLoggedIn
            ? '리뷰를 작성하거나 설문조사를 100% 완료하면 모든 리뷰를 볼 수 있어요'
            : '로그인하면 더 많은 리뷰를 확인할 수 있어요'}
        </p>

        {isLoggedIn ? (
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
              <Link href="/mypage/personal">설문조사 완료하기</Link>
            </Button>
            <span className="text-muted-foreground text-xs">또는</span>
            <p className="text-muted-foreground text-xs">위에서 후기를 작성해 주세요</p>
          </div>
        ) : (
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href="/login">로그인하고 리뷰 더 보기</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
