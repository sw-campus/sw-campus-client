'use client'

import { AnimatePresence, motion, Variants } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiX } from 'react-icons/fi'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { useCategoryTree } from '@/features/category'
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
  const router = useRouter()
  const showDesktop = useDesktopNavigationStore(state => state.showDesktopNav)
  const activeMenu = useDesktopNavigationStore(state => state.activeMenu)
  const { data: categoryTree } = useCategoryTree()

  // 모바일용 전체 메뉴 데이터
  const mobileNavData = (() => {
    if (!categoryTree) return []
    return categoryTree.map(l1 => ({
      title: l1.categoryName,
      items:
        l1.children?.map(l2 => ({
          title: l2.categoryName,
          href: `/lectures/search?categoryIds=${l2.categoryId}`,
          items:
            l2.children?.map(l3 => ({
              title: l3.categoryName,
              href: `/lectures/search?categoryIds=${l3.categoryId}`,
            })) || [],
        })) || [],
    }))
  })()

  // 데스크탑용: 현재 선택된 대분류의 하위 메뉴(중분류 + 소분류)
  const activeCategoryChildren = (() => {
    if (!categoryTree || activeMenu === null) return []
    const activeCategory = categoryTree.find(c => c.categoryId === activeMenu)
    if (!activeCategory || !activeCategory.children) return []

    return activeCategory.children.map(l2 => ({
      title: l2.categoryName,
      href: `/lectures/search?categoryIds=${l2.categoryId}`,
      children:
        l2.children?.map(l3 => ({
          title: l3.categoryName,
          href: `/lectures/search?categoryIds=${l3.categoryId}`,
        })) || [],
    }))
  })()

  const menuVariants: Variants = {
    open: {
      height: 'auto',
      opacity: 1,
      transition: { duration: 0.25, ease: 'easeOut' },
      transitionEnd: { overflow: 'visible' },
    },
    closed: {
      height: 0,
      opacity: 0,
      overflow: 'hidden',
      transition: { duration: 0.25, ease: 'easeOut' },
    },
  }

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
              {mobileNavData.map((item, idx) => (
                <div key={idx}>
                  <div className="mb-2 font-semibold">{item.title}</div>
                  <div className="ml-2 flex flex-col gap-2">
                    {item.items.map(child => (
                      <div key={child.title} className="flex flex-col gap-1">
                        <Link href={child.href} className="font-medium text-gray-600 hover:text-orange-500">
                          {child.title}
                        </Link>
                        {/* 소분류 렌더링 */}
                        {child.items && child.items.length > 0 && (
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
      )}

      {/* 데스크탑인 경우 */}
      <motion.div
        className="hidden md:block" // overflow-hidden 제거
        initial="closed"
        animate={showDesktop ? 'open' : 'closed'}
        variants={menuVariants}
        style={{ pointerEvents: showDesktop ? 'auto' : 'none' }}
      >
        <div className="mx-auto mt-4 flex w-full max-w-7xl items-center justify-center px-8">
          <NavigationMenu
            viewport={false}
            className="w-full"
            delayDuration={0}
            skipDelayDuration={500}
            onMouseEnter={onDesktopEnter}
            onMouseLeave={onDesktopLeave}
          >
            <NavigationMenuList className="flex-wrap justify-start gap-y-2">
              {activeCategoryChildren.length > 0 ? (
                activeCategoryChildren.map((item, key) => (
                  <NavigationMenuItem key={key} className="relative">
                    {item.children.length > 0 ? (
                      <>
                        <NavigationMenuTrigger onClick={() => router.push(item.href)}>
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="absolute top-8 left-0 z-[100] mt-0 w-max min-w-[220px] rounded-lg bg-white shadow-xl before:absolute before:-top-4 before:-left-10 before:h-10 before:w-[200%] before:bg-transparent">
                          <div className="flex flex-col gap-2 p-4">
                            <Link
                              href={item.href}
                              className="hover:text-accent-foreground mb-2 font-semibold whitespace-nowrap"
                            >
                              전체
                            </Link>
                            {item.children.map(child => (
                              <Link
                                href={child.href}
                                key={child.title}
                                className="hover:text-accent-foreground text-sm whitespace-nowrap"
                              >
                                {child.title}
                              </Link>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.title}</NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))
              ) : (
                <div className="p-4 text-sm text-gray-500">하위 카테고리가 없습니다.</div>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </motion.div>
    </>
  )
}
