import Image from 'next/image'
import { ImageIcon } from 'lucide-react'

interface ComparisonCardProps {
  title: string
  imageUrl?: string
}

export function ComparisonCard({ title, imageUrl }: ComparisonCardProps) {
  return (
    <div className="flex-1 p-3 bg-white rounded-xl shadow-[4px_4px_20px_rgba(161,161,170,0.25)] overflow-hidden flex flex-col gap-3">
      <div className="w-full h-[86px] bg-gray-200 rounded-lg flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            width={132}
            height={86}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <ImageIcon className="w-8 h-8 text-gray-400" />
        )}
      </div>
      <p className="text-xs font-bold text-[#020202] text-center line-clamp-2 min-h-[32px]">{title}</p>
    </div>
  )
}
