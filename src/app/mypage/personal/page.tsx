'use client'

import { MyPageDashboard } from '@/features/mypage/components/my-page-dashboard'
import { useAuthStore } from '@/store/auth-store'

export default function MyPage() {
  const { userType } = useAuthStore()

  if (userType === 'PERSONAL') {
    return <MyPageDashboard />
  }

  // userType이 null이거나 알 수 없을 때
  return (
    <div className="flex h-96 items-center justify-center bg-[#F5F5F5]">
      <span className="text-lg text-[#888888]">로그인 후 이용 가능합니다.</span>
    </div>
  )
}
