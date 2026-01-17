'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { FiArrowLeft } from 'react-icons/fi'

import type { CreatePostRequest } from '@/features/community/api/postApi.types'
import { PostForm } from '@/features/community/components/PostForm'
import { useBoardCategories } from '@/features/community/hooks/useBoardCategories'
import { usePostDetail } from '@/features/community/hooks/usePostDetail'
import { useUpdatePost } from '@/features/community/hooks/useUpdatePost'
import { useAuthStore } from '@/store/authStore'

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = Number(params.postId)

  const { isLoggedIn, hasHydrated } = useAuthStore()
  const { data: categories = [] } = useBoardCategories()
  const { data: post, isLoading, error } = usePostDetail(postId)
  const { mutate: updatePost, isPending } = useUpdatePost()

  // 로그인 체크
  if (hasHydrated && !isLoggedIn) {
    return (
      <main className="custom-container mx-auto max-w-6xl">
        <div className="py-16 text-center">
          <p className="text-lg text-gray-500">로그인이 필요합니다</p>
          <Link href="/login" className="mt-4 inline-block text-orange-500 hover:underline">
            로그인하기
          </Link>
        </div>
      </main>
    )
  }

  // 로딩
  if (isLoading) {
    return (
      <main className="custom-container mx-auto max-w-6xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 rounded bg-gray-200" />
          <div className="custom-card">
            <div className="h-96 w-full rounded bg-gray-200" />
          </div>
        </div>
      </main>
    )
  }

  // 에러 또는 권한 없음
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

  // 작성자가 아닌 경우
  if (!post.isAuthor) {
    return (
      <main className="custom-container mx-auto max-w-6xl">
        <div className="py-16 text-center">
          <p className="text-lg text-gray-500">수정 권한이 없습니다</p>
          <Link href={`/community/${postId}`} className="mt-4 inline-block text-orange-500 hover:underline">
            게시글로 돌아가기
          </Link>
        </div>
      </main>
    )
  }

  const handleSubmit = (data: CreatePostRequest) => {
    updatePost(
      {
        postId,
        data: {
          title: data.title,
          body: data.body,
          images: data.images,
          tags: data.tags,
        },
      },
      {
        onSuccess: () => {
          router.push(`/community/${postId}`)
        },
      },
    )
  }

  return (
    <main className="custom-container mx-auto max-w-6xl">
      {/* 뒤로가기 */}
      <Link
        href={`/community/${postId}`}
        className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <FiArrowLeft />
        돌아가기
      </Link>

      {/* 폼 카드 */}
      <div className="custom-card">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">게시글 수정</h1>

        {categories.length > 0 ? (
          <PostForm
            categories={categories}
            initialData={post}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitLabel="수정하기"
          />
        ) : (
          <div className="py-8 text-center text-gray-500">카테고리를 불러오는 중...</div>
        )}
      </div>
    </main>
  )
}
