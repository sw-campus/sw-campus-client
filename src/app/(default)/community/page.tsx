'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiEdit3 } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { CategorySidebar } from '@/features/community/components/CategorySidebar'
import { PostList } from '@/features/community/components/PostList'
import { SearchBar } from '@/features/community/components/SearchBar'
import { useBoardCategories } from '@/features/community/hooks/useBoardCategories'
import { usePosts } from '@/features/community/hooks/usePosts'
import { useAuthStore } from '@/store/authStore'

export default function CommunityPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryIdParam = searchParams.get('categoryId')
  const keywordParam = searchParams.get('keyword') ?? ''
  const selectedCategoryId = categoryIdParam ? Number(categoryIdParam) : null

  const [page, setPage] = useState(0)

  const { isLoggedIn } = useAuthStore()
  const { data: categories = [] } = useBoardCategories()
  const { data, isLoading } = usePosts({
    categoryId: selectedCategoryId ?? undefined,
    keyword: keywordParam || undefined,
    page,
    size: 12,
  })

  const handleCategorySelect = (categoryId: number | null) => {
    setPage(0) // 카테고리 변경 시 첫 페이지로

    const params = new URLSearchParams()
    if (categoryId !== null) {
      params.set('categoryId', categoryId.toString())
    }
    if (keywordParam) {
      params.set('keyword', keywordParam)
    }
    const queryString = params.toString()
    router.push(queryString ? `/community?${queryString}` : '/community')
  }

  const handleSearch = (keyword: string) => {
    setPage(0) // 검색 시 첫 페이지로

    const params = new URLSearchParams()
    if (selectedCategoryId !== null) {
      params.set('categoryId', selectedCategoryId.toString())
    }
    if (keyword) {
      params.set('keyword', keyword)
    }
    const queryString = params.toString()
    router.push(queryString ? `/community?${queryString}` : '/community')
  }

  // 선택된 카테고리 이름 찾기
  const getSelectedCategoryName = () => {
    if (selectedCategoryId === null) return '전체 게시글'
    for (const parent of categories) {
      if (parent.id === selectedCategoryId) return parent.name
      for (const child of parent.children) {
        if (child.id === selectedCategoryId) return child.name
      }
    }
    return '전체 게시글'
  }

  const pageInfo = data?.page
  const totalPages = pageInfo?.totalPages ?? 1

  return (
    <div className="custom-container mx-auto max-w-7xl">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">커뮤니티</h1>
            <p className="mt-1 text-gray-500">SW 캠퍼스 커뮤니티에서 자유롭게 소통하세요</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-64">
              <SearchBar value={keywordParam} onChange={handleSearch} placeholder="검색..." />
            </div>
            {isLoggedIn && (
              <Link href="/community/write">
                <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
                  <FiEdit3 className="h-4 w-4" />
                  글쓰기
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* 사이드바 (데스크탑: 왼쪽, 모바일: 상단) */}
        <CategorySidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={handleCategorySelect}
        />

        {/* 게시글 목록 */}
        <main className="min-w-0 flex-1">
          {/* 현재 카테고리 표시 */}
          <div className="mb-4 hidden items-center justify-between lg:flex">
            <h2 className="text-lg font-semibold text-gray-900">{getSelectedCategoryName()}</h2>
            <span className="text-sm text-gray-500">{data?.page?.totalElements ?? 0}개의 게시글</span>
          </div>

          <PostList posts={data?.posts ?? []} isLoading={isLoading} />

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button variant="outline" disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>
                이전
              </Button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                {page + 1} / {totalPages}
              </span>
              <Button variant="outline" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                다음
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
