'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { LuBookmark, LuFileText, LuMessageCircle, LuHeart } from 'react-icons/lu'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/format-relative-time'

import { useBookmarksQuery } from '../hooks/use-bookmarks-query'

export function BookmarkSection() {
  const router = useRouter()
  const { data: bookmarks, isLoading } = useBookmarksQuery()

  // 공통 헤더 렌더링
  const renderHeader = () => (
    <div className="flex items-center gap-2">
      <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
        <LuBookmark className="h-4 w-4" />
      </div>
      <span className="text-foreground text-lg font-semibold">북마크한 글</span>
    </div>
  )

  // 공통 컨텐츠 렌더링
  const renderContent = () => (
    <>
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <span className="text-muted-foreground text-sm">불러오는 중...</span>
        </div>
      ) : !bookmarks || bookmarks.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center gap-2">
          <LuBookmark className="text-muted-foreground h-8 w-8" />
          <span className="text-muted-foreground text-sm">북마크한 글이 없습니다.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.slice(0, 5).map(bookmark => (
            <div
              key={bookmark.bookmarkId}
              onClick={() => router.push(`/community/${bookmark.postId}`)}
              className="group flex cursor-pointer gap-3 rounded-lg border border-transparent p-2 transition-all hover:border-gray-200 hover:bg-gray-50"
            >
              {/* 썸네일 */}
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-16 sm:w-16">
                {bookmark.thumbnailUrl ? (
                  <Image
                    src={bookmark.thumbnailUrl}
                    alt={bookmark.title}
                    fill
                    sizes="(max-width: 640px) 56px, 64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                    <LuFileText className="h-6 w-6 text-orange-300" />
                  </div>
                )}
              </div>

              {/* 컨텐츠 */}
              <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                <div>
                  <h4 className="text-foreground line-clamp-1 text-sm font-medium transition-colors group-hover:text-orange-600">
                    {bookmark.title}
                  </h4>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground truncate">
                      {bookmark.authorNickname}
                    </span>
                    <span className="text-muted-foreground hidden sm:inline">·</span>
                    <span className="hidden rounded bg-orange-100 px-1.5 py-0.5 text-orange-600 sm:inline">
                      {bookmark.categoryName}
                    </span>
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-xs sm:gap-3">
                  <span className="flex items-center gap-0.5">
                    <LuHeart className="h-3 w-3" />
                    {bookmark.likeCount}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <LuMessageCircle className="h-3 w-3" />
                    {bookmark.commentCount}
                  </span>
                  <span>{formatRelativeTime(new Date(bookmark.postCreatedAt))}</span>
                  <span className="max-w-[60px] truncate rounded bg-orange-100 px-1.5 py-0.5 text-orange-600 sm:hidden">
                    {bookmark.categoryName}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* 더보기 링크 */}
          {bookmarks.length > 5 && (
            <div className="pt-2 text-center">
              <span className="text-muted-foreground text-xs">
                외 {bookmarks.length - 5}개의 북마크
              </span>
            </div>
          )}
        </div>
      )}
    </>
  )

  return (
    <>
      {/* Mobile: 플랫 섹션 (마지막 섹션이므로 border-b 없음) */}
      <section className="space-y-4 overflow-hidden sm:hidden">
        {renderHeader()}
        {renderContent()}
      </section>

      {/* Desktop: Card */}
      <Card className="bg-card hidden sm:block">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
              <LuBookmark className="h-4 w-4" />
            </div>
            <CardTitle className="text-foreground text-lg">북마크한 글</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="border-border border-t py-4">
          {renderContent()}
        </CardContent>
      </Card>
    </>
  )
}
