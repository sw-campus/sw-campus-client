import Link from 'next/link'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { BOOT_NAV_DATA } from '@/features/navi/types/navigation.type'

export default function Navigation() {
  return (
    <NavigationMenu
      viewport={false}
      className="relative mx-auto mt-4 flex w-full max-w-7xl items-center justify-center px-8"
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
  )
}
