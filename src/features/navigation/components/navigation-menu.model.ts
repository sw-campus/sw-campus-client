import { DEFAULT_PAGE_SIZE } from '@/features/lecture/types/filter.type'
import type { DesktopNavCategory, MobileNavGroup } from '@/features/navigation/types/navigation-menu.types'

type CategoryNode = {
  categoryId: number
  categoryName: string
  children?: CategoryNode[]
  link?: string
}

export const buildMobileNavData = (categoryTree?: CategoryNode[] | null): MobileNavGroup[] => {
  if (!categoryTree) return []

  return categoryTree.map(l1 => ({
    title: l1.categoryName,
    items:
      l1.children?.map(l2 => ({
        title: l2.categoryName,
        href: l2.link || `/lectures/search?categoryIds=${l2.categoryId}&size=${DEFAULT_PAGE_SIZE}`,
        items:
          l2.children?.map(l3 => ({
            title: l3.categoryName,
            href: l3.link || `/lectures/search?categoryIds=${l3.categoryId}&size=${DEFAULT_PAGE_SIZE}`,
          })) || [],
      })) || [],
  }))
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
