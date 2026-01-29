'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { User, Award, ClipboardCheck, Key, UserX, Pencil, FileText, MessageSquare, Bookmark, Settings, Heart, LogOut, Trash2, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCompletedLecturesQuery } from '@/features/mypage/hooks/use-completed-lectures-query'
import { api } from '@/lib/axios'

import { type WithdrawResponse } from '@/features/mypage/api/member.api'

import { useUserPosts, useUserCommentedPosts } from '@/features/community/hooks/use-user-profile'

import { useLogout } from '@/features/auth/hooks/use-logout'
import { useCartLecturesQuery } from '@/features/cart/hooks/use-cart-lectures-query'
import { useRemoveFromCart } from '@/features/cart/hooks/use-remove-from-cart'
import type { CartItem } from '@/features/cart/types/cart.type'
import { useBookmarksQuery } from '../hooks/use-bookmarks-query'
import { useCurrentMemberQuery } from '../hooks/use-current-member-query'
import { useSurveyStatusQuery, useSurveyResultsQuery } from '../hooks/use-survey'
import { RECOMMENDED_JOB_LABELS } from '../types/survey.type'
import { JOB_TYPE_INFO } from './survey/survey-results-step'
import { ReviewManagementSection } from './management-section'
import { PROFILE_QUERY_KEY } from './profile-card'
import { PasswordChangeModal } from './password-change-modal'
import { PasswordVerifyModal } from './password-verify-modal'
import { WithdrawCompleteModal } from './withdraw-complete-modal'
import { WithdrawModal } from './withdraw-modal'

type ProfileData = {
  email: string
  name: string
  nickname: string
  phone: string
  location: string
  provider: string
  role: string
  postCount: number
  commentedPostCount: number
}

type LectureTabType = 'all' | 'reviews' | 'interest'
type CommunityTabType = 'posts' | 'commented' | 'bookmarks'
type MobileSectionTab = 'lecture' | 'community'

