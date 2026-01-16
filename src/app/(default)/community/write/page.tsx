'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiArrowLeft } from 'react-icons/fi'

import type { CreatePostRequest } from '@/features/community/api/postApi.types'
import { PostForm } from '@/features/community/components/PostForm'
import { useBoardCategories } from '@/features/community/hooks/useBoardCategories'
import { useCreatePost } from '@/features/community/hooks/useCreatePost'
import { useAuthStore } from '@/store/authStore'

export default function WritePostPage() {
  const router = useRouter()
  const { isLoggedIn, hasHydrated } = useAuthStore()
  const { data: categories = [] } = useBoardCategories()
  const { mutate: createPost, isPending } = useCreatePost()

  // 로그인 체크
  if (hasHydrated && !isLoggedIn) {
    return (
      <main className="custom-container mx-auto max-w-4xl">
        <div className="py-16 text-center">
          <p className="text-lg text-gray-500">로그인이 필요합니다</p>
          <Link href="/login" className="mt-4 inline-block text-orange-500 hover:underline">
            로그인하기
          </Link>
        </div>
      </main>
    )
  }

  const handleSubmit = (data: CreatePostRequest) => {
    createPost(data, {
      onSuccess: result => {
        router.push(`/community/${result.id}`)
      },
    })
  }

  return (
    <main className="custom-container mx-auto max-w-4xl">
      {/* 뒤로가기 */}
      <Link href="/community" className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <FiArrowLeft />
        목록으로
      </Link>

      {/* 폼 카드 */}
      <div className="custom-card">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">게시글 작성</h1>

        {categories.length > 0 ? (
          <PostForm categories={categories} onSubmit={handleSubmit} isSubmitting={isPending} submitLabel="작성하기" />
        ) : (
          <div className="py-8 text-center text-gray-500">카테고리를 불러오는 중...</div>
        )}
      </div>
    </main>
  )
}
