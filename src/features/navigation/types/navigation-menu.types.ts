export type NavLinkItem = {
  title: string
  href: string
}

export type MobileNavGroup = {
  title: string
  items: Array<{
    title: string
    href: string
    items: NavLinkItem[]
  }>
}

export type DesktopNavCategory = {
  title: string
  href: string
  children: NavLinkItem[]
}
