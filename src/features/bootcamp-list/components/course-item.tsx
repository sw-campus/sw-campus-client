import Image from 'next/image'
import { ImageIcon, X } from 'lucide-react'
import type { CartItem } from '@/features/cart/types/cart.type'

interface CourseItemProps {
  item: CartItem
  isSelected?: boolean
  onClick?: () => void
  onRemove?: () => void
}

export function CourseItem({
  item,
  isSelected = false,
  onClick,
  onRemove,
}: CourseItemProps) {
  return (
    <div
      onClick={onClick}
      className={`
        w-full p-2 rounded-xl flex items-center gap-2 cursor-pointer
        shadow-[4px_4px_20px_rgba(161,161,170,0.25)]
        ${isSelected
          ? 'bg-[#FFFCF4] outline outline-1 outline-[#FEB706]'
          : 'bg-white'
        }
      `}
    >
      {/* 이미지 */}
      <div className="w-[40px] h-[40px] flex-shrink-0 rounded overflow-hidden flex items-center justify-center">
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon className="w-6 h-6 text-[#CCCCCC]" strokeWidth={1} />
        )}
      </div>

      {/* 텍스트 */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="w-full text-xs font-semibold text-black text-left line-clamp-1">
          {item.title}
        </span>
        <span className="text-sm text-[#888888]">{item.categoryName || item.orgName}</span>
      </div>

      {/* 삭제 버튼 */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="w-5 h-5 flex-shrink-0 flex items-center justify-center text-[#888888] hover:text-[#020202]"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
