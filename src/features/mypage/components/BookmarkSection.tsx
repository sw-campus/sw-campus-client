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

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <LuBookmark className="text-muted-foreground h-5 w-5" />
          <CardTitle className="text-foreground text-lg">북마크한 글</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
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
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {bookmark.thumbnailUrl ? (
                    <Image
                      src={bookmark.thumbnailUrl}
                      alt={bookmark.title}
                      fill
                      sizes="64px"
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
                      <span className="text-muted-foreground">·</span>
                      <span className="rounded bg-orange-100 px-1.5 py-0.5 text-orange-600">
                        {bookmark.categoryName}
                      </span>
                    </div>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-0.5">
                      <LuHeart className="h-3 w-3" />
                      {bookmark.likeCount}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <LuMessageCircle className="h-3 w-3" />
                      {bookmark.commentCount}
                    </span>
                    <span>{formatRelativeTime(new Date(bookmark.postCreatedAt))}</span>
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
      </CardContent>
    </Card>
  )
}
