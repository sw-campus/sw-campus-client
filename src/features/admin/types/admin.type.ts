export interface StatCardData {
  title: string
  value: number
  icon: React.ReactNode
}

export interface VisitorData {
  date: string
  visitors: number
}

export interface MemberStatusData {
  status: string
  count: number
  color: string
}

export interface FeatureCardData {
  title: string
  description: string
  icon: React.ReactNode
}

export interface SidebarMenuItem {
  label: string
  href: string
  icon?: React.ReactNode
}
