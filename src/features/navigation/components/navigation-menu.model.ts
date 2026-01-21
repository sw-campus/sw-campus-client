import { DEFAULT_PAGE_SIZE } from '@/features/lecture/types/filter.type'
import type { DesktopNavCategory, MobileNavGroup } from '@/features/navigation/types/navigation-menu.types'

type CategoryNode = {
  categoryId: number
  categoryName: string
  children?: CategoryNode[]
  link?: string
  type?: 'LECTURE' | 'BOARD'
}

export type MobileNavTabs = {
  lectures: MobileNavGroup[]
  community: MobileNavGroup[]
}

export const buildMobileNavData = (categoryTree?: CategoryNode[] | null): MobileNavTabs => {
  if (!categoryTree) return { lectures: [], community: [] }

  const lectureCategories = categoryTree.filter(c => !c.type || c.type === 'LECTURE')
  const boardCategories = categoryTree.filter(c => c.type === 'BOARD')

  const mapToNavGroup = (categories: CategoryNode[]): MobileNavGroup[] =>
    categories.map(l1 => ({
      title: l1.categoryName,
      href: l1.link || (l1.type === 'BOARD'
        ? `/community?categoryId=${l1.categoryId}`
        : `/lectures/search?categoryIds=${l1.categoryId}&size=${DEFAULT_PAGE_SIZE}`),
      items:
        l1.children?.map(l2 => ({
          title: l2.categoryName,
          href: l2.link || (l1.type === 'BOARD'
            ? `/community?categoryId=${l2.categoryId}`
            : `/lectures/search?categoryIds=${l2.categoryId}&size=${DEFAULT_PAGE_SIZE}`),
          items:
            l2.children?.map(l3 => ({
              title: l3.categoryName,
              href: l3.link || (l1.type === 'BOARD'
                ? `/community?categoryId=${l3.categoryId}`
                : `/lectures/search?categoryIds=${l3.categoryId}&size=${DEFAULT_PAGE_SIZE}`),
            })) || [],
        })) || [],
    }))

  return {
    lectures: mapToNavGroup(lectureCategories),
    community: mapToNavGroup(boardCategories),
  }
}

export const buildActiveCategoryChildren = (
  categoryTree: CategoryNode[] | undefined | null,
  activeMenu: number | null,
): DesktopNavCategory[] => {
  if (!categoryTree || activeMenu === null) return []

  const activeCategory = categoryTree.find(c => c.categoryId === activeMenu)
  if (!activeCategory?.children) return []

  return activeCategory.children.map(l2 => ({
    title: l2.categoryName,
    href: l2.link || `/lectures/search?categoryIds=${l2.categoryId}&size=${DEFAULT_PAGE_SIZE}`,
    children:
      l2.children?.map(l3 => ({
        title: l3.categoryName,
        href: l3.link || `/lectures/search?categoryIds=${l3.categoryId}&size=${DEFAULT_PAGE_SIZE}`,
      })) || [],
  }))
}
