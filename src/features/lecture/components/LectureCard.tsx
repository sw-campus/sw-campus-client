import Link from 'next/link'

import { AddToCartButton } from '@/features/cart'
import { Lecture } from '@/features/lecture/types/lecture.type'

export function LectureCard({ lecture }: { lecture: Lecture }) {
  const { id, title, organization, periodStart, periodEnd, tags, imageUrl } = lecture

  return (
    <Link
      href={`/course/${id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl p-6 backdrop-blur-xl transition hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="relative z-10 flex h-full flex-col">
        {/* 이미지 */}
        {/* {imageUrl && <img src={imageUrl} alt={title} className="mb-4 h-40 w-full rounded-lg object-cover" />} */}
        {/* 콘텐츠 */}
        <p className="mb-2 text-xs font-semibold tracking-widest">{tags[0]?.name ?? 'CATEGORY'}</p>
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
          <AddToCartButton item={{ lectureId: id }} className="w-full rounded-lg py-2 transition">
            Add to cart
          </AddToCartButton>
        </div>
      </div>
    </Link>
  )
}