export function MyPageDashboard() {
  const router = useRouter()
  const { logout } = useLogout()
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [lectureTab, setLectureTab] = useState<LectureTabType>('all')
  const [communityTab, setCommunityTab] = useState<CommunityTabType>('posts')
  const [mobileSectionTab, setMobileSectionTab] = useState<MobileSectionTab>('lecture')

  // 커뮤니티 페이지네이션 상태
  const [postsPage, setPostsPage] = useState(0)
  const [commentedPage, setCommentedPage] = useState(0)
  const [bookmarksPage, setBookmarksPage] = useState(0)

  // 커뮤니티 선택 상태
  const [communitySelectedIds, setCommunitySelectedIds] = useState<Set<number>>(new Set())

  // 탭 변경 시 선택 초기화
  useEffect(() => {
    setCommunitySelectedIds(new Set())
  }, [communityTab])

  // 개별 선택/해제
  const handleCommunitySelect = (id: number) => {
    setCommunitySelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // 전체 선택/해제 (데이터 필요)
  const handleCommunitySelectAll = (allIds: number[]) => {
    if (communitySelectedIds.size === allIds.length) {
      setCommunitySelectedIds(new Set())
    } else {
      setCommunitySelectedIds(new Set(allIds))
    }
  }

  // 삭제 핸들러
  const handleCommunityDelete = () => {
    if (communitySelectedIds.size === 0) return
    // TODO: 삭제 확인 모달 및 API 호출
    alert(`${communitySelectedIds.size}개 항목을 삭제합니다.`)
  }

  // Modal states for password change and withdrawal
  const [verifyModalOpen, setVerifyModalOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [withdrawCompleteOpen, setWithdrawCompleteOpen] = useState(false)
  const [withdrawProviders, setWithdrawProviders] = useState<string[]>([])

  const handleEditProfile = () => {
    router.push('/mypage/personal/info')
  }

  const handleEditSurvey = () => {
    router.push('/mypage/personal/survey')
  }

  const handleProfileButtonClick = () => {
    setProfileModalOpen(true)
  }

  const handleWithdrawSuccess = (response: WithdrawResponse) => {
    setWithdrawModalOpen(false)
    setWithdrawProviders(response.oauthProviders)
    setWithdrawCompleteOpen(true)
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
  const { data: surveyResults } = useSurveyResultsQuery(surveyStatus?.hasAptitudeTest ?? false)
  const { data: bookmarks } = useBookmarksQuery()
  const { data: currentMember } = useCurrentMemberQuery()
  const { data: cartLectures } = useCartLecturesQuery()
  const hasBasicSurvey = surveyStatus?.hasBasicSurvey ?? false
  const hasAptitudeTest = surveyStatus?.hasAptitudeTest ?? false
  const recommendedJob = surveyResults?.recommendedJob

  // 커뮤니티 데이터
  const userId = currentMember?.userId ?? 0
  const { data: userPostsData } = useUserPosts(userId, { page: postsPage, size: 5 })
  const { data: commentedPostsData } = useUserCommentedPosts(userId, { page: commentedPage, size: 5 })

  // 수료 강의 통계
  const completedLectureCount = lectures?.length ?? 0
  const writtenReviewCount = lectures?.filter(l => !l.canWriteReview).length ?? 0
  const interestLectureCount = cartLectures?.length ?? 0

  // 커뮤니티 활동 통계
  const bookmarkCount = bookmarks?.length ?? 0

  // OAuth 사용자인지 체크
  const isSocialUser = profile?.provider && profile.provider !== 'LOCAL'
  // 일반 사용자(USER) 및 기관 회원(ORGANIZATION)은 탈퇴 가능 (ADMIN만 제외)
  const canWithdraw = profile?.role === 'USER' || profile?.role === 'ORGANIZATION'

  return (
    <>
    <div className="w-full min-h-screen bg-white md:bg-[#F8F8F8]">
      {/* ==================== 모바일 프로필 헤더 ==================== */}
      <div className="md:hidden">
        {/* 짙은 회색 헤더 */}
        <div className="bg-[#262626] px-4 py-6 pb-16 relative overflow-visible">
          <div className="flex items-start justify-between">
            {/* 프로필 정보 */}
            <div>
              <h1 className="text-xl font-bold text-[#FEB706]">
                {profile?.nickname || profile?.name || '사용자'}
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <p className="text-[#FEB706]/80 text-xs">
                  {profile?.email || ''}
                </p>
                <button
                  onClick={() => logout().then(() => router.push('/'))}
                  className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  로그아웃
                </button>
              </div>
            </div>

            {/* 캐릭터 + 설정 버튼 (헤더 위로 넘어가도록) */}
            <div className="absolute right-6 -top-8 z-30">
              {/* 캐릭터 이미지 (성향검사 완료 시) */}
              {hasAptitudeTest && recommendedJob ? (
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[#FEB706]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={JOB_TYPE_INFO[recommendedJob].imagePath}
                    alt={RECOMMENDED_JOB_LABELS[recommendedJob]}
                    className="absolute h-36 w-36 object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#FEB706]">
                  <User className="w-12 h-12 text-[#FEB706]/60" />
                </div>
              )}
              {/* 설정 버튼 (우측 하단) */}
              <button
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#FEB706] rounded-full flex items-center justify-center shadow-md"
                onClick={handleProfileButtonClick}
              >
                <Settings className="w-4 h-4 text-[#262626]" />
              </button>
            </div>
          </div>
        </div>

        {/* 흰색 카드 섹션 (위로 겹침) */}
        <div className="bg-white rounded-t-[2rem] -mt-10 pt-6 px-4 min-h-screen relative z-20">
          {/* 성향 검사 바로가기 */}
          {hasAptitudeTest && recommendedJob ? (
            // 완료 시 - 결과 간략 표시
            <div className="w-full bg-white border border-[#262626] rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-[#FEB706]" />
                  <span className="text-sm text-[#888888]">나의 추천 직무</span>
                  <span className="text-sm font-bold text-[#262626]">{RECOMMENDED_JOB_LABELS[recommendedJob]}</span>
                </div>
                <button
                  className="text-xs text-[#888888] underline"
                  onClick={handleEditSurvey}
                >
                  다시하기
                </button>
              </div>
            </div>
          ) : (
            // 미완료 시 - 기존 스타일
            <button
              className="w-full bg-white border border-[#262626] rounded-xl p-3 mb-4 text-left"
              onClick={handleEditSurvey}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-[#FEB706]" />
                  <span className="text-sm font-medium text-[#262626]">성향 검사</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-sm font-bold ${
                    hasBasicSurvey ? 'text-orange-500' : 'text-gray-400'
                  }`}>
                    {hasBasicSurvey ? '진행중' : '미작성'}
                  </span>
                  <Pencil className="w-3.5 h-3.5 text-[#888888]" />
                </div>
              </div>
            </button>
          )}

          {/* 탭 네비게이션 */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setMobileSectionTab('lecture')}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                mobileSectionTab === 'lecture'
                  ? 'text-[#FF9500] border-b-2 border-[#FF9500]'
                  : 'text-[#888888]'
              }`}
            >
              나의 강의
            </button>
            <button
              onClick={() => setMobileSectionTab('community')}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                mobileSectionTab === 'community'
                  ? 'text-[#FF9500] border-b-2 border-[#FF9500]'
                  : 'text-[#888888]'
              }`}
            >
              커뮤니티 활동
            </button>
          </div>

          {/* 탭 콘텐츠 */}
          {mobileSectionTab === 'lecture' ? (
            /* 나의 강의 */
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              <div className="p-4 pb-3">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setLectureTab('all')}
                    className={`flex-1 rounded-lg px-2 py-3 border transition-colors text-center ${
                      lectureTab === 'all'
                        ? 'bg-[#FEB706]/10 border-[#FEB706]'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className={`text-xs mb-1 whitespace-nowrap ${lectureTab === 'all' ? 'text-[#FF9500]' : 'text-[#888888]'}`}>수료한 강의</div>
                    <div className="text-lg font-bold text-[#020202]">{completedLectureCount}</div>
                  </button>
                  <button
                    onClick={() => setLectureTab('reviews')}
                    className={`flex-1 rounded-lg px-2 py-3 border transition-colors text-center ${
                      lectureTab === 'reviews'
                        ? 'bg-[#FEB706]/10 border-[#FEB706]'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className={`text-xs mb-1 whitespace-nowrap ${lectureTab === 'reviews' ? 'text-[#FF9500]' : 'text-[#888888]'}`}>작성한 후기</div>
                    <div className="text-lg font-bold text-[#020202]">{writtenReviewCount}</div>
                  </button>
                  <button
                    onClick={() => setLectureTab('interest')}
                    className={`flex-1 rounded-lg px-2 py-3 border transition-colors text-center ${
                      lectureTab === 'interest'
                        ? 'bg-[#FEB706]/10 border-[#FEB706]'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className={`text-xs mb-1 whitespace-nowrap ${lectureTab === 'interest' ? 'text-[#FF9500]' : 'text-[#888888]'}`}>관심 등록 강의</div>
                    <div className="text-lg font-bold text-[#020202]">{interestLectureCount}</div>
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-200 bg-white">
                {lectureTab === 'interest' ? (
                  <InterestLectureSection lectures={cartLectures ?? []} />
                ) : (
                  <ReviewManagementSection filterStatus={lectureTab} />
                )}
              </div>
            </div>
          ) : (
            /* 커뮤니티 활동 */
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              <div className="p-4 pb-3">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setCommunityTab('posts')}
                    className={`flex-1 rounded-lg px-2 py-3 border transition-colors text-center ${
                      communityTab === 'posts'
                        ? 'bg-[#FEB706]/10 border-[#FEB706]'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className={`text-xs mb-1 whitespace-nowrap ${communityTab === 'posts' ? 'text-[#FF9500]' : 'text-[#888888]'}`}>작성글</div>
                    <div className="text-lg font-bold text-[#020202]">{profile?.postCount ?? 0}</div>
                  </button>
                  <button
                    onClick={() => setCommunityTab('commented')}
                    className={`flex-1 rounded-lg px-2 py-3 border transition-colors text-center ${
                      communityTab === 'commented'
                        ? 'bg-[#FEB706]/10 border-[#FEB706]'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className={`text-xs mb-1 whitespace-nowrap ${communityTab === 'commented' ? 'text-[#FF9500]' : 'text-[#888888]'}`}>댓글 활동</div>
                    <div className="text-lg font-bold text-[#020202]">{profile?.commentedPostCount ?? 0}</div>
                  </button>
                  <button
                    onClick={() => setCommunityTab('bookmarks')}
                    className={`flex-1 rounded-lg px-2 py-3 border transition-colors text-center ${
                      communityTab === 'bookmarks'
                        ? 'bg-[#FEB706]/10 border-[#FEB706]'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className={`text-xs mb-1 whitespace-nowrap ${communityTab === 'bookmarks' ? 'text-[#FF9500]' : 'text-[#888888]'}`}>북마크</div>
                    <div className="text-lg font-bold text-[#020202]">{bookmarkCount}</div>
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-200 bg-white">
                {/* 모바일 전체 선택/삭제 버튼 - 리스트 바로 위 */}
                <div className="flex items-center justify-end gap-3 px-3 pt-3 pb-2">
                  <button
                    onClick={() => {
                      const allIds = communityTab === 'posts'
                        ? (userPostsData?.posts ?? []).map(p => p.id)
                        : communityTab === 'commented'
                          ? (commentedPostsData?.posts ?? []).map(p => p.id)
                          : (bookmarks ?? []).map(b => b.postId)
                      handleCommunitySelectAll(allIds)
                    }}
                    className="text-xs text-[#888888] hover:text-[#555555] transition-colors"
                  >
                    전체 선택
                  </button>
                  <button
                    onClick={handleCommunityDelete}
                    disabled={communitySelectedIds.size === 0}
                    className="text-xs text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-3 h-3" />
                    삭제
                  </button>
                </div>
                <CommunityContentSection
                  tab={communityTab}
                  userPosts={userPostsData?.posts ?? []}
                  commentedPosts={commentedPostsData?.posts ?? []}
                  postsPage={{ current: postsPage, total: userPostsData?.page?.totalPages ?? 0 }}
                  commentedPage={{ current: commentedPage, total: commentedPostsData?.page?.totalPages ?? 0 }}
                  bookmarksPage={{ current: bookmarksPage, total: Math.ceil((bookmarks?.length ?? 0) / 5) }}
                  onPostsPageChange={setPostsPage}
                  onCommentedPageChange={setCommentedPage}
                  onBookmarksPageChange={setBookmarksPage}
                  selectedIds={communitySelectedIds}
                  onSelect={handleCommunitySelect}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== 데스크톱 컨테이너 ==================== */}
      <div className="hidden md:block max-w-[1448px] mx-auto px-6 py-6">
        {/* ==================== 페이지 타이틀 ==================== */}
        <div className="w-full py-4 border-b border-[#020202] flex items-center mb-6">
          <h2 className="flex-1 text-xl font-bold text-[#020202]">마이페이지</h2>
        </div>

        {/* ==================== 2컬럼 레이아웃: 프로필(좌) + 섹션들(우) ==================== */}
        <div className="flex gap-6">
          {/* ==================== 왼쪽: 프로필 카드 ==================== */}
          <div className="w-[348px] flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 sticky top-6">
              {/* 프로필 영역 */}
              <div>
                {/* 닉네임 + 정보확인 버튼 */}
                <div className="flex items-center justify-between">
                  <h1 className="text-lg font-bold text-[#020202]">
                    {profile?.nickname || profile?.name || '사용자'}님
                  </h1>
                  <button
                    className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    onClick={handleProfileButtonClick}
                  >
                    <Settings className="w-5 h-5 text-[#888888]" />
                  </button>
                </div>
                <p className="text-[#888888] text-base mt-1">
                  {profile?.email || ''}
                </p>
                {profile?.phone && (
                  <p className="text-[#888888]/70 text-sm mt-1">
                    {profile.phone}
                  </p>
                )}
              </div>

              {/* 구분선 */}
              <div className="border-t border-gray-200 my-6" />

              {/* 성향검사 영역 */}
              <div>
                {hasAptitudeTest && recommendedJob ? (
                  // 성향검사 완료 - 결과 표시 (심플 스타일)
                  <div className="text-center">
                    {/* 캐릭터 영역 */}
                    <div className="mb-4 flex justify-center">
                      <div className={`relative flex h-32 w-32 items-center justify-center rounded-full ${JOB_TYPE_INFO[recommendedJob].bgColor}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={JOB_TYPE_INFO[recommendedJob].imagePath}
                          alt={RECOMMENDED_JOB_LABELS[recommendedJob]}
                          className="absolute h-44 w-44 object-contain"
                        />
                      </div>
                    </div>

                    {/* 직무명 */}
                    <div className="mb-3">
                      <p className="text-base text-gray-500 mb-1">나의 추천 직무</p>
                      <h3 className={`text-xl font-bold ${JOB_TYPE_INFO[recommendedJob].color}`}>
                        {RECOMMENDED_JOB_LABELS[recommendedJob]}
                      </h3>
                    </div>

                    {/* 특성 태그 */}
                    <div className="mb-4 flex flex-wrap justify-center gap-1.5">
                      {JOB_TYPE_INFO[recommendedJob].traits.map((trait) => (
                        <span
                          key={trait}
                          className={`rounded-full px-3 py-1 text-sm font-medium ${JOB_TYPE_INFO[recommendedJob].bgColor} text-white`}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>

                    {/* 다시 검사하기 버튼 */}
                    <button
                      className="text-base text-gray-500 underline hover:text-gray-700"
                      onClick={handleEditSurvey}
                    >
                      다시 검사하기
                    </button>
                  </div>
                ) : (
                  // 성향검사 미완료 - 안내 문구
                  <div className="text-center">
                    {hasBasicSurvey ? (
                      // 기초설문 완료, 성향 테스트 미완료
                      <>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <div className="w-5 h-5 rounded-full bg-[#FF9500] flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-xs text-[#FF9500]">기초설문</span>
                          </div>
                          <div className="w-6 h-px bg-gray-300" />
                          <div className="flex items-center gap-1">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                              <span className="text-gray-300 text-xs">2</span>
                            </div>
                            <span className="text-xs text-[#888888]">성향 테스트</span>
                          </div>
                        </div>
                        <p className="text-sm text-[#555555] mb-1">
                          성향 테스트를 완료해주세요
                        </p>
                        <p className="text-xs text-[#888888] mb-3">
                          맞춤 강의 추천을 받을 수 있어요
                        </p>
                        <button
                          className="bg-[#FF9500] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#FF9500]/90 transition-colors"
                          onClick={handleEditSurvey}
                        >
                          성향 테스트 하기
                        </button>
                      </>
                    ) : (
                      // 기초설문 미완료
                      <>
                        <div className="w-12 h-12 bg-[#FF9500]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <ClipboardCheck className="w-6 h-6 text-[#FF9500]" />
                        </div>
                        <p className="text-sm text-[#555555] mb-1">
                          성향검사가 필요합니다
                        </p>
                        <p className="text-xs text-[#888888] mb-3">
                          맞춤 강의 추천을 받을 수 있어요
                        </p>
                        <button
                          className="bg-[#FF9500] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#FF9500]/90 transition-colors"
                          onClick={handleEditSurvey}
                        >
                          검사 시작하기
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ==================== 오른쪽: 섹션들 (하나의 카드) ==================== */}
          <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-8">
            {/* ==================== 섹션 1: 나의 강의 ==================== */}
            <div className="min-h-[520px]">
            {/* 섹션 헤더 */}
            <h3 className="text-lg font-bold text-[#020202] pb-3 border-b border-[#020202]">나의 강의</h3>

            {/* 탭 버튼 */}
            <div className="flex gap-6 border-b border-gray-200 mt-2">
              <button
                onClick={() => setLectureTab('all')}
                className={`py-3 text-base font-medium transition-colors relative ${
                  lectureTab === 'all'
                    ? 'text-[#FF9500]'
                    : 'text-[#888888] hover:text-[#555555]'
                }`}
              >
                수료한 강의 ({completedLectureCount})
                {lectureTab === 'all' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9500]" />
                )}
              </button>
              <button
                onClick={() => setLectureTab('reviews')}
                className={`py-3 text-base font-medium transition-colors relative ${
                  lectureTab === 'reviews'
                    ? 'text-[#FF9500]'
                    : 'text-[#888888] hover:text-[#555555]'
                }`}
              >
                작성한 후기 ({writtenReviewCount})
                {lectureTab === 'reviews' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9500]" />
                )}
              </button>
              <button
                onClick={() => setLectureTab('interest')}
                className={`py-3 text-base font-medium transition-colors relative ${
                  lectureTab === 'interest'
                    ? 'text-[#FF9500]'
                    : 'text-[#888888] hover:text-[#555555]'
                }`}
              >
                관심 등록 강의 ({interestLectureCount})
                {lectureTab === 'interest' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9500]" />
                )}
              </button>
            </div>

            {/* 콘텐츠 영역 */}
            <div className="pt-4">
              {lectureTab === 'interest' ? (
                <InterestLectureSection lectures={cartLectures ?? []} />
              ) : (
                <ReviewManagementSection filterStatus={lectureTab} />
              )}
            </div>
            </div>

            {/* ==================== 섹션 2: 커뮤니티 활동 ==================== */}
            <div className="flex-1 min-h-[600px]">
            {/* 섹션 헤더 */}
            <h3 className="text-lg font-bold text-[#020202] pb-3 border-b border-[#020202]">커뮤니티 활동</h3>

            {/* 탭 버튼 + 전체 선택/삭제 */}
            <div className="flex items-end justify-between border-b border-gray-200 mt-2">
              <div className="flex gap-6">
                <button
                  onClick={() => setCommunityTab('posts')}
                  className={`py-3 text-base font-medium transition-colors relative ${
                    communityTab === 'posts'
                      ? 'text-[#FF9500]'
                      : 'text-[#888888] hover:text-[#555555]'
                  }`}
                >
                  작성한 게시글 ({profile?.postCount ?? 0})
                  {communityTab === 'posts' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9500]" />
                  )}
                </button>
                <button
                  onClick={() => setCommunityTab('commented')}
                  className={`py-3 text-base font-medium transition-colors relative ${
                    communityTab === 'commented'
                      ? 'text-[#FF9500]'
                      : 'text-[#888888] hover:text-[#555555]'
                  }`}
                >
                  작성한 댓글 ({profile?.commentedPostCount ?? 0})
                  {communityTab === 'commented' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9500]" />
                  )}
                </button>
                <button
                  onClick={() => setCommunityTab('bookmarks')}
                  className={`py-3 text-base font-medium transition-colors relative ${
                    communityTab === 'bookmarks'
                      ? 'text-[#FF9500]'
                      : 'text-[#888888] hover:text-[#555555]'
                  }`}
                >
                  북마크한 게시글 ({bookmarkCount})
                  {communityTab === 'bookmarks' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9500]" />
                  )}
                </button>
              </div>
              {/* 전체 선택 / 삭제 버튼 */}
              <div className="flex items-center gap-3 pb-3">
                <button
                  onClick={() => {
                    const allIds = communityTab === 'posts'
                      ? (userPostsData?.posts ?? []).map(p => p.id)
                      : communityTab === 'commented'
                        ? (commentedPostsData?.posts ?? []).map(p => p.id)
                        : (bookmarks ?? []).map(b => b.postId)
                    handleCommunitySelectAll(allIds)
                  }}
                  className="text-xs text-[#888888] hover:text-[#555555] transition-colors"
                >
                  전체 선택
                </button>
                <button
                  onClick={handleCommunityDelete}
                  disabled={communitySelectedIds.size === 0}
                  className="text-xs text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3 h-3" />
                  삭제
                </button>
              </div>
            </div>

            {/* 콘텐츠 영역 */}
            <div className="pt-4">
              <CommunityContentSection
                  tab={communityTab}
                  userPosts={userPostsData?.posts ?? []}
                  commentedPosts={commentedPostsData?.posts ?? []}
                  postsPage={{ current: postsPage, total: userPostsData?.page?.totalPages ?? 0 }}
                  commentedPage={{ current: commentedPage, total: commentedPostsData?.page?.totalPages ?? 0 }}
                  bookmarksPage={{ current: bookmarksPage, total: Math.ceil((bookmarks?.length ?? 0) / 5) }}
                  onPostsPageChange={setPostsPage}
                  onCommentedPageChange={setCommentedPage}
                  onBookmarksPageChange={setBookmarksPage}
                  selectedIds={communitySelectedIds}
                  onSelect={handleCommunitySelect}
                />
            </div>
            </div>
          </div>
          {/* 2컬럼 레이아웃 끝 */}
        </div>
      </div>
    </div>

    {/* ==================== 내 정보 모달 ==================== */}
    <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
      <DialogContent className="md:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#FEB706]" />
            내 정보
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {profile ? (
            <div className="grid grid-cols-1 gap-3">
              <ProfileRow label="이름" value={profile.name || '-'} />
              <ProfileRow label="이메일" value={profile.email || '-'} />
              <ProfileRow label="닉네임" value={profile.nickname || '-'} />
              <ProfileRow label="연락처" value={profile.phone || '-'} />
              <ProfileRow label="주소" value={profile.location || '-'} />
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center">
              <span className="text-sm text-[#888888]">프로필 정보를 불러올 수 없습니다.</span>
            </div>
          )}
        </div>

        {/* 모달 하단 액션 버튼들 */}
        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
          {/* 주요 버튼 영역 */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setProfileModalOpen(false)}
            >
              닫기
            </Button>
            <Button
              className="flex-1 bg-[#FEB706] hover:bg-[#e5a505] text-white"
              onClick={() => {
                setProfileModalOpen(false)
                // OAuth 사용자는 비밀번호 검증 없이 바로 진행
                if (isSocialUser) {
                  handleEditProfile()
                } else {
                  setVerifyModalOpen(true)
                }
              }}
            >
              수정하기
            </Button>
          </div>

          {/* 추가 옵션 영역 */}
          <div className="flex items-center justify-between pt-2">
            {!isSocialUser && (
              <button
                className="text-xs text-[#555555] hover:text-[#020202] flex items-center gap-1"
                onClick={() => {
                  setProfileModalOpen(false)
                  setChangePasswordOpen(true)
                }}
              >
                <Key className="w-3 h-3" />
                비밀번호 변경
              </button>
            )}
            {canWithdraw && (
              <button
                className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 ml-auto"
                onClick={() => {
                  setProfileModalOpen(false)
                  setWithdrawModalOpen(true)
                }}
              >
                <UserX className="w-3 h-3" />
                회원 탈퇴
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Password Verification Modal */}
    <PasswordVerifyModal open={verifyModalOpen} onOpenChange={setVerifyModalOpen} onVerified={handleEditProfile} />

    {/* Password Change Modal */}
    <PasswordChangeModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />

    {/* Withdraw Confirmation Modal */}
    <WithdrawModal
      open={withdrawModalOpen}
      onOpenChange={setWithdrawModalOpen}
      onSuccess={handleWithdrawSuccess}
      isOrganization={profile?.role === 'ORGANIZATION'}
      isSocialUser={!!isSocialUser}
    />

    {/* Withdraw Complete Modal */}
    <WithdrawCompleteModal open={withdrawCompleteOpen} oauthProviders={withdrawProviders} />
    </>
  )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 py-2 px-3 bg-gray-50 rounded-lg">
      <span className="text-xs md:text-sm text-[#888888] w-14 md:w-16 shrink-0">{label}</span>
      <span className="text-sm md:text-base text-[#020202] break-all">{value}</span>
    </div>
  )
}

// 커뮤니티 활동 콘텐츠 섹션
interface CommunityContentSectionProps {
  tab: CommunityTabType
  userPosts: Array<{
    id: number
    title: string
    authorNickname: string
    categoryName: string
    likeCount: number
    commentCount: number
    createdAt: Date
    thumbnailUrl: string | null
  }>
  commentedPosts: Array<{
    id: number
    title: string
    authorNickname: string
    categoryName: string
    likeCount: number
    commentCount: number
    createdAt: Date
    thumbnailUrl: string | null
    myComment: string | null
    myCommentCreatedAt: Date | null
    myCommentLikeCount: number
    myCommentReplyCount: number
  }>
  // 페이지네이션
  postsPage: { current: number; total: number }
  commentedPage: { current: number; total: number }
  bookmarksPage: { current: number; total: number }
  onPostsPageChange: (page: number) => void
  onCommentedPageChange: (page: number) => void
  onBookmarksPageChange: (page: number) => void
  // 선택 관련
  selectedIds: Set<number>
  onSelect: (id: number) => void
}

function CommunityContentSection({
  tab,
  userPosts,
  commentedPosts,
  postsPage,
  commentedPage,
  bookmarksPage,
  onPostsPageChange,
  onCommentedPageChange,
  onBookmarksPageChange,
  selectedIds,
  onSelect,
}: CommunityContentSectionProps) {
  const router = useRouter()
  const { data: bookmarks, isLoading: bookmarksLoading } = useBookmarksQuery()

  // 탭에 따른 타이틀과 아이콘
  const getTabInfo = () => {
    switch (tab) {
      case 'posts':
        return { title: '작성한 게시글', Icon: FileText, emptyText: '작성한 게시글이 없습니다.' }
      case 'commented':
        return { title: '댓글 단 게시글', Icon: MessageSquare, emptyText: '댓글 단 게시글이 없습니다.' }
      case 'bookmarks':
        return { title: '북마크한 게시글', Icon: Bookmark, emptyText: '북마크한 게시글이 없습니다.' }
    }
  }

  const { Icon, emptyText } = getTabInfo()

  // 탭에 따른 데이터
  const getData = () => {
    switch (tab) {
      case 'posts':
        return userPosts.map(p => ({
          id: p.id,
          title: p.title,
          authorNickname: p.authorNickname,
          categoryName: p.categoryName,
          likeCount: p.likeCount,
          commentCount: p.commentCount,
          thumbnailUrl: p.thumbnailUrl,
        }))
      case 'commented':
        return commentedPosts.map(p => ({
          id: p.id,
          title: p.title,
          authorNickname: p.authorNickname,
          categoryName: p.categoryName,
          likeCount: p.likeCount,
          commentCount: p.commentCount,
          thumbnailUrl: p.thumbnailUrl,
          myComment: p.myComment,
          myCommentLikeCount: p.myCommentLikeCount,
          myCommentReplyCount: p.myCommentReplyCount,
        }))
      case 'bookmarks':
        const allBookmarks = (bookmarks ?? []).map(b => ({
          id: b.postId,
          title: b.title,
          authorNickname: b.authorNickname,
          categoryName: b.categoryName,
          likeCount: b.likeCount,
          commentCount: b.commentCount,
          thumbnailUrl: b.thumbnailUrl,
        }))
        // 클라이언트 사이드 페이지네이션
        const pageSize = 5
        const start = bookmarksPage.current * pageSize
        return allBookmarks.slice(start, start + pageSize)
    }
  }

  const data = getData()
  const isLoading = tab === 'bookmarks' ? bookmarksLoading : false

  // 현재 탭의 페이지네이션 정보
  const getCurrentPageInfo = () => {
    switch (tab) {
      case 'posts':
        return { page: postsPage, onPageChange: onPostsPageChange }
      case 'commented':
        return { page: commentedPage, onPageChange: onCommentedPageChange }
      case 'bookmarks':
        return { page: bookmarksPage, onPageChange: onBookmarksPageChange }
    }
  }
  const pageInfo = getCurrentPageInfo()

  // 개별 선택/해제
  const handleSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(id)
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <span className="text-sm text-[#888888]">불러오는 중...</span>
      </div>
    )
  }

  // 빈 상태
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <Icon className="w-12 h-12 text-gray-200" />
        <span className="text-sm text-[#888888]">{emptyText}</span>
        <button
          onClick={() => router.push('/community')}
          className="text-sm text-[#FEB706] hover:underline"
        >
          커뮤니티 둘러보기
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* 모바일: 리스트 스타일 */}
      <div className="sm:hidden space-y-2">
        {data.map(item => (
          <div
            key={item.id}
            className={`rounded-xl border bg-white p-3 transition-all ${
              selectedIds.has(item.id) ? 'border-[#FEB706] bg-[#FEB706]/5' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* 체크박스 */}
              <button
                onClick={(e) => handleSelect(item.id, e)}
                className="mt-0.5 shrink-0"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  selectedIds.has(item.id)
                    ? 'bg-[#FEB706] border-[#FEB706]'
                    : 'border-gray-300 hover:border-[#FEB706]'
                }`}>
                  {selectedIds.has(item.id) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>
              {/* 콘텐츠 */}
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => router.push(`/community/${item.id}`)}
              >
                {/* 댓글 단 게시글: 댓글 메인 + 제목 태그 + 내 댓글 좋아요/대댓글 오른쪽 정렬 */}
                {tab === 'commented' && 'myComment' in item ? (
                  <>
                    <p className="text-sm text-[#020202]">{item.myComment || '-'}</p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[9px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded truncate max-w-[60%]">
                        {item.title}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-[#888888]">
                        <span className="flex items-center gap-0.5">
                          <Heart className="w-3 h-3" />
                          {'myCommentLikeCount' in item ? item.myCommentLikeCount : 0}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <MessageSquare className="w-3 h-3" />
                          {'myCommentReplyCount' in item ? item.myCommentReplyCount : 0}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-[#020202] truncate">
                      {item.title}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-[#888888]">
                      <span className="truncate max-w-[80px]">{item.authorNickname}</span>
                      <span className="flex items-center gap-0.5">
                        <Heart className="w-3 h-3" />
                        {item.likeCount}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <MessageSquare className="w-3 h-3" />
                        {item.commentCount}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PC: 테이블 스타일 */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="w-10 py-3"></th>
              <th className="py-3 text-left text-[#888888] text-xs font-medium">
                {tab === 'commented' ? '내 댓글' : '제목'}
              </th>
              {tab !== 'commented' && (
                <th className="w-28 py-3 text-left text-[#888888] text-xs font-medium">작성자</th>
              )}
              <th className="w-20 py-3 text-center text-[#888888] text-xs font-medium">좋아요</th>
              <th className="w-20 py-3 text-center text-[#888888] text-xs font-medium">댓글</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-gray-50 transition-colors ${
                  selectedIds.has(item.id)
                    ? 'bg-[#FEB706]/10'
                    : 'hover:bg-[#FEB706]/5'
                }`}
              >
                <td className="py-3 text-center">
                  <button onClick={(e) => handleSelect(item.id, e)}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors mx-auto ${
                      selectedIds.has(item.id)
                        ? 'bg-[#FEB706] border-[#FEB706]'
                        : 'border-gray-300 hover:border-[#FEB706]'
                    }`}>
                      {selectedIds.has(item.id) && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                </td>
                <td
                  className="py-3 text-sm text-[#020202] cursor-pointer"
                  onClick={() => router.push(`/community/${item.id}`)}
                >
                  {/* 댓글 단 게시글: 댓글 메인 + 제목 태그 */}
                  {tab === 'commented' && 'myComment' in item ? (
                    <div>
                      <p className="text-sm text-[#020202]">{item.myComment || '-'}</p>
                      <span className="text-[9px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded inline-block mt-1">
                        {item.title}
                      </span>
                    </div>
                  ) : (
                    <span className="truncate block max-w-[300px]" title={item.title}>
                      {item.title}
                    </span>
                  )}
                </td>
                {tab !== 'commented' && (
                  <td className="py-3 text-sm text-[#888888] truncate max-w-[100px]">{item.authorNickname}</td>
                )}
                <td className="py-3 text-center text-sm text-[#888888]">
                  {tab === 'commented' && 'myCommentLikeCount' in item
                    ? item.myCommentLikeCount
                    : item.likeCount}
                </td>
                <td className="py-3 text-center text-sm text-[#888888]">
                  {tab === 'commented' && 'myCommentReplyCount' in item
                    ? item.myCommentReplyCount
                    : item.commentCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {pageInfo && pageInfo.page.total > 1 && (
        <div className="flex justify-center items-center gap-1 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => pageInfo.onPageChange(Math.max(0, pageInfo.page.current - 1))}
            disabled={pageInfo.page.current === 0}
            className="px-2 py-1 text-sm text-[#888888] hover:text-[#020202] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            이전
          </button>
          {Array.from({ length: pageInfo.page.total }, (_, i) => (
            <button
              key={i}
              onClick={() => pageInfo.onPageChange(i)}
              className={`w-8 h-8 text-sm rounded-full transition-colors ${
                pageInfo.page.current === i
                  ? 'bg-[#FF9500] text-white'
                  : 'text-[#888888] hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => pageInfo.onPageChange(Math.min(pageInfo.page.total - 1, pageInfo.page.current + 1))}
            disabled={pageInfo.page.current >= pageInfo.page.total - 1}
            className="px-2 py-1 text-sm text-[#888888] hover:text-[#020202] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}

// 관심등록 강의 섹션
interface InterestLectureCardProps {
  lecture: CartItem
  onClick: () => void
  onDelete?: () => void
}

function InterestLectureCard({ lecture, onClick, onDelete }: InterestLectureCardProps) {
  const [imgError, setImgError] = useState(false)

  const handleImageError = useCallback(() => {
    setImgError(true)
  }, [])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.()
  }, [onDelete])

  const showFallback = !lecture.thumbnailUrl || imgError

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-[#FEB706]/30 hover:shadow-sm"
    >
      {/* 썸네일 (왼쪽) */}
      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
        {showFallback ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-[8px] text-gray-400">NO IMAGE</span>
          </div>
        ) : (
          <Image
            src={lecture.thumbnailUrl!}
            alt={lecture.title}
            fill
            sizes="64px"
            className="object-cover"
            unoptimized
            onError={handleImageError}
          />
        )}
      </div>

      {/* 컨텐츠 (가운데) */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {lecture.categoryName && (
          <span className="text-[10px] text-gray-400 mb-0.5">{lecture.categoryName}</span>
        )}
        <h4 className="line-clamp-1 text-sm font-medium text-[#020202] transition-colors group-hover:text-[#FEB706]">
          {lecture.title}
        </h4>
        {lecture.orgName && (
          <span className="text-xs text-[#888888] truncate">{lecture.orgName}</span>
        )}
      </div>

      {/* 삭제 버튼 (오른쪽) */}
      <button
        onClick={handleDelete}
        className="shrink-0 self-center px-2 py-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
      >
        삭제
      </button>
    </div>
  )
}

interface InterestLectureSectionProps {
  lectures: CartItem[]
}

function InterestLectureSection({ lectures }: InterestLectureSectionProps) {
  const router = useRouter()
  const { mutate: removeFromCart } = useRemoveFromCart()

  if (lectures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <Heart className="w-12 h-12 text-gray-200" />
        <span className="text-sm text-[#888888]">관심등록한 강의가 없습니다.</span>
        <button
          onClick={() => router.push('/lectures/search')}
          className="text-sm text-[#FEB706] hover:underline"
        >
          강의 둘러보기
        </button>
      </div>
    )
  }

  const displayedLectures = lectures.slice(0, 10) // 최대 10개

  return (
    <div className="pt-4 pb-6 md:pt-0 md:pb-0">
      <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
        <span>⏰</span>
        <span>관심 등록하신 강의는 일주일간 보관됩니다.</span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {displayedLectures.map(lecture => (
        <InterestLectureCard
          key={lecture.lectureId}
          lecture={lecture}
          onClick={() => router.push(`/lectures/${lecture.lectureId}`)}
          onDelete={() => removeFromCart(lecture.lectureId)}
        />
      ))}
      </div>
    </div>
  )
}
