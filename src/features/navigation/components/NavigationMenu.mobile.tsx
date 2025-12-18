import Link from 'next/link'
import { FiX } from 'react-icons/fi'

import type { MobileNavGroup } from '@/features/navigation/types/navigation-menu.types'

type Props = {
  open: boolean
  onClose: () => void
  items: MobileNavGroup[]
}

export function NavigationMenuMobileOverlay({ open, onClose, items }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden" onClick={onClose}>
      <div
        className="absolute top-0 left-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <button className="mb-6" onClick={onClose}>
          <FiX size={26} />
        </button>

        <div className="flex flex-col gap-6">
          {items.map((item, idx) => (
            <div key={idx}>
              <div className="mb-2 font-semibold">{item.title}</div>
              <div className="ml-2 flex flex-col gap-2">
                {item.items.map(child => (
                  <div key={child.title} className="flex flex-col gap-1">
                    <Link href={child.href} className="font-medium text-gray-600 hover:text-orange-500">
                      {child.title}
                    </Link>
                    {child.items.length > 0 && (
                      <div className="ml-2 flex flex-col gap-1 border-l pl-2 text-sm text-gray-500">
                        {child.items.map(grandChild => (
                          <Link key={grandChild.title} href={grandChild.href} className="hover:text-orange-500">
                            {grandChild.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
