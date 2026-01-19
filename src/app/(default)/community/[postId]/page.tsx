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
      <main className="custom-container mx-auto w-full max-w-7xl md:!px-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 rounded bg-gray-200" />
          <div className="h-12 w-full rounded bg-gray-200" />
          <div className="h-6 w-48 rounded bg-gray-200" />
          <div className="h-64 w-full rounded bg-gray-200" />
        </div>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="custom-container mx-auto w-full max-w-7xl md:!px-10">
        <div className="py-16 text-center">
          <p className="text-lg text-gray-500">게시글을 찾을 수 없습니다</p>
          <Link href="/community" className="mt-4 inline-block text-orange-500 hover:underline">
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
    <main className="custom-container mx-auto w-full max-w-7xl md:!px-10">
      {/* 뒤로가기 */}
      <Link
        href="/community"
        className="mb-6 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
      >
        <FiArrowLeft />
        목록으로
      </Link>

      {/* 게시글 카드 */}
      <article className="custom-card w-full max-w-3xl">
        {/* 헤더 */}
        <header className="border-b border-gray-100 pb-6">
          <div className="mb-3 space-y-2">
            <div className="flex items-center gap-2">
              {post.pinned && (
                <span className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600">
                  <FiMapPin className="h-4 w-4" />
                  공지
                </span>
              )}
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                {post.categoryName}
              </span>
              {/* 공유 버튼 */}
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600 transition-all hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
              >
                {isCopied ? (
                  <>
                    <FiCheck className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">복사됨!</span>
                  </>
                ) : (
                  <>
                    <FiShare2 className="h-4 w-4" />
                    <span>공유</span>
                  </>
                )}
              </button>
            </div>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map(tag => (
                  <ClickableTag key={tag} tag={tag} variant="chip" />
                ))}
              </div>
            )}
          </div>

          <h1 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">{post.title}</h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
            {/* 작성자 정보 - 아바타 추가 */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Link
                href={`/community/user/${post.authorId}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 transition-transform hover:scale-110"
              >
                <FiUser className="h-4 w-4 text-orange-600" />
              </Link>
              <div className="flex flex-col">
                <Link
                  href={`/community/user/${post.authorId}`}
                  className="font-medium text-gray-700 transition-colors hover:text-orange-600 hover:underline"
                >
                  {post.authorNickname}
                </Link>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span title={formattedDate}>{relativeTime}</span>
                  <span className="hidden sm:inline">·</span>
                  <time className="hidden sm:inline">{formattedDate}</time>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FiEye className="h-4 w-4" />
                {post.viewCount}
              </span>
              <span className="flex items-center gap-1">
                <FiHeart className="h-4 w-4" />
                {post.likeCount}
              </span>
              <span className="flex items-center gap-1">
                <FiMessageCircle className="h-4 w-4" />
                {post.commentCount}
              </span>
            </div>
          </div>
        </header>

        {/* 본문 */}
        <div
          className="prose prose-gray mt-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body) }}
        />

        {/* 이미지 - 본문에 포함되지 않은 이미지만 표시 */}
        {imagesNotInBody.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-4">
            {imagesNotInBody.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`첨부 이미지 ${index + 1}`}
                className="max-h-96 rounded-lg object-contain"
              />
            ))}
          </div>
        )}

        {/* 액션 버튼 */}
        {isLoggedIn && (
          <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:pt-6">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`h-10 flex-1 gap-1.5 transition-all active:scale-95 sm:h-9 sm:flex-none sm:hover:scale-105 ${post.isLiked ? 'border-red-200 bg-red-50 text-red-600' : ''}`}
                onClick={() => toggleLike()}
                disabled={isLiking}
              >
                <FiHeart className={post.isLiked ? 'fill-red-500 text-red-500' : ''} />
                <span>좋아요</span>
                {post.likeCount > 0 && <span>{post.likeCount}</span>}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`h-10 flex-1 gap-1.5 transition-all active:scale-95 sm:h-9 sm:flex-none sm:hover:scale-105 ${post.isBookmarked ? 'border-yellow-200 bg-yellow-50 text-yellow-600' : ''}`}
                onClick={() => toggleBookmark()}
                disabled={isBookmarking}
              >
                <FiBookmark className={post.isBookmarked ? 'fill-yellow-500 text-yellow-500' : ''} />
                북마크
              </Button>
            </div>

            <div className="flex items-center justify-between gap-2 sm:justify-end">
              {/* 관리자: 공지 고정/해제 */}
              {userType === 'ADMIN' && (
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-10 gap-1 sm:h-9 ${post.pinned ? 'border-orange-200 bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}
                  onClick={() => togglePin()}
                  disabled={isPinning}
                >
                  <FiMapPin className={post.pinned ? 'fill-orange-600' : ''} />
                  {post.pinned ? '고정 해제' : '공지 고정'}
                </Button>
              )}

              {(post.isAuthor || userType === 'ADMIN') && (
                <div className="flex gap-2">
                  <Link href={`/community/${post.id}/edit`}>
                    <Button variant="outline" size="sm" className="h-10 gap-1 active:scale-95 sm:h-9">
                      <FiEdit2 />
                      수정
                    </Button>
                  </Link>
                  <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 gap-1 text-red-500 hover:bg-red-50 active:scale-95 sm:h-9"
                        disabled={isDeleting}
                      >
                        <FiTrash2 />
                        삭제
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                          정말 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-500 hover:bg-red-600"
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
        <CommentSection postId={postId} />

        {/* 이전/다음 게시글 네비게이션 */}
        <PostNavigation postId={postId} />
      </article>
    </main>
  )
}
