'use client'

import { useMemo, useState } from 'react'

import DOMPurify from 'dompurify'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiHeart,
  FiBookmark,
  FiEye,
  FiMessageCircle,
  FiShare2,
  FiUser,
  FiCheck,
  FiMapPin,
} from 'react-icons/fi'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ClickableTag } from '@/features/community/components/ClickableTag'
import { CommentSection } from '@/features/community/components/CommentSection'
import { PostNavigation } from '@/features/community/components/PostNavigation'
import { useDeletePost } from '@/features/community/hooks/useDeletePost'
import { usePostDetail } from '@/features/community/hooks/usePostDetail'
import { useToggleLike, useToggleBookmark, useTogglePin } from '@/features/community/hooks/usePostInteractions'
import { formatRelativeTime } from '@/lib/formatRelativeTime'
import { useAuthStore } from '@/store/authStore'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = Number(params.postId)

  const { isLoggedIn, userType } = useAuthStore()
  const { data: post, isLoading, error } = usePostDetail(postId)
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost()
  const { mutate: toggleLike, isPending: isLiking } = useToggleLike(postId)
  const { mutate: toggleBookmark, isPending: isBookmarking } = useToggleBookmark(postId)
  const { mutate: togglePin, isPending: isPinning } = useTogglePin(postId)
  const [isCopied, setIsCopied] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const imagesNotInBody = useMemo(() => {
    if (!post) return []

    const imgTagRegex = /<img[^>]*src="([^"]*)"[^>]*>/g
    const bodyImageUrls = new Set<string>()
    let match

    while ((match = imgTagRegex.exec(post.body)) !== null) {
      if (match[1]) {
        bodyImageUrls.add(match[1])
      }
    }

    return post.images.filter(url => !bodyImageUrls.has(url))
  }, [post])

  const handleDelete = () => {
    deletePost(postId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
        router.push('/community')
      },
    })
  }

  const showCopySuccess = () => {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      showCopySuccess()
    } catch {
      // 클립보드 API 미지원 시 fallback
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      showCopySuccess()
    }
  }

  if (isLoading) {
    return (
      <main className="custom-container mx-auto w-full max-w-3xl">
        <div className="space-y-4">
          <div className="h-8 w-24 rounded-lg bg-gray-100" />
          <div className="rounded-2xl border border-gray-200/60 bg-white p-5 sm:p-8">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded-full bg-gray-100" />
                <div className="h-6 w-20 rounded-full bg-gray-100" />
              </div>
              <div className="h-8 w-3/4 rounded-lg bg-gray-100" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100" />
                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-3 w-32 rounded bg-gray-100" />
                </div>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="space-y-3 pt-4">
                <div className="h-4 w-full rounded bg-gray-100" />
                <div className="h-4 w-5/6 rounded bg-gray-100" />
                <div className="h-4 w-4/6 rounded bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="custom-container mx-auto w-full max-w-3xl">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gradient-to-b from-gray-50/50 to-white py-20">
          <p className="text-lg font-medium text-gray-500">게시글을 찾을 수 없습니다</p>
          <Link
            href="/community"
            className="mt-4 inline-flex items-center gap-1 text-orange-500 transition-colors hover:text-orange-600 hover:underline"
          >
            <FiArrowLeft className="h-4 w-4" />
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    )
  }

  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(post.createdAt)

  const relativeTime = formatRelativeTime(post.createdAt)

  return (
    <main className="custom-container mx-auto w-full max-w-3xl">
      {/* 뒤로가기 */}
      <Link
        href="/community"
        className="mb-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 active:scale-95 sm:mb-6"
      >
        <FiArrowLeft className="h-4 w-4" />
        <span>목록</span>
      </Link>

      {/* 게시글 카드 */}
      <article className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm sm:rounded-3xl">
        {/* 헤더 */}
        <header className="p-5 pb-0 sm:p-8 sm:pb-0">
          {/* 배지 영역 */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {post.pinned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                  <FiMapPin className="h-3 w-3" />
                  공지
                </span>
              )}
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {post.categoryName}
              </span>
            </div>

            {/* 공유 버튼 */}
            <button
              onClick={handleShare}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                isCopied
                  ? 'bg-green-50 text-green-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isCopied ? (
                <>
                  <FiCheck className="h-3.5 w-3.5" />
                  복사됨
                </>
              ) : (
                <>
                  <FiShare2 className="h-3.5 w-3.5" />
                  공유
                </>
              )}
            </button>
          </div>

          {/* 태그 */}
          {post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {post.tags.map(tag => (
                <ClickableTag key={tag} tag={tag} variant="chip" />
              ))}
            </div>
          )}

          {/* 제목 */}
          <h1 className="mb-5 text-xl leading-snug font-bold tracking-tight text-gray-900 sm:mb-6 sm:text-2xl lg:text-3xl">
            {post.title}
          </h1>

          {/* 작성자 정보 + 통계 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* 작성자 */}
            <div className="flex items-center gap-3">
              <Link href={`/community/user/${post.authorId}`}>
                <Avatar className="h-11 w-11 ring-2 ring-white transition-transform hover:scale-105 sm:h-10 sm:w-10">
                  <AvatarImage />
                  <AvatarFallback className="bg-gradient-to-br from-orange-100 to-amber-100 text-sm font-semibold text-orange-700">
                    {post.authorNickname?.slice(0, 2) ?? '익명'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col">
                <Link
                  href={`/community/user/${post.authorId}`}
                  className="font-semibold text-gray-900 transition-colors hover:text-orange-600"
                >
                  {post.authorNickname ?? '익명'}
                </Link>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span title={formattedDate}>{relativeTime}</span>
                  <span className="hidden text-gray-300 sm:inline">·</span>
                  <span className="hidden text-gray-400 sm:inline">{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* 통계 */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5" title="조회수">
                <FiEye className="h-4 w-4" />
                <span className="tabular-nums">{post.viewCount}</span>
              </span>
              <span className="flex items-center gap-1.5" title="좋아요">
                <FiHeart className="h-4 w-4" />
                <span className="tabular-nums">{post.likeCount}</span>
              </span>
              <span className="flex items-center gap-1.5" title="댓글">
                <FiMessageCircle className="h-4 w-4" />
                <span className="tabular-nums">{post.commentCount}</span>
              </span>
            </div>
          </div>
        </header>

        {/* 구분선 */}
        <div className="mx-5 my-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent sm:mx-8 sm:my-6" />

        {/* 본문 */}
        <div className="px-5 sm:px-8">
          <div
            className="prose prose-gray max-w-none prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body) }}
          />

          {/* 이미지 - 본문에 포함되지 않은 이미지만 표시 */}
          {imagesNotInBody.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {imagesNotInBody.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`첨부 이미지 ${index + 1}`}
                  className="max-h-80 rounded-xl object-contain"
                />
              ))}
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        {isLoggedIn && (
          <div className="mt-6 border-t border-gray-100 p-4 sm:mt-8 sm:p-6">
            {/* 좋아요, 북마크 - 항상 표시 */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => toggleLike()}
                disabled={isLiking}
                className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all active:scale-95 sm:flex-none sm:px-4 ${
                  post.isLiked
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FiHeart className={`h-4 w-4 ${post.isLiked ? 'fill-rose-500' : ''}`} />
                <span>좋아요</span>
                {post.likeCount > 0 && <span className="tabular-nums">{post.likeCount}</span>}
              </button>

              <button
                onClick={() => toggleBookmark()}
                disabled={isBookmarking}
                className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all active:scale-95 sm:flex-none sm:px-4 ${
                  post.isBookmarked
                    ? 'border-amber-200 bg-amber-50 text-amber-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FiBookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-amber-500' : ''}`} />
                <span>북마크</span>
              </button>

              {/* 관리자: 공지 고정/해제 */}
              {userType === 'ADMIN' && (
                <button
                  onClick={() => togglePin()}
                  disabled={isPinning}
                  className={`flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-all active:scale-95 ${
                    post.pinned
                      ? 'border-orange-200 bg-orange-50 text-orange-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <FiMapPin className={`h-4 w-4 ${post.pinned ? 'fill-orange-600' : ''}`} />
                  <span className="hidden sm:inline">{post.pinned ? '고정 해제' : '공지 고정'}</span>
                </button>
              )}

              {/* 수정/삭제 - 작성자 또는 관리자 */}
              {(post.isAuthor || userType === 'ADMIN') && (
                <div className="flex gap-2 sm:ml-auto">
                  <Link href={`/community/${post.id}/edit`}>
                    <button className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-95 sm:px-4">
                      <FiEdit2 className="h-4 w-4" />
                      <span className="hidden sm:inline">수정</span>
                    </button>
                  </Link>

                  <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <button
                        disabled={isDeleting}
                        className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 text-sm font-medium text-rose-500 transition-all hover:border-rose-200 hover:bg-rose-50 active:scale-95 sm:px-4"
                      >
                        <FiTrash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">삭제</span>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="mx-4 max-w-sm rounded-2xl sm:mx-auto">
                      <AlertDialogHeader>
                        <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                          정말 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-2 sm:gap-0">
                        <AlertDialogCancel className="rounded-xl">취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="rounded-xl bg-rose-500 hover:bg-rose-600"
                          disabled={isDeleting}
                        >
                          {isDeleting ? '삭제 중...' : '삭제'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 댓글 섹션 */}
        <div className="px-5 pb-5 sm:px-8 sm:pb-8">
          <CommentSection postId={postId} />
        </div>
      </article>

      {/* 이전/다음 게시글 네비게이션 */}
      <div className="mt-6">
        <PostNavigation postId={postId} />
      </div>
    </main>
  )
}
