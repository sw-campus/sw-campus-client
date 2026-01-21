'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FiArrowLeft } from 'react-icons/fi'

import type { CreatePostRequest } from '@/features/community/api/post-api.types'
import { PostForm } from '@/features/community/components/post-form'
import { useBoardCategories } from '@/features/community/hooks/use-board-categories'
import { useCreatePost } from '@/features/community/hooks/use-create-post'
import { useAuthStore } from '@/store/auth-store'

export default function WritePostPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn, hasHydrated } = useAuthStore()
  const { data: categories = [], isLoading: isCategoriesLoading } = useBoardCategories()
  const { mutate: createPost, isPending } = useCreatePost()

  // 로그인 체크
  if (!hasHydrated) {
    return (
      <main className="custom-container mx-auto w-full max-w-7xl md:!px-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 rounded bg-gray-200" />
          <div className="custom-card">
            <div className="h-96 w-full rounded bg-gray-200" />
          </div>
        </div>
      </main>
    )
  }

  if (!isLoggedIn) {
    return (
      <main className="custom-container mx-auto w-full max-w-7xl md:!px-10">
        <div className="py-16 text-center">
          <p className="text-lg text-gray-500">로그인이 필요합니다</p>
          <Link href={`/login?returnUrl=${encodeURIComponent(pathname)}`} className="mt-4 inline-block text-orange-500 hover:underline">
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
    <main className="custom-container mx-auto w-full max-w-7xl md:!px-10">
      {/* 뒤로가기 */}
      <Link href="/community" className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <FiArrowLeft />
        목록으로
      </Link>

      {/* 폼 카드 */}
      <div className="custom-card">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">게시글 작성</h1>

        {isCategoriesLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-40 rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-200" />
            <div className="h-64 w-full rounded bg-gray-200" />
            <div className="flex justify-end">
              <div className="h-10 w-24 rounded bg-gray-200" />
            </div>
          </div>
        ) : (
          <PostForm categories={categories} onSubmit={handleSubmit} isSubmitting={isPending} submitLabel="작성하기" />
        )}
      </div>
    </main>
  )
}
