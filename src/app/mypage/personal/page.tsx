'use client'

import { MyPageDashboard } from '@/features/mypage/components/MyPageDashboard'
import { useAuthStore } from '@/store/authStore'

export default function MyPage() {
  const { userType } = useAuthStore()

  if (userType === 'PERSONAL') {
    return (
      <div className="custom-container">
        <div className="custom-card">
          <MyPageDashboard />
        </div>
      </div>
    )
  }

  // userType이 null이거나 알 수 없을 때
  return (
    <div className="flex h-96 items-center justify-center">
      <span className="text-lg text-neutral-500">로그인 후 이용 가능합니다.</span>
    </div>
  )
}
