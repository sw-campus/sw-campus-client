'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { FiArrowLeft, FiEdit2, FiTrash2, FiHeart, FiBookmark, FiEye, FiMessageCircle } from 'react-icons/fi'
import DOMPurify from 'dompurify'

import { Button } from '@/components/ui/button'
import { useDeletePost } from '@/features/community/hooks/useDeletePost'
import { usePostDetail } from '@/features/community/hooks/usePostDetail'
import { useAuthStore } from '@/store/authStore'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = Number(params.postId)

  const { isLoggedIn } = useAuthStore()
  const { data: post, isLoading, error } = usePostDetail(postId)
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost()

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
    if (!confirm('정말 삭제하시겠습니까?')) return

    deletePost(postId, {
      onSuccess: () => {
        router.push('/community')
      },
    })
  }

  if (isLoading) {
    return (
      <main className="custom-container mx-auto max-w-6xl">
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
      <main className="custom-container mx-auto max-w-6xl">
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

  return (
    <main className="custom-container mx-auto max-w-6xl">
      {/* 뒤로가기 */}
      <Link href="/community" className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <FiArrowLeft />
        목록으로
      </Link>

      {/* 게시글 카드 */}
      <article className="custom-card max-w-[800px] w-full">
        {/* 헤더 */}
        <header className="border-b border-gray-100 pb-6">
          <div className="mb-3 space-y-2">
            <div>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                {post.categoryName}
              </span>
            </div>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map(tag => (
                  <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">{post.title}</h1>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{post.authorNickname}</span>
              <span>·</span>
              <time>{formattedDate}</time>
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
          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <FiHeart className={post.isLiked ? 'fill-red-500 text-red-500' : ''} />
                좋아요
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <FiBookmark className={post.isBookmarked ? 'fill-yellow-500 text-yellow-500' : ''} />
                북마크
              </Button>
            </div>

            {post.isAuthor && (
              <div className="flex gap-2">
                <Link href={`/community/${post.id}/edit`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FiEdit2 />
                    수정
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-red-500 hover:bg-red-50"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <FiTrash2 />
                  삭제
                </Button>
              </div>
            )}
          </div>
        )}
      </article>
    </main>
  )
}
