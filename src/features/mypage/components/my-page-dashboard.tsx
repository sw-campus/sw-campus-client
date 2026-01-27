'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { User, Award, BadgeCheck, ClipboardCheck, Pencil, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { APPROVAL_STATUS } from '@/features/admin/types/approval.type'
import { useCompletedLecturesQuery } from '@/features/mypage/hooks/use-completed-lectures-query'
import { api } from '@/lib/axios'

import { useSurveyStatusQuery } from '../hooks/use-survey'
import { BookmarkSection } from './bookmark-section'
import { ReviewManagementSection } from './management-section'
import { ProfileCard, PROFILE_QUERY_KEY } from './profile-card'

type ProfileData = {
  email: string
  name: string
  nickname: string
  phone: string
  location: string
  provider: string
  role: string
}

type TabType = 'activity' | 'bookmark'

export function MyPageDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('activity')

  const handleEditProfile = () => {
    router.push('/mypage/personal/info')
  }

  const handleEditSurvey = () => {
    router.push('/mypage/personal/survey')
  }

  // 프로필 데이터
  const { data: profile } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get<ProfileData>('/mypage/profile')
      return res.data
    },
  })

  // 활동 요약 데이터
  const { data: lectures } = useCompletedLecturesQuery()
  const { data: surveyStatus } = useSurveyStatusQuery()
  const hasBasicSurvey = surveyStatus?.hasBasicSurvey ?? false
  const hasAptitudeTest = surveyStatus?.hasAptitudeTest ?? false
  const approvedReviews = lectures?.filter(l => l.reviewStatus === APPROVAL_STATUS.APPROVED).length ?? 0

  const tabs = [
    { id: 'activity' as TabType, label: '활동' },
    { id: 'bookmark' as TabType, label: '북마크' },
  ]

  return (
    <div className="w-full min-h-screen bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ==================== 상단 프로필 카드 ==================== */}
        <div className="bg-gradient-to-r from-[#FEB706] to-[#FF9500] rounded-2xl p-4 sm:p-6 mb-4">
          <div className="flex items-center justify-between">
            {/* 프로필 정보 */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-[#FEB706]" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  {profile?.nickname || profile?.name || '사용자'}님
                </h1>
                <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                  {profile?.email || ''}
                </p>
                {profile?.phone && (
                  <p className="text-white/70 text-xs mt-0.5">
                    {profile.phone}
                  </p>
                )}
              </div>
            </div>

            {/* 프로필 수정 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 gap-1 h-8"
              onClick={handleEditProfile}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-sm">수정</span>
            </Button>
          </div>
        </div>

        {/* ==================== 통계 카드 섹션 ==================== */}
        <div className="bg-white rounded-2xl border border-gray-200 mb-4">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {/* 수료 강의 */}
            <button
              className="flex flex-col items-center py-4 sm:py-5 hover:bg-gray-50 transition-colors rounded-l-2xl"
              onClick={() => setActiveTab('activity')}
            >
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#FEB706] mb-1.5" />
              <span className="text-xl sm:text-2xl font-bold text-[#020202]">{lectures?.length ?? 0}</span>
              <span className="text-[10px] sm:text-xs text-[#888888] mt-0.5">수료 강의</span>
            </button>

            {/* 승인 후기 */}
            <button
              className="flex flex-col items-center py-4 sm:py-5 hover:bg-gray-50 transition-colors"
              onClick={() => setActiveTab('activity')}
            >
              <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#FEB706] mb-1.5" />
              <span className="text-xl sm:text-2xl font-bold text-[#020202]">{approvedReviews}</span>
              <span className="text-[10px] sm:text-xs text-[#888888] mt-0.5">승인 후기</span>
            </button>

            {/* 설문 */}
            <button
              className="flex flex-col items-center py-4 sm:py-5 hover:bg-gray-50 transition-colors rounded-r-2xl"
              onClick={handleEditSurvey}
            >
              <ClipboardCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#FEB706] mb-1.5" />
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  <div className={`h-2 w-2.5 sm:h-2.5 sm:w-3 rounded-sm ${hasBasicSurvey ? (hasAptitudeTest ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-gray-300'}`} />
                  <div className={`h-2 w-2.5 sm:h-2.5 sm:w-3 rounded-sm ${hasAptitudeTest ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                </div>
                <span className={`text-sm sm:text-lg font-bold ${hasAptitudeTest ? 'text-emerald-500' : hasBasicSurvey ? 'text-amber-500' : 'text-[#888888]'}`}>
                  {hasAptitudeTest ? '완료' : hasBasicSurvey ? '1/2' : '미작성'}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-[#888888] mt-0.5">설문</span>
            </button>
          </div>
        </div>

        {/* ==================== 탭 네비게이션 ==================== */}
        <div className="bg-white rounded-t-2xl border border-b-0 border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-none sm:px-8 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#FEB706]'
                    : 'text-[#888888] hover:text-[#555555]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FEB706]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ==================== 탭 컨텐츠 ==================== */}
        <div className="bg-white rounded-b-2xl border border-t-0 border-gray-200 min-h-[300px]">
          <div className="p-4 sm:p-6">
            {activeTab === 'activity' ? (
              <div className="flex flex-col gap-6">
                {/* 내 프로필 */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <ProfileCard onEditClick={handleEditProfile} />
                </div>

                {/* 후기 관리 */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <ReviewManagementSection />
                </div>
              </div>
            ) : (
              <BookmarkSection />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
