'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useParams, useRouter, notFound } from 'next/navigation'
import { FiArrowLeft, FiCalendar, FiFileText, FiMessageCircle, FiBookmark } from 'react-icons/fi'

import { UserAvatar } from '@/components/ui/user-avatar'
import { DEFAULT_POST_SORT } from '@/features/community/api/post-api.types'
import { useUserProfile, useUserPosts, useUserCommentedPosts } from '@/features/community/hooks/use-user-profile'
import { useBookmarksQuery } from '@/features/mypage/hooks/use-bookmarks-query'
import { useCurrentMemberQuery } from '@/features/mypage/hooks/use-current-member-query'

import { PostCard, BookmarkCard, CardSkeleton, EmptyState, Pagination } from './_components'

type TabType = 'posts' | 'commented' | 'bookmarks'

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = Number(params.userId)

  const [activeTab, setActiveTab] = useState<TabType>('posts')
  const [postsPage, setPostsPage] = useState(0)
  const [commentedPage, setCommentedPage] = useState(0)
  const [sort] = useState(DEFAULT_POST_SORT)

  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile(userId)
  const { data: postsData, isLoading: postsLoading } = useUserPosts(userId, { page: postsPage, size: 10, sort })
  const { data: commentedData, isLoading: commentedLoading } = useUserCommentedPosts(userId, {
    page: commentedPage,
    size: 10,
    sort,
  })
  const { data: currentMember } = useCurrentMemberQuery()

  const isOwnProfile = currentMember?.userId === userId

  // 자기 프로필일 때만 북마크 API 호출
  const { data: bookmarks, isLoading: bookmarksLoading } = useBookmarksQuery({ enabled: isOwnProfile })

  if (profileError) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  // 숫자 포맷팅 (1234 → 1,234)
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num)
  }

  // 탭 데이터
  const tabs = [
    { id: 'posts' as const, label: '작성한 글', icon: FiFileText, count: profile?.postCount ?? 0 },
    { id: 'commented' as const, label: '댓글 단 글', icon: FiMessageCircle, count: profile?.commentedPostCount ?? 0 },
    ...(isOwnProfile
      ? [{ id: 'bookmarks' as const, label: '북마크', icon: FiBookmark, count: bookmarks?.length ?? 0 }]
      : []),
  ]

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-stretch px-4 py-6 md:px-6 md:py-8">
      {/* 뒤로가기 */}
      <Link
        href="/community"
        className="mb-5 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-900 active:scale-95 md:mb-6"
      >
        <FiArrowLeft className="h-4 w-4" />
        커뮤니티
      </Link>

      {/* 프로필 헤더 */}
      <div className="mb-6 w-full self-stretch overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 md:mb-8 md:rounded-3xl">
        {/* 커버 이미지 */}
        <div className="bg-primary relative h-24">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute right-0 -bottom-1 left-0 h-12 bg-linear-to-t from-white to-transparent" />
        </div>

        <div className="relative w-full px-4 pb-4 md:px-8 md:pb-8">
          {profileLoading ? (
            <div className="w-full space-y-4">
              <div className="absolute -top-10 left-4 h-20 w-20 animate-pulse rounded-full bg-gray-200 ring-4 ring-white md:-top-16 md:left-8 md:h-32 md:w-32" />
              <div className="w-full pt-12 md:pt-20">
                <div className="h-7 w-32 animate-pulse rounded-lg bg-gray-200 md:h-8 md:w-40" />
                <div className="mt-3 flex gap-2 md:mt-4 md:gap-3">
                  <div className="h-8 w-28 animate-pulse rounded-lg bg-gray-200 md:h-10 md:w-32 md:rounded-xl" />
                </div>
                <div className="mt-4 h-[60px] w-full animate-pulse rounded-xl bg-gray-200 md:mt-6 md:h-[72px] md:rounded-2xl" />
              </div>
            </div>
          ) : profile ? (
            <>
              <UserAvatar
                nickname={profile.nickname ?? '익명'}
                size="xl"
                initialLength={2}
                avatarClassName="absolute -top-10 left-4 ring-4 ring-white md:-top-16 md:left-8"
              />

              <div className="w-full pt-12 md:pt-20">
                <h1 className="text-xl font-bold text-gray-900 md:text-3xl">{profile.nickname}</h1>

                <div className="mt-3 md:mt-4">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 md:gap-2 md:px-4 md:py-2">
                    <FiCalendar className="h-3.5 w-3.5 text-gray-500 md:h-4 md:w-4" />
                    <span className="text-xs text-gray-600 md:text-sm">{formatDate(profile.joinedAt)} 가입</span>
                  </div>
                </div>

                {/* 활동 통계 */}
                <div
                  className={`mt-4 grid w-full rounded-xl bg-gray-50 py-3 md:mt-6 md:rounded-2xl md:py-4 ${isOwnProfile ? 'grid-cols-3' : 'grid-cols-2'}`}
                >
                  <div className="flex flex-col items-center justify-center border-r border-gray-200">
                    <p className="text-primary text-xl font-bold">{formatNumber(profile.postCount)}</p>
                    <p className="mt-0.5 text-xs text-gray-500">작성글</p>
                  </div>
                  <div
                    className={`flex flex-col items-center justify-center ${isOwnProfile ? 'border-r border-gray-200' : ''}`}
                  >
                    <p className="text-success text-xl font-bold md:text-2xl">
                      {formatNumber(profile.commentedPostCount)}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 md:text-sm">댓글</p>
                  </div>
                  {isOwnProfile && (
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-xl font-bold text-blue-600 md:text-2xl">
                        {formatNumber(bookmarks?.length ?? 0)}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 md:text-sm">북마크</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="mb-4 w-full md:mb-6">
        <div className={`grid w-full gap-2 ${isOwnProfile ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-medium transition-all md:gap-2 md:py-3 md:text-sm ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">
                {tab.id === 'posts' ? '작성글' : tab.id === 'commented' ? '댓글' : '북마크'}
              </span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] md:px-2 md:text-xs ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {formatNumber(tab.count)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="w-full">
        {/* 작성한 글 탭 */}
        {activeTab === 'posts' && (
          <div className="min-h-[300px] w-full space-y-3 md:min-h-[400px] md:space-y-4">
            {postsLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : postsData?.posts && postsData.posts.length > 0 ? (
              <>
                {postsData.posts.map(post => (
                  <PostCard key={post.id} post={post} onClick={() => router.push(`/community/${post.id}`)} />
                ))}
                <Pagination page={postsPage} totalPages={postsData.page?.totalPages ?? 1} onPageChange={setPostsPage} />
              </>
            ) : (
              <EmptyState
                icon={FiFileText}
                title="작성한 게시글이 없습니다"
                description="아직 게시글을 작성하지 않았어요"
              />
            )}
          </div>
        )}

        {/* 댓글 단 글 탭 */}
        {activeTab === 'commented' && (
          <div className="min-h-[300px] w-full space-y-3 md:min-h-[400px] md:space-y-4">
            {commentedLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : commentedData?.posts && commentedData.posts.length > 0 ? (
              <>
                {commentedData.posts.map(post => (
                  <PostCard key={post.id} post={post} onClick={() => router.push(`/community/${post.id}`)} />
                ))}
                <Pagination
                  page={commentedPage}
                  totalPages={commentedData.page?.totalPages ?? 1}
                  onPageChange={setCommentedPage}
                />
              </>
            ) : (
              <EmptyState
                icon={FiMessageCircle}
                title="댓글 단 게시글이 없습니다"
                description="아직 댓글을 작성하지 않았어요"
              />
            )}
          </div>
        )}

        {/* 북마크 탭 */}
        {activeTab === 'bookmarks' && isOwnProfile && (
          <div className="min-h-[300px] w-full space-y-3 md:min-h-[400px] md:space-y-4">
            {bookmarksLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : bookmarks && bookmarks.length > 0 ? (
              bookmarks.map(bookmark => (
                <BookmarkCard
                  key={bookmark.bookmarkId}
                  bookmark={bookmark}
                  onClick={() => router.push(`/community/${bookmark.postId}`)}
                />
              ))
            ) : (
              <EmptyState
                icon={FiBookmark}
                title="북마크한 글이 없습니다"
                description="마음에 드는 글을 북마크해보세요"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
