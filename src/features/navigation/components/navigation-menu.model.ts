import type { DesktopNavCategory, MobileNavGroup } from '@/features/navigation/types/navigation-menu.types'

type CategoryNode = {
  categoryId: number
  categoryName: string
  children?: CategoryNode[]
}

export const buildMobileNavData = (categoryTree?: CategoryNode[] | null): MobileNavGroup[] => {
  if (!categoryTree) return []

  return categoryTree.map(l1 => ({
    title: l1.categoryName,
    items:
      l1.children?.map(l2 => ({
        title: l2.categoryName,
        href: `/lectures/search?categoryIds=${l2.categoryId}&size=12`,
        items:
          l2.children?.map(l3 => ({
            title: l3.categoryName,
            href: `/lectures/search?categoryIds=${l3.categoryId}&size=12`,
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
    href: `/lectures/search?categoryIds=${l2.categoryId}&size=12`,
    children:
      l2.children?.map(l3 => ({
        title: l3.categoryName,
        href: `/lectures/search?categoryIds=${l3.categoryId}&size=12`,
      })) || [],
  }))
}
