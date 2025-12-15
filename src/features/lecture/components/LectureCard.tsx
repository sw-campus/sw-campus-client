import Link from 'next/link'

import { AddToCartButton } from '@/features/cart'
import { Lecture } from '@/features/lecture/types/lecture.type'

export function LectureCard({ lecture }: { lecture: Lecture }) {
  const { id, title, organization, periodStart, periodEnd, tags, imageUrl, status } = lecture

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'RECRUITING':
        return { text: '모집중', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50' }
      case 'FINISHED':
        return { text: '마감', className: 'bg-gray-500/10 text-gray-500 border-gray-200/50' }
      default:
        return null
    }
  }

  const statusBadge = getStatusBadge(status)

  return (
    <Link
      href={`/lectures/${id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl p-6 backdrop-blur-xl transition hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="relative z-10 flex h-full flex-col">
        {/* 상단: 카테고리 & 상태 뱃지 */}
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold tracking-widest">{tags[0]?.name ?? 'CATEGORY'}</p>
          {statusBadge && (
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${statusBadge.className}`}>
              {statusBadge.text}
            </span>
          )}
        </div>
        <h3 className="mb-3 text-xl leading-tight font-bold">{title}</h3>
        <p className="mb-4 text-sm">{organization}</p>
        <p className="mb-6 text-xs">
          {periodStart} ~ {periodEnd}
        </p>
        {/* 별점 */}
        {/* 태그 */}
        <div className="mb-6 flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag.id}
              className="rounded-full bg-orange-300/20 px-3 py-1 text-xs text-black/70 backdrop-blur-sm"
            >
              {tag.name}
            </span>
          ))}
        </div>
        {/* 장바구니 버튼 */}
        <div className="mt-auto">
          <AddToCartButton item={{ id, title, image: imageUrl }} className="w-full rounded-lg py-2 transition">
            Add to cart
          </AddToCartButton>
        </div>
      </div>
    </Link>
  )
}
