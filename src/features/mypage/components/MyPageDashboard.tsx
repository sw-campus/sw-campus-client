'use client'

import { useRouter } from 'next/navigation'

import { ActivitySummary } from './ActivitySummary'
import { ReviewManagementSection } from './ManagementSection'
import { ProfileCard } from './ProfileCard'

export function MyPageDashboard() {
  const router = useRouter()

  const handleEditProfile = () => {
    router.push('/mypage/personal/info')
  }

  const handleEditSurvey = () => {
    router.push('/mypage/personal/survey')
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground text-2xl font-bold">마이페이지</h1>
        <p className="text-muted-foreground mt-1 text-sm">내 정보와 활동을 관리하세요</p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Profile + Activity Summary */}
        <div className="flex flex-col gap-6">
          <ProfileCard onEditClick={handleEditProfile} />
          <ActivitySummary onEditSurvey={handleEditSurvey} />
        </div>

        {/* Right Column: Review Management */}
        <ReviewManagementSection />
      </div>
    </div>
  )
}
