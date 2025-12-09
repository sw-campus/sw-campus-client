export interface NavChild {
  title: string
  href: string
}

export interface NavItem {
  title: string
  items?: NavChild[]
}

export type NavData = NavItem[]

export const BOOT_NAV_DATA: NavData = [
  {
    title: '웹개발',
    items: [
      { title: '프론트엔드 개발', href: '/' },
      { title: '백엔드 개발', href: '/' },
      { title: '풀스택 개발', href: '/' },
    ],
  },
  {
    title: '모바일',
  },
  {
    title: '데이터·AI',
    items: [
      { title: '데이터', href: '/' },
      { title: 'AI', href: '/' },
    ],
  },
  {
    title: '클라우드',
  },
  {
    title: '보안',
  },
  {
    title: '임베디드(IoT)',
    items: [
      { title: '임베디드(IoT)', href: '/' },
      { title: '로봇', href: '/' },
    ],
  },
  {
    title: '게임·블록체인',
    items: [
      { title: '게임', href: '/' },
      { title: '블록체인', href: '/' },
    ],
  },
  {
    title: '기획·마케팅·디자인',
    items: [
      { title: '기획', href: '/' },
      { title: '마케팅', href: '/' },
      { title: '디자인', href: '/' },
    ],
  },
]
