'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Bookmark, FileText, MessageCircle, Heart } from 'lucide-react'

import { formatRelativeTime } from '@/lib/format-relative-time'

import { useBookmarksQuery } from '../hooks/use-bookmarks-query'

export function BookmarkSection() {
  const router = useRouter()
  const { data: bookmarks, isLoading } = useBookmarksQuery()

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-[#FEB706]" />
          <span className="text-base font-semibold text-[#020202]">북마크한 글</span>
        </div>
        <span className="text-xs text-[#888888]">총 {bookmarks?.length ?? 0}건</span>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <span className="text-sm text-[#888888]">불러오는 중...</span>
        </div>
      ) : !bookmarks || bookmarks.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-3">
          <Bookmark className="w-12 h-12 text-gray-200" />
          <span className="text-sm text-[#888888]">북마크한 글이 없습니다.</span>
          <button
            onClick={() => router.push('/community')}
            className="text-sm text-[#FEB706] hover:underline"
          >
            커뮤니티 둘러보기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map(bookmark => (
            <div
              key={bookmark.bookmarkId}
              onClick={() => router.push(`/community/${bookmark.postId}`)}
              className="group cursor-pointer rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-[#FEB706]/30 hover:shadow-sm"
            >
              {/* 썸네일 */}
              <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-100 mb-3">
                {bookmark.thumbnailUrl ? (
                  <Image
                    src={bookmark.thumbnailUrl}
                    alt={bookmark.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFFCF4] to-[#FFF8E7]">
                    <FileText className="w-8 h-8 text-[#FEB706]/50" />
                  </div>
                )}
                {/* 카테고리 뱃지 */}
                <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-xs text-[#555555] shadow-sm">
                  {bookmark.categoryName}
                </span>
              </div>

              {/* 컨텐츠 */}
              <h4 className="line-clamp-2 text-sm font-medium text-[#020202] transition-colors group-hover:text-[#FEB706] mb-2">
                {bookmark.title}
              </h4>

              <div className="flex items-center justify-between text-xs text-[#888888]">
                <span className="truncate max-w-[100px]">{bookmark.authorNickname}</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5">
                    <Heart className="w-3 h-3" />
                    {bookmark.likeCount}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MessageCircle className="w-3 h-3" />
                    {bookmark.commentCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
