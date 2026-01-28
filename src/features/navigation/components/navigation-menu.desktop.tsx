import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

import type { DesktopNavCategory } from '../types/navigation-menu.types'

type Props = {
  showDesktop: boolean
  items: DesktopNavCategory[]
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onNavigate: (href: string) => void
  isHome?: boolean
}

const menuVariants: Variants = {
  open: {
    height: 'auto',
    opacity: 1,
    overflow: 'visible',
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  closed: {
    height: 0,
    opacity: 1,
    overflow: 'hidden',
    transition: { duration: 0.25, ease: 'easeOut' },
  },
}

export function NavigationMenuDesktop({ showDesktop, items, onMouseEnter, onMouseLeave, onNavigate, isHome = false }: Props) {
  const bgColor = isHome ? '#041032' : '#ffffff'
  const textColor = isHome ? 'text-header-text' : 'text-gray-900'
  const hoverBg = isHome ? 'hover:bg-white/10 hover:text-white' : 'hover:bg-gray-100'

  return (
    <motion.div
      className="hidden w-full md:block"
      initial="closed"
      animate={showDesktop ? 'open' : 'closed'}
      variants={menuVariants}
      style={{ pointerEvents: showDesktop ? 'auto' : 'none', backgroundColor: bgColor }}
    >
      <div className="page-container flex items-center justify-center px-8 pt-0 pb-4">
        <NavigationMenu
          viewport={false}
          className="w-full"
          delayDuration={0}
          skipDelayDuration={500}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <NavigationMenuList className="flex-wrap justify-start gap-x-6 gap-y-2">
            {items.length > 0 ? (
              items.map((item, key) => (
                <NavigationMenuItem key={key} className="relative">
                  {item.children.length > 0 ? (
                    <>
                      <NavigationMenuTrigger
                        onClick={() => onNavigate(item.href)}
                        className={`bg-transparent ${textColor} ${hoverBg}`}
                      >
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="absolute top-8 left-0 z-100 mt-0 w-max min-w-55 rounded-lg bg-white shadow-xl before:absolute before:-top-4 before:-left-10 before:h-10 before:w-[200%] before:bg-transparent">
                        <div className="flex flex-col gap-2 p-4">
                          {item.children.map(child => (
                            <Link
                              href={child.href}
                              key={child.title}
                              className="text-sm whitespace-nowrap text-gray-700 hover:font-bold hover:text-brand-gold"
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href} passHref>
                      <NavigationMenuLink className={`bg-transparent px-3 py-2 text-sm font-medium ${textColor} ${hoverBg}`}>
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))
            ) : null}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </motion.div>
  )
}
