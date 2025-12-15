'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { FiX } from 'react-icons/fi'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { BOOT_NAV_DATA } from '@/features/navi/types/navigation.type'
import { useDesktopNavigationStore } from '@/store/navigation.store'

export default function Navigation({
  open,
  onClose,
  onDesktopEnter,
  onDesktopLeave,
}: {
  open: boolean
  onClose: () => void
  onDesktopEnter?: () => void
  onDesktopLeave?: () => void
}) {
  const showDesktop = useDesktopNavigationStore(state => state.showDesktopNav)
  return (
    <>
      {/* 모바일인 경우 */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden" onClick={onClose}>
          <div
            className="absolute top-0 left-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <button className="mb-6" onClick={onClose}>
              <FiX size={26} />
            </button>

            <div className="flex flex-col gap-6">
              {BOOT_NAV_DATA.map((item, idx) => (
                <div key={idx}>
                  <div className="mb-2 font-semibold">{item.title}</div>
                  <div className="ml-2 flex flex-col gap-2">
                    {item.items?.map(child => (
                      <Link key={child.title} href={child.href} className="text-gray-600 hover:text-orange-500">
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 데스크탑인 경우 */}
      <motion.div
        className="hidden overflow-hidden md:block"
        initial={false}
        animate={{ height: showDesktop ? 'auto' : 0, opacity: showDesktop ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{ pointerEvents: showDesktop ? 'auto' : 'none' }}
      >
        <div className="mx-auto mt-4 flex w-full max-w-7xl items-center justify-center px-8">
          <NavigationMenu
            viewport={false}
            className="w-full"
            onMouseEnter={onDesktopEnter}
            onMouseLeave={onDesktopLeave}
          >
            <NavigationMenuList className="justify-start">
              {BOOT_NAV_DATA.map((item, key) => (
                <NavigationMenuItem key={key} className="relative">
                  {/* 중분류 */}
                  <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>

                  {/* 소분류 */}
                  {item.items && (
                    <NavigationMenuContent className="absolute top-full left-0 w-[200px] md:w-[200px]">
                      <div className="flex flex-col gap-2 p-4">
                        {item.items.map(child => (
                          <Link href={child.href} key={child.title} className="hover:text-accent-foreground">
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </motion.div>
    </>
  )
}
