import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import type { DesktopNavCategory } from '../types/navigation-menu.types'

type Props = {
  showDesktop: boolean
  items: DesktopNavCategory[]
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onNavigate: (href: string) => void
}

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

export function NavigationMenuDesktop({ showDesktop, items, onMouseEnter, onMouseLeave, onNavigate }: Props) {
  return (
    <motion.div
      className="hidden md:block"
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
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <NavigationMenuList className="flex-wrap justify-start gap-y-2">
            {items.length > 0 ? (
              items.map((item, key) => (
                <NavigationMenuItem key={key} className="relative">
                  {item.children.length > 0 ? (
                    <>
                      <NavigationMenuTrigger onClick={() => onNavigate(item.href)}>{item.title}</NavigationMenuTrigger>
                      <NavigationMenuContent className="absolute top-8 left-0 z-100 mt-0 w-max min-w-55 rounded-lg bg-white shadow-xl before:absolute before:-top-4 before:-left-10 before:h-10 before:w-[200%] before:bg-transparent">
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
                    <Link href={item.href} passHref>
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
  )
}
