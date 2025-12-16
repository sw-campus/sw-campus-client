export interface NavChild {
  title: string
  href: string
}

export interface NavItem {
  title: string
  items?: NavChild[]
}

export type NavData = NavItem[]


